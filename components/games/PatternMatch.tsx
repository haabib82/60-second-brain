"use client";

import { useEffect, useRef, useState } from "react";
import GameWrapper from "./ui/GameWrapper";
import GameStartScreen from "./ui/GameStartScreen";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";

export default function VisualMemoryGame() {
  const GAME_TIME = 60;

  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bestScore, setBestScore] = useState(0);

  // Matrix Game Specific States
  const [gridSize, setGridSize] = useState(3); // 3x3, 4x4, 5x5...
  const [targetTiles, setTargetTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [wrongTiles, setWrongTiles] = useState<number[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [shake, setShake] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalCells = gridSize * gridSize;
  const cells = Array.from({ length: totalCells }, (_, i) => i);
  const progress = (timeLeft / GAME_TIME) * 100;

  // Load High Score
  useEffect(() => {
    const saved = Number(localStorage.getItem("bestScore60SecondVisual") || 0);
    setBestScore(saved);
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

  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function playSound(type: "correct" | "wrong" | "start" | "tick" | "clear") {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value =
        type === "correct" ? 600 : 
        type === "clear" ? 900 :
        type === "wrong" ? 130 : 
        type === "start" ? 550 : 400;

      gain.gain.value = type === "tick" ? 0.012 : 0.045;
      osc.start();
      osc.stop(ctx.currentTime + (type === "clear" ? 0.2 : 0.08));
    } catch {}
  }

  function startCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const savedBest = Number(localStorage.getItem("bestScore60SecondVisual") || 0);

    setPreviousBest(savedBest);
    setBestScore(savedBest);
    setScore(0);
    setFinalScore(0);
    setTimeLeft(GAME_TIME);
    setGridSize(3);
    setStrikes(0);
    setFeedbackText("");
    setWrongTiles([]);
    setSelectedTiles([]);
    setTargetTiles([]);
    setCountdown(3);
    setScreen("countdown");

    playSound("start");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setScreen("playing");
          generateMatrixRound(3, 3); // Start with 3x3, 3 targets
          return 0;
        }
        playSound("start");
        return prev - 1;
      });
    }, 800);
  }

  function generateMatrixRound(size: number, targetsCount: number) {
    setGridSize(size);
    setSelectedTiles([]);
    setWrongTiles([]);
    setStrikes(0);
    setIsShowingPattern(true);
    setFeedbackText("Memorize Tiles...");

    // Generate unique random target cell placements
    const newTargets: number[] = [];
    while (newTargets.length < targetsCount) {
      const rand = Math.floor(Math.random() * (size * size));
      if (!newTargets.includes(rand)) {
        newTargets.push(rand);
      }
    }
    setTargetTiles(newTargets);

    // Show pattern for 1.2 seconds, then flip back
    setTimeout(() => {
      setIsShowingPattern(false);
      setFeedbackText("Find the Tiles!");
    }, 1200);
  }

  function handleCellClick(index: number) {
    if (screen !== "playing" || isShowingPattern) return;
    if (selectedTiles.includes(index) || wrongTiles.includes(index)) return;

    if (targetTiles.includes(index)) {
      // Hit a correct square!
      const updatedSelections = [...selectedTiles, index];
      setSelectedTiles(updatedSelections);
      playSound("correct");

      // Check if all correct matrix items were successfully uncovered
      if (updatedSelections.length === targetTiles.length) {
        const pointsEarned = targetTiles.length * 2;
        setScore((prev) => prev + pointsEarned);
        setFeedbackText(`Perfect! +${pointsEarned} ⚡`);
        playSound("clear");

        // Dynamic Level Progression Scaling System
        setTimeout(() => {
          let nextSize = gridSize;
          let nextTargetsCount = targetTiles.length + 1;

          // Scale grid dimensions contextually up based on target capacities
          if (nextTargetsCount > Math.floor((gridSize * gridSize) / 2)) {
            nextSize = Math.min(gridSize + 1, 6); // Max grid cap safely at 6x6
          }
          
          generateMatrixRound(nextSize, nextTargetsCount);
        }, 800);
      }
    } else {
      // Missed structural node! Add strike penalty
      const updatedWrong = [...wrongTiles, index];
      setWrongTiles(updatedWrong);
      const currentStrikes = strikes + 1;
      setStrikes(currentStrikes);
      playSound("wrong");

      if (currentStrikes >= 3) {
        // Too many strikes: Break round flow, apply screen shake, downscale level slightly
        setShake(true);
        setFeedbackText("Round Failed! Resetting layout...");
        setTimeout(() => setShake(false), 200);

        setTimeout(() => {
          const nextSize = Math.max(3, gridSize - 1);
          const nextTargetsCount = Math.max(3, targetTiles.length - 2);
          generateMatrixRound(nextSize, nextTargetsCount);
        }, 800);
      }
    }
  }

  function endGame() {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsShowingPattern(false);

    setScore((currentScore) => {
      const savedBest = Number(localStorage.getItem("bestScore60SecondVisual") || 0);
      setFinalScore(currentScore);
      setPreviousBest(savedBest);

      if (currentScore > savedBest) {
        localStorage.setItem("bestScore60SecondVisual", String(currentScore));
        setBestScore(currentScore);
      } else {
        setBestScore(savedBest);
      }
      return currentScore;
    });
    setScreen("end");
  }

  function getRank() {
    if (finalScore < 25) return "Observer";
    if (finalScore < 55) return "Scanner";
    if (finalScore < 95) return "Overdrive Core";
    return "Omnipresent Vision";
  }

  function getMessage() {
    if (finalScore > previousBest && previousBest > 0) {
      return `Spatial record shattered! You beat your old threshold by +${finalScore - previousBest}.`;
    }
    return "Exceptional chunking and processing retention speed.";
  }

  function getPercentile() {
    if (finalScore < 25) return 40;
    if (finalScore < 55) return 65;
    if (finalScore < 95) return 84;
    return 96;
  }

  function shareScore() {
    const text = `I just scored ${finalScore} on 60 Secondary Visual Matrix 🧠⚡\n\nCan your eyes handle these scaling dimensions?\n\nhttps://60secondbrain.com`;
    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share message copied!");
    }
  }

  return (
    <GameWrapper gameTitle="Visual">
      {screen === "start" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Memorize the flash pattern of matrix cubes.\nRe-identify them perfectly as dimensions grow.\n3 strikes fails the active round configuration.`}
          onStart={startCountdown}
        />
      )}

      {screen === "countdown" && <GameCountdownScreen countdown={countdown} />}

      {screen === "playing" && (
        <div
          className={`rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-5 transition ${
            shake ? "animate-shake" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                {score}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Strikes</p>
              <p className="text-xl font-black text-red-400">
                {"❌".repeat(strikes) || "✨"}
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

          {/* Fully Dynamic Grid System Configuration */}
          <div 
            className="grid gap-2 aspect-square max-w-[340px] mx-auto w-full"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
            }}
          >
            {cells.map((cell) => {
              const isTarget = targetTiles.includes(cell);
              const isSelected = selectedTiles.includes(cell);
              const isWrong = wrongTiles.includes(cell);

              // CRITICAL FIX: Only flip the card up when showing the initial pattern 
              const isFlipped = isShowingPattern && isTarget;

              // Static styling applied to the front face during active gameplay interaction
              let frontFaceStyle = "bg-[#090c17]/75 border-white/10 hover:bg-[#151b2d] active:scale-95";
              if (isSelected) {
                frontFaceStyle = "bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse scale-100";
              } else if (isWrong) {
                frontFaceStyle = "bg-red-950/60 border-red-500/50 scale-95";
              }

              return (
                <div
                  key={cell}
                  className="w-full h-full select-none"
                  style={{ minHeight: "45px", perspective: "600px" }}
                >
                  <button
                    onClick={() => handleCellClick(cell)}
                    disabled={isShowingPattern || isSelected || isWrong}
                    className={`relative w-full h-full rounded-xl transition-transform duration-300 transform-style-3d cursor-pointer ${
                      isFlipped ? "rotate-x-180" : ""
                    }`}
                  >
                    {/* FRONT FACE: Hidden/Unflipped default state (handles active game clicks cleanly) */}
                    <div className={`absolute inset-0 w-full h-full backface-hidden rounded-xl border transition-all duration-150 ${frontFaceStyle}`} />

                    {/* BACK FACE: Revealed flash pattern target state */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden rounded-xl border rotate-x-180 flex items-center justify-center transition-all bg-gradient-to-br from-[#60a5fa] to-[#8b5cf6] border-[#c4b5fd] shadow-[0_0_25px_rgba(96,165,250,0.65)]"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="h-7 mt-4 text-center text-sm font-black tracking-wide">
            <span className={isShowingPattern ? "text-[#a78bfa] animate-pulse" : "text-[#60a5fa]"}>
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