"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Meteors } from "@/components/ui/meteors";

function fireConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const colors = ["#FFFFFF", "#DDDDDD", "#BBBBBB", "#999999", "#777777", "#555555"];
  const particles = Array.from({ length: 80 }, () => ({
    x: canvas.width / 2, y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * 5 + 2,
    alpha: 1, gravity: 0.35,
  }));
  let frame: number;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.alpha -= 0.015;
      if (p.alpha > 0) {
        alive = true;
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    });
    if (alive) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export const WaitlistHero = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    if (canvasRef.current) fireConfetti(canvasRef.current);
  };

  return (
    <section className="relative py-32 t-bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <Meteors number={12} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFFFFF]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" style={{ width: "100%", height: "100%" }} width={800} height={600} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#FFFFFF]/30 bg-[#FFFFFF]/10">
          <Sparkles className="w-4 h-4 text-[#FFFFFF]" />
          <span className="text-sm font-semibold text-[#FFFFFF] tracking-wide">انضم إلى القائمة الانتظار</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-4xl md:text-5xl font-black t-text-primary mb-6 leading-tight tracking-tight">
          كن من{" "}
          <span className="bg-gradient-to-r from-[#FFFFFF] via-[#CCCCCC] to-[#888888] bg-clip-text text-transparent">أوائل المنضمين</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="t-text-secondary text-lg mb-12 leading-relaxed font-light">
          سجّل بريدك الإلكتروني واحصل على وصول حصري مبكر مع مزايا لا تُعطى لاحقاً
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}>
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني..." required
                  className="w-full px-5 py-4 rounded-xl t-bg-card t-border t-text-primary placeholder:text-current placeholder:opacity-50 text-sm font-medium backdrop-blur-sm focus:outline-none focus:border-[#FFFFFF]/50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
                  dir="rtl" />
                <BorderBeam size={150} duration={8} borderWidth={1} colorFrom="#FFFFFF" colorTo="#888888" />
              </div>
              <motion.button type="submit" disabled={status === "loading"}
                className="px-7 py-4 rounded-xl bg-[#FFFFFF] text-black font-semibold text-sm tracking-wide flex items-center gap-2 justify-center shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-60"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {status === "loading"
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" />انضم الآن</>}
              </motion.button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative max-w-lg mx-auto p-8 rounded-2xl border border-[#FFFFFF]/30 bg-[#FFFFFF]/8 backdrop-blur-sm overflow-hidden shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
              <BorderBeam colorFrom="#FFFFFF" colorTo="#CCCCCC" duration={6} />
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-xl font-bold t-text-primary mb-2">تم التسجيل بنجاح!</p>
              <p className="t-text-secondary text-sm">سنرسل لك رابط الوصول المبكر قريباً على بريدك الإلكتروني.</p>
            </motion.div>
          )}
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }} className="mt-6 t-text-muted text-xs tracking-wide">
          🔒 بياناتك محمية · لا مشاركة مع طرف ثالث · إلغاء في أي وقت
        </motion.p>
      </div>
    </section>
  );
};
