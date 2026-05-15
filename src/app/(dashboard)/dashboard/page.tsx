import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Redirect instructors and admins to their own dashboards
  if (session.user.role === "INSTRUCTOR") redirect("/instructor");
  if (session.user.role === "ADMIN") redirect("/admin");

  const userId = session.user.id;

  const [enrollments, quizCount, recentAttempts] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            _count: { select: { modules: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 6,
    }),
    prisma.quizAttempt.count({ where: { userId } }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { module: { include: { course: { select: { title: true } } } } },
    }),
  ]);

  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
      : 0;

  const stats = [
    { label: "Enrolled Courses", value: enrollments.length, icon: BookOpen, color: "text-brand-400 bg-brand-500/15" },
    { label: "Completed", value: completedCourses, icon: CheckCircle, color: "text-green-400 bg-green-500/15" },
    { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-blue-400 bg-blue-500/15" },
    { label: "Quizzes Taken", value: quizCount, icon: Brain, color: "text-orange-400 bg-orange-500/15" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1">
            Welcome back, <span className="gradient-text">{session.user.name?.split(" ")[0]} 👋</span>
          </h1>
          <p className="text-muted-foreground">
            {enrollments.length === 0
              ? "Start your learning journey by enrolling in a course!"
              : `You have ${enrollments.filter((e) => !e.completedAt).length} active courses in progress.`}
          </p>
        </div>
        <Link href="/courses" className="btn-primary hidden sm:flex">
          Browse Courses <ArrowRight className="w-4 h-4" />
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

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active courses */}
        <div className="lg:col-span-2 glass rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">My Courses</h2>
            <Link href="/dashboard/courses" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
              <Link href="/courses" className="btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 4).map((e) => (
                <Link key={e.id} href={`/courses/${e.courseId}`} className="block">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:text-brand-300 transition-colors">
                        {e.course.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        by {e.course.instructor.name} • {e.course._count.modules} modules
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-brand-300 flex-shrink-0">
                      {Math.round(e.progress)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* AI Tools */}
          <div className="glass rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              AI Tools
            </h2>
            <div className="space-y-3">
              <Link href="/dashboard/quiz" className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-muted transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold group-hover:text-brand-300 transition-colors">AI Quiz</div>
                  <div className="text-xs text-muted-foreground">Generate from any module</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Link>
              <Link href="/dashboard/chat" className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-muted transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold group-hover:text-brand-300 transition-colors">Study Assistant</div>
                  <div className="text-xs text-muted-foreground">Chat with AI tutor</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Link>
            </div>
          </div>

          {/* Recent quiz attempts */}
          <div className="glass rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Quizzes
            </h2>
            {recentAttempts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No quiz attempts yet</p>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      a.score >= 80 ? "bg-green-500/15 text-green-400" :
                      a.score >= 60 ? "bg-yellow-500/15 text-yellow-400" :
                      "bg-red-500/15 text-red-400"
                    }`}>
                      {Math.round(a.score)}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{a.module.course.title}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
