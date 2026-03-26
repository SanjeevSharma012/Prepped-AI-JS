import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function detectSTAR(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  if (/\b(situation|context|background)/.test(t)) score++;
  if (/\b(task|goal|objective)/.test(t)) score++;
  if (/\b(implemented|built|created|developed)/.test(t)) score++;
  if (/\b(result|impact|improved|reduced|\d+%)/.test(t)) score++;

  return score >= 3;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const questions = body.questions || [];
    const answers = body.answers || [];

    if (!questions.length || !answers.length) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 LOAD EVERYTHING INSIDE FUNCTION (CRITICAL FIX)
    const prismaModule = await import("@/lib/prisma");
    const aiModule = await import("@/lib/ai");

    const prisma = prismaModule.prisma;
    const { evaluateAllAnswers } = aiModule;

    const feedback = await evaluateAllAnswers(
      questions,
      answers,
      body.role,
      body.level
    );

    const overall =
      feedback.length > 0
        ? Number(
            (
              feedback.reduce((a, b) => a + b.score, 0) /
              feedback.length
            ).toFixed(2)
          )
        : 0;

    await prisma.interviewSession.create({
      data: {
        role: body.role,
        roleCat: body.roleCat ?? "dev",
        level: body.level,
        company: body.company ?? null,
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
            wordCount: (answers[i] ?? "").split(" ").length,
            usedSTAR: detectSTAR(answers[i] ?? ""),
          })),
        },
      },
    });

    return NextResponse.json({ feedback, overall });

  } catch (err) {
    console.error("EVALUATE ERROR:", err);

    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}