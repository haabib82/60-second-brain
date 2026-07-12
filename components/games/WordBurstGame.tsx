"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";
import GameCountdownScreen from "./ui/GameCountdownScreen";
import GameEndScreen from "./ui/GameEndScreen";
import GameStartScreen from "./ui/GameStartScreen";
import GameWrapper from "./ui/GameWrapper";

interface WordPuzzleState {
  fragmentedText: string;
  correctAnswer: string;
  choices: string[];
}

// 100% Real, educational, high-value vocabulary targets
const REAL_VOCAB_MASTER = {
  easy: [
    "ADAPT", "BLAND", "CRISP", "CRAFT", "FORCE", "FLASH", "FOCUS", "SMART",
    "AMPLY", "BRISK", "DRAIN", "FLAIR", "GLIDE", "LOGIC", "MATCH", "MIND", 
    "SHIFT", "SOLID", "STARK", "SWIFT", "THINK", "TRACE", "VIVID", "SHARP"
  ],
  medium: [
    "SPORADIC", "ADVOCATE", "MUTATION", "ABSENTEE", "ACADEMIC", "CAPACITY", "CRITERIA", "DECORUM",
    "EMPHASIS", "FRACTION", "HORIZON", "ILLUSION", "JOURNAL", "MAXIMUM", "NOSTALGIA", "OPTIMUM",
    "SPECTRUM", "STRATEGY", "SYMPATHY", "VELOCITY", "NEURON", "SYNAPSE", "DYNAMIC", "REACTION",
    "CHALLENGE", "PATTERN", "MEMORY", "COGNITIVE", "RESONANCE", "AMPLIFY", "ABSTRACT", "PRODIGY"
  ],
  hard: [
    "METICULOUS", "BENEVOLENT", "CAPRICIOUS", "EPHEMERAL", "EQUIVOCAL", "LOQUACIOUS", "MAGNANIMOUS",
    "OBFUSCATE", "PERFIDIOUS", "PRAGMATIC", "REPROACH", "SCRUPULOUS", "TRANSIENT", "ALGORITHM",
    "ASYMMETRIC", "EFFICIENT", "NEUROPLASTIC", "SYNCHRONOUS", "ANACHRONISM", "CACOPHONY", "DEBILITATE",
    "ECLECTIC", "ESOTERIC", "GARRULOUS", "ICONOCLAST", "MALLEABLE", "PARADIGM", "RECALCITRANT", "SYCOPHANT"
  ]
};

export default function WordBurstGame() {
  const GAME_TIME = 60;

  const [screen, setScreen] = useState("start");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bestScore, setBestScore] = useState(0);

  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzleState | null>(null);
  const [streak, setStreak] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [shake, setShake] = useState(false);
  const [answeredWrong, setAnsweredWrong] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const progress = (timeLeft / GAME_TIME) * 100;

  useEffect(() => {
    const saved = Number(localStorage.getItem("bestScore60SecondWord") || 0);
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
        type === "correct" ? 880 : 
        type === "wrong" ? 140 : 
        type === "start" ? 640 : 420;

      gain.gain.value = type === "tick" ? 0.012 : 0.045;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }

  function startCountdown() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const savedBest = Number(localStorage.getItem("bestScore60SecondWord") || 0);

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
          generateNewPuzzle(0);
          return 0;
        }
        playSound("start");
        return prev - 1;
      });
    }, 800);
  }

  // --- DYNAMIC CLONE CONTEXT MUTATOR ---
  function generateNewPuzzle(currentScore: number) {
    setAnsweredWrong(null);

    // Pick a completely real word based on current performance
    let pool = REAL_VOCAB_MASTER.easy;
    if (currentScore > 32) {
      pool = REAL_VOCAB_MASTER.hard;
    } else if (currentScore > 12) {
      pool = REAL_VOCAB_MASTER.medium;
    }

    const correctAnswer = pool[Math.floor(Math.random() * pool.length)];

    // Fragment ~45% of the characters for high visual strain
    let fragmentedText = "";
    const blankIndices = new Set<number>();
    const blanksCount = Math.max(1, Math.floor(correctAnswer.length * 0.45));
    while (blankIndices.size < blanksCount) {
      blankIndices.add(Math.floor(Math.random() * correctAnswer.length));
    }

    for (let i = 0; i < correctAnswer.length; i++) {
      fragmentedText += blankIndices.has(i) ? "_ " : `${correctAnswer[i]} `;
    }
    fragmentedText = fragmentedText.trim();

    // Generate synthetic duplicate clones to force precise reading mechanics
    const wrongOptions: string[] = [];
    const vowels = "AEIOU";
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";

    let attempts = 0;
    while (wrongOptions.length < 3 && attempts < 300) {
      attempts++;
      let mutation = correctAnswer.split("");
      
      // Determine mutation depth based on total word length
      const lettersToMutate = correctAnswer.length > 7 ? 2 : 1;
      const mutatedPositions = new Set<number>();

      while (mutatedPositions.size < lettersToMutate) {
        // Keeps outer framing intact so word sizes match perfectly
        const targetIdx = Math.floor(Math.random() * (mutation.length - 2)) + 1;
        mutatedPositions.add(targetIdx);
      }

      mutatedPositions.forEach((pos) => {
        const originalChar = mutation[pos];
        if (vowels.includes(originalChar)) {
          const alternativeVowels = vowels.replace(originalChar, "");
          mutation[pos] = alternativeVowels[Math.floor(Math.random() * alternativeVowels.length)];
        } else {
          const alternativeConsonants = consonants.replace(originalChar, "");
          mutation[pos] = alternativeConsonants[Math.floor(Math.random() * alternativeConsonants.length)];
        }
      });

      const generatedFake = mutation.join("");
      
      if (generatedFake !== correctAnswer && !wrongOptions.includes(generatedFake)) {
        wrongOptions.push(generatedFake);
      }
    }

    // Safety fallback
    while (wrongOptions.length < 3) {
      wrongOptions.push(correctAnswer + "X");
    }

    const choices = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);
    setCurrentPuzzle({ fragmentedText, correctAnswer, choices });
  }

  function handleChoiceTap(selected: string) {
    if (!currentPuzzle || screen !== "playing" || answeredWrong) return;

    if (selected === currentPuzzle.correctAnswer) {
      playSound("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);

      const streakBonus = Math.floor(nextStreak / 3);
      const pointsEarned = 3 + streakBonus;

      const newScore = score + pointsEarned;
      setScore(newScore);
      setFeedbackText(`Correct! +${pointsEarned}⚡`);

      generateNewPuzzle(newScore);
    } else {
      setAnsweredWrong(selected);
      setShake(true);
      setStreak(0);
      setFeedbackText(`Wrong! Target word was: ${currentPuzzle.correctAnswer}`);
      playSound("wrong");

      setTimeout(() => setShake(false), 200);
      setTimeout(() => {
        generateNewPuzzle(score);
      }, 1500);
    }
  }

  function endGame() {
    if (timerRef.current) clearInterval(timerRef.current);

    setScore((currentScore) => {
      const savedBest = Number(localStorage.getItem("bestScore60SecondWord") || 0);
      setFinalScore(currentScore);
      setPreviousBest(savedBest);

      if (currentScore > savedBest) {
        localStorage.setItem("bestScore60SecondWord", String(currentScore));
        setBestScore(currentScore);
      } else {
        setBestScore(savedBest);
      }
      return currentScore;
    });
    setScreen("end");
  }

  function getRank() {
    if (finalScore < 20) return "Syllable Sprout";
    if (finalScore < 50) return "Lexical Synthesizer";
    if (finalScore < 85) return "Semantic Core";
    return "Dictionary Overlord";
  }

  function getMessage() {
    if (finalScore > previousBest && previousBest > 0) {
      return `Linguistic performance spiked! Reached speed barrier +${finalScore - previousBest} points higher.`;
    }
    return "Stable semantic alignment and vocabulary pattern-matching.";
  }

  function getPercentile() {
    if (finalScore < 20) return 41;
    if (finalScore < 50) return 72;
    if (finalScore < 85) return 91;
    return 99;
  }

  function shareScore() {
    const text = `I unlocked ${finalScore} points on 60 Second Word Burst! 🧠📝\n\nCan your brain piece together missing dynamic fragments under pressure?\n\nhttps://60secondbrain.com`;
    if (navigator.share) {
      navigator.share({ title: "60 Second Brain", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share payload ready to paste!");
    }
  }

  return (
    <GameWrapper gameTitle="Vocab.">
      {screen === "start" && (
        <GameStartScreen
          bestScore={bestScore}
          description={`Identify the complete hidden word matching the incomplete layout.\nPoints scale upwards automatically with consecutive solution streaks.\nWrong inputs do not stop the clock—stay fluid, recover fast.`}
          onStart={startCountdown}
        />
      )}

      {screen === "countdown" && <GameCountdownScreen countdown={countdown} />}

      {screen === "playing" && currentPuzzle && (
        <div
          className={`rounded-[2rem] border border-[#a78bfa]/25 bg-[#111421]/80 shadow-[0_0_70px_rgba(167,139,250,0.16)] backdrop-blur-xl p-6 transition ${
            shake ? "animate-shake" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] text-transparent bg-clip-text">
                {score}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Streak</p>
              <p className="text-xl font-black text-[#60a5fa]">
                🔥 {streak}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[#8f96aa]">Time</p>
              <p className={`text-4xl font-black ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-[#a78bfa]"}`}>
                {timeLeft}
              </p>
            </div>
          </div>

          <div className="h-3 bg-[#090c17]/80 border border-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] transition-all duration-500 shadow-[0_0_22px_rgba(167,139,250,0.75)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Missing Character Layout Display */}
          <div className="rounded-2xl border border-white/5 bg-[#090c17]/60 py-10 mb-6 text-center shadow-inner">
            <h3 className="text-4xl font-black tracking-widest text-white select-none font-mono">
              {currentPuzzle.fragmentedText}
            </h3>
          </div>

          {/* 2x2 Word Node Grid Setup */}
          <div className="grid grid-cols-2 gap-4">
            {currentPuzzle.choices.map((choice, idx) => {
              const isCorrectChoice = choice === currentPuzzle.correctAnswer;
              const isUserMistake = answeredWrong === choice;

              let choiceStyle = "border-white/10 bg-[#090c17]/75 hover:bg-[#151b2d] text-white";
              if (answeredWrong) {
                if (isCorrectChoice) {
                  choiceStyle = "border-green-500/50 bg-green-950/40 text-green-300 scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                } else if (isUserMistake) {
                  choiceStyle = "border-red-500/50 bg-red-950/50 text-red-300 scale-95";
                } else {
                  choiceStyle = "border-white/5 bg-[#090c17]/30 text-white/20 scale-95";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceTap(choice)}
                  disabled={!!answeredWrong}
                  className={`py-4 text-sm sm:text-base md:text-lg font-extrabold tracking-wide rounded-xl border transition-all duration-150 select-none active:scale-95 uppercase ${choiceStyle}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className="h-6 mt-5 text-center text-sm font-black tracking-wide">
            <span className={answeredWrong ? "text-red-400" : "text-[#a78bfa]"}>
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