"use client";

interface GameEndScreenProps {
  finalScore: number;
  bestScore: number;
  rank: string;
  percentile: number;
  feedbackMessage: string;
  onRestart: () => void;
  onShare: () => void;
}

export default function GameEndScreen({
  finalScore,
  bestScore,
  rank,
  percentile,
  feedbackMessage,
  onRestart,
  onShare,
}: GameEndScreenProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#60a5fa]/35 bg-[#080b18]/90 shadow-[0_0_90px_rgba(96,165,250,0.25)] backdrop-blur-xl p-5 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.32),transparent_38%)]" />

      <div className="relative">
        <div className="flex justify-center gap-5 text-lg mb-1 opacity-90">
          <span className="text-yellow-300">✦</span>
          <span className="text-blue-400">◆</span>
          <span className="text-purple-400">✦</span>
          <span className="text-pink-400">◆</span>
          <span className="text-yellow-300">✦</span>
        </div>

        <div className="mx-auto mb-2 w-28 h-28 rounded-full border-2 border-[#8b5cf6]/70 bg-[#12182a] flex items-center justify-center shadow-[0_0_55px_rgba(139,92,246,0.55)]">
          <div className="text-6xl drop-shadow-[0_0_20px_rgba(250,204,21,0.65)]">🏆</div>
        </div>

        <div className="mx-auto -mt-2 mb-5 w-fit px-5 py-2 rounded-md bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#2563eb] border border-white/15 shadow-[0_0_25px_rgba(96,165,250,0.35)]">
          <p className="text-sm font-black tracking-widest text-white">CHALLENGE COMPLETED!</p>
        </div>

        <p className="text-xs tracking-[0.35em] uppercase text-[#aeb7d4] font-black">Score Achieved</p>

        <h2 className="text-7xl sm:text-8xl font-black mt-1 bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
          {finalScore}
        </h2>

        <div className="mt-3 inline-flex rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] px-7 py-2 text-white font-black shadow-[0_0_28px_rgba(96,165,250,0.45)]">
          ⚡ {rank}
        </div>

        <p className="mt-5 text-[#dbeafe] text-sm leading-6">
          🎉 Great job! You pushed your limits to the end.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
            <p className="text-xs text-[#8f96aa] uppercase tracking-widest">Best Score</p>
            <p className="text-3xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
              {bestScore} <span className="text-yellow-300">♛</span>
            </p>
            <p className="text-xs text-[#8f96aa]">Your personal best</p>
          </div>

          <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
            <p className="text-xs text-[#8f96aa] uppercase tracking-widest">Faster Than</p>
            <p className="text-3xl font-black text-[#60a5fa]">{percentile}%</p>
            <p className="text-xs text-[#8f96aa]">of players</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4 text-left">
          <div className="flex gap-3 items-center">
            <div className="text-2xl">⭐</div>
            <p className="text-sm text-[#b9c0d4] leading-5">{feedbackMessage}</p>
          </div>

          <div className="flex gap-3 items-center border-l border-white/10 pl-3">
            <div className="text-2xl">🧠</div>
            <p className="text-sm text-[#b9c0d4] leading-5">
              1 minute is over... but your brain isn’t.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={onRestart}
            className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-black py-4 text-lg tracking-widest shadow-[0_0_35px_rgba(96,165,250,0.45)] active:scale-95 transition"
          >
            ↻ PLAY AGAIN
          </button>

          <button
            onClick={onShare}
            className="w-full rounded-[1.4rem] border border-[#60a5fa]/50 bg-[#050814]/80 py-4 font-black text-[#dbeafe] active:scale-95 transition"
          >
            ⤴ SHARE SCORE
          </button>
        </div>
      </div>
    </div>
  );
}