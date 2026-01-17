export default function TrustedBy() {
  return (
    <section className="py-16 bg-slate-dark border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
      <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
        <p className="text-gold-dim text-[10px] font-bold uppercase tracking-[0.3em] mb-12">
          Trusted by Global Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12 opacity-50 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100">
          
          <div className="flex items-center gap-2 group cursor-default">
             <div className="h-4 w-4 bg-white transform rotate-45 group-hover:bg-gold-primary transition-colors"></div>
             <h3 className="text-xl font-serif text-white tracking-[0.2em] font-bold">
                VOGUE<span className="font-light text-gray-400 group-hover:text-gold-light">.MFG</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
             <div className="h-4 w-1 bg-white group-hover:bg-gold-primary transition-colors"></div>
             <h3 className="text-lg font-sans text-white tracking-[0.3em] font-light">
                ARCTIC<span className="font-bold">LABS</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
             <div className="h-3 w-3 rounded-full border-2 border-white group-hover:border-gold-primary transition-colors"></div>
             <h3 className="text-xl font-mono text-white tracking-tighter font-bold">
                NOVA<span className="text-gray-500 group-hover:text-gold-primary">CORE</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
             <span className="material-symbols-outlined text-xl group-hover:text-gold-primary transition-colors">bolt</span>
             <h3 className="text-lg font-sans text-white tracking-widest font-bold italic">
                HELIOS
            </h3>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
             <div className="h-4 w-4 border border-white group-hover:border-gold-primary transition-colors flex items-center justify-center">
                <div className="h-2 w-2 bg-white group-hover:bg-gold-primary"></div>
             </div>
             <h3 className="text-xl font-serif text-white tracking-widest">
                ROYAL<span className="text-xs align-top ml-1">TEAK</span>
            </h3>
          </div>

        </div>
      </div>
    </section>
  );
}
