// components/landing/games.ts
import { Brain, Target, Zap, Calculator, Grid, Type, Shuffle, Keyboard, Eye } from "lucide-react";

export const GAMES = [
  {
    id: "memory",
    title: "60S Memory",
    subtitle: "Brain Retention",
    desc: "Test your brain's short-term retention under extreme pressure.",
    icon: Brain,
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-rose-500/30",
    stats: "4.8",
    players: "12.4k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(244,63,94,0.15), transparent 70%)"
  },
  {
    id: "focus",
    title: "60S Focus",
    subtitle: "Laser Vision",
    desc: "Maintain laser vision. Ignore the chaotic visual distractions.",
    icon: Target,
    color: "from-violet-600 to-indigo-600",
    shadow: "shadow-indigo-500/30",
    stats: "4.9",
    players: "8.9k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(79,70,229,0.15), transparent 70%)"
  },
  {
    id: "reaction",
    title: "60S Reaction",
    subtitle: "Reflex Strike",
    desc: "Click, tap, strike. Every millisecond counts against the clock.",
    icon: Zap,
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-500/30",
    stats: "4.7",
    players: "24.1k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(245,158,11,0.15), transparent 70%)"
  },
  {
    id: "speed-math",
    title: "60S Speed Math",
    subtitle: "Mental Crunch",
    desc: "Crunch equations fast. Mental math on absolute overdrive.",
    icon: Calculator,
    color: "from-emerald-400 to-teal-600",
    shadow: "shadow-teal-500/30",
    stats: "4.6",
    players: "15.3k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(16,185,129,0.15), transparent 70%)"
  },
  {
    id: "pattern-match",
    title: "60S Pattern Match",
    subtitle: "Spatial Logic",
    desc: "Recognize spatial geometric shifts before they morph.",
    icon: Grid,
    color: "from-cyan-400 to-blue-600",
    shadow: "shadow-blue-500/30",
    stats: "4.9",
    players: "7.2k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(6,182,212,0.15), transparent 70%)"
  },
  {
    id: "word-challenge",
    title: "60S Word Rush",
    subtitle: "Lexicon Race",
    desc: "Unscramble and construct vocabulary chains in a flash.",
    icon: Type,
    color: "from-fuchsia-500 to-purple-600",
    shadow: "shadow-purple-500/30",
    stats: "4.5",
    players: "11.0k active",
    bgGraphic: "radial-gradient(circle at 50% 120%, rgba(217,70,239,0.15), transparent 70%)"
  },

];