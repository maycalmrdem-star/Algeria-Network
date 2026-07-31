"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Mic, ExternalLink, Users, RefreshCw } from "lucide-react";

const GUILD_ID       = "1531987166048030750";
const WIDGET_API     = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;
const INVITE_API     = `https://discord.com/api/v9/invites/34fqkXH6ts?with_counts=true`;
const DISCORD_INVITE = "https://discord.gg/34fqkXH6ts";

interface WidgetChannel { id: string; name: string; position: number; }
interface WidgetMember  {
  id: string; username: string; status: string;
  avatar_url?: string; channel_id?: string | null;
  game?: { name: string };
  streaming?: boolean;
  self_video?: boolean;
}
interface WidgetData {
  id: string; name: string; presence_count: number;
  channels: WidgetChannel[];
  members:  WidgetMember[];
  instant_invite?: string;
}

/* ── Fast fetcher with 4s timeout ── */
async function fetchWithTimeout(url: string, ms = 4000) {
  const ctrl = new AbortController();
  const id   = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    return r.json();
  } catch {
    clearTimeout(id);
    return null;
  }
}

/* ── CountUp ── */
function CountUp({ end, suffix = "" }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let val = 0;
    const step = end / (1600 / 16);
    const t = setInterval(() => {
      val += step;
      if (val >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(val));
    }, 16);
    return () => clearInterval(t);
  }, [isInView, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── LIVE badge ── */
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wider animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />
      LIVE
    </span>
  );
}

/* ── Status dot ── */
function StatusDot({ status }: { status: string }) {
  const color = status === "online" ? "bg-green-500"
    : status === "idle"   ? "bg-yellow-400"
    : status === "dnd"    ? "bg-red-500"
    : "bg-gray-500";
  return <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />;
}

/* ── Skeleton loader ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />;
}

/* ── Main Stats ── */
export const Stats = () => {
  const [widget,   setWidget]   = useState<WidgetData | null>(null);
  const [invite,   setInvite]   = useState<{ members: number; online: number } | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [spinning, setSpinning] = useState(false);

  const fetchAll = useCallback(async (manual = false) => {
    if (manual) setSpinning(true);
    const [w, inv] = await Promise.all([
      fetchWithTimeout(WIDGET_API),
      fetchWithTimeout(INVITE_API),
    ]);
    if (w?.id)                         setWidget(w);
    if (inv?.approximate_member_count) setInvite({ members: inv.approximate_member_count, online: inv.approximate_presence_count });
    setLoading(false);
    if (manual) setTimeout(() => setSpinning(false), 600);
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(() => fetchAll(), 60_000); // auto-refresh every 60s
    return () => clearInterval(id);
  }, [fetchAll]);

  const memberCount = invite?.members ?? 198;
  const onlineCount = widget?.presence_count ?? invite?.online ?? 28;

  const statsCards = [
    { end: memberCount, suffix: "+", label: "عضو منضم",     icon: "👥" },
    { end: 20,          suffix: "+", label: "قناة متخصصة", icon: "📢" },
    { end: onlineCount, suffix: "",  label: "متصل الآن",    icon: "🟢" },
    { end: 99,          suffix: "%", label: "رضا الأعضاء", icon: "⭐" },
  ];

  /* group members by voice channel */
  const voiceChannels = (widget?.channels ?? []).map(ch => ({
    ...ch,
    members: (widget?.members ?? []).filter(m => m.channel_id === ch.id),
  })).sort((a, b) => a.position - b.position);

  const onlineOnly = (widget?.members ?? []).filter(m => !m.channel_id);

  /* detect streaming / live */
  const isLive = (m: WidgetMember) =>
    m.streaming === true || m.self_video === true ||
    (m.game?.name ?? "").toLowerCase().includes("stream");

  return (
    <section className="relative py-32 overflow-hidden t-bg-secondary border-y t-border">
      <div className="relative max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 t-text-primary">بالأرقام.</h2>
          <p className="text-lg t-text-secondary">ننمو يومياً بفضل مجتمعنا الرائع.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {statsCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="relative p-8 rounded-3xl text-center glass-mono flex flex-col items-center justify-center">
                <div className="text-2xl mb-4 opacity-80">{s.icon}</div>
                <div className="text-4xl font-semibold tracking-tight t-text-primary mb-1">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <p className="text-[13px] font-medium tracking-wide t-text-muted uppercase">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Widget */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <div className="rounded-3xl overflow-hidden glass-mono p-1">

            {/* Widget Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b t-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full t-bg-card border t-border flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 t-text-primary" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold t-text-primary leading-none mb-1">
                    {widget?.name ?? "Algeria Network"} — النشاط الحي
                  </h3>
                  <p className="text-[13px] t-text-muted leading-none">القنوات الصوتية والأعضاء المتصلين</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchAll(true)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all t-text-muted hover:t-text-primary"
                  title="تحديث"
                >
                  <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${spinning ? "animate-spin" : ""}`} />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-400">{onlineCount} متصل</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {loading ? (
                /* Skeleton */
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-2 gap-3">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
                  </div>
                </div>
              ) : (
                <>
                  {/* Voice Channels */}
                  {voiceChannels.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold t-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Mic className="w-3 h-3" /> القنوات الصوتية
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {voiceChannels.map(ch => (
                          <div key={ch.id}
                            className="group flex flex-col gap-3 p-4 rounded-2xl t-bg-card border t-border hover:border-[#5865F2]/40 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Mic className="w-3.5 h-3.5 text-[#5865F2]" />
                                <span className="text-sm font-medium t-text-primary truncate max-w-[140px]">{ch.name}</span>
                              </div>
                              <a href={widget?.instant_invite ?? DISCORD_INVITE}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white text-[11px] font-semibold transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 flex-shrink-0"
                              >
                                <ExternalLink className="w-3 h-3" /> انضم
                              </a>
                            </div>

                            {ch.members.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {ch.members.map(m => (
                                  <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full t-bg-secondary border t-border">
                                    {m.avatar_url
                                      ? <img src={m.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0" alt={m.username} />
                                      : <StatusDot status={m.status} />
                                    }
                                    <span className="text-[11px] font-medium t-text-secondary">{m.username}</span>
                                    {isLive(m) && <LiveBadge />}
                                    {m.game && !isLive(m) && (
                                      <span className="text-[10px] t-text-muted px-1.5 py-0.5 rounded bg-white/5 hidden sm:inline">
                                        🎮 {m.game.name.slice(0, 12)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs t-text-muted">فارغة</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Online Members */}
                  {onlineOnly.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold t-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users className="w-3 h-3" /> أعضاء متصلون
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {onlineOnly.slice(0, 24).map(m => (
                          <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full t-bg-card border t-border">
                            {m.avatar_url
                              ? <img src={m.avatar_url} className="w-4 h-4 rounded-full flex-shrink-0" alt={m.username} />
                              : <StatusDot status={m.status} />
                            }
                            <span className="text-xs font-medium t-text-secondary">{m.username}</span>
                            {isLive(m) && <LiveBadge />}
                          </div>
                        ))}
                        {onlineOnly.length > 24 && (
                          <div className="flex items-center px-3 py-1.5 rounded-full t-bg-card border t-border">
                            <span className="text-xs t-text-muted">+{onlineOnly.length - 24} آخرون</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {voiceChannels.length === 0 && onlineOnly.length === 0 && (
                    <div className="text-center py-8 t-text-muted text-sm">لا يوجد أعضاء متصلون الآن</div>
                  )}
                </>
              )}
            </div>

            {/* Big Join CTA */}
            <div className="px-6 pb-6">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#5865F2]/25"
              >
                <ExternalLink className="w-4 h-4" />
                انضم إلى السيرفر الآن
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
