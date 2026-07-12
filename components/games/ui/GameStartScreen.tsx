"use client";

interface GameStartScreenProps {
  bestScore: number;
  description: string;
  onStart: () => void;
}

export default function GameStartScreen({ bestScore, description, onStart }: GameStartScreenProps) {
  return (
    <div className="rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-6 text-center">
      <div className="mx-auto mb-5 w-24 h-24 rounded-full bg-[#12182a] border border-[#8b9cff]/20 flex items-center justify-center shadow-[0_0_45px_rgba(139,92,246,0.35)]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(96,165,250,0.55)]">
          🧠
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black">Ready for 60 seconds?</h2>

      <p className="text-[#b9c0d4] text-sm mt-4 leading-7 whitespace-pre-line">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-4 my-7">
        <div className="rounded-[1.4rem] bg-[#090c17]/70 border border-white/10 p-4 text-left">
          <p className="text-xs uppercase tracking-widest text-[#8f96aa]">🏆 Best Score</p>
          <p className="mt-2 text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
            {bestScore}
          </p>
        </div>

        <div className="rounded-[1.4rem] bg-[#090c17]/70 border border-white/10 p-4 text-left">
          <p className="text-xs uppercase tracking-widest text-[#8f96aa]">⏱ Challenge</p>
          <p className="mt-2 text-4xl font-black text-[#60a5fa]">60s</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-black py-4 text-lg tracking-widest shadow-[0_0_35px_rgba(96,165,250,0.45)] active:scale-95 transition"
      >
        ⚡ START CHALLENGE
      </button>

      <p className="text-center text-[#8f96aa] text-sm mt-6">🧠 One minute. One focus.</p>
    </div>
  );
}