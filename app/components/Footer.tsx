import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-dark py-12 border-t border-white/5 relative z-10">
      <div className="layout-container px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h4 className="text-white font-serif tracking-widest uppercase">
              ChainBridge
            </h4>
            <p className="text-xs text-gray-600 max-w-[200px]">
              AI-Powered Procurement Infrastructure for the Elite Enterprise.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] text-gray-500 uppercase tracking-widest">
            <Link
              href="#"
              className="hover:text-gold-primary transition-colors"
            >
              Legal
            </Link>
            <Link
              href="#"
              className="hover:text-gold-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-gold-primary transition-colors"
            >
              Shanghai Office
            </Link>
            <Link
              href="#"
              className="hover:text-gold-primary transition-colors"
            >
              SF HQ
            </Link>
          </div>
          <div className="text-[10px] text-gray-600">
            © 2024 ChainBridge Systems Inc.
          </div>
        </div>
      </div>
    </footer>
  );
}
