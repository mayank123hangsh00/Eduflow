"use server";

import { prisma } from "@/lib/db/prisma";
import { moduleSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, data: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const parsed = moduleSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const count = await prisma.module.count({ where: { courseId } });
  const mod = await prisma.module.create({
    data: { ...parsed.data, courseId, order: count },
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: true, moduleId: mod.id };
}

export async function updateModule(moduleId: string, data: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: true },
  });
  if (!mod) return { error: "Module not found" };
  if (mod.course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const parsed = moduleSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.module.update({ where: { id: moduleId }, data: parsed.data });
  revalidatePath(`/instructor/courses/${mod.courseId}`);
  return { success: true };
}

export async function deleteModule(moduleId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: true },
  });
  if (!mod) return { error: "Module not found" };
  if (mod.course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/instructor/courses/${mod.courseId}`);
  return { success: true };
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  await Promise.all(
    moduleIds.map((id, order) =>
      prisma.module.update({ where: { id }, data: { order } })
    )
  );

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: true };
}

