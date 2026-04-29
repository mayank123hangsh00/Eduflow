"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Search } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import type { Session } from "next-auth";

export function DashboardHeader({ user }: { user: Session["user"] }) {
  const [searching, setSearching] = useState(false);

  return (
    <header className="h-16 glass-strong border-b border-border flex items-center px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            className="input-field pl-10 py-2 text-sm"
            onFocus={() => setSearching(true)}
            onBlur={() => setSearching(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications placeholder */}
        <button className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-sm font-bold text-white">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name || "U")
            )}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-destructive/20 hover:border-destructive/30 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
