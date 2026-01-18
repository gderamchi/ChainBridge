import AIChat from "@/app/components/AIChat";

export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel-luxury p-8 border-t border-gold-primary/20">
        <h1 className="text-3xl font-serif text-gold-primary mb-4">Intelligence Hub</h1>
        <p className="text-lg text-gray-300 font-light">
          Our AI sourcing intelligence and supplier discovery.
        </p>
      </div>

      <div className="h-[calc(100vh-300px)] relative">
        <AIChat />
      </div>
    </div>
  );
}
