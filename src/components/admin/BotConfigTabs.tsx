import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, MessageSquare, Ticket, Hash } from 'lucide-react';

interface BotConfigTabsProps {
  password: string;
  pin: string;
}

export function BotConfigTabs({ password, pin }: BotConfigTabsProps) {
  const [activeTab, setActiveTab] = useState('automod');
  const [loading, setLoading] = useState(false);
  
  const [automod, setAutomod] = useState({
    antiLinks: false,
    antiSpam: false,
    antiBadWords: false,
    badWordsList: ''
  });

  const [welcome, setWelcome] = useState({
    enabled: false,
    channelId: '',
    messageText: '',
    imageUrl: ''
  });

  const [tickets, setTickets] = useState({
    categoryId: '',
    adminRoleId: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/bot-settings', {
        headers: {
          'x-admin-password': password,
          'x-admin-pin': pin
        }
      });
      const data = await res.json();
      if (data.automod) {
        setAutomod({
          ...data.automod,
          badWordsList: data.automod.badWordsList?.join(', ') || ''
        });
      }
      if (data.welcome) setWelcome(data.welcome);
      if (data.tickets) setTickets(data.tickets);
    } catch (err) {
      console.error("Error fetching config:", err);
    }
  };

  const saveConfig = async (type: string, data: any) => {
    setLoading(true);
    try {
      let payload = data;
      if (type === 'automod') {
        payload = {
          ...data,
          badWordsList: data.badWordsList.split(',').map((w: string) => w.trim()).filter(Boolean)
        };
      }

      const res = await fetch('/api/bot-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
          'x-admin-pin': pin
        },
        body: JSON.stringify({ type, data: payload })
      });
      
      if (res.ok) alert('تم الحفظ بنجاح!');
      else alert('فشل الحفظ!');
    } catch (err) {
      alert('خطأ في الاتصال');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex border-b border-white/10 overflow-x-auto">
        <TabButton active={activeTab === 'automod'} onClick={() => setActiveTab('automod')} icon={<Shield size={18} />} label="الحماية (AutoMod)" />
        <TabButton active={activeTab === 'welcome'} onClick={() => setActiveTab('welcome')} icon={<MessageSquare size={18} />} label="الترحيب (Welcome)" />
        <TabButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={<Ticket size={18} />} label="التذاكر (Tickets)" />
      </div>

      <div className="p-6">
        {activeTab === 'automod' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">إعدادات الحماية التلقائية</h3>
            <Toggle label="منع الروابط (Anti-Links)" checked={automod.antiLinks} onChange={(e: any) => setAutomod({...automod, antiLinks: e.target.checked})} />
            <Toggle label="منع السبام (Anti-Spam)" checked={automod.antiSpam} onChange={(e: any) => setAutomod({...automod, antiSpam: e.target.checked})} />
            <Toggle label="منع الكلمات البذيئة (Anti-Bad Words)" checked={automod.antiBadWords} onChange={(e: any) => setAutomod({...automod, antiBadWords: e.target.checked})} />
            
            {automod.antiBadWords && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">قائمة الكلمات الممنوعة (افصل بينها بفاصلة)</label>
                <textarea 
                  value={automod.badWordsList}
                  onChange={(e: any) => setAutomod({...automod, badWordsList: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24"
                  placeholder="كلمة1, كلمة2, كلمة3"
                />
              </div>
            )}
            <SaveButton loading={loading} onClick={() => saveConfig('automod', automod)} />
          </motion.div>
        )}

        {activeTab === 'welcome' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">إعدادات الترحيب</h3>
            <Toggle label="تفعيل الترحيب" checked={welcome.enabled} onChange={(e: any) => setWelcome({...welcome, enabled: e.target.checked})} />
            
            {welcome.enabled && (
              <>
                <Input label="أيدي روم الترحيب (Channel ID)" value={welcome.channelId} onChange={(e: any) => setWelcome({...welcome, channelId: e.target.value})} />
                <div>
                  <label className="block text-sm text-gray-400 mb-2">رسالة الترحيب</label>
                  <textarea 
                    value={welcome.messageText}
                    onChange={(e: any) => setWelcome({...welcome, messageText: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24"
                  />
                  <p className="text-xs text-gray-500 mt-1">المتغيرات: [user], [server], [memberCount]</p>
                </div>
                <Input label="رابط صورة الترحيب" value={welcome.imageUrl} onChange={(e: any) => setWelcome({...welcome, imageUrl: e.target.value})} dir="ltr" />
              </>
            )}
            <SaveButton loading={loading} onClick={() => saveConfig('welcome', welcome)} />
          </motion.div>
        )}

        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">إعدادات نظام التذاكر</h3>
            <Input label="أيدي الكاتيجوري (Category ID) لفتح التذاكر فيه" value={tickets.categoryId} onChange={(e: any) => setTickets({...tickets, categoryId: e.target.value})} />
            <Input label="أيدي رتبة الدعم الفني (Support Role ID)" value={tickets.adminRoleId} onChange={(e: any) => setTickets({...tickets, adminRoleId: e.target.value})} />
            <SaveButton loading={loading} onClick={() => saveConfig('tickets', tickets)} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${active ? 'text-[#5865F2] border-b-2 border-[#5865F2] bg-[#5865F2]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      {icon} {label}
    </button>
  );
}

function Toggle({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer">
      <span className="font-semibold text-white">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 accent-[#5865F2]" />
    </label>
  );
}

function Input({ label, value, onChange, dir = "rtl" }: any) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={onChange}
        dir={dir}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#5865F2] outline-none transition"
      />
    </div>
  );
}

function SaveButton({ loading, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 mt-6"
    >
      <Save size={20} />
      {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
    </button>
  );
}
