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
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen overflow-hidden pt-12">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-primary/30 via-gold-dim/20 to-transparent opacity-30 blur-xl transition duration-700 group-hover:opacity-60"></div>
            <div className="relative flex flex-col md:flex-row items-center bg-slate-panel/80 backdrop-blur-xl border border-gold-primary/30 p-2 sm:p-3 shadow-2xl">
              <div className="flex items-center w-full px-4 md:px-6">
                <span className="material-symbols-outlined text-gold-primary font-light text-2xl">
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none text-white focus:outline-0 focus:ring-0 h-16 md:h-20 px-4 text-lg md:text-xl font-light placeholder:text-gray-600 font-sans tracking-wide"
                  placeholder="What are you sourcing today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleExecute}
                disabled={loading}
                className="w-full md:w-auto h-16 md:h-20 px-12 bg-gold-primary text-slate-900 hover:bg-white transition-all duration-500 text-sm md:text-base font-bold uppercase tracking-[0.2em] flex items-center justify-center whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sourcing..." : "Execute"}
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