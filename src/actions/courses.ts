"use server";

import { prisma } from "@/lib/db/prisma";
import { courseSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCourse(data: unknown) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  const parsed = courseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const course = await prisma.course.create({
    data: { ...parsed.data, instructorId: session.user.id },
  });

  revalidatePath("/instructor/courses");
  return { success: true, courseId: course.id };
}

export async function updateCourse(courseId: string, data: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const parsed = courseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.course.update({ where: { id: courseId }, data: parsed.data });
  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath("/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/instructor/courses");
  revalidatePath("/courses");
  return { success: true };
}

export async function publishCourse(courseId: string, published: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  await prisma.course.update({ where: { id: courseId }, data: { published } });
  revalidatePath("/courses");
  revalidatePath(`/instructor/courses`);
  return { success: true };
}

export async function getCourses(options?: { published?: boolean; instructorId?: string; category?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.published !== undefined) where.published = options.published;
  if (options?.instructorId) where.instructorId = options.instructorId;
  if (options?.category) where.category = options.category;

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: { select: { id: true, name: true, avatar: true } },
      _count: { select: { modules: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return courses;
}

export async function getCourse(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true, name: true, avatar: true, bio: true } },
      modules: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
}

