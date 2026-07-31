"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<
    { top: string; left: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    const styles = Array.from({ length: number }, () => ({
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${(Math.random() * 0.6 + 0.2).toFixed(2)}s`,
      duration: `${(Math.random() * 8 + 4).toFixed(2)}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className="absolute h-px w-[100px] rotate-[215deg] animate-meteor rounded-full bg-gradient-to-r from-[#5865F2] to-transparent shadow-[0_0_0_1px_#5865F220]"
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        >
          <div className="absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-[#5865F230] to-transparent" />
        </span>
      ))}
    </div>
  );
}
