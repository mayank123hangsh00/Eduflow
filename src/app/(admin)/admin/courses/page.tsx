import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { BookOpen, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Courses | Admin" };

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true, email: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black mb-1">All Courses</h1>
        <p className="text-muted-foreground">Monitor and manage all courses on the platform</p>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase border-b border-border bg-secondary/30">
                <th className="text-left p-4 pl-6">Course</th>
                <th className="text-left p-4">Instructor</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Metrics</th>
                <th className="text-left p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-medium">{course.title}</div>
                    <div className="text-xs text-muted-foreground">{course.category}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{course.instructor.name}</div>
                    <div className="text-xs text-muted-foreground">{course.instructor.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${course.published ? "badge-beginner" : "badge-advanced"}`}>
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1" title="Modules">
                        <BookOpen className="w-3 h-3" /> {course._count.modules}
                      </span>
                      <span className="flex items-center gap-1" title="Students Enrolled">
                        <Users className="w-3 h-3" /> {course._count.enrollments}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(course.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
