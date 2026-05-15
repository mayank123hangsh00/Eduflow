import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import type { Metadata } from "next";
import { UserRoleManager } from "@/components/admin/user-role-manager";

export const metadata: Metadata = { title: "Manage Users | Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { enrollments: true, courses: true } },
    },
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    instructors: users.filter((u) => u.role === "INSTRUCTOR").length,
    students: users.filter((u) => u.role === "STUDENT").length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-400" />
            Platform Users
          </h1>
          <p className="text-muted-foreground">
            Manage roles for all students, instructors, and admins
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-foreground bg-secondary" },
          { label: "Admins", value: stats.admins, color: "text-red-400 bg-red-500/10" },
          { label: "Instructors", value: stats.instructors, color: "text-brand-400 bg-brand-500/10" },
          { label: "Students", value: stats.students, color: "text-blue-400 bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-xl border border-border p-5 ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* User table with role management */}
      <UserRoleManager
        users={users}
        currentSessionUserId={session.user.id}
      />
    </div>
  );
}
