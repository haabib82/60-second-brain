"use client";

import { useEffect, useRef, useState } from "react";
import GameWrapper from "./ui/GameWrapper";
import GameStartScreen from "./ui/GameStartScreen";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";

interface EquationState {
  a: number;
  b: number;
  result: number;
  questionText: string;
  correctAnswer: string;
  choices: string[];
}

export default function SpeedMathGame() {
  const GAME_TIME = 60;

  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bestScore, setBestScore] = useState(0);

  // Speed Math specific states
  const [currentEquation, setCurrentEquation] = useState<EquationState | null>(null);
  const [streak, setStreak] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [shake, setShake] = useState(false);
  const [answeredWrong, setAnsweredWrong] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const progress = (timeLeft / GAME_TIME) * 100;

  // Load High Score
  useEffect(() => {
    const saved = Number(localStorage.getItem("bestScore60SecondMath") || 0);
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
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
        type === "correct" ? 830 : 
        type === "wrong" ? 150 : 
        type === "start" ? 600 : 450;

      gain.gain.value = type === "tick" ? 0.012 : 0.045;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }

  function startCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const savedBest = Number(localStorage.getItem("bestScore60SecondMath") || 0);

    setPreviousBest(savedBest);
    setBestScore(savedBest);
    setScore(0);
    setFinalScore(0);
    setTimeLeft(GAME_TIME);
    setStreak(0);
    setFeedbackText("");
    setAnsweredWrong(null);
    setCountdown(3);
    setScreen("countdown");

    playSound("start");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setScreen("playing");
          generateNewEquation(0); 
          return 0;
        }
        playSound("start");
        return prev - 1;
      });
    }, 800);
  }

  function generateNewEquation(currentStreak: number) {
    setAnsweredWrong(null);

    let a = 0;
    let b = 0;
    let result = 0;
    let correctAnswer = "+";

    const forceTrickyQuestion = currentStreak > 0 && currentStreak % 3 === 0;

    if (forceTrickyQuestion) {
      const trickType = Math.floor(Math.random() * 4);
      const randomNum = Math.floor(Math.random() * 40) + 6;

      switch (trickType) {
        case 0: // The Zero Multiplier Trap
          a = randomNum;
          b = 0;
          result = 0;
          correctAnswer = "×";
          break;
        case 1: // The Zero Identity Swap (Handles + or - dynamically)
          a = randomNum;
          b = 0;
          result = randomNum;
          correctAnswer = "+"; // Will check math validation instead of exact string matching later
          break;
        case 2: // Twin Match Reductions
          a = randomNum;
          b = randomNum;
          if (Math.random() < 0.5) {
            result = 0;
            correctAnswer = "-";
          } else {
            result = 1;
            correctAnswer = "÷";
          }
          break;
        case 3: // The Cruel Neutral One Trap
          a = randomNum;
          b = 1;
          result = randomNum;
          correctAnswer = "×"; 
          break;
      }
    } else {
      const availableOps = ["+", "-", "×", "÷"];
      correctAnswer = availableOps[Math.floor(Math.random() * availableOps.length)];

      let maxRange = 12;
      let multMaxRange = 6;

      if (currentStreak >= 15) {
        maxRange = 75;
        multMaxRange = 16;
      } else if (currentStreak >= 10) {
        maxRange = 45;
        multMaxRange = 12;
      } else if (currentStreak >= 5) {
        maxRange = 25;
        multMaxRange = 9;
      }

      switch (correctAnswer) {
        case "+":
          a = Math.floor(Math.random() * (maxRange - 3)) + 3;
          b = Math.floor(Math.random() * (maxRange - 3)) + 3;
          result = a + b;
          break;
        case "-":
          a = Math.floor(Math.random() * maxRange) + maxRange + 3;
          b = Math.floor(Math.random() * (a - 3)) + 2;
          result = a - b;
          break;
        case "×":
          a = Math.floor(Math.random() * (multMaxRange - 2)) + 3;
          b = Math.floor(Math.random() * 7) + 3;
          result = a * b;
          break;
        case "÷":
          b = Math.floor(Math.random() * 7) + 3;
          result = Math.floor(Math.random() * (multMaxRange - 2)) + 3;
          a = b * result;
          break;
      }
    }

    const questionText = `${a}  ?  ${b} = ${result}`;
    const choices = ["+", "-", "×", "÷"];

    // Explicitly keeping raw numbers in state to evaluate alternative correct answers
    setCurrentEquation({ a, b, result, questionText, correctAnswer, choices });
  }

  function handleChoiceTap(selected: string) {
    if (!currentEquation || screen !== "playing" || answeredWrong) return;

    const { a, b, result } = currentEquation;
    let isCorrect = false;

    // Run actual functional math validation instead of basic string comparing
    if (selected === "+") isCorrect = (a + b === result);
    if (selected === "-") isCorrect = (a - b === result);
    if (selected === "×") isCorrect = (a * b === result);
    if (selected === "÷") isCorrect = (b !== 0 && a / b === result);

    if (isCorrect) {
      playSound("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      const streakBonus = Math.floor(nextStreak / 4);
      const pointsEarned = 2 + streakBonus;
      
      const newScore = score + pointsEarned;
      setScore(newScore);
      setFeedbackText(`Correct! +${pointsEarned}⚡`);

      generateNewEquation(nextStreak);
    } else {
      setAnsweredWrong(selected);
      setShake(true);
      setStreak(0);
      
      // Look up what label to display dynamically if multiple signs work
      let correctDisplay = currentEquation.correctAnswer;
      if (b === 0 && result === a) correctDisplay = "+ or -";
      if (b === 1 && result === a && selected !== "×" && selected !== "÷") correctDisplay = "× or ÷";

      setFeedbackText(`Wrong! Missing sign was ${correctDisplay}`);
      playSound("wrong");

      setTimeout(() => setShake(false), 200);

      setTimeout(() => {
        generateNewEquation(0);
      }, 900);
    }
  }

  function endGame() {
    if (timerRef.current) clearInterval(timerRef.current);

    setScore((currentScore) => {
      const savedBest = Number(localStorage.getItem("bestScore60SecondMath") || 0);
      setFinalScore(currentScore);
      setPreviousBest(savedBest);

      if (currentScore > savedBest) {
        localStorage.setItem("bestScore60SecondMath", String(currentScore));
        setBestScore(currentScore);
      } else {
        setBestScore(savedBest);
      }
      return currentScore;
    });
    setScreen("end");
  }

  function getRank() {
    if (finalScore < 20) return "Sign Novice";
    if (finalScore < 45) return "Symbol Snicker";
    if (finalScore < 75) return "Operator Expert";
    return "Logic Overlord";
  }

  // UI rendering updates check the actual verified dynamic condition
  function checkChoiceHighlight(choice: string) {
    if (!currentEquation || !answeredWrong) return "border-white/10 bg-[#090c17]/75 hover:bg-[#151b2d] text-white";

    const { a, b, result } = currentEquation;
    let choiceIsMathCorrect = false;
    if (choice === "+") choiceIsMathCorrect = (a + b === result);
    if (choice === "-") choiceIsMathCorrect = (a - b === result);
    if (choice === "×") choiceIsMathCorrect = (a * b === result);
    if (choice === "÷") choiceIsMathCorrect = (b !== 0 && a / b === result);

    if (choiceIsMathCorrect) {
      return "border-green-500/50 bg-green-950/40 text-green-300 scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
    } else if (answeredWrong === choice) {
      return "border-red-500/50 bg-red-950/50 text-red-300 scale-95";
    } else {
      return "border-white/5 bg-[#090c17]/30 text-white/20 scale-95";
    }
  }

  function getMessage() {
    if (finalScore > previousBest && previousBest > 0) {
      return `New speed record established! Upgraded matrix by +${finalScore - previousBest} units.`;
    }
    return "Operator processing engines fully operational.";
  }

  function getPercentile() {
    if (finalScore < 20) return 38;
    if (finalScore < 45) return 66;
    if (finalScore < 75) return 88;
    return 98;
  }

  function shareScore() {
    const text = `I decoded a score of ${finalScore} on Quick Operator Math! 🧠⚡\n\nCan you swap symbols faster than me?\n\nhttps://60secondbrain.com`;
    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share layout linked successfully!");
    }
  }

  return (
    <GameWrapper gameTitle="Maths">
      {screen === "start" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Identify the missing sign (+, -, ×, ÷) that satisfies the equation.\nSpeed and streaks increase points.\nMistakes reset streaks but won't stop the clock.`}
          onStart={startCountdown}
        />
      )}

      {screen === "countdown" && <GameCountdownScreen countdown={countdown} />}

      {screen === "playing" && currentEquation && (
        <div
          className={`rounded-[2rem] border border-[#8b9cff]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(96,165,250,0.16)] backdrop-blur-xl p-6 transition ${
            shake ? "animate-shake" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
                {score}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Streak</p>
              <p className="text-xl font-black text-[#a78bfa]">
                🔥 {streak}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Time</p>
              <p className={`text-4xl font-black ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-[#60a5fa]"}`}>
                {timeLeft}
              </p>
            </div>
          </div>

          <div className="h-3 bg-[#090c17]/80 border border-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] transition-all duration-500 shadow-[0_0_22px_rgba(96,165,250,0.75)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Equation Layout Display area */}
          <div className="rounded-2xl border border-white/5 bg-[#090c17]/60 py-10 mb-6 text-center shadow-inner">
            <h3 className="text-5xl font-black tracking-tight text-white select-none">
              {currentEquation.questionText}
            </h3>
          </div>

          {/* 2x2 Operator Grid Configuration */}
          <div className="grid grid-cols-2 gap-4">
            {currentEquation.choices.map((choice, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceTap(choice)}
                  disabled={!!answeredWrong}
                  className={`py-6 text-4xl font-black rounded-xl border transition-all duration-150 select-none active:scale-95 ${checkChoiceHighlight(choice)}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className="h-6 mt-5 text-center text-sm font-black tracking-wide">
            <span className={answeredWrong ? "text-red-400" : "text-[#60a5fa]"}>
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