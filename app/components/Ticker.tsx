export default function Ticker() {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-panel border-t border-white/5 py-3 overflow-hidden z-20">
      <div className="ticker-fade-mask w-full">
        <div className="inline-block whitespace-nowrap animate-marquee">
          <span className="inline-flex items-center gap-8 px-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              Latest Matches:
            </span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">DEAL</span> • 5,000 Organic
              Cotton Tees • $2.45/unit •{" "}
              <span className="text-gray-500">Hangzhou → NYC</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">DEAL</span> • CNC Aluminum
              Casings • $12.80/unit •{" "}
              <span className="text-gray-500">Shenzhen → Berlin</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">REQ</span> • Sustainable
              Bamboo Packaging • Qty: 10k •{" "}
              <span className="text-gray-500">Processing...</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">DEAL</span> • Lithium Ion
              Battery Cells • $4.20/unit •{" "}
              <span className="text-gray-500">Dongguan → Tokyo</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              Latest Matches:
            </span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">DEAL</span> • 5,000 Organic
              Cotton Tees • $2.45/unit •{" "}
              <span className="text-gray-500">Hangzhou → NYC</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-xs text-gray-300 font-mono">
              <span className="text-gold-primary">DEAL</span> • CNC Aluminum
              Casings • $12.80/unit •{" "}
              <span className="text-gray-500">Shenzhen → Berlin</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
