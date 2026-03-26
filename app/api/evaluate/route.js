import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function detectSTAR(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  if (/\b(situation|context|background)/.test(t)) score++;
  if (/\b(task|goal|objective)/.test(t)) score++;
  if (/\b(i built|i created|i implemented)/.test(t)) score++;
  if (/\b(result|impact|improved|reduced|\d+%)/.test(t)) score++;

  return score >= 3;
}

export async function POST(req) {
  try {
    const {
      questions = [],
      answers = [],
      role,
      roleCat,
      level,
      company,
    } = await req.json();

    if (!questions.length || !answers.length) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

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
            wordCount: (answers[i] ?? "")
              .trim()
              .split(/\s+/)
              .filter(Boolean).length,
            usedSTAR: detectSTAR(answers[i] ?? ""),
          })),
        },
      },
    });

    return NextResponse.json({ feedback, overall });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}