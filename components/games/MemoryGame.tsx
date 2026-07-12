"use client";

import { useEffect, useRef, useState } from "react";
import GameWrapper from "./ui/GameWrapper";
import GameStartScreen from "./ui/GameStartScreen";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";

export default function SequenceGame() {
  const GAME_TIME = 60;

  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bestScore, setBestScore] = useState(0);
  
  // Game engine specific states
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeFlashCell, setActiveFlashCell] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const screenRef = useRef(screen);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const cells = Array.from({ length: 9 }, (_, i) => i);
  const progress = (timeLeft / GAME_TIME) * 100;

  // Load High Score
  useEffect(() => {
    const saved = Number(localStorage.getItem("bestScore60SecondSequence") || 0);
    setBestScore(saved);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  // Main Game Countdown Timer
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

  useEffect(() => {
    if (
      screen === "playing" &&
      sequence.length === 0 &&
      !isShowingSequence
    ) {
      generateNextSequenceLevel([Math.floor(Math.random() * 9)]);
    }
  }, [screen]);

  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function playSound(type: "correct" | "wrong" | "start" | "tick" | "flash") {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value =
        type === "correct" ? 880 : 
        type === "wrong" ? 140 : 
        type === "start" ? 580 : 
        type === "flash" ? 640 : 430;

      gain.gain.value = type === "tick" ? 0.012 : 0.045;
      osc.start();
      osc.stop(ctx.currentTime + (type === "flash" ? 0.15 : 0.08));
    } catch {}
  }

  function startCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);

    const savedBest = Number(localStorage.getItem("bestScore60SecondSequence") || 0);

    setPreviousBest(savedBest);
    setBestScore(savedBest);
    setScore(0);
    setFinalScore(0);
    setTimeLeft(GAME_TIME);
    setFeedbackText("");
    setShake(false);
    setSequence([]);
    setPlayerSequence([]);
    setCountdown(3);
    setScreen("countdown");

    playSound("start");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setScreen("playing");
          return 0;
        }
        playSound("start");
        return prev - 1;
      });
    }, 800);
  }

  async function generateNextSequenceLevel(nextSequence: number[]) {
    setSequence(nextSequence);
    setPlayerSequence([]);
    setIsShowingSequence(true);
    setFeedbackText("Watch Pattern...");

    await new Promise((resolve) => {
      sequenceTimeoutRef.current = setTimeout(resolve, 600);
    });

    if (screenRef.current === "end") {
      setIsShowingSequence(false);
      return;
    }

    for (let i = 0; i < nextSequence.length; i++) {
      if (screenRef.current === "end") {
        setIsShowingSequence(false);
        setActiveFlashCell(null);
        return;
      }

      const cellId = nextSequence[i];

      setActiveFlashCell(cellId);
      playSound("flash");

      await new Promise((resolve) => {
        sequenceTimeoutRef.current = setTimeout(resolve, 350);
      });

      setActiveFlashCell(null);

      await new Promise((resolve) => {
        sequenceTimeoutRef.current = setTimeout(resolve, 150);
      });
    }

    if (screenRef.current === "end") return;

    setIsShowingSequence(false);
    setFeedbackText("Your Turn!");
  }

  function handleTileTap(index: number) {
    if (screen !== "playing" || isShowingSequence) return;

    const expectedIndex = playerSequence.length;
    const expectedCellId = sequence[expectedIndex];

    if (index === expectedCellId) {
      const updatedPlayerSeq = [...playerSequence, index];
      setPlayerSequence(updatedPlayerSeq);
      playSound("flash");

      if (updatedPlayerSeq.length === sequence.length) {
        const structuralScoreBonus = sequence.length;
        setScore((prev) => prev + structuralScoreBonus);
        setFeedbackText(`Perfect! +${structuralScoreBonus}⚡`);
        playSound("correct");

        sequenceTimeoutRef.current = setTimeout(() => {
          const nextRandomTile = Math.floor(Math.random() * 9);
          generateNextSequenceLevel([...sequence, nextRandomTile]);
        }, 600);
      }
    } else {
      setShake(true);
      setFeedbackText("Strike! Resetting level...");
      playSound("wrong");

      sequenceTimeoutRef.current = setTimeout(() => setShake(false), 200);

      sequenceTimeoutRef.current = setTimeout(() => {
        generateNextSequenceLevel([Math.floor(Math.random() * 9)]);
      }, 800);
    }
  }

  function endGame() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);

    setIsShowingSequence(false);
    setActiveFlashCell(null);

    setScore((currentScore) => {
      const savedBest = Number(
        localStorage.getItem("bestScore60SecondSequence") || 0
      );

      setFinalScore(currentScore);
      setPreviousBest(savedBest);

      if (currentScore > savedBest) {
        localStorage.setItem(
          "bestScore60SecondSequence",
          String(currentScore)
        );
        setBestScore(currentScore);
      } else {
        setBestScore(savedBest);
      }

      return currentScore;
    });

    setSequence([]);
    setPlayerSequence([]);
    setScreen("end");
  }

  function getRank() {
    if (finalScore < 15) return "Scout";
    if (finalScore < 35) return "Tactician";
    if (finalScore < 60) return "Neuro-Linker";
    if (finalScore < 90) return "Grandmaster";
    return "Photographic Brain";
  }

  function getMessage() {
    if (finalScore > previousBest && previousBest > 0) {
      return `Phenomenal! You beat your memory sequence records by +${finalScore - previousBest}.`;
    }
    if (previousBest > finalScore) {
      return `Missed your best record by ${previousBest - finalScore} structural points. Try again!`;
    }
    return "Excellent pattern recognition capacity sustained.";
  }

  function getPercentile() {
    if (finalScore < 15) return 42;
    if (finalScore < 35) return 61;
    if (finalScore < 60) return 79;
    if (finalScore < 90) return 91;
    return 97;
  }

  function shareScore() {
    const text = `I just scored ${finalScore} on 60 Second Sequence Memory 🧠⚡\n\nCan your working memory compete with mine?\n\nhttps://60secondbrain.com`;
    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share message copied!");
    }
  }

  return (
    <GameWrapper gameTitle="Brain">
      {screen === "start" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Memorize the order of flashing blocks.\nRepeat the sequence cleanly back.\nLonger chains grant exponential score values!`}
          onStart={startCountdown}
        />
      )}

      {screen === "countdown" && <GameCountdownScreen countdown={countdown} />}

      {screen === "playing" && (
        <div
          style={{
            backgroundImage: "radial-gradient(circle at 50% 120%, rgba(244,63,94,0.15), transparent 70%)"
          }}
          className={`rounded-[2rem] border border-rose-500/25 bg-[#121013]/90 shadow-[0_0_70px_rgba(244,63,94,0.12)] backdrop-blur-xl p-5 transition ${
            shake ? "animate-shake border-rose-600 bg-rose-950/10" : ""
          }`}
        >
          {/* Top Panel Metrics Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#9d8fa0]">Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-500 text-transparent bg-clip-text">
                {score}
              </p>
            </div>

            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-[#9d8fa0] block">Chain Length</span>
              <p className="text-xl font-black text-pink-400 mt-1">
                {sequence.length > 0 ? `${playerSequence.length}/${sequence.length}` : "-"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[#9d8fa0]">Time</p>
              <p className={`text-4xl font-black ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-rose-400"}`}>
                {timeLeft}
              </p>
            </div>
          </div>

          {/* Time Limit Progress Gas Tube */}
          <div className="h-3 bg-[#0d0a0e]/90 border border-white/5 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 shadow-[0_0_22px_rgba(244,63,94,0.75)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Core Custom Styled Memory Sequence Grid Deck */}
          <div className="grid grid-cols-3 gap-3">
            {cells.map((cell) => {
              const isFlashing = activeFlashCell === cell;

              return (
                <button
                  key={cell}
                  onClick={() => handleTileTap(cell)}
                  disabled={isShowingSequence}
                  className={`aspect-square rounded-[26px] flex items-center justify-center transition-all duration-150 border select-none ${
                    isFlashing
                      ? "bg-gradient-to-br from-pink-400 to-rose-500 border-rose-300 scale-105 shadow-[0_0_45px_rgba(244,63,94,0.85)]"
                      : isShowingSequence
                      ? "bg-[#0e0d14]/40 border-white/[0.02] text-transparent cursor-not-allowed"
                      : "bg-[#0e0d14]/80 border-white/5 hover:bg-[#1a141b] hover:border-pink-500/20 active:scale-95"
                  }`}
                />
              );
            })}
          </div>

          {/* Sandbox Event Text Field Area */}
          <div className="h-7 mt-4 text-center text-sm font-black tracking-wide">
            <span className={isShowingSequence ? "text-pink-400" : "text-rose-400"}>
              {feedbackText}
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