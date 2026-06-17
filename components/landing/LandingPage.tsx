"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "framer-motion";
import { Award, Star } from "lucide-react";
import { GAMES } from "./games";

const CAROUSEL_GAMES = [...GAMES, ...GAMES];

export default function LandingPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const xTranslation = useMotionValue(0);
  const xPercent = useTransform(xTranslation, (value) => `${value}%`);

  useAnimationFrame((_, delta) => {
    if (isCarouselHovered) return;

    const speed = 0.0025;
    let newX = xTranslation.get() - delta * speed;

    if (newX <= -50) {
      newX = 0;
    }

    xTranslation.set(newX);
  });

  return (
    <motion.div
      initial={{ y: 160, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col items-center justify-center my-auto"
    >
      {/* --- HERO BANNER --- */}
      <div className="text-center max-w-3xl mx-auto mb-4 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        >
          <Award className="w-3 h-3" /> Challenge Yourself
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          Fun Games <br className="sm:hidden" />
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400">for your Mind</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
          Explore your favorite cognitive chambers and gain a whole new perspective on real-time rapid challenges.
        </p>
      </div>

      {/* --- INFINITE CAROUSEL --- */}
      <div
        className="w-full overflow-hidden py-12 mask-fade-edges"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <motion.div
          className="flex items-stretch gap-6 md:gap-8 w-max px-4"
          style={{ x: xPercent }}
        >
          {CAROUSEL_GAMES.map((game, index) => {
            const IconComponent = game.icon;
            const uniqueTrackId = `${game.id}-${index}`;
            const isHovered = hoveredId === uniqueTrackId;

            return (
              <motion.div
                key={uniqueTrackId}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index % GAMES.length) * 0.08 }}
                onMouseEnter={() => setHoveredId(uniqueTrackId)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative w-[260px] md:w-[300px] group cursor-pointer flex-shrink-0"
              >
                <Link href={`/play/${game.id}`} className="block h-full">
                  <div
                    className={`relative h-full flex flex-col justify-between bg-gradient-to-b from-[#15181f]/90 to-[#0e1014]/95 border ${isHovered ? 'border-purple-500/40' : 'border-white/[0.06]'} p-6 rounded-[32px] transition-all duration-500 shadow-2xl overflow-hidden backdrop-blur-xl group-hover:-translate-y-4`}
                    style={{
                      backgroundImage: game.bgGraphic,
                      boxShadow: isHovered ? `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 30px -5px var(--tw-shadow-color)` : 'none'
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 blur-xl pointer-events-none`} />

                    <div className="w-full flex items-center justify-center py-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div className="w-24 h-24 border border-white/5 rounded-full group-hover:scale-125 group-hover:border-white/10 transition-all duration-700" />
                        <div className="w-36 h-36 border border-white/[0.02] rounded-full absolute group-hover:scale-110 transition-all duration-700" />
                      </div>

                      <motion.div
                        animate={{ y: isHovered ? -12 : 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 10 }}
                        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${game.color} p-0.5 flex items-center justify-center ${game.shadow} shadow-2xl relative z-10`}
                      >
                        <div className="w-full h-full bg-[#0d0e12]/90 rounded-[22px] flex items-center justify-center text-white group-hover:bg-transparent transition-colors duration-300">
                          <IconComponent className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors duration-300 mb-1">
                        {game.subtitle}
                      </p>
                      <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                        {game.title}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal opacity-80 line-clamp-2 group-hover:opacity-100 transition-opacity">
                        {game.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.05]">
                      <span className="text-[11px] font-mono font-medium text-slate-500 flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {game.players}
                      </span>

                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-black font-mono">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{game.stats}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* --- BOTTOM GAME GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-4">
        {GAMES.map((game, index) => {
          const IconComponent = game.icon;
          const uniqueGridId = `grid-${game.id}`;
          const isHovered = hoveredId === uniqueGridId;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
              onMouseEnter={() => setHoveredId(uniqueGridId)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer"
            >
              <Link href={`/play/${game.id}`} className="block h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-3xl blur-xl ${game.shadow}`} />

                <div className="relative h-full flex flex-col justify-between bg-gradient-to-b from-[#13151c] to-[#0f1116] border border-slate-800/80 group-hover:border-slate-700/60 p-6 md:p-8 rounded-3xl transition-all duration-300 shadow-xl group-hover:-translate-y-1 overflow-hidden">
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        layoutId="hoverBorder"
                        className={`absolute inset-0 border-2 border-transparent rounded-3xl bg-gradient-to-br ${game.color} [mask-image:linear-gradient(white,white)_content-box,linear-gradient(white,white)] [mask-composite:padding-box,dash_exclude] -z-10`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3.5 bg-gradient-to-br ${game.color} rounded-2xl text-white shadow-lg shadow-black/40 transform group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold font-mono text-slate-500 group-hover:text-slate-400 bg-slate-900/50 border border-slate-800/50 px-2.5 py-1 rounded-full backdrop-blur-sm transition-colors">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> {game.stats}
                      </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-200 group-hover:text-white mb-2 transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {game.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-900">
                    <span className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> {game.players}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                      <span>Enter</span>
                      <motion.span
                        animate={{ x: isHovered ? 4 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}