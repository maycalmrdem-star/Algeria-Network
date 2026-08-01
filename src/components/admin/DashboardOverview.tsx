import React from 'react';
import { Settings, Hand, Wrench, ShieldAlert, Ticket, Clock, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const MODULES = [
  { id: 'automod', label: 'الحماية', description: 'حماية السيرفر من الروابط والسبام والكلمات البذيئة', icon: <ShieldAlert size={24} />, active: true },
  { id: 'welcome', label: 'الترحيب', description: 'رسائل الترحيب وتوديع الأعضاء في السيرفر', icon: <Hand size={24} />, active: true },
  { id: 'commands', label: 'الأوامر المخصصة', description: 'إضافة أوامر مخصصة بردود تلقائية', icon: <Wrench size={24} />, active: true },
  { id: 'tickets', label: 'نظام التذاكر', description: 'نظام متكامل لفتح وإدارة تذاكر الدعم الفني', icon: <Ticket size={24} />, active: true },
  { id: 'events', label: 'إدارة الفعاليات', description: 'إنشاء وإدارة فعاليات وبطولات السيرفر', icon: <Settings size={24} />, active: true },
  { id: 'tempchannels', label: 'الرومات المؤقتة', description: 'إنشاء رومات صوتية مؤقتة للأعضاء', icon: <Clock size={24} />, active: false },
  { id: 'autoresponder', label: 'الرد التلقائي', description: 'الرد التلقائي على كلمات معينة', icon: <MessageSquare size={24} />, active: false },
  { id: 'starboard', label: 'نجمة', description: 'حفظ الرسائل المميزة في روم مخصص', icon: <Star size={24} />, active: false },
];

export function DashboardOverview({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Fast Access</h2>
      <p className="text-gray-400 mb-8">Access modules settings quickly</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MODULES.map((mod, i) => (
          <div 
            key={i} 
            className="bg-[#2f3136] rounded-lg p-5 flex flex-col items-center text-center border border-transparent hover:border-white/10 transition group"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${mod.active ? 'bg-[#5865F2]/10 text-[#5865F2]' : 'bg-gray-700/50 text-gray-400'}`}>
              {mod.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{mod.label}</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">{mod.description}</p>
            
            {mod.active ? (
              <button 
                onClick={() => setActiveSection(mod.id)}
                className="w-full py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded font-medium transition"
              >
                Visit
              </button>
            ) : (
              <button 
                className="w-full py-2 bg-[#4f545c] text-white/50 cursor-not-allowed rounded font-medium"
                disabled
              >
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
