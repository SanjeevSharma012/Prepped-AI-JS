import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function detectSTAR(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  if (/\b(situation|context|background)/.test(t)) score++;
  if (/\b(task|goal|objective|role)/.test(t)) score++;
  if (/\b(i built|i created|i implemented|i developed|i worked)/.test(t)) score++;
  if (/\b(result|impact|improved|reduced|\d+%)/.test(t)) score++;

  return score >= 3;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { questions = [], answers = [], role, roleCat, level, company } = body;

    if (!questions.length || !answers.length) {
      return NextResponse.json(
        { error: "questions and answers are required" },
        { status: 400 }
      );
    }

    // ✅ MOVE IMPORTS INSIDE TRY (SAFE FOR VERCEL)
    const prismaModule = await import("@/lib/prisma");
    const aiModule = await import("@/lib/ai");

    const prisma = prismaModule.prisma;
    const evaluateAllAnswers = aiModule.evaluateAllAnswers;

    const feedback = await evaluateAllAnswers(
      questions,
      answers,
      role,
      level
    );

    const scores = feedback.map(f => f.score);

    const overall =
      scores.length > 0
        ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
        : 0;

    await prisma.interviewSession.create({
      data: {
        role,
        roleCat: roleCat ?? "dev",
        level,
        company: company ?? null,
        score: overall,
        answers: {
          create: questions.map((q, i) => ({
            question: q.text,
            questionType: q.type,
            response: answers[i] ?? "",
            score: feedback[i]?.score ?? 0,
            good: feedback[i]?.good ?? "",
            missing: feedback[i]?.missing ?? "",
            better: feedback[i]?.better ?? "",
            wordCount: (answers[i] ?? "").trim().split(/\s+/).filter(Boolean).length,
            usedStar: detectSTAR(answers[i] ?? "")
          })),
        },
      },
    });

    return NextResponse.json({ feedback, overall });

  } catch (err) {
    console.error("[evaluate error]", err);

    return NextResponse.json(
      { error: "Evaluation failed", detail: String(err) },
      { status: 500 }
    );
  }
}