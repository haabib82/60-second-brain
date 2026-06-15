"use client";

import { useEffect, useRef, useState } from "react";
import GameWrapper from "./ui/GameWrapper";
import GameStartScreen from "./ui/GameStartScreen";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";

export default function FocusGame() {
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
        type === "correct" ? 820 : type === "wrong" ? 150 : type === "start" ? 520 : 430;
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

  function getRank() {
    if (finalScore < 20) return "Warm Up";
    if (finalScore < 40) return "Focused";
    if (finalScore < 60) return "Sharp Mind";
    if (finalScore < 80) return "Brain Sprint";
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
    const text = `I just scored ${finalScore} on 60 Second Brain 🧠⚡\n\nFastest focus challenge — can you beat me?\n\nhttps://60secondbrain.com`;
    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share message copied!");
    }
  }

  return (
    <GameWrapper gameTitle="Focus">
      {screen === "start" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Tap the highlighted number as fast as you can.\nBeat your best and challenge a friend.`}
          onStart={startCountdown}
        />
      )}

      {screen === "countdown" && <GameCountdownScreen countdown={countdown} />}

      {screen === "playing" && (
        <div
          className={`rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-5 transition ${
            shake ? "translate-x-1" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Focus Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                {score}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Streak</p>
              <p className={`text-xl font-black ${combo >= 5 ? "text-[#60a5fa] animate-pulse" : "text-[#a78bfa]"}`}>
                {combo > 1 ? `x${combo}` : "-"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Time</p>
              <p className={`text-4xl font-black ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-[#60a5fa]"}`}>
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
                  } ${isFlashing && isActive ? "ring-4 ring-[#93c5fd]/60 scale-95" : ""} ${
                    isFlashing && !isActive ? "ring-4 ring-red-400/60 scale-95" : ""
                  }`}
                >
                  <span className={isActive ? "animate-pulse" : ""}>{cell + 1}</span>
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
        <GameEndScreen
          finalScore={finalScore}
          bestScore={bestScore}
          rank={getRank()}
          percentile={getPercentile()}
          feedbackMessage={getMessage()}
          onRestart={startCountdown}
          onShare={shareScore}
        />
      )}
    </GameWrapper>
  );
}