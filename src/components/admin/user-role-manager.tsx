"use client";

import { useState, useTransition } from "react";
import { updateUserRole, deleteUser } from "@/actions/users";
import { Shield, GraduationCap, BookOpen, Loader2, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  _count: { enrollments: number; courses: number };
};

const ROLES: Role[] = ["STUDENT", "INSTRUCTOR", "ADMIN"];

const roleConfig: Record<Role, { label: string; color: string; Icon: React.ElementType }> = {
  ADMIN: {
    label: "Admin",
    color: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    Icon: Shield,
  },
  INSTRUCTOR: {
    label: "Instructor",
    color: "bg-brand-500/10 text-brand-400 border-brand-500/20 hover:bg-brand-500/20",
    Icon: BookOpen,
  },
  STUDENT: {
    label: "Student",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    Icon: GraduationCap,
  },
};

function RoleBadge({ role }: { role: Role }) {
  const { label, color, Icon } = roleConfig[role];
  return (
    <span className={cn("badge flex items-center gap-1", color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function UserRoleDropdown({ user, currentSessionUserId }: { user: User; currentSessionUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [localRole, setLocalRole] = useState<Role>(user.role);

  const isSelf = user.id === currentSessionUserId;

  const handleRoleChange = (role: Role) => {
    if (role === localRole) { setOpen(false); return; }
    setOpen(false);
    startTransition(async () => {
      const res = await updateUserRole(user.id, role);
      if (res.success) {
        setLocalRole(role);
        setToast({ type: "success", msg: `Role updated to ${role}` });
      } else {
        setToast({ type: "error", msg: res.error || "Failed to update role" });
      }
      setTimeout(() => setToast(null), 2500);
    });
  };

  const ActiveIcon = roleConfig[localRole].Icon;

  return (
    <div className="relative">
      {toast && (
        <div
          className={cn(
            "absolute -top-10 left-0 z-30 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap",
            toast.type === "success"
              ? "bg-green-500/15 text-green-300 border border-green-500/20"
              : "bg-red-500/15 text-red-300 border border-red-500/20"
          )}
        >
          {toast.msg}
        </div>
      )}

      <button
        onClick={() => !isSelf && setOpen((o) => !o)}
        disabled={isPending || isSelf}
        title={isSelf ? "You cannot change your own role" : "Change role"}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
          roleConfig[localRole].color,
          isSelf ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <ActiveIcon className="w-3 h-3" />
        )}
        {roleConfig[localRole].label}
        {!isSelf && <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-20 w-36 rounded-xl border border-border bg-popover shadow-2xl overflow-hidden animate-fade-in">
            {ROLES.map((role) => {
              const { label, color, Icon: RoleIcon } = roleConfig[role];
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors",
                    role === localRole
                      ? cn(color, "opacity-100")
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <RoleIcon className="w-3.5 h-3.5" />
                  {label}
                  {role === localRole && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete user "${userName}"? This action cannot be undone.`)) return;
    startTransition(async () => {
      await deleteUser(userId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="opacity-0 group-hover:opacity-100 transition-opacity btn-secondary py-1.5 px-2 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
      title="Delete user"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}

export function UserRoleManager({
  users,
  currentSessionUserId,
}: {
  users: User[];
  currentSessionUserId: string;
}) {
  return (
    <div className="glass rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-muted-foreground uppercase border-b border-border bg-secondary/30">
              <th className="text-left p-4 pl-6">User</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Activity</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border/50 hover:bg-secondary/50 transition-colors group"
              >
                {/* Avatar + Name */}
                <td className="p-4 pl-6">
                  <div className="font-medium flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-300 flex-shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role dropdown */}
                <td className="p-4">
                  <UserRoleDropdown user={user} currentSessionUserId={currentSessionUserId} />
                </td>

                {/* Activity */}
                <td className="p-4">
                  <div className="text-sm text-muted-foreground flex gap-3">
                    {user.role === "INSTRUCTOR" ? (
                      <span>{user._count.courses} courses</span>
                    ) : (
                      <span>{user._count.enrollments} enrollments</span>
                    )}
                  </div>
                </td>

                {/* Joined */}
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>

                {/* Delete */}
                <td className="p-4">
                  <DeleteUserButton userId={user.id} userName={user.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
