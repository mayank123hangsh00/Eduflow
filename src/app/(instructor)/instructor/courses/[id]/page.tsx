import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { notFound, redirect } from "next/navigation";
import { CourseManagerClient } from "@/components/instructor/course-manager";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id }, select: { title: true } });
  return { title: `Manage: ${course?.title || "Course"}` };
}

export default async function ManageCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/instructor");
  }

  return <CourseManagerClient course={JSON.parse(JSON.stringify(course))} />;
}
