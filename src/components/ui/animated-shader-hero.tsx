"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Users, Gamepad2, Mic, Code, Trophy, MessageSquare, Star, Zap } from "lucide-react";
import { SparklesText } from "./sparkles-text";
import { AnimatedShinyText } from "./animated-shiny-text";
import { Meteors } from "./meteors";
import { BorderBeam } from "./border-beam";

const floatingIcons = [
  { Icon: MessageSquare, color: "#FFFFFF", size: 36, x: "10%", y: "20%", delay: 0 },
  { Icon: Gamepad2, color: "#CCCCCC", size: 28, x: "85%", y: "15%", delay: 0.4 },
  { Icon: Mic, color: "#999999", size: 24, x: "78%", y: "65%", delay: 0.8 },
  { Icon: Trophy, color: "#666666", size: 32, x: "12%", y: "72%", delay: 1.2 },
  { Icon: Code, color: "#AAAAAA", size: 26, x: "50%", y: "88%", delay: 0.6 },
  { Icon: Star, color: "#888888", size: 20, x: "92%", y: "42%", delay: 1.0 },
  { Icon: Zap, color: "#FFFFFF", size: 22, x: "4%", y: "46%", delay: 1.4 },
  { Icon: Users, color: "#DDDDDD", size: 30, x: "60%", y: "6%", delay: 0.2 },
];

interface HeroProps {
  headline: { line1: string; line2: string };
  subtitle: string;
  buttons?: {
    primary?: { label: string; onClick?: () => void };
    secondary?: { label: string; onClick?: () => void };
  };
}

// 3D Mouse-track orb
function MagneticOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [15, -15]);
  const rotateY = useTransform(springX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-72 h-72 md:w-96 md:h-96 mx-auto"
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-4 rounded-full border border-white/10 animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />

      {/* Core sphere */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.1),inset_0_0_40px_rgba(255,255,255,0.05)]">
        {/* Inner highlight */}
        <div className="absolute top-4 left-6 w-12 h-8 rounded-full bg-white/15 blur-md" />
        {/* Discord logo center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <img src="/server-icon.gif" alt="Algeria Network" className="w-16 h-16 mx-auto mb-2 rounded-2xl object-cover shadow-[0_8px_32px_rgba(255,255,255,0.1)]" />
            <p className="text-white/60 text-xs font-medium tracking-widest uppercase">Algeria Network</p>
          </div>
        </div>
      </div>

      {/* Orbit ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin-slow" />
      {/* Orbital dot */}
      <div className="absolute inset-0" style={{ transform: "rotate(0deg)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-orbit" />
      </div>
    </motion.div>
  );
}

const AnimatedShaderHero: React.FC<HeroProps> = ({ headline, subtitle, buttons }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050507]">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Radial ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-white/2 rounded-full blur-[80px] pointer-events-none" />

      {/* Meteors */}
      <Meteors number={15} />

      {/* Floating icons — 3D positioned */}
      {floatingIcons.map(({ Icon, color, size, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 0.6, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: delay + 0.5, duration: 0.6 },
            scale: { delay: delay + 0.5, duration: 0.6, type: "spring" },
            y: { delay: delay + 1, duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div
            className="relative p-3 rounded-2xl backdrop-blur-xl border border-white/10"
            style={{ background: `${color}15`, boxShadow: `0 8px 32px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)` }}
          >
            <Icon style={{ color, width: size, height: size }} />
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            <AnimatedShinyText className="text-sm font-medium text-white/80">
              ✦ أفضل مجتمع ديسكورد جزائري
            </AnimatedShinyText>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            <span className="block text-white mb-2">{headline.line1}</span>
            <SparklesText text={headline.line2} className="text-5xl md:text-6xl lg:text-7xl font-black" />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl font-light tracking-wide"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            {buttons?.primary && (
              <motion.button
                onClick={buttons.primary.onClick}
                className="relative group px-8 py-4 rounded-xl bg-white text-black font-semibold text-base tracking-wide overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_8px_32px_rgba(255,255,255,0.2)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.8),0_8px_40px_rgba(255,255,255,0.4)] transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">{buttons.primary.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BorderBeam size={120} duration={6} borderWidth={1} colorFrom="#fff" colorTo="#999" />
              </motion.button>
            )}
            {buttons?.secondary && (
              <motion.button
                onClick={buttons.secondary.onClick}
                className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white/70 font-semibold text-base tracking-wide backdrop-blur-sm hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {buttons.secondary.label}
              </motion.button>
            )}
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center gap-4 justify-center lg:justify-start"
          >
            <div className="flex -space-x-2">
              {["#FFFFFF", "#DDDDDD", "#BBBBBB", "#999999", "#777777"].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050507]" style={{ background: `${c}` }} />
              ))}
            </div>
            <p className="text-white/40 text-sm"><span className="text-white/70 font-semibold">+5,000</span> عضو انضموا</p>
          </motion.div>
        </div>

        {/* Right: 3D Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
          className="hidden lg:flex items-center justify-center"
        >
          <MagneticOrb />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
    </section>
  );
};

export default AnimatedShaderHero;
