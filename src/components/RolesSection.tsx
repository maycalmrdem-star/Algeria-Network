import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function RolesSection() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/discord-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats || !stats.roles || stats.roles.length === 0) return null;

  return (
    <section className="py-20 relative bg-black border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-red-400 font-medium mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            الطاقم الإداري
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            رتب السيرفر العليا
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            أصحاب الرتب الإدارية العليا في سيرفر ديسكورد
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {stats.roles.map((user: any) => (
            <motion.div 
              key={user.id}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center w-64 text-center"
            >
              <img 
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                alt={user.username}
                className="w-20 h-20 rounded-full mb-4 border-4"
                style={{ borderColor: user.color !== '#000000' ? user.color : '#5865F2' }}
                onError={(e) => (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png"}
              />
              <h3 className="text-xl font-bold text-white mb-2">{user.username}</h3>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium bg-white/10"
                style={{ color: user.color !== '#000000' ? user.color : '#ffffff' }}
              >
                {user.highestRole}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
