export default function Methodology() {
  return (
    <section className="py-24 bg-[#0B0E11]" id="methodology">
      <div className="layout-content-container flex flex-col max-w-[1400px] w-full px-6 md:px-12 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-gold-primary font-medium tracking-widest uppercase text-xs mb-4">
              Methodology
            </h2>
            <h1 className="text-white text-4xl md:text-5xl font-serif leading-tight">
              Precision Sourcing
              <br />
              <span className="text-gray-600 italic">Redefined</span>
            </h1>
          </div>
          <p className="text-text-muted max-w-sm text-sm leading-relaxed border-l border-white/10 pl-6">
            We bypass traditional intermediaries using proprietary algorithms,
            connecting you directly to elite-tier manufacturing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          <div className="md:col-span-7 glass-panel-luxury p-10 min-h-[400px] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <span className="material-symbols-outlined text-gold-primary text-4xl font-light">
                token
              </span>
              <div>
                <h3 className="text-2xl text-white font-serif mb-4">
                  The Golden Ledger
                </h3>
                <p className="text-text-muted font-light leading-relaxed max-w-md">
                  Every interaction, quote, and quality check is immutably
                  recorded. Our verification process acts as the gold standard
                  for trust in an otherwise opaque market.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 glass-panel-luxury p-10 min-h-[400px] flex flex-col relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-slate-900/60"></div>
            <div className="relative z-10 flex flex-col h-full justify-end">
              <div className="w-12 h-[1px] bg-gold-primary mb-6"></div>
              <h3 className="text-2xl text-white font-serif mb-2">
                Visual Inspection AI
              </h3>
              <p className="text-text-muted text-sm font-light">
                Real-time computer vision analysis of production lines ensures
                specific adherence to your schematics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
