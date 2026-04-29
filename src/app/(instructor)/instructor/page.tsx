import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, TrendingUp, PlusCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Instructor Dashboard" };

export default async function InstructorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((a, c) => a + c._count.enrollments, 0);
  const publishedCount = courses.filter((c) => c.published).length;

  const stats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, color: "text-brand-400 bg-brand-500/15" },
    { label: "Published", value: publishedCount, icon: Eye, color: "text-green-400 bg-green-500/15" },
    { label: "Total Students", value: totalStudents, icon: Users, color: "text-blue-400 bg-blue-500/15" },
    { label: "Drafts", value: courses.length - publishedCount, icon: EyeOff, color: "text-orange-400 bg-orange-500/15" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1">
            Instructor Dashboard <span className="gradient-text">👨‍🏫</span>
          </h1>
          <p className="text-muted-foreground">Manage your courses and track student engagement</p>
        </div>
        <Link href="/instructor/courses/new" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Courses table */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Courses</h2>
          <Link href="/instructor/courses" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Manage all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="p-16 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="font-bold mb-2">No courses yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Create your first course to start teaching</p>
            <Link href="/instructor/courses/new" className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Create Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase border-b border-border">
                  <th className="text-left p-4 pl-6">Course</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Modules</th>
                  <th className="text-left p-4">Students</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4 pr-6">Actions</th>
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
                      <span className={`badge ${course.published ? "badge-beginner" : "badge-advanced"}`}>
                        {course.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{course._count.modules}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {course._count.enrollments}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(course.createdAt)}</td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/instructor/courses/${course.id}`} className="btn-secondary text-xs py-1.5 px-3">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
