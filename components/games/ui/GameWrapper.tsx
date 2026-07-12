"use client";

import React from "react";

interface GameWrapperProps {
  children: React.ReactNode;
  gameTitle: string;
}

export default function GameWrapper({ children, gameTitle }: GameWrapperProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050712] text-white flex items-center justify-center px-4 py-5 relative w-full">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-130px] left-[-120px] w-80 h-80 bg-[#6d4cff]/20 blur-[110px] rounded-full" />
      <div className="absolute bottom-[-130px] right-[-120px] w-96 h-96 bg-[#3b82f6]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 bg-[#8b5cf6]/20 blur-[100px] rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Header Block */}
        <div className="text-center mb-5">
          <p className="text-xs tracking-[0.42em] uppercase font-black bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
            60 Second Brain
          </p>

          <h1 className="text-4xl sm:text-5xl font-black mt-3 leading-tight tracking-tight">
            Train Your{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] text-transparent bg-clip-text">
              {gameTitle}
            </span>
          </h1>
        </div>

        {/* Dynamic Screen Injector */}
        {children}
      </div>
    </main>
  );
}