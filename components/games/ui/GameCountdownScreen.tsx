"use client";

interface GameCountdownScreenProps {
  countdown: number;
}

export default function GameCountdownScreen({ countdown }: GameCountdownScreenProps) {
  return (
    <div className="rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_80px_rgba(96,165,250,0.2)] backdrop-blur-xl p-10 text-center">
      <p className="text-[#8f96aa] text-sm uppercase tracking-[0.28em] font-black">Get Ready</p>

      <div className="my-8 text-8xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text animate-pulse">
        {countdown > 0 ? countdown : "GO"}
      </div>

      <p className="text-[#b9c0d4] text-sm">Focus on the highlighted target area.</p>
    </div>
  );
}