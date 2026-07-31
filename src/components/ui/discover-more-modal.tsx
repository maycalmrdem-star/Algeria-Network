import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Shield, ScrollText, Volume2, MessageSquare, Award, Flame } from "lucide-react";

interface DiscoverMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscoverMoreModal({ isOpen, onClose }: DiscoverMoreModalProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "roles" | "rules">("activity");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const tabs = [
    { id: "activity" as const, label: "التفاعل الحي", icon: Activity },
    { id: "roles" as const, label: "الرتب العليا", icon: Shield },
    { id: "rules" as const, label: "القوانين", icon: ScrollText },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-50" />
                <h2 className="text-2xl font-bold tracking-tight text-white relative z-10">اكتشف المزيد عن مجتمعنا</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors relative z-10"
                >
                  <X className="w-6 h-6 text-white/70" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex gap-2 p-4 md:px-6 bg-white/[0.02] border-b border-white/5 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-white text-black"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === "activity" && <ActivityTab key="activity" />}
                  {activeTab === "roles" && <RolesTab key="roles" />}
                  {activeTab === "rules" && <RulesTab key="rules" />}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── TABS CONTENT COMPONENTS ──────────────────────────────────────────

function ActivityTab() {
  type Category = "voice" | "chat";
  type Period = "daily" | "weekly" | "monthly";

  const [category, setCategory] = useState<Category>("voice");
  const [period, setPeriod] = useState<Period>("daily");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTopUsers = async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await fetch(`/api/discord-stats?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        
        if (isSubscribed) {
          const key = category === 'voice' ? 'topStudiers' : 'topTalkers';
          setData(json[key]?.[period] || []);
        }
      } catch (err) {
        console.error(err);
        if (isSubscribed && !silent) setError('حدث خطأ أثناء جلب البيانات');
      } finally {
        if (isSubscribed && !silent) setLoading(false);
      }
    };

    fetchTopUsers();
    const intervalId = setInterval(() => fetchTopUsers(true), 5000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [period, category]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-white">
          الأكثر تفاعلاً {period === "daily" ? "اليوم" : period === "weekly" ? "هذا الأسبوع" : "هذا الشهر"}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Period Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p ? "bg-[#5865F2] text-white shadow-sm" : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {p === "daily" ? "يومي" : p === "weekly" ? "أسبوعي" : "شهري"}
              </button>
            ))}
          </div>
          
          {/* Category Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            {(["voice", "chat"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  category === c ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
                }`}
              >
                {c === "voice" ? <Volume2 className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                {c === "voice" ? "صوتي (دراسة)" : "شات"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-white/50 animate-pulse">جاري جلب البيانات...</div>
        ) : data.filter(u => u.value > 0).length > 0 ? (
          data.filter(u => u.value > 0).map((user, idx) => {
            const isTop3 = idx < 3;
            return (
              <motion.div 
                key={user.id || idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group ${
                  isTop3 
                    ? "border-[#5865F2]/40 bg-gradient-to-r from-[#5865F2]/10 to-transparent hover:border-[#5865F2]" 
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                {isTop3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                )}
                
                <div className={`w-8 text-center font-mono text-xl font-bold ${
                  idx === 0 ? "text-yellow-400 text-2xl drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : 
                  idx === 1 ? "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" : 
                  idx === 2 ? "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" : 
                  "text-white/20"
                }`}>
                  #{idx + 1}
                </div>
                
                <div className={`w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-2 ${
                  isTop3 ? "border-[#5865F2]" : "border-white/10"
                }`}>
                  <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt={user.username} className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                  }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate text-lg group-hover:text-[#5865F2] transition-colors">{user.username}</h4>
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    {category === "chat" ? <MessageSquare className="w-3 h-3 text-[#5865F2]" /> : <Volume2 className="w-3 h-3 text-[#5865F2]" />}
                    <span>{category === "chat" ? "الرسائل:" : "الدقائق:"} <span className="font-bold text-white">{category === "chat" ? (user.value || 0) : (user.value || 0)}</span></span>
                  </div>
                </div>
                
                {isTop3 && (
                  <div className="text-yellow-400 group-hover:scale-110 transition-transform">
                    {idx === 0 ? <Award className="w-8 h-8" /> : <Flame className="w-6 h-6 text-orange-500" />}
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Activity className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <div className="text-white/50">لا توجد بيانات حالياً لهذه الفترة.</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RolesTab() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/discord-stats?t=${Date.now()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        if (json.roles) {
          setRoles(json.roles);
        }
      } catch (err) {
        console.error("Roles fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group roles by highestRole name to show counts
  const roleGroups = roles.reduce((acc, user) => {
    const rName = user.highestRole;
    if (!acc[rName]) {
      acc[rName] = { name: rName, count: 0, color: user.color !== "#000000" ? user.color : "#ffffff", users: [] };
    }
    acc[rName].count++;
    acc[rName].users.push(user);
    return acc;
  }, {});

  const sortedRoles = Object.values(roleGroups).sort((a: any, b: any) => b.count - a.count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-2">هيكلة الرتب في السيرفر</h3>
        <p className="text-white/50 text-sm">تعرف على الإدارة والأشخاص المسؤولين عن تنظيم المجتمع.</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/50 animate-pulse">جاري جلب البيانات...</div>
      ) : sortedRoles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedRoles.map((role: any, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold" style={{ color: role.color }}>{role.name}</h4>
                <span className="px-2.5 py-1 rounded-full bg-black/40 text-xs text-white/70 font-mono">
                  {role.count} أعضاء
                </span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {role.users.slice(0, 5).map((u: any) => (
                  <div key={u.id} className="w-8 h-8 rounded-full bg-white/10 overflow-hidden" title={u.username}>
                    <img src={`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`} alt={u.username} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                    }} />
                  </div>
                ))}
                {role.users.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
                    +{role.users.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white/50">لا توجد إداريين متاحين حالياً.</div>
      )}
    </motion.div>
  );
}

function RulesTab() {
  const rules = [
    { text: "ممنوع التنمر بأي شكل من الأشكال.", action: "warning" },
    { text: "ممنوع نشر صور الأعضاء دون إذنهم المسبق.", action: "warning" },
    { text: "يمنع نشر روابط سيرفرات أو روابط قد تكون احتيالية أو غير آمنة.", action: "warning" },
    { text: "يمنع السب، القذف، أو الكلام غير اللائق (+18).", action: "mute" },
    { text: "يمنع نشر صور غير لائقة ويشمل ذلك الإيموجيات غير اللائقة.", action: "ban" },
    { text: "يمنع مناقشة أمور سياسية، دينية، أو معتقدات قد تثير الفتن.", action: "warning" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-2">قوانين السيرفر</h3>
        <p className="text-white/50 text-sm">الالتزام بالقوانين يضمن بيئة نظيفة وممتعة للجميع. هذه القوانين غير ثابتة وقد يتم تغييرها.</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-white/40 font-mono font-bold mt-0.5">{idx + 1}.</div>
            <p className="text-white/80 text-sm leading-relaxed">{rule.text}</p>
          </div>
        ))}
      </div>

      {/* Penalties Section */}
      <div className="mt-8 p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
        <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          نظام العقوبات
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-yellow-500 text-sm font-bold mb-1">تحذير (Warning)</div>
            <div className="text-white/50 text-xs">نشر روابط / نشر صور الأعضاء / نقاشات ممنوعة</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-orange-500 text-sm font-bold mb-1">ميوت (Mute)</div>
            <div className="text-white/50 text-xs">سب / إيموجيات أو كلام +18</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-red-500 text-sm font-bold mb-1">حظر (Ban)</div>
            <div className="text-white/50 text-xs">صور غير لائقة / التعدي على المقدسات (سب الله)</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
