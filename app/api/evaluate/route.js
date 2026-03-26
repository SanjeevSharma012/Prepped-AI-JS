import { NextResponse } from "next/server";
import { evaluateAllAnswers } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

function detectSTAR(text) {
  if (!text || text.length < 20) return false;
  const t = text.toLowerCase();
  let score = 0;
  if (/\b(situation|context|background|when i was|at the time)/.test(t)) score++;
  if (/\b(task|goal|objective|my role|needed to|had to)/.test(t)) score++;
  if (/\b(i decided|i implemented|i built|i created|i led|i wrote|i set up)/.test(t)) score++;
  if (/\b(result|outcome|impact|improved|reduced|increased|shipped|\d+%|percent)/.test(t)) score++;
  return score >= 3;
}

export async function POST(req) {
  try {
    const { questions, answers, role, roleCat, level, company } = await req.json();

    if (!questions?.length || !answers?.length) {
      return NextResponse.json({ error: "questions and answers are required" }, { status: 400 });
    }

    const feedback = await evaluateAllAnswers(questions, answers, role, level);
    const scores = feedback.map(f => f.score);
    const overall = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));

    // Save session to database (no login required)
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
            usedStar: detectSTAR(answers[i] ?? ""),
          })),
        },
      },
    });

    return NextResponse.json({ feedback, overall });
  } catch (err) {
    console.error("[evaluate]", err);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
