"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Ticker from "./Ticker";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExecute = async () => {
    if (!query.trim()) return;

    setLoading(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      if (res.ok && data.conversationId) {
        router.push(`/chat?cId=${data.conversationId}`);
      } else {
        console.error("Failed to start chat:", data.error);
        setLoading(false); // Only stop loading on error, otherwise we are redirecting
        // Optionally show a toast error here
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleExecute();
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 bg-slate-dark z-[-2]"></div>
      <div className="bridge-beam"></div>
      <div
        className="bridge-beam"
        style={{ left: "30%", transform: "rotate(25deg)" }}
      ></div>
      <div
        className="bridge-beam"
        style={{ left: "70%", transform: "rotate(25deg)" }}
      ></div>
      <div className="bridge-beam-2"></div>
      <div className="relative z-10 w-full max-w-[1400px] 2xl:max-w-[1800px] px-6 md:px-12 flex flex-col items-center text-center transition-all duration-500">
        <div className="flex flex-col gap-6 max-w-4xl 2xl:max-w-6xl w-full items-center">
          <h1 className="text-white text-6xl md:text-8xl lg:text-9xl 2xl:text-[10rem] font-serif font-medium leading-[1] tracking-tight mb-4">
            Bridging <span className="gold-text-gradient italic">Vision.</span>
          </h1>
          <p className="text-white text-xl md:text-2xl 2xl:text-3xl font-light tracking-wide mb-12">
            Find your suppliers in{" "}
            <span className="strike-through mx-2 text-text-muted">
              many calls
            </span>{" "}
            one click.
          </p>
          <div className="w-full max-w-3xl 2xl:max-w-4xl mx-auto relative group z-30">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary/50 via-gold-dim/30 to-gold-primary/10 opacity-40 blur-lg transition duration-1000 group-hover:opacity-70 group-hover:blur-xl"></div>
            
            {/* Main Container */}
            <div className="relative flex items-center bg-[#0F1216] border border-white/10 p-1.5 shadow-2xl transition-all duration-300 focus-within:border-gold-primary/50 focus-within:bg-[#14181F] group-focus-within:shadow-[0_0_30px_rgba(197,160,89,0.15)]">
              
              {/* Icon */}
              <div className="pl-6 pr-2 hidden md:flex items-center justify-center pointer-events-none transition-colors duration-300 group-focus-within:text-gold-primary">
                <span className="material-symbols-outlined text-gray-500 group-focus-within:text-gold-primary text-2xl">search</span>
              </div>

              {/* Input */}
              <input
                className="w-full bg-transparent border-none text-white focus:outline-0 focus:ring-0 h-16 text-lg font-light placeholder:text-gray-600 font-sans tracking-wide px-4"
                placeholder="Describe your sourcing requirements..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              {/* Button */}
              <button
                onClick={handleExecute}
                disabled={loading}
                className="h-16 px-8 md:px-12 bg-gold-primary hover:bg-[#D4AF67] text-slate-900 transition-all duration-300 text-xs md:text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ml-2 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] active:scale-[0.98]"
              >
                <span>{loading ? "Processing" : "Initialize"}</span>
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-12 opacity-40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">
                verified
              </span>
              <span className="text-[10px] uppercase tracking-widest font-medium">
                Verified Manufacturers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">bolt</span>
              <span className="text-[10px] uppercase tracking-widest font-medium">
                Zero Intermediaries
              </span>
            </div>
          </div>
        </div>
      </div>
      <Ticker />
    </section>
  );
}