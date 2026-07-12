import React from "react";
import { notFound } from "next/navigation";
import FocusGame from "@/components/games/FocusGame";
import MemoryGame from "@/components/games/MemoryGame";
import PatternMatch from "@/components/games/PatternMatch";
import ReactionTest from "@/components/games/ReactionTest";
import SpeedMathGame from "@/components/games/SpeedMathGame";
import WordBurstGame from "@/components/games/WordBurstGame";

interface GamePageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export default async function GameRouterPage({ params }: GamePageProps) {
  // Await the dynamic URL parameter promise safely
  const resolvedParams = await params;
  const { gameId } = resolvedParams;

  // Render the corresponding component matching your landing page configs
  switch (gameId) {
    case "focus":
      return <FocusGame />;
      
    // As you create more games, simply drop their cases here:
    case "memory":
      return <MemoryGame />;

    case "pattern-match":
      return <PatternMatch />;

    case "reaction":
      return <ReactionTest />;

    case "speed-math":
      return <SpeedMathGame />;

    case "word-challenge":
      return <WordBurstGame />;



    default:
      // If a route doesn't match a built case, trigger Next's 404 handler
      notFound();
  }
}