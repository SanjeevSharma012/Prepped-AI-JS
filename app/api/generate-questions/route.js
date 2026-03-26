import { NextResponse } from "next/server";
import { generateQuestions } from "@/lib/ai";

export async function POST(req) {
  try {
    const { role, level, company, jobDesc } = await req.json();
    if (!role || !level) {
      return NextResponse.json({ error: "role and level are required" }, { status: 400 });
    }
    const questions = await generateQuestions(role, level, company ?? "", jobDesc ?? "");
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("[generate-questions]", err);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
