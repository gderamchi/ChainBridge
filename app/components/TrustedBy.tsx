export default function TrustedBy() {
  return (
    <section className="py-16 bg-slate-dark border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <p className="text-gold-dim text-[10px] font-bold uppercase tracking-[0.3em] mb-10">
          Trusted by Global Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-80">
          <h3 className="text-xl font-serif text-white tracking-widest">
            VOGUE<span className="text-gold-primary">.MFG</span>
          </h3>
          <h3 className="text-xl font-serif text-white tracking-widest">
            ARCTIC<span className="text-gold-primary">LABS</span>
          </h3>
          <h3 className="text-xl font-serif text-white tracking-widest">
            NOVA<span className="text-gold-primary">CORE</span>
          </h3>
          <h3 className="text-xl font-serif text-white tracking-widest">
            HELIOS<span className="text-gold-primary">ENERGY</span>
          </h3>
          <h3 className="text-xl font-serif text-white tracking-widest">
            ROYAL<span className="text-gold-primary">TEAK</span>
          </h3>
        </div>
      </div>
    </section>
  );
}
