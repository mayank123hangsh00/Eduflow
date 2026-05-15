import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, Brain, Activity, TrendingUp, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const [userCount, courseCount, enrollmentCount, quizCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.quizAttempt.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-brand-400 bg-brand-500/15" },
    { label: "Total Courses", value: courseCount, icon: BookOpen, color: "text-blue-400 bg-blue-500/15" },
    { label: "Enrollments", value: enrollmentCount, icon: TrendingUp, color: "text-green-400 bg-green-500/15" },
    { label: "Quizzes Taken", value: quizCount, icon: Brain, color: "text-orange-400 bg-orange-500/15" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black flex items-center gap-2 mb-1">
          <ShieldCheck className="w-8 h-8 text-brand-400" />
          <span className="gradient-text">Admin Dashboard</span>
        </h1>
        <p className="text-muted-foreground">Platform-wide statistics and management</p>
      </div>

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

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            Recent Users
          </h2>
          <Link href="/admin/users" className="text-sm text-brand-400 hover:text-brand-300">
            Manage all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase border-b border-border">
                <th className="text-left p-4 pl-6">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                        {u.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${u.role === "ADMIN" ? "badge-advanced" : u.role === "INSTRUCTOR" ? "badge-intermediate" : "badge-beginner"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
