import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-black mb-1">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global application preferences</p>
      </div>

      <div className="glass rounded-2xl border border-border p-8">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-8">
          <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">Restricted Area</h3>
            <p className="text-sm opacity-90">
              Platform settings modify the global behavior of the application for all users.
              Settings adjustments are currently locked in the demo environment.
            </p>
          </div>
        </div>

        <div className="space-y-6 opacity-60 pointer-events-none">
          <div className="space-y-2 pb-6 border-b border-border">
            <h3 className="font-bold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Global Registration
            </h3>
            <p className="text-sm text-muted-foreground">Allow new users to sign up for accounts</p>
            <div className="w-12 h-6 bg-brand-500 rounded-full relative mt-2 opacity-50">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
          
          <div className="space-y-2 pb-6 border-b border-border">
            <h3 className="font-bold flex items-center gap-2">
              Maintenance Mode
            </h3>
            <p className="text-sm text-muted-foreground">Temporarily disable access to the platform for non-admins</p>
            <div className="w-12 h-6 bg-secondary rounded-full relative mt-2">
              <div className="w-4 h-4 bg-muted-foreground rounded-full absolute left-1 top-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
