"use client";

import { useState } from "react";
import { enrollCourse, unenrollCourse } from "@/actions/enrollments";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, LogIn } from "lucide-react";
import Link from "next/link";

export function EnrollButton({
  courseId,
  isEnrolled,
  isLoggedIn,
}: {
  courseId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="btn-primary w-full justify-center py-3 text-base">
        <LogIn className="w-4 h-4" />
        Sign in to Enroll
      </Link>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    if (isEnrolled) {
      await unenrollCourse(courseId);
    } else {
      await enrollCourse(courseId);
    }
    router.refresh();
    setLoading(false);
  };

  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <Link href="/dashboard/courses" className="btn-primary w-full justify-center py-3 text-base">
          <BookOpen className="w-4 h-4" />
          Go to Course
        </Link>
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="btn-secondary w-full justify-center py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unenroll"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="btn-primary w-full justify-center py-3 text-base"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
        <>
          <BookOpen className="w-4 h-4" />
          Enroll Now — Free
        </>
      )}
    </button>
  );
}
