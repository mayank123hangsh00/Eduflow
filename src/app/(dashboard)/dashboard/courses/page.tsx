import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Courses | Student" };

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black mb-1">My Courses</h1>
        <p className="text-muted-foreground">Pick up right where you left off</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass rounded-2xl border border-border p-16 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="font-bold mb-2">You aren&apos;t enrolled in any courses</h3>
          <p className="text-muted-foreground text-sm mb-4">Browse the catalog to find your next skill.</p>
          <Link href="/courses" className="btn-primary">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="glass rounded-2xl border border-border overflow-hidden card-hover">
              <div className="h-40 bg-gradient-to-br from-brand-500/20 to-blue-500/10 flex items-center justify-center relative">
                {enrollment.course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-12 h-12 text-brand-400/50" />
                )}
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-border">
                  {Math.round(enrollment.progress)}% Complete
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-muted-foreground mb-1">{enrollment.course.category}</div>
                <h3 className="font-bold leading-tight mb-2 line-clamp-1">{enrollment.course.title}</h3>
                
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-brand-500" style={{ width: `${enrollment.progress}%` }} />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {enrollment.course._count.modules} modules
                  </span>
                  <Link href={`/courses/${enrollment.course.id}`} className="btn-primary text-xs py-1.5 px-3 rounded-lg">
                    <PlayCircle className="w-3 h-3 mr-1" /> Continue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
