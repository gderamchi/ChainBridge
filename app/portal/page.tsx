import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  return (
    <div className="min-h-screen bg-slate-dark text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-slate-dark z-0"></div>
        <div className="bridge-beam opacity-20"></div>
        
        <div className="glass-panel-luxury p-12 max-w-2xl w-full text-center relative z-10 border-t border-gold-primary/20">
            <h1 className="text-4xl font-serif text-gold-primary mb-6">Client Portal</h1>
            <p className="text-xl text-gray-300 mb-8 font-light">
                Welcome back, <span className="text-white font-medium">{user.email}</span>
            </p>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-sm mb-8">
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
      </div>
    </div>
  );
}