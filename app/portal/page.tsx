import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div className="glass-panel-luxury p-8 border-t border-gold-primary/20">
        <h1 className="text-3xl font-serif text-gold-primary mb-4">Welcome back</h1>
        <p className="text-lg text-gray-300 font-light">
          {user?.email}
        </p>
      </div>

      <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
        <p className="text-text-muted italic">
          Dashboard features are currently under development.
        </p>
      </div>

      <form action="/auth/signout" method="post">
        <button
          className="px-8 py-3 bg-transparent border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-slate-900 transition-all duration-300 uppercase tracking-widest text-xs font-bold"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}