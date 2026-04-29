"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  MessageSquare,
  User,
  GraduationCap,
  PlusCircle,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/quiz", label: "AI Quiz", icon: Brain },
  { href: "/dashboard/chat", label: "Study Assistant", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const instructorLinks = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/courses/new", label: "Create Course", icon: PlusCircle },
  { href: "/instructor/students", label: "Students", icon: GraduationCap },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/courses", label: "All Courses", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const links =
    role === "ADMIN" ? adminLinks : role === "INSTRUCTOR" ? instructorLinks : studentLinks;

  return (
    <aside className="w-64 h-full glass-strong border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold gradient-text">EduFlow</span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-border">
        <div className="tag text-xs">
          {role === "ADMIN" ? "⚡" : role === "INSTRUCTOR" ? "🎓" : "📚"} {role}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/dashboard" && link.href !== "/instructor" && link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("sidebar-link", isActive && "active")}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Browse courses link */}
      <div className="p-4 border-t border-border">
        <Link href="/courses" className="sidebar-link">
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog</span>
        </Link>
      </div>
    </aside>
  );
}
