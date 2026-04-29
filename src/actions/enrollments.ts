"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function enrollCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return { error: "Already enrolled" };

  await prisma.enrollment.create({
    data: { userId: session.user.id, courseId },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}

export async function unenrollCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await prisma.enrollment.deleteMany({
    where: { userId: session.user.id, courseId },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProgress(courseId: string, progress: number) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const completedAt = progress >= 100 ? new Date() : null;

  await prisma.enrollment.update({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    data: { progress, completedAt },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getMyEnrollments() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: { select: { id: true, name: true, avatar: true } },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}
