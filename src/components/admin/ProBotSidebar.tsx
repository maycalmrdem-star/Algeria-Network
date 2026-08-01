import React from 'react';
import { 
  Eye, Settings, MessageSquare, Wrench, Hand, Send, TrendingUp, Users, Palette, UserCheck, Star, 
  Clock, Link, BarChart2, Ticket, ShieldAlert, ChevronDown, LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const MENU_ITEMS = [
  {
    category: 'GÉNÉRAL',
    items: [
      { id: 'overview', label: 'Vue d\'ensemble', icon: <Eye size={18} />, enabled: true },
      { id: 'events', label: 'إدارة الفعاليات', icon: <Settings size={18} />, enabled: true },
      { id: 'embeds', label: 'Messages en Embed', icon: <MessageSquare size={18} />, enabled: false },
    ]
  },
  {
    category: 'PARAMÈTRES DES MODULES',
    items: [
      { id: 'commands', label: 'أوامر مخصصة', icon: <Wrench size={18} />, enabled: true },
      { id: 'welcome', label: 'الترحيب', icon: <Hand size={18} />, enabled: true },
      { id: 'autoresponder', label: 'الرد التلقائي', icon: <Send size={18} />, enabled: false },
      { id: 'leveling', label: 'نظام المستويات', icon: <TrendingUp size={18} />, enabled: false, premium: true },
      { id: 'autoroles', label: 'الرتب التلقائية', icon: <Users size={18} />, enabled: false },
      { id: 'colors', label: 'الألوان', icon: <Palette size={18} />, enabled: false },
      { id: 'selfroles', label: 'رتب اختيارية', icon: <UserCheck size={18} />, enabled: false },
      { id: 'starboard', label: 'نجمة', icon: <Star size={18} />, enabled: false },
      { id: 'tempchannels', label: 'رومات مؤقتة', icon: <Clock size={18} />, enabled: false },
      { id: 'templinks', label: 'رابط مؤقت', icon: <Link size={18} />, enabled: false, premium: true },
      { id: 'statistics', label: 'إحصائيات', icon: <BarChart2 size={18} />, enabled: false, premium: true },
      { id: 'tickets', label: 'نظام التذاكر', icon: <Ticket size={18} />, enabled: true, premium: true },
    ]
  },
  {
    category: 'MODÉRATION',
    items: [
      { id: 'automod', label: 'الحماية (AutoMod)', icon: <ShieldAlert size={18} />, enabled: true },
    ]
  }
];

export function ProBotSidebar({ activeSection, setActiveSection, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-[#1e2124] h-screen flex flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-[#1e2124] custom-scrollbar">
      <div className="p-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#2f3136] rounded-full flex items-center justify-center mb-3 shadow-lg overflow-hidden">
          <img src="/server-icon.gif" alt="Server Icon" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-white font-bold text-lg">Algeria Network</h2>
        <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-md mt-2 cursor-pointer hover:bg-white/10 transition border border-white/5">Algeria Network . 200?</span>
      </div>

      <div className="flex-1 py-2">
        {MENU_ITEMS.map((group, i) => (
          <div key={i} className="mb-6 px-3">
            <div className="flex items-center gap-2 px-3 mb-2 cursor-pointer text-gray-400 hover:text-gray-300 transition">
              <ChevronDown size={14} />
              <span className="text-xs font-bold tracking-wider">{group.category}</span>
            </div>
            
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition group ${
                    activeSection === item.id 
                      ? 'bg-[#2f3136] text-white' 
                      : 'text-gray-400 hover:bg-[#2f3136]/50 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${activeSection === item.id ? 'text-[#a3a6aa]' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold truncate">{item.label}</span>
                    {item.premium && (
                      <span className="text-[9px] font-bold bg-[#ffb12f]/20 text-[#ffb12f] px-1.5 py-0.5 rounded ml-1">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  {item.enabled ? (
                    <div className="w-4 h-4 rounded-full bg-[#3ba55d] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#4f545c]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition font-semibold text-sm"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
