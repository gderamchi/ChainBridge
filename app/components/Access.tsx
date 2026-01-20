export default function Access() {
  return (
    <section
      className="py-24 relative overflow-hidden bg-[#0e1116] border-t border-gold-primary/10"
      id="access"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent"></div>
      <div className="layout-content-container flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center z-10">
        <h2 className="text-white text-4xl md:text-6xl font-serif mb-6 tracking-tight">
          Apply for Access
        </h2>
        <p className="text-text-muted text-lg mb-12 max-w-xl font-light mx-auto">
          We maintain a strict ratio of clients to suppliers to ensure premium
          service delivery. Currently accepting applications for Q4.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button className="flex min-w-[200px] cursor-pointer items-center justify-center h-14 px-10 bg-gold-primary text-slate-900 hover:bg-white transition-all duration-300 text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(197,160,89,0.2)]">
            Begin Application
          </button>
        </div>
      </div>
    </section>
  );
}
