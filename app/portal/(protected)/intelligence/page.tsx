import AIChat from "@/app/components/AIChat";

export default function IntelligencePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="glass-panel-luxury p-8 border-t border-gold-primary/20 shrink-0">
        <h1 className="text-3xl font-serif text-gold-primary mb-4">Intelligence Hub</h1>
        <p className="text-lg text-gray-300 font-light">
          AI-powered sourcing intelligence and supplier discovery.
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-6 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
        <AIChat />
      </div>
    </div>
  );
}
