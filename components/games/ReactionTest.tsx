"use client";

import React, { useState, useEffect, useRef } from "react";
import GameWrapper from "./ui/GameWrapper";
import GameStartScreen from "./ui/GameStartScreen";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";

type GameState = "START" | "COUNTDOWN" | "PLAYING" | "FINISHED";

export default function F1ReactionGame() {
  // Game state controllers
  const [gameState, setGameState] = useState<GameState>("START");
  const [countdown, setCountdown] = useState<number>(3);
  const [timer, setTimer] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // F1 Core Light Mechanics
  const [lightPhase, setLightPhase] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);

  // High performance game references
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lightsOutTimeRef = useRef<number>(0);
  const gameActiveRef = useRef<boolean>(false);

  // Web Audio API Context Reference
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load high score locally on mount
  useEffect(() => {
    const saved = localStorage.getItem("60s_f1_best");
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  // Initialize Audio Context on user intent / client-side action to bypass browser policies
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // --- SYNTHETIC AUDIO GENERATION ENGINE ---
  const playStagingBeep = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High-pitched crisp F1 light-up ring

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); // Short punchy burst

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playLightsOutBuzz = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Use two raw oscillators to synthesize a thick, rich green-light race horn
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(220, ctx.currentTime); // Sub-mid foundation

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(440, ctx.currentTime); // Crisp melodic double

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);
  };

  const playPenaltyBuzzer = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35); // Dramatic failing pitch drop

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };
  // -----------------------------------------

  // 60 Second Core Countdown Engine
  useEffect(() => {
    if (gameState === "PLAYING" && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState, timer]);

  // Handle pre-game countdown screen mechanics
  useEffect(() => {
    if (gameState === "COUNTDOWN") {
      playStagingBeep(); // Pre-countdown UI feedback sound ticks
      const cdInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(cdInterval);
            setGameState("PLAYING");
            gameActiveRef.current = true;
            triggerNewLightSequence();
            return 3;
          }
          playStagingBeep();
          return prev - 1;
        });
      }, 800);
      return () => clearInterval(cdInterval);
    }
  }, [gameState]);

  // Clean timeouts up on unmount to safeguard memory
  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  const startGame = () => {
    initAudio(); // Hook dynamic initialization directly into user interaction context
    setScore(0);
    setStreak(0);
    setTimer(60);
    setFeedback(null);
    setLastReactionTime(null);
    setGameState("COUNTDOWN");
    setCountdown(3);
  };

  const endGame = () => {
    setGameState("FINISHED");
    gameActiveRef.current = false;
    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    setLightPhase(0);

    setBestScore((prevBest) => {
      if (score > prevBest) {
        localStorage.setItem("60s_f1_best", score.toString());
        return score;
      }
      return prevBest;
    });
  };

  const triggerNewLightSequence = () => {
    if (!gameActiveRef.current) return;
    
    setLightPhase(0);
    let currentStep = 0;
    
    const lightUpNextNode = () => {
      if (!gameActiveRef.current) return;
      currentStep += 1;
      setLightPhase(currentStep);

      if (currentStep <= 5) {
        playStagingBeep(); // Sounds during sequential node lights up (Phases 1-5)
      }

      if (currentStep < 5) {
        sequenceTimeoutRef.current = setTimeout(lightUpNextNode, 450);
      } else {
        // Phase 6: All five pairs are burning hot red. Dead silent dynamic pause window.
        setLightPhase(6);
        const randomLightsOutDelay = Math.floor(Math.random() * 2000) + 1200; // between 1.2s and 3.2s
        sequenceTimeoutRef.current = setTimeout(() => {
          if (!gameActiveRef.current) return;
          
          playLightsOutBuzz(); // Aggressive Green Launch Tone!
          setLightPhase(7); 
          lightsOutTimeRef.current = performance.now();
        }, randomLightsOutDelay);
      }
    };

    sequenceTimeoutRef.current = setTimeout(lightUpNextNode, 400);
  };

  const handleTriggerInput = () => {
    if (gameState !== "PLAYING") return;

    // SCENARIO A: FALSE START / JUMP START
    if (lightPhase > 0 && lightPhase <= 6) {
      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
      
      playPenaltyBuzzer(); // Instant harsh synthesized penalty sound
      setIsScreenShaking(true);
      setStreak(0); 
      setFeedback({ text: "⚠️ JUMP START! PENALTY (-150 pts)", color: "text-red-500" });
      setScore((prev) => Math.max(0, prev - 150));
      
      setTimeout(() => setIsScreenShaking(false), 400);
      setTimeout(() => {
        setFeedback(null);
        triggerNewLightSequence();
      }, 900);
      return;
    }

    // SCENARIO B: IDLE STAGE
    if (lightPhase === 0) return;

    // SCENARIO C: VALID GREEN LAUNCH TIME COMPUTED (Lights Out Phase 7)
    if (lightPhase === 7) {
      const completionTime = performance.now();
      const reactionDeltaMs = Math.round(completionTime - lightsOutTimeRef.current);
      setLastReactionTime(reactionDeltaMs);

      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);

      let pointsEarned = 0;
      let roundFeedback = { text: "", color: "" };
      let newStreak = streak;

      if (reactionDeltaMs < 180) {
        newStreak += 1;
        pointsEarned = Math.round(800 * (1 + newStreak * 0.15));
        roundFeedback = { text: `⚡ PERFECT LAUNCH! +${pointsEarned}`, color: "text-emerald-400 font-extrabold text-xl animate-bounce" };
      } else if (reactionDeltaMs <= 320) {
        newStreak += 1;
        pointsEarned = Math.round(450 * (1 + newStreak * 0.05));
        roundFeedback = { text: `🔥 GOOD LAUNCH! +${pointsEarned}`, color: "text-cyan-400" };
      } else {
        newStreak = 0; 
        pointsEarned = Math.max(50, 200 - (reactionDeltaMs - 320));
        roundFeedback = { text: `🐌 SLOW REACTION! +${Math.round(pointsEarned)}`, color: "text-amber-500" };
      }

      setStreak(newStreak);
      setScore((prev) => prev + Math.round(pointsEarned));
      setFeedback(roundFeedback);
      
      setLightPhase(0);
      setTimeout(() => {
        setFeedback(null);
        triggerNewLightSequence();
      }, 1100);
    }
  };

  const metaMetrics = getRankAndPercentile();

  function getRankAndPercentile() {
    if (score >= 8000) return { rank: "F1 WORLD CHAMPION", percentile: 99, msg: "Sub-human nerve routing. Absolute masterclass precision performance!" };
    if (score >= 5000) return { rank: "PRO PODIUM DRIVER", percentile: 92, msg: "Outstanding reaction velocity. Your focus index is hyper-tuned." };
    if (score >= 2500) return { rank: "MIDFIELD CONSTRUCTOR", percentile: 71, msg: "Solid awareness base. Shave off milliseconds on your transitions to reach pro standard." };
    return { rank: "ROOKIE TEST DRIVER", percentile: 38, msg: "Keep working your eye muscle tracking. Consistency beats raw rush!" };
  }

  return (
    <GameWrapper gameTitle="Reflex">
      {gameState === "START" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Wait for the 5 F1 red lights to turn on sequentially.\n\nAS SOON AS THEY GO OUT... CLICK OR TAP immediately!\n\n⚠️ Jump starting before lights out drops points and your streak!`}
          onStart={startGame}
        />
      )}

      {gameState === "COUNTDOWN" && <GameCountdownScreen countdown={countdown} />}

      {gameState === "PLAYING" && (
        <div 
          onClick={handleTriggerInput}
          style={{
            backgroundImage: "radial-gradient(circle at 50% 120%, rgba(245,158,11,0.15), transparent 70%)"
          }}
          className={`cursor-pointer select-none rounded-[2rem] border transition-all duration-200 p-6 text-center bg-[#111421]/90 shadow-2xl relative min-h-[380px] flex flex-col justify-between items-center ${
            isScreenShaking ? "animate-bounce border-red-500 bg-red-950/20" : "border-[#8b9cff]/20 hover:border-amber-500/40"
          }`}
        >
          {/* Header Dashboard Grid */}
          <div className="w-full grid grid-cols-3 gap-2 items-center bg-[#090c17]/80 rounded-2xl border border-white/5 p-3 text-xs tracking-wider">
            <div className="text-left">
              <span className="block text-[#8f96aa] uppercase text-[10px]">Time Left</span>
              <span className={`text-lg font-black ${timer <= 10 ? "text-red-500 animate-pulse" : "text-amber-500"}`}>{timer}s</span>
            </div>
            <div className="text-center">
              <span className="block text-[#8f96aa] uppercase text-[10px]">Streak</span>
              <span className="text-lg font-black text-purple-400">x{streak}</span>
            </div>
            <div className="text-right">
              <span className="block text-[#8f96aa] uppercase text-[10px]">Score</span>
              <span className="text-lg font-black text-emerald-400">{score}</span>
            </div>
          </div>

          {/* Core F1 Gantry Light Deck Array Housing */}
          <div className="my-6 w-full max-w-[340px] bg-[#0d101d] border-4 border-[#1f253d] p-4 rounded-xl flex items-center justify-between gap-2 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
            {[1, 2, 3, 4, 5].map((index) => {
              const isRedActive = lightPhase >= index && lightPhase <= 6;
              return (
                <div key={index} className="flex flex-col gap-1 items-center bg-[#171c30] p-1.5 rounded-md border border-white/5 flex-1">
                  <div 
                    className={`w-6 h-6 rounded-full transition-all duration-70 ${
                      isRedActive 
                        ? "bg-red-600 shadow-[0_0_18px_#ef4444,inset_0_2px_4px_rgba(255,255,255,0.4)] border border-red-400" 
                        : "bg-[#252c4a] border border-black/40"
                    }`} 
                  />
                  <div 
                    className={`w-6 h-6 rounded-full transition-all duration-70 ${
                      isRedActive 
                        ? "bg-red-600 shadow-[0_0_18px_#ef4444,inset_0_2px_4px_rgba(255,255,255,0.4)] border border-red-400" 
                        : "bg-[#252c4a] border border-black/40"
                    }`} 
                  />
                </div>
              );
            })}
          </div>

          {/* Central Sandbox Target Reaction Display Indicator Pad */}
          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[140px]">
            {lightPhase === 0 && !feedback && (
              <p className="text-sm font-medium text-[#7a829a] animate-pulse">Staging engine... preparing next race light sequence</p>
            )}

            {lightPhase > 0 && lightPhase <= 6 && !feedback && (
              <p className="text-sm font-bold text-red-400 uppercase tracking-widest animate-pulse">STAY STILL... WAIT FOR LIGHTS OUT</p>
            )}

            {lightPhase === 7 && !feedback && (
              <div className="animate-ping bg-emerald-500/20 border-2 border-emerald-400 w-full rounded-xl py-6 flex flex-col justify-center items-center">
                <span className="text-3xl font-black text-emerald-400 tracking-widest">TAP NOW!!!</span>
              </div>
            )}

            {feedback && (
              <div className="flex flex-col items-center gap-1">
                <span className={`text-base font-bold ${feedback.color}`}>{feedback.text}</span>
                {lastReactionTime !== null && lightPhase === 0 && (
                  <span className="text-xs text-[#a3aed0] font-mono mt-1">Reaction Speed: <strong className="text-white text-sm">{lastReactionTime}ms</strong></span>
                )}
              </div>
            )}
          </div>

          <div className="text-[11px] font-semibold text-[#5a627a] uppercase tracking-wider bg-black/20 w-full py-1.5 rounded-lg border border-white/[0.02]">
              Tap Anywhere Inside Box to Fire Launch System 
          </div>
        </div>
      )}

      {gameState === "FINISHED" && (
        <GameEndScreen
          finalScore={score}
          bestScore={bestScore}
          rank={metaMetrics.rank}
          percentile={metaMetrics.percentile}
          feedbackMessage={metaMetrics.msg}
          onRestart={startGame}
          onShare={() => {
            navigator.clipboard.writeText(`I scored ${score} pts on F1 Reflexes in the 60S Universe! Can you beat my launch time? 🏎️⚡`);
            alert("Score copied to clipboard!");
          }}
        />
      )}
    </GameWrapper>
  );
}