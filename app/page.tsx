"use client";

import React from "react";
import Link from "next/link";
import { Play, ArrowUp, Gamepad2 } from "lucide-react";
import LandingPage from "@/components/landing/LandingPage";

export default function Dashboard() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#060709] text-slate-100 overflow-x-hidden font-sans selection:bg-purple-500 selection:text-white">

      {/* Immersive Cosmic Aurora Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(88,28,135,0.25),transparent_60%),radial-gradient(circle_at_10%_40%,rgba(6,182,212,0.08),transparent_40%),radial-gradient(circle_at_90%_70%,rgba(244,63,94,0.06),transparent_50%)] pointer-events-none" />

      {/* Micro Tech Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full mx-auto px-4 md:px-8 pt-6 pb-20 z-10 flex flex-col min-h-screen justify-between">

        {/* Minimal High-Tech Floating Top Bar */}
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 mb-8">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-black text-xs text-black tracking-tighter shrink-0">
              60'S
            </div>
            <span className="text-xs sm:text-sm font-black tracking-widest text-slate-400">
              UNIVERSE
            </span>
          </div>

          {/* Action Link Button */}
          <Link href={`/play/${'reaction'}`} className="block">
            <div className="group relative overflow-hidden flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1.5 sm:px-3 rounded-full backdrop-blur-md transition-all duration-300 hover:border-white/20">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 fill-cyan-400/20 animate-pulse shrink-0" />
              <span className="relative z-10 whitespace-nowrap">
                Play <b className="text-white font-bold">Game</b>
              </span>
            </div>
          </Link>
        </header>

        {/* Clean Modular Hero Layout Integration Block */}
        <LandingPage />

        {/* Global Minimal Dashboard Analytics Counter Footer Row */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-20 border-t border-white/5 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Left Column: About Us details */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-black text-[10px] text-black tracking-tighter">
                  60'S
                </div>
                <span className="text-xs font-black tracking-widest text-white">
                  60'S UNIVERSE
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                A micro-gaming nebula built to challenge human cognitive limits. 
                Test your reaction speed, train decision-making pathways, and sharp-tune your memory through lightning-fast, 60-second interactive trials. 
              </p>
            </div>

            {/* Middle Column: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Core Arenas</h4>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                <li>
                  <Link href="/play/reaction" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <Gamepad2 className="w-3 h-3" /> Reaction Test
                  </Link>
                </li>
                <li>
                  <Link href="/play/memory" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <Gamepad2 className="w-3 h-3" /> Memory Burst
                  </Link>
                </li>
                <li>
                  <Link href="/play/focus" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <Gamepad2 className="w-3 h-3" /> Focus Control
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-mono text-slate-500 order-2 sm:order-1">
              &copy; {new Date().getFullYear()} 60'S Universe. All mind assets loaded.
            </p>

            <button 
              onClick={scrollToTop}
              className="group relative overflow-hidden order-1 sm:order-2 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:text-white cursor-pointer"
            >
              <div className="absolute inset-0 -translate-x-full translate-y-full group-hover:translate-x-full group-hover:-translate-y-full transition-transform duration-700 ease-out bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent pointer-events-none" />
              <span>Return up</span>
              <ArrowUp className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </footer>

      </div>

      {/* Target Tailwind Hidden Utility Helpers */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
        }
      `}</style>
    </div>
  );
}