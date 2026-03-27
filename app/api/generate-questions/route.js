import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function detectSTAR(text = "") {
  const t = text.toLowerCase();
  let score = 0;

  if (/\b(situation|context|background)/.test(t)) score++;
  if (/\b(task|goal|objective)/.test(t)) score++;
  if (/\b(implemented|built|created)/.test(t)) score++;
  if (/\b(result|impact|improved|\d+%)/.test(t)) score++;

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

    const prismaModule = await import("@/lib/prisma");
    const aiModule = await import("@/lib/ai");

    const prisma = prismaModule.prisma;
    const { evaluateAllAnswers } = aiModule;

    const feedback = await evaluateAllAnswers(
      questions,
      answers
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
        level: body.level,
        score: overall,
        answers: {
          create: questions.map((q, i) => ({
            question: q.text,
            response: answers[i] ?? "",
            score: feedback[i]?.score ?? 0,
            usedSTAR: detectSTAR(answers[i] ?? ""),
          })),
        },
      },
    });

    return NextResponse.json({ feedback, overall });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}