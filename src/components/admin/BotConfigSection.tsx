import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface BotConfigSectionProps {
  activeSection: string;
  password: string;
  pin: string;
}

export function BotConfigSection({ activeSection, password, pin }: BotConfigSectionProps) {
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

  const [commands, setCommands] = useState<any[]>([]);
  const [newCommand, setNewCommand] = useState({ name: '', response: '' });

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
      if (data.commands) setCommands(data.commands);
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
      
      if (res.ok) {
        if (type !== 'delete_command') alert('تم الحفظ بنجاح!');
        if (type === 'add_command' || type === 'delete_command') {
          fetchConfig(); // refresh commands list
          setNewCommand({ name: '', response: '' });
        }
      } else alert('فشل الحفظ!');
    } catch (err) {
      alert('خطأ في الاتصال');
    }
    setLoading(false);
  };

  const deleteCommand = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الأمر؟')) {
      saveConfig('delete_command', { commandId: id });
    }
  };

  return (
    <div className="bg-[#2f3136] rounded-xl overflow-hidden p-6 shadow-lg border border-white/5">
      {activeSection === 'automod' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">إعدادات الحماية (AutoMod)</h3>
            <p className="text-sm text-gray-400">تحكم في فلاتر الحماية التلقائية للسيرفر لحمايته من المخالفات.</p>
          </div>
          <Toggle label="منع الروابط (Anti-Links)" checked={automod.antiLinks} onChange={(e: any) => setAutomod({...automod, antiLinks: e.target.checked})} />
          <Toggle label="منع السبام (Anti-Spam)" checked={automod.antiSpam} onChange={(e: any) => setAutomod({...automod, antiSpam: e.target.checked})} />
          <Toggle label="منع الكلمات البذيئة (Anti-Bad Words)" checked={automod.antiBadWords} onChange={(e: any) => setAutomod({...automod, antiBadWords: e.target.checked})} />
          
          {automod.antiBadWords && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">قائمة الكلمات الممنوعة (افصل بينها بفاصلة)</label>
              <textarea 
                value={automod.badWordsList}
                onChange={(e: any) => setAutomod({...automod, badWordsList: e.target.value})}
                className="w-full bg-[#1e2124] border border-white/5 rounded-xl p-3 text-white h-24 focus:border-[#5865F2] outline-none transition"
                placeholder="كلمة1, كلمة2, كلمة3"
              />
            </div>
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('automod', automod)} />
        </motion.div>
      )}

      {activeSection === 'welcome' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">إعدادات الترحيب</h3>
            <p className="text-sm text-gray-400">قم بتخصيص رسالة الترحيب وصورة الترحيب للأعضاء الجدد.</p>
          </div>
          <Toggle label="تفعيل الترحيب" checked={welcome.enabled} onChange={(e: any) => setWelcome({...welcome, enabled: e.target.checked})} />
          
          {welcome.enabled && (
            <>
              <Input label="أيدي روم الترحيب (Channel ID)" value={welcome.channelId} onChange={(e: any) => setWelcome({...welcome, channelId: e.target.value})} />
              <div>
                <label className="block text-sm text-gray-400 mb-2">رسالة الترحيب</label>
                <textarea 
                  value={welcome.messageText}
                  onChange={(e: any) => setWelcome({...welcome, messageText: e.target.value})}
                  className="w-full bg-[#1e2124] border border-white/5 rounded-xl p-3 text-white h-24 focus:border-[#5865F2] outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">المتغيرات المتاحة: [user], [server], [memberCount]</p>
              </div>
              <Input label="رابط صورة الترحيب" value={welcome.imageUrl} onChange={(e: any) => setWelcome({...welcome, imageUrl: e.target.value})} dir="ltr" />
            </>
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('welcome', welcome)} />
        </motion.div>
      )}

      {activeSection === 'tickets' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">إعدادات نظام التذاكر</h3>
            <p className="text-sm text-gray-400">تكوين فئة التذاكر ورتبة الدعم الفني.</p>
          </div>
          <Input label="أيدي الكاتيجوري (Category ID) لفتح التذاكر فيه" value={tickets.categoryId} onChange={(e: any) => setTickets({...tickets, categoryId: e.target.value})} />
          <Input label="أيدي رتبة الدعم الفني (Support Role ID)" value={tickets.adminRoleId} onChange={(e: any) => setTickets({...tickets, adminRoleId: e.target.value})} />
          <SaveButton loading={loading} onClick={() => saveConfig('tickets', tickets)} />
        </motion.div>
      )}

      {activeSection === 'commands' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">الأوامر المخصصة</h3>
            <p className="text-sm text-gray-400">قم بإنشاء أوامر نصية مخصصة يرد عليها البوت تلقائياً.</p>
          </div>
          
          <div className="bg-[#1e2124] p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="font-semibold text-white">إضافة أمر جديد</h4>
            <Input label="اسم الأمر (بدون مسافات)" value={newCommand.name} onChange={(e: any) => setNewCommand({...newCommand, name: e.target.value})} dir="ltr" />
            <div>
              <label className="block text-sm text-gray-400 mb-2">رد البوت</label>
              <textarea 
                value={newCommand.response}
                onChange={(e: any) => setNewCommand({...newCommand, response: e.target.value})}
                className="w-full bg-[#2f3136] border border-white/5 rounded-xl p-3 text-white h-24 focus:border-[#5865F2] outline-none transition"
              />
            </div>
            <button 
              onClick={() => saveConfig('add_command', { commandName: newCommand.name, response: newCommand.response })}
              disabled={loading || !newCommand.name || !newCommand.response}
              className="bg-[#3ba55d] hover:bg-[#2d8147] text-white px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
            >
              إضافة الأمر
            </button>
          </div>

          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-white">الأوامر الحالية ({commands.length})</h4>
            {commands.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-[#1e2124] rounded-xl border border-white/5">لا توجد أوامر مخصصة حالياً.</p>
            ) : (
              commands.map((cmd, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-[#1e2124] rounded-xl border border-white/5">
                  <div>
                    <span className="font-bold text-[#5865F2]">/{cmd.commandName}</span>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{cmd.response}</p>
                  </div>
                  <button onClick={() => deleteCommand(cmd._id)} className="text-[#ed4245] hover:bg-[#ed4245]/20 p-2 rounded-lg transition text-sm font-semibold">
                    حذف
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Fallback for unused or premium modules */}
      {!['automod', 'welcome', 'tickets', 'commands', 'events'].includes(activeSection) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#1e2124] rounded-full flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#72767d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">غير متوفر حالياً</h3>
          <p className="text-gray-400 max-w-md">هذا القسم قيد التطوير أو يتطلب اشتراك Premium. سيتم إتاحته قريباً.</p>
        </motion.div>
      )}
    </div>
  );
}

function Toggle({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center justify-between p-4 bg-[#1e2124] rounded-xl border border-white/5 cursor-pointer">
      <span className="font-semibold text-white">{label}</span>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-[#3ba55d]' : 'bg-[#4f545c]'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`}></div>
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
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
        className="w-full bg-[#1e2124] border border-white/5 rounded-xl p-3 text-white focus:border-[#5865F2] outline-none transition"
      />
    </div>
  );
}

function SaveButton({ loading, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-2.5 rounded-xl font-bold transition disabled:opacity-50 mt-6"
    >
      <Save size={18} />
      {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
    </button>
  );
}
