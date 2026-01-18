"use client";

interface ConsentFormProps {
  authorizationId: string;
}

export default function ConsentForm({ authorizationId }: ConsentFormProps) {
  return (
    <form action="/api/oauth/decision" method="POST" className="w-full flex flex-col gap-3">
      <input type="hidden" name="authorization_id" value={authorizationId} />
      
      <button
        type="submit"
        name="decision"
        value="approve"
        className="w-full h-12 bg-gold-primary hover:bg-[#D4AF67] text-slate-900 transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center hover:shadow-[0_0_15px_rgba(197,160,89,0.3)]"
      >
        Approve
      </button>
      
      <button
        type="submit"
        name="decision"
        value="deny"
        className="w-full h-12 bg-transparent border border-white/10 hover:border-gold-primary text-white hover:text-gold-primary transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center"
      >
        Deny
      </button>
    </form>
  );
}
