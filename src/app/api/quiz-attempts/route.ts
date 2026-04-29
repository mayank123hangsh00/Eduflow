import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { moduleId, questions, answers, score, timeTaken } = await req.json();

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      moduleId,
      questions,
      answers,
      score,
      totalQ: questions.length,
      timeTaken,
    },
  });

  return NextResponse.json({ success: true, attemptId: attempt.id });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  const where: Record<string, string> = { userId: session.user.id };
  if (moduleId) where.moduleId = moduleId;

  const attempts = await prisma.quizAttempt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ attempts });
}
