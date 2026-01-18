import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ConsentForm from "./consent-form";

interface ConsentPageProps {
  searchParams: Promise<{ authorization_id?: string }>;
}

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const { authorization_id: authorizationId } = await searchParams;

  if (!authorizationId) {
    return (
      <ErrorDisplay
        title="Invalid Request"
        message="Missing authorization_id parameter."
      />
    );
  }

  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login, preserving authorization_id
    redirect(`/portal/login?redirect=/oauth/consent?authorization_id=${authorizationId}`);
  }

  // Note: We don't call getAuthorizationDetails() here because it consumes the authorization.
  // The authorization will be processed when the user clicks Approve or Deny.

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-dark relative overflow-hidden p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-dark z-0"></div>
      <div className="bridge-beam opacity-20"></div>
      <div className="bridge-beam-2 opacity-30"></div>

      <div className="glass-panel-luxury w-full max-w-lg p-8 md:p-10 rounded-sm relative z-10 flex flex-col items-center border-t border-gold-primary/20">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 group cursor-default">
          <div className="h-8 w-8 relative flex items-center justify-center">
            <div className="absolute inset-0 border-t border-b border-gold-primary/40 transform -skew-x-12"></div>
            <div className="absolute h-[1px] w-full bg-gold-primary top-1/2 -translate-y-1/2"></div>
          </div>
          <h2 className="text-white text-xl font-serif tracking-widest uppercase">
            ChainBridge
          </h2>
        </div>

        <h1 className="text-2xl md:text-3xl text-white font-serif mb-2 tracking-wide text-center">
          Authorize Application
        </h1>
        <p className="text-text-muted text-center mb-6 font-light text-sm">
          An application is requesting access to your ChainBridge account
        </p>

        {/* Info Notice */}
        <div className="w-full bg-white/5 border border-white/10 p-4 mb-6">
          <p className="text-sm text-text-muted">
            By clicking <span className="text-white">Approve</span>, you authorize this application to access your account on your behalf.
          </p>
        </div>

        {/* Decision Form */}
        <ConsentForm authorizationId={authorizationId} />

        {/* User Info */}
        <div className="mt-6 pt-4 border-t border-white/5 w-full text-center">
          <p className="text-xs text-text-muted">
            Signed in as <span className="text-white">{user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-dark relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-slate-dark z-0"></div>
      <div className="bridge-beam opacity-20"></div>

      <div className="glass-panel-luxury w-full max-w-md p-8 md:p-10 rounded-sm relative z-10 flex flex-col items-center border-t border-red-500/20">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-400 text-2xl">
            error
          </span>
        </div>
        <h1 className="text-xl text-white font-serif mb-2">{title}</h1>
        <p className="text-text-muted text-center text-sm mb-6">{message}</p>
        <a
          href="/"
          className="text-xs text-gold-primary hover:text-white transition-colors uppercase tracking-wider"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}

function formatScope(scope: string): string {
  const scopeDescriptions: Record<string, string> = {
    openid: "Access your user ID",
    email: "View your email address",
    profile: "View your profile information",
    offline_access: "Maintain access when you're not using the app",
  };
  return scopeDescriptions[scope] || scope;
}
