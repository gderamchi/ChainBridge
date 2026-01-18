"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const searchParams = useSearchParams();

  // Check for error parameters from auth callback
  useEffect(() => {
    const error = searchParams.get("error");
    const cause = searchParams.get("cause");
    const errorMessage = searchParams.get("message");

    if (error) {
      let displayMessage = "Authentication failed. Please try again.";
      
      if (cause === "missing_token") {
        displayMessage = "Magic link token not found. Please request a new link.";
      } else if (errorMessage) {
        displayMessage = errorMessage;
      }

      setMessage({ type: "error", text: displayMessage });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        if (error.status === 429) {
          setMessage({ type: "error", text: "Please wait before requesting another link" });
        } else {
          setMessage({ type: "error", text: error.message });
        }
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the magic link to sign in",
        });
        setEmail("");
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-dark relative overflow-hidden p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-dark z-0"></div>
      <div className="bridge-beam"></div>
      <div className="bridge-beam-2 opacity-50"></div>

      <div className="glass-panel-luxury w-full max-w-md p-8 md:p-10 rounded-sm relative z-10 flex flex-col items-center border-t border-gold-primary/20 animate-in fade-in zoom-in duration-500">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 group cursor-default">
          <div className="h-8 w-8 relative flex items-center justify-center">
            <div className="absolute inset-0 border-t border-b border-gold-primary/40 transform -skew-x-12"></div>
            <div className="absolute h-[1px] w-full bg-gold-primary top-1/2 -translate-y-1/2"></div>
          </div>
          <h2 className="text-white text-xl font-serif tracking-widest uppercase">
            ChainBridge
          </h2>
        </div>

        <h1 className="text-2xl md:text-3xl text-white font-serif mb-2 tracking-wide text-center">
          Client Portal
        </h1>
        <p className="text-text-muted text-center mb-8 font-light text-sm">
          Secure access for verified partners
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-[#0F1216] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-gold-primary/50 transition-colors placeholder:text-gray-600 font-light tracking-wide text-sm"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gold-primary hover:bg-[#D4AF67] text-slate-900 transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"></span>
              </span>
            ) : (
              "Send Magic Link"
            )}
          </button>

           {message && (
            <div
              className={`mt-4 p-3 text-xs text-center border ${
                message.type === "success"
                  ? "bg-green-900/20 border-green-500/30 text-green-200"
                  : "bg-red-900/20 border-red-500/30 text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
          <a
            href="/"
            className="text-xs text-text-muted hover:text-gold-primary transition-colors uppercase tracking-wider"
          >
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-dark relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-slate-dark z-0"></div>
      <div className="bridge-beam"></div>
      <div className="bridge-beam-2 opacity-50"></div>
      <div className="glass-panel-luxury w-full max-w-md p-8 md:p-10 rounded-sm relative z-10 flex flex-col items-center border-t border-gold-primary/20 animate-pulse">
        <div className="h-8 w-32 bg-white/10 rounded mb-8"></div>
        <div className="h-8 w-48 bg-white/10 rounded mb-2"></div>
        <div className="h-4 w-40 bg-white/10 rounded mb-8"></div>
        <div className="w-full h-12 bg-white/10 rounded mb-4"></div>
        <div className="w-full h-12 bg-white/10 rounded"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
