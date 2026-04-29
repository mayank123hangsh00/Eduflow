import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Users, Shield, GraduationCap, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Users | Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, courses: true } },
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black mb-1">Platform Users</h1>
        <p className="text-muted-foreground">Manage all students, instructors, and admins</p>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase border-b border-border bg-secondary/30">
                <th className="text-left p-4 pl-6">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Activity</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                        {user.name?.[0] || <Users className="w-4 h-4" />}
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      user.role === "ADMIN" ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                      user.role === "INSTRUCTOR" ? "bg-brand-500/10 text-brand-500 border-brand-500/20" : 
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {user.role === "ADMIN" && <Shield className="w-3 h-3 mr-1" />}
                      {user.role === "INSTRUCTOR" && <BookOpen className="w-3 h-3 mr-1" />}
                      {user.role === "STUDENT" && <GraduationCap className="w-3 h-3 mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground flex gap-3">
                      {user.role === "INSTRUCTOR" && (
                        <span title="Courses Created">{user._count.courses} courses</span>
                      )}
                      {(user.role === "STUDENT" || user.role === "ADMIN") && (
                        <span title="Enrolled Courses">{user._count.enrollments} enrollments</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
