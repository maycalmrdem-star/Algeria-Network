import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, MessageCircle, Headphones } from "lucide-react";

const formatVoiceTime = (mins: number) => {
  if (!mins) return "0 دقيقة";
  if (mins < 60) return `${mins} دقيقة`;
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  let hoursText = "ساعة";
  if (hours === 2) hoursText = "ساعتين";
  else if (hours > 2 && hours <= 10) hoursText = "ساعات";
  else if (hours > 10) hoursText = "ساعة";
  
  let result = hours === 1 ? "ساعة" : hours === 2 ? "ساعتين" : `${hours} ${hoursText}`;
  
  if (remainingMins > 0) {
    result += ` و ${remainingMins} دقيقة`;
  }
  
  return result;
};

export function TopUsersSection() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/discord-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) return null;

  const topStudiers = stats.topStudiers?.daily || [];
  const topTalkers = stats.topTalkers?.daily || [];

  return (
    <section className="py-20 relative bg-black/50 backdrop-blur-sm border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#5865F2] font-medium mb-6"
          >
            <Trophy className="w-4 h-4" />
            أفضل الطلاب اليوم
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            قادة التفاعل
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            أكثر الأعضاء تفاعلاً ودراسة في السيرفر لهذا اليوم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Top Studiers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Headphones className="text-green-400 w-6 h-6" />
              <h3 className="text-2xl font-bold text-white">أبطال الدراسة</h3>
            </div>
            <div className="space-y-4">
              {topStudiers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">لم يتم تسجيل أي دراسة اليوم بعد</p>
              ) : (
                topStudiers.map((user: any, index: number) => (
                  <div key={user.id} className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full border-2 border-[#5865F2]"
                          onError={(e) => (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png"}
                        />
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      <span className="text-white font-medium text-lg">{user.username}</span>
                    </div>
                    <div className="text-gray-300 font-mono text-sm bg-white/10 px-3 py-1 rounded-lg">
                      {formatVoiceTime(user.voiceMinutes)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Talkers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <MessageCircle className="text-blue-400 w-6 h-6" />
              <h3 className="text-2xl font-bold text-white">أكثر المتفاعلين</h3>
            </div>
            <div className="space-y-4">
              {topTalkers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">لا توجد رسائل مسجلة اليوم بعد</p>
              ) : (
                topTalkers.map((user: any, index: number) => (
                  <div key={user.id} className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full border-2 border-purple-500"
                          onError={(e) => (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png"}
                        />
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      <span className="text-white font-medium text-lg">{user.username}</span>
                    </div>
                    <div className="text-gray-300 font-mono text-sm bg-white/10 px-3 py-1 rounded-lg">
                      {user.messages} رسالة
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
