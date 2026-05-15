import { getCourses } from "@/actions/courses";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { BookOpen, Users, Clock, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Course Catalog" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const allCourses = await getCourses({ published: true, ...(params.category ? { category: params.category } : {}) });

  // Filter by search query
  const courses = params.q
    ? allCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(params.q!.toLowerCase()) ||
          c.description.toLowerCase().includes(params.q!.toLowerCase())
      )
    : allCourses;

  // Get user enrollments
  let enrolledIds: string[] = [];
  if (session?.user) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    });
    enrolledIds = enrollments.map((e) => e.courseId);
  }

  const categories: string[] = ["All", ...Array.from(new Set(allCourses.map((c) => c.category)))];
  const difficultyColors: Record<string, string> = {
    BEGINNER: "badge-beginner",
    INTERMEDIATE: "badge-intermediate",
    ADVANCED: "badge-advanced",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-strong border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold gradient-text text-lg">EduFlow</Link>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Link href="/dashboard" className="btn-primary text-sm">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">Sign in</Link>
                <Link href="/register" className="btn-primary text-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">Discover courses taught by expert instructors</p>

          {/* Search */}
          <form className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search courses..."
                className="input-field pl-12 py-4 text-base"
              />
            </div>
          </form>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/courses" : `/courses?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                (cat === "All" && !params.category) || params.category === cat
                  ? "bg-brand-500/20 border-brand-500/50 text-brand-300"
                  : "bg-secondary border-border text-muted-foreground hover:border-brand-500/30"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-bold mb-2">No courses found</h2>
            <p className="text-muted-foreground">Try adjusting your search or browse all categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrolledIds.includes(course.id);
              return (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="glass rounded-2xl border border-border overflow-hidden card-hover h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="h-44 bg-gradient-to-br from-brand-500/20 to-blue-500/10 flex items-center justify-center relative overflow-hidden">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-brand-400/50" />
                      )}
                      {isEnrolled && (
                        <div className="absolute top-3 right-3 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Enrolled
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <span className={`badge ${difficultyColors[course.difficulty] || ""}`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold leading-tight">{course.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{course.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course._count.enrollments} students
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course._count.modules} modules
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                          {course.instructor.name?.[0]}
                        </div>
                        <span className="text-xs text-muted-foreground">{course.instructor.name}</span>
                        <span className="text-xs text-brand-400 ml-auto font-semibold">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
