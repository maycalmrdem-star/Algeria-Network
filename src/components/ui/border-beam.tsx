"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#5865F2",
  colorTo = "#7983F5",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        className
      )}
      style={
        {
          "--size": size,
          "--duration": duration,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
          backgroundImage: `linear-gradient(transparent, transparent), conic-gradient(from calc(270deg - (360deg * var(--delay) / var(--duration) * 1s)) at 50% 50%, ${colorFrom} 0deg, ${colorTo} 60deg, transparent 120deg)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          animation: `border-beam calc(var(--duration)*1s) calc(var(--delay)*1s) linear infinite`,
        } as React.CSSProperties
      }
    />
  );
}
