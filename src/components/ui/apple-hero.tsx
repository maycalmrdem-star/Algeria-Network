import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DiscordStats } from "../DiscordStats";

interface AppleHeroProps {
  headline: { line1: string; line2: string };
  subtitle: string;
  buttons: {
    primary: { label: string; onClick: () => void };
    secondary: { label: string; onClick: () => void };
  };
}

export default function AppleHero({ headline, subtitle, buttons }: AppleHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden t-bg-primary pt-20">
      {/* Subtle background ambient light */}
      <div className="absolute inset-0 ambient-mono pointer-events-none" />
      
      {/* Very faint background grid for texture */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/5 border border-white/10 text-[#86868b]">
            <span className="w-2 h-2 rounded-full t-bg-primary opacity-60"></span>
            مجتمع حصري
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6"
          style={{ 
            lineHeight: 1.05,
            letterSpacing: "-0.03em"
          }}
        >
          <span className="block t-text-primary mb-2">{headline.line1}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-purple-600">
            {headline.line2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl font-normal max-w-2xl mx-auto mb-12 text-[#86868b] leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={buttons.primary.onClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-[15px] flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            {buttons.primary.label}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={buttons.secondary.onClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all duration-300 font-semibold text-[15px]"
          >
            {buttons.secondary.label}
          </button>
        </motion.div>

        {/* Discord Live Stats */}
        <DiscordStats />

      </div>
    </section>
  );
}
