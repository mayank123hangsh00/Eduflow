import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { QuizClientPage } from "@/components/dashboard/quiz-client";

export const metadata: Metadata = { title: "AI Quiz | EduFlow" };

export default async function QuizPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch all enrolled courses with their modules
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, description: true, duration: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Flatten into a flat list of modules with course info
  const coursesWithModules = enrollments
    .filter((e) => e.course.modules.length > 0)
    .map((e) => ({
      courseId: e.course.id,
      courseTitle: e.course.title,
      category: e.course.category,
      modules: e.course.modules,
    }));

  // Also get recent quiz attempts for quick retry
  const recentAttempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      module: {
        select: {
          id: true,
          title: true,
          course: { select: { title: true } },
        },
      },
    },
  });

  return (
    <QuizClientPage
      coursesWithModules={coursesWithModules}
      recentAttempts={recentAttempts.map((a) => ({
        moduleId: a.moduleId,
        moduleTitle: a.module.title,
        courseTitle: a.module.course.title,
        score: a.score,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}
