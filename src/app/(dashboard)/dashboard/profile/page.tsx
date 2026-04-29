import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-black mb-1">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="p-8 flex items-center gap-6 border-b border-border bg-secondary/10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {session.user.name?.[0] || <User className="w-10 h-10" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{session.user.name}</h2>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{session.user.email}</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> Account Role
            </label>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border inline-block">
              <span className="font-mono text-brand-400 font-bold">{session.user.role}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your role determines which dashboard and permissions you have access to.
            </p>
          </div>
          
          <hr className="border-border" />
          
          <p className="text-sm text-muted-foreground">
            Account management features (changing password, updating email) will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
