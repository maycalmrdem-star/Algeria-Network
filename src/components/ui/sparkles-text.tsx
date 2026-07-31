"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const generateSparkle = (colors: { first: string; second: string }) => ({
  id: Math.random(),
  x: `${random(10, 90)}%`,
  y: `${random(10, 90)}%`,
  color: Math.random() > 0.5 ? colors.first : colors.second,
  scale: Math.random() * 0.4 + 0.3,
  lifespan: random(800, 1400),
});

export function SparklesText({
  text,
  className,
  sparklesCount = 6,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = React.useState(() =>
    Array.from({ length: sparklesCount }, () => generateSparkle(colors))
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => (Date.now() - s.lifespan > 0 ? generateSparkle(colors) : s))
      );
    }, 400);
    return () => clearInterval(interval);
  }, [sparklesCount, colors]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute z-20"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, sparkle.scale, 0], opacity: [0, 1, 0] }}
          transition={{ duration: sparkle.lifespan / 1000, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 160 160" fill="none">
            <path
              d="M80 0 C80 0, 90 70, 160 80 C90 90, 80 160, 80 160 C80 160, 70 90, 0 80 C70 70, 80 0, 80 0 Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.span>
      ))}
      <span className="relative z-10 bg-gradient-to-r from-[#5865F2] via-[#9E7AFF] to-[#FE8BBB] bg-clip-text text-transparent">
        {text}
      </span>
    </span>
  );
}
