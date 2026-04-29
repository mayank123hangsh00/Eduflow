import { getCourse } from "@/actions/courses";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EnrollButton } from "@/components/courses/enroll-button";
import { BookOpen, Clock, Users, Award, CheckCircle, Play } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  return { title: course?.title || "Course" };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course, session] = await Promise.all([getCourse(id), auth()]);
  if (!course) notFound();

  let enrollment = null;
  if (session?.user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: id } },
    });
  }

  const difficultyColors: Record<string, string> = {
    BEGINNER: "badge-beginner",
    INTERMEDIATE: "badge-intermediate",
    ADVANCED: "badge-advanced",
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <div className="glass-strong border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to catalog</Link>
          {session?.user && (
            <Link href="/dashboard" className="btn-primary text-sm ml-auto">Dashboard</Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="tag">{course.category}</span>
                <span className={`badge ${difficultyColors[course.difficulty]}`}>{course.difficulty}</span>
              </div>
              <h1 className="text-4xl font-black mb-4 leading-tight">{course.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { icon: Users, label: `${course._count.enrollments} students` },
                { icon: BookOpen, label: `${course.modules.length} modules` },
                { icon: Award, label: `${course.difficulty.toLowerCase()} level` },
                { icon: Clock, label: `Updated ${formatDate(course.updatedAt)}` },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </div>
              ))}
            </div>

            {/* Instructor */}
            <div className="glass p-5 rounded-xl border border-border">
              <h3 className="font-bold mb-3">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center font-bold text-brand-300 text-lg">
                  {course.instructor.name?.[0]}
                </div>
                <div>
                  <div className="font-semibold">{course.instructor.name}</div>
                  {course.instructor.bio && (
                    <div className="text-sm text-muted-foreground mt-1">{course.instructor.bio}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-black mb-6">Curriculum</h2>
              {course.modules.length === 0 ? (
                <div className="glass p-8 rounded-xl border border-border text-center text-muted-foreground">
                  No modules added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {course.modules.map((mod, i) => (
                    <div key={mod.id} className="glass p-4 rounded-xl border border-border flex items-center gap-4 group hover:border-brand-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center text-sm font-bold text-brand-300 flex-shrink-0">
                        {enrollment ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{mod.title}</div>
                        {mod.description && <div className="text-sm text-muted-foreground truncate">{mod.description}</div>}
                      </div>
                      {mod.duration > 0 && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(mod.duration)}
                        </div>
                      )}
                      {enrollment && (
                        <CheckCircle className="w-4 h-4 text-green-400/40 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar CTA */}
          <div>
            <div className="glass-strong rounded-2xl border border-border p-6 sticky top-24">
              {/* Thumbnail */}
              <div className="h-44 bg-gradient-to-br from-brand-500/20 to-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <BookOpen className="w-16 h-16 text-brand-400/30" />
                )}
              </div>

              <div className="text-3xl font-black mb-6">
                {course.price === 0 ? <span className="gradient-text">Free</span> : `$${course.price}`}
              </div>

              <EnrollButton
                courseId={course.id}
                isEnrolled={!!enrollment}
                isLoggedIn={!!session?.user}
              />

              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                {[
                  `${course.modules.length} modules`,
                  `${course._count.enrollments} students enrolled`,
                  "Certificate on completion",
                  "AI quiz for each module",
                  "24/7 AI study assistant",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
