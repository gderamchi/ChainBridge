import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 py-4 bg-slate-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="layout-container flex justify-center w-full">
        <div className="px-6 md:px-12 flex items-center justify-between w-full max-w-[1400px]">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="h-8 w-8 relative flex items-center justify-center">
              <div className="absolute inset-0 border-t border-b border-gold-primary/40 transform -skew-x-12 group-hover:skew-x-0 transition-transform duration-500"></div>
              <div className="absolute h-[1px] w-full bg-gold-primary top-1/2 -translate-y-1/2"></div>
            </div>
            <h2 className="text-white text-xl font-serif tracking-widest uppercase">
              ChainBridge
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <Link
              href="#methodology"
              className="text-text-muted hover:text-gold-primary transition-colors text-xs font-medium uppercase tracking-widest"
            >
              Methodology
            </Link>
            <Link
              href="#intelligence"
              className="text-text-muted hover:text-gold-primary transition-colors text-xs font-medium uppercase tracking-widest"
            >
              Intelligence
            </Link>
            <Link
              href="#access"
              className="text-text-muted hover:text-gold-primary transition-colors text-xs font-medium uppercase tracking-widest"
            >
              Access
            </Link>
          </div>
          <button className="hidden md:flex items-center gap-2 text-gold-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-gold-primary/30 px-6 py-2 hover:bg-gold-primary/10 rounded-sm cursor-pointer">
            Client Portal
          </button>
          <button className="md:hidden text-gold-primary cursor-pointer">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
