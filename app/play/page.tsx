"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const GAME_TIME = 60;

  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bestScore, setBestScore] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [lastResult, setLastResult] = useState("");
  const [flashCell, setFlashCell] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const cells = Array.from({ length: 9 }, (_, i) => i);
  const progress = (timeLeft / GAME_TIME) * 100;

  useEffect(() => {
    const saved = Number(localStorage.getItem("bestScore60SecondBrain") || 0);
    setBestScore(saved);
  }, []);

  useEffect(() => {
    if (screen !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          endGame();
          return 0;
        }

        if (prev <= 10) playSound("tick");
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function playSound(type: "correct" | "wrong" | "start" | "tick") {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value =
        type === "correct"
          ? 820
          : type === "wrong"
          ? 150
          : type === "start"
          ? 520
          : 430;

      gain.gain.value = type === "tick" ? 0.012 : 0.045;

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  function randomTarget(prev: number | null = null) {
    let next;
    do {
      next = Math.floor(Math.random() * 9);
    } while (next === prev);
    return next;
  }

  function startCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const savedBest = Number(localStorage.getItem("bestScore60SecondBrain") || 0);

    setPreviousBest(savedBest);
    setBestScore(savedBest);
    setScore(0);
    setFinalScore(0);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setLastResult("");
    setFlashCell(null);
    setShake(false);
    setTarget(null);
    setCountdown(3);
    setScreen("countdown");

    playSound("start");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setTarget(randomTarget());
          setScreen("playing");
          playSound("correct");
          return 0;
        }

        playSound("start");
        return prev - 1;
      });
    }, 800);
  }

  function handleTap(index: number) {
    if (screen !== "playing") return;

    if (index === target) {
      const bonus = combo >= 5 ? 2 : 1;

      setScore((prev) => prev + bonus);
      setCombo((prev) => prev + 1);
      setLastResult(bonus === 2 ? "+2 streak ⚡" : "+1");
      setFlashCell(index);
      playSound("correct");

      setTimeout(() => setFlashCell(null), 120);
      setTimeout(() => setTarget((prev) => randomTarget(prev)), 60);
    } else {
      setCombo(0);
      setLastResult("Miss");
      setFlashCell(index);
      setShake(true);
      playSound("wrong");

      setTimeout(() => setFlashCell(null), 120);
      setTimeout(() => setShake(false), 180);
    }
  }

  function endGame() {
    if (timerRef.current) clearInterval(timerRef.current);

    setScore((currentScore) => {
      const savedBest = Number(localStorage.getItem("bestScore60SecondBrain") || 0);

      setFinalScore(currentScore);
      setPreviousBest(savedBest);

      if (currentScore > savedBest) {
        localStorage.setItem("bestScore60SecondBrain", String(currentScore));
        setBestScore(currentScore);
      } else {
        setBestScore(savedBest);
      }

      return currentScore;
    });

    setScreen("end");
  }

  function getRank(scoreValue = finalScore) {
    if (scoreValue < 20) return "Warm Up";
    if (scoreValue < 40) return "Focused";
    if (scoreValue < 60) return "Sharp Mind";
    if (scoreValue < 80) return "Brain Sprint";
    return "Genius Mode";
  }

  function getMessage() {
    if (finalScore > previousBest && previousBest > 0) {
      return `New best score! You beat your record by +${finalScore - previousBest}.`;
    }

    if (previousBest > finalScore) {
      return `You were only ${previousBest - finalScore} taps away from your best.`;
    }

    if (finalScore === previousBest && finalScore > 0) {
      return "You matched your best. One more run could break it.";
    }

    return "Great job! You kept your focus till the end.";
  }

  function getPercentile() {
    if (finalScore < 20) return 38;
    if (finalScore < 35) return 55;
    if (finalScore < 50) return 68;
    if (finalScore < 65) return 78;
    if (finalScore < 80) return 88;
    return 94;
  }

  function shareScore() {
    const text = `I just scored ${finalScore} on 60 Second Brain 🧠⚡

Fastest focus challenge — can you beat me?

https://60secondbrain.com`;

    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share message copied!");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050712] text-white flex items-center justify-center px-4 py-5 relative">
      <div className="absolute top-[-130px] left-[-120px] w-80 h-80 bg-[#6d4cff]/20 blur-[110px] rounded-full" />
      <div className="absolute bottom-[-130px] right-[-120px] w-96 h-96 bg-[#3b82f6]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 bg-[#8b5cf6]/20 blur-[100px] rounded-full" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-5">
          <p className="text-xs tracking-[0.42em] uppercase font-black bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
            60 Second Brain
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-3 leading-tight tracking-tight">
            Train Your{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
              Focus
            </span>
          </h1>
        </div>

        {screen === "start" && (
          <div className="rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-6 text-center">
            <div className="mx-auto mb-5 w-24 h-24 rounded-full bg-[#12182a] border border-[#8b9cff]/20 flex items-center justify-center shadow-[0_0_45px_rgba(139,92,246,0.35)]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(96,165,250,0.55)]">
                🧠
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              Ready for 60 seconds?
            </h2>

            <p className="text-[#b9c0d4] text-sm mt-4 leading-7">
              Tap the highlighted number as fast as you can.
              <br />
              Beat your best and challenge a friend.
            </p>

            <div className="grid grid-cols-2 gap-4 my-7">
              <div className="rounded-[1.4rem] bg-[#090c17]/70 border border-white/10 p-4 text-left">
                <p className="text-xs uppercase tracking-widest text-[#8f96aa]">
                  🏆 Best Score
                </p>
                <p className="mt-2 text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                  {bestScore}
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-[#090c17]/70 border border-white/10 p-4 text-left">
                <p className="text-xs uppercase tracking-widest text-[#8f96aa]">
                  ⏱ Challenge
                </p>
                <p className="mt-2 text-4xl font-black text-[#60a5fa]">
                  60s
                </p>
              </div>
            </div>

            <button
              onClick={startCountdown}
              className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-black py-4 text-lg tracking-widest shadow-[0_0_35px_rgba(96,165,250,0.45)] active:scale-95 transition"
            >
              ⚡ START CHALLENGE
            </button>

            <p className="text-center text-[#8f96aa] text-sm mt-6">
              🧠 One minute. One focus.
            </p>
          </div>
        )}

        {screen === "countdown" && (
          <div className="rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_80px_rgba(96,165,250,0.2)] backdrop-blur-xl p-10 text-center">
            <p className="text-[#8f96aa] text-sm uppercase tracking-[0.28em] font-black">
              Get Ready
            </p>

            <div className="my-8 text-8xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text animate-pulse">
              {countdown > 0 ? countdown : "GO"}
            </div>

            <p className="text-[#b9c0d4] text-sm">
              Focus on the highlighted number.
            </p>
          </div>
        )}

        {screen === "playing" && (
          <div
            className={`rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-5 transition ${
              shake ? "translate-x-1" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8f96aa]">
                  Focus Score
                </p>
                <p className="text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                  {score}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-[#8f96aa]">
                  Streak
                </p>
                <p
                  className={`text-xl font-black ${
                    combo >= 5
                      ? "text-[#60a5fa] animate-pulse"
                      : "text-[#a78bfa]"
                  }`}
                >
                  {combo > 1 ? `x${combo}` : "-"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-[#8f96aa]">
                  Time
                </p>
                <p
                  className={`text-4xl font-black ${
                    timeLeft <= 10
                      ? "text-red-400 animate-pulse"
                      : "text-[#60a5fa]"
                  }`}
                >
                  {timeLeft}
                </p>
              </div>
            </div>

            <div className="h-3 bg-[#090c17]/80 border border-white/10 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] transition-all duration-500 shadow-[0_0_22px_rgba(96,165,250,0.75)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {cells.map((cell) => {
                const isActive = target === cell;
                const isFlashing = flashCell === cell;

                return (
                  <button
                    key={cell}
                    onClick={() => handleTap(cell)}
                    disabled={screen !== "playing"}
                    className={`aspect-square rounded-[26px] flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-150 active:scale-90 border select-none ${
                      isActive
                        ? "bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white border-[#c4b5fd]/60 scale-105 shadow-[0_0_40px_rgba(96,165,250,0.72)]"
                        : "bg-[#090c17]/75 text-[#6f7891] border-white/10 hover:bg-[#151b2d]"
                    } ${
                      isFlashing && isActive
                        ? "ring-4 ring-[#93c5fd]/60 scale-95"
                        : ""
                    } ${
                      isFlashing && !isActive
                        ? "ring-4 ring-red-400/60 scale-95"
                        : ""
                    }`}
                  >
                    <span className={isActive ? "animate-pulse" : ""}>
                      {cell + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-7 mt-4 text-center text-sm font-black">
              <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                {lastResult}
              </span>
            </div>
          </div>
        )}

        {screen === "end" && (
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
                <div className="text-6xl drop-shadow-[0_0_20px_rgba(250,204,21,0.65)]">
                  🏆
                </div>
              </div>

              <div className="mx-auto -mt-2 mb-5 w-fit px-5 py-2 rounded-md bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#2563eb] border border-white/15 shadow-[0_0_25px_rgba(96,165,250,0.35)]">
                <p className="text-sm font-black tracking-widest text-white">
                  CHALLENGE COMPLETED!
                </p>
              </div>

              <p className="text-xs tracking-[0.35em] uppercase text-[#aeb7d4] font-black">
                Focus Score
              </p>

              <h2 className="text-7xl sm:text-8xl font-black mt-1 bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                {finalScore}
              </h2>

              <div className="mt-3 inline-flex rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] px-7 py-2 text-white font-black shadow-[0_0_28px_rgba(96,165,250,0.45)]">
                ⚡ {getRank()}
              </div>

              <p className="mt-5 text-[#dbeafe] text-sm leading-6">
                🎉 Great job! You kept your{" "}
                <span className="text-[#a78bfa] font-black">focus</span> till
                the end.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
                  <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                    Best Score
                  </p>
                  <p className="text-3xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                    {bestScore} <span className="text-yellow-300">♛</span>
                  </p>
                  <p className="text-xs text-[#8f96aa]">Your personal best</p>
                </div>

                <div className="rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4">
                  <p className="text-xs text-[#8f96aa] uppercase tracking-widest">
                    Faster Than
                  </p>
                  <p className="text-3xl font-black text-[#60a5fa]">
                    {getPercentile()}%
                  </p>
                  <p className="text-xs text-[#8f96aa]">of players</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 rounded-[1.3rem] bg-[#050814]/80 border border-[#8b9cff]/20 p-4 text-left">
                <div className="flex gap-3 items-center">
                  <div className="text-2xl">⭐</div>
                  <p className="text-sm text-[#b9c0d4] leading-5">
                    {getMessage()}
                  </p>
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
                  onClick={startCountdown}
                  className="w-full rounded-[1.4rem] bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-black py-4 text-lg tracking-widest shadow-[0_0_35px_rgba(96,165,250,0.45)] active:scale-95 transition"
                >
                  ↻ PLAY AGAIN
                </button>

                <button
                  onClick={shareScore}
                  className="w-full rounded-[1.4rem] border border-[#60a5fa]/50 bg-[#050814]/80 py-4 font-black text-[#dbeafe] active:scale-95 transition"
                >
                  ⤴ SHARE SCORE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}