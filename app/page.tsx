"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050712] text-white flex items-center justify-center px-4 py-6 relative">
      <div className="absolute top-[-140px] left-[-120px] w-96 h-96 bg-[#8b5cf6]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-160px] right-[-120px] w-96 h-96 bg-[#3b82f6]/20 blur-[130px] rounded-full" />
      <div className="absolute top-[35%] right-[-140px] w-72 h-72 bg-[#60a5fa]/10 blur-[100px] rounded-full" />

      <section className="relative w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left">
          <p className="text-xs tracking-[0.45em] uppercase font-black bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text mb-5">
            60 Second Brain
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Test Your{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
              Focus
            </span>{" "}
            in 60 Seconds
          </h1>

          <p className="mt-6 text-[#b9c0d4] text-base sm:text-lg leading-8 max-w-xl mx-auto lg:mx-0">
            A fast, simple focus challenge. Tap the highlighted number, build a
            streak, and see how sharp your brain is today.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl mx-auto lg:mx-0">
            <div className="rounded-2xl bg-[#090c17]/80 border border-white/10 p-4">
              <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                Time
              </p>
              <p className="mt-2 text-2xl font-black text-[#60a5fa]">60s</p>
            </div>

            <div className="rounded-2xl bg-[#090c17]/80 border border-white/10 p-4">
              <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                Average
              </p>
              <p className="mt-2 text-2xl font-black text-[#a78bfa]">50+</p>
            </div>

            <div className="rounded-2xl bg-[#090c17]/80 border border-white/10 p-4">
              <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                Elite
              </p>
              <p className="mt-2 text-2xl font-black text-[#60a5fa]">100+</p>
            </div>
          </div>

          <div className="mt-8 space-y-3 max-w-xl mx-auto lg:mx-0">
            <button
              onClick={() => router.push("/play")}
              className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] py-4 text-white font-black text-lg tracking-widest shadow-[0_0_35px_rgba(96,165,250,0.45)] active:scale-95 transition"
            >
              ⚡ START CHALLENGE
            </button>

            <p className="text-sm text-[#8f96aa]">
              No login. No download. Just one minute of pure focus.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-[#60a5fa]/30 bg-[#080b18]/90 shadow-[0_0_90px_rgba(96,165,250,0.22)] backdrop-blur-xl p-5 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.3),transparent_42%)]" />

            <div className="relative">
              <div className="flex justify-center gap-5 text-lg mb-3">
                <span className="text-yellow-300">✦</span>
                <span className="text-blue-400">◆</span>
                <span className="text-purple-400">✦</span>
                <span className="text-pink-400">◆</span>
                <span className="text-yellow-300">✦</span>
              </div>

              <div className="mx-auto mb-4 w-24 h-24 rounded-full border-2 border-[#8b5cf6]/70 bg-[#12182a] flex items-center justify-center shadow-[0_0_55px_rgba(139,92,246,0.55)]">
                <div className="text-5xl">🧠</div>
              </div>

              <div className="mx-auto mb-5 w-fit px-5 py-2 rounded-md bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#2563eb] border border-white/15">
                <p className="text-sm font-black tracking-widest">
                  TODAY’S CHALLENGE
                </p>
              </div>

              <p className="text-xs tracking-[0.35em] uppercase text-[#aeb7d4] font-black">
                Can you beat
              </p>

              <h2 className="text-7xl sm:text-8xl font-black mt-1 bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                50?
              </h2>

              <div className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] px-7 py-2 text-white font-black shadow-[0_0_28px_rgba(96,165,250,0.45)]">
                ⚡ Focus Test
              </div>

              <p className="mt-5 text-[#dbeafe] text-sm leading-6">
                Most players try again immediately after their first score.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
                  <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                    Top Score
                  </p>
                  <p className="text-3xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                    100+
                  </p>
                  <p className="text-xs text-[#8f96aa]">Elite focus</p>
                </div>

                <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
                  <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                    Goal
                  </p>
                  <p className="text-3xl font-black text-[#60a5fa]">Beat 50</p>
                  <p className="text-xs text-[#8f96aa]">First target</p>
                </div>
              </div>

              <button
                onClick={() => router.push("/play")}
                className="mt-5 w-full rounded-[1.4rem] border border-[#60a5fa]/50 bg-[#050814]/80 py-4 font-black text-[#dbeafe] active:scale-95 transition"
              >
                PLAY NOW →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}