"use client";

import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050712] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-120px] left-[-100px] w-80 h-80 bg-[#8b5cf6]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-[#3b82f6]/20 blur-[120px] rounded-full" />

      <div className="relative max-w-md w-full text-center">
        {/* Brand */}
        <p className="text-xs tracking-[0.4em] uppercase font-black bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text mb-4">
          60 Second Brain
        </p>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-black leading-tight">
          Train Your{" "}
          <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
            Focus
          </span>{" "}
          in 60 Seconds
        </h1>

        {/* Subtext */}
        <p className="text-[#b9c0d4] mt-5 text-sm leading-6">
          Most people can’t stay focused for even a minute.
          <br />
          Can you beat the average score?
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 my-8">
          <div className="rounded-xl bg-[#090c17]/70 border border-white/10 p-4">
            <p className="text-xs text-[#8f96aa] uppercase">Average</p>
            <p className="text-3xl font-black text-[#60a5fa]">30–70</p>
          </div>

          <div className="rounded-xl bg-[#090c17]/70 border border-white/10 p-4">
            <p className="text-xs text-[#8f96aa] uppercase">Top 5%</p>
            <p className="text-3xl font-black text-[#a78bfa]">100+</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/play")}
          className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] py-4 font-black text-lg tracking-widest shadow-[0_0_30px_rgba(96,165,250,0.4)] active:scale-95 transition"
        >
          ⚡ START CHALLENGE
        </button>

        {/* Footer */}
        <p className="mt-6 text-sm text-[#8f96aa]">
          🧠 1 minute. No login. Pure focus.
        </p>
      </div>
    </main>
  );
}