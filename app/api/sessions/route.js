import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.interviewSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { _count: { select: { answers: true } } },
  });

  return NextResponse.json({
    sessions: sessions.map(s => ({
      id: s.id,
      role: s.role,
      roleCat: s.roleCat,
      level: s.level,
      company: s.company,
      score: s.score,
      createdAt: s.createdAt.toISOString(),
      answerCount: s._count.answers,
    })),
  });
}
