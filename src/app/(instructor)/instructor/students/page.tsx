import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Users, GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Students | Instructor" };

export default async function InstructorStudentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get courses taught by this instructor
  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    select: { id: true, title: true },
  });

  const courseIds = courses.map((c) => c.id);

  // Get all enrollments for these courses
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1">Students</h1>
          <p className="text-muted-foreground">View and manage students enrolled in your courses</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-16 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="font-bold mb-2">No students yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Students will appear here once they enroll in your courses.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase border-b border-border bg-secondary/30">
                  <th className="text-left p-4 pl-6">Student</th>
                  <th className="text-left p-4">Course Enrolled</th>
                  <th className="text-left p-4">Progress</th>
                  <th className="text-left p-4">Enrolled Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                          {enrollment.user.name?.[0] || <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <div>{enrollment.user.name}</div>
                          <div className="text-xs text-muted-foreground">{enrollment.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{enrollment.course.title}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-brand-500" 
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.round(enrollment.progress)}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(enrollment.enrolledAt)}</td>
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
