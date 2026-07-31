"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverImageCardProps {
  images: string[];       // exactly 3 image paths
  label?: string;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

/**
 * On hover → a floating card with 3 stacked/fanned images rises above the element.
 * The card follows the cursor horizontally so it never clips the viewport.
 */
export function HoverImageCard({
  images,
  label,
  children,
  className,
  accentColor = "#5865F2",
}: HoverImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // Offset within element, normalised -1 to 1
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    setMouseX(relX * 20); // tilt / shift range ±20px
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 280, damping: 22 },
    },
    exit: {
      opacity: 0,
      y: 8,
      scale: 0.94,
      transition: { duration: 0.18 },
    },
  };

  // Fan angles for 3 images
  const rotations = [-10, 0, 10];
  const offsets   = [-24, 0, 24]; // horizontal spread

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Floating popup card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-[calc(100%+16px)] left-1/2 z-50 pointer-events-none"
            style={{ translateX: `calc(-50% + ${mouseX}px)` }}
          >
            {/* Card shell */}
            <div
              className="relative w-72 rounded-2xl border border-white/15 bg-[#0d0e18]/95 backdrop-blur-2xl p-4 shadow-[0_32px_64px_rgba(0,0,0,0.7)]"
              style={{ boxShadow: `0 0 0 1px ${accentColor}20, 0 32px 64px rgba(0,0,0,0.7), 0 0 40px ${accentColor}15` }}
            >
              {/* Label */}
              {label && (
                <p
                  className="text-xs font-bold tracking-[0.12em] uppercase mb-3 text-center"
                  style={{ color: accentColor }}
                >
                  {label}
                </p>
              )}

              {/* 3 fanned images */}
              <div className="relative h-36 flex items-end justify-center mb-3">
                {images.map((src, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-40 h-28 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                    initial={{ rotate: 0, x: 0, opacity: 0, scale: 0.85 }}
                    animate={{
                      rotate: rotations[i],
                      x: offsets[i],
                      opacity: 1,
                      scale: i === 1 ? 1.08 : 0.92,
                      zIndex: i === 1 ? 10 : i === 0 ? 5 : 3,
                    }}
                    transition={{
                      delay: i * 0.06,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {/* Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom accent line */}
              <div
                className="h-0.5 w-full rounded-full mt-1"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}
              />
            </div>

            {/* Arrow */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 rounded-sm border-r border-b border-white/10"
              style={{ background: "#0d0e18" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
