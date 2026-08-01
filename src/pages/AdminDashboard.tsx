import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound, Lock, Plus, Trash2, Save, Menu } from 'lucide-react';
import type { EventItem } from '../components/EventsSection';
import { ProBotSidebar } from '../components/admin/ProBotSidebar';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { BotConfigSection } from '../components/admin/BotConfigSection';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeVoiceCount, setActiveVoiceCount] = useState<number>(0);
  
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('admin_auth');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setPassword(auth.password);
      setPin(auth.pin);
      setIsAuthenticated(true);
      fetchEvents();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, pin })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', JSON.stringify({ password, pin }));
        fetchEvents();
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setPin('');
    sessionStorage.removeItem('admin_auth');
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data && data.events) {
        setEvents(data.events);
        setActiveVoiceCount(data.activeVoiceCount || 0);
      } else if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const saveEvents = async (updatedEvents: EventItem[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password,
          'x-admin-pin': pin
        },
        body: JSON.stringify({ events: updatedEvents })
      });
      if (res.ok) {
        setEvents(updatedEvents);
        alert('تم الحفظ بنجاح!');
      } else {
        alert('فشل الحفظ. تأكد من صلاحياتك.');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم.');
    }
    setLoading(false);
  };

  const addEvent = () => {
    const newEvent: EventItem = {
      id: Date.now().toString(),
      title: 'فعالية جديدة',
      description: 'وصف الفعالية...',
      time: '20:00 KSA',
      imageUrl: '',
      status: 'upcoming'
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, field: keyof EventItem, value: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
  };

  const removeEvent = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#36393e] p-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#2f3136] border border-white/5 p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#1e2124] rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-white/5">
                 <img src="/server-icon.gif" alt="Server Icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">تسجيل الدخول للإدارة</h2>
            <p className="text-gray-400 text-center text-sm mb-8">أدخل المفاتيح السرية لـ Algeria Network</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">كلمة المرور</label>
                <div className="relative">
                  <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1e2124] border border-white/5 text-white rounded-lg py-3 pr-10 pl-4 focus:border-[#5865F2] outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">الرقم السري (PIN)</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-[#1e2124] border border-white/5 text-white rounded-lg py-3 pr-10 pl-4 focus:border-[#5865F2] outline-none transition-all tracking-[0.5em] font-mono"
                    placeholder="••••"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm font-medium mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 mt-6 shadow-md"
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderSectionHeader = () => {
    let title = '';
    switch(activeSection) {
      case 'overview': title = 'Vue d\'ensemble'; break;
      case 'events': title = 'إدارة الفعاليات'; break;
      case 'automod': title = 'الحماية (AutoMod)'; break;
      case 'welcome': title = 'الترحيب'; break;
      case 'tickets': title = 'نظام التذاكر'; break;
      case 'commands': title = 'الأوامر المخصصة'; break;
      default: title = 'Dashboard';
    }

    return (
      <header className="bg-[#36393e] border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </header>
    );
  };

  return (
    <div className="flex h-screen bg-[#36393e] overflow-hidden dir-rtl">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={`fixed md:static inset-y-0 right-0 z-30 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
         <ProBotSidebar activeSection={activeSection} setActiveSection={(s) => { setActiveSection(s); setSidebarOpen(false); }} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden text-right">
        {renderSectionHeader()}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {activeSection === 'overview' && (
              <DashboardOverview setActiveSection={setActiveSection} />
            )}

            {activeSection === 'events' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center bg-[#2f3136] p-5 rounded-xl border border-white/5 shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold text-white">الفعاليات الحالية ({events.length})</h2>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3ba55d] animate-pulse"></span>
                      المتواجدون في الرومات الصوتية الآن: <span className="font-bold text-white">{activeVoiceCount}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={addEvent}
                      className="flex items-center gap-2 bg-[#1e2124] text-white hover:bg-white/5 px-4 py-2 rounded-lg transition font-semibold border border-white/10"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة فعالية
                    </button>
                    <button 
                      onClick={() => saveEvents(events)}
                      disabled={loading}
                      className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-lg transition font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {events.map((ev) => (
                      <motion.div 
                        key={ev.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#2f3136] border border-white/5 p-6 rounded-xl relative group shadow-sm hover:border-[#5865F2]/50 transition-colors"
                      >
                        <button 
                          onClick={() => removeEvent(ev.id)}
                          className="absolute top-4 left-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="حذف الفعالية"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">عنوان الفعالية</label>
                            <input 
                              type="text" 
                              value={ev.title} 
                              onChange={(e) => updateEvent(ev.id, 'title', e.target.value)}
                              className="w-full bg-[#1e2124] border border-white/5 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">وصف الفعالية</label>
                            <textarea 
                              value={ev.description} 
                              onChange={(e) => updateEvent(ev.id, 'description', e.target.value)}
                              className="w-full bg-[#1e2124] border border-white/5 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none h-20 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 mb-1">الوقت والتاريخ</label>
                              <input 
                                type="text" 
                                value={ev.time} 
                                onChange={(e) => updateEvent(ev.id, 'time', e.target.value)}
                                className="w-full bg-[#1e2124] border border-white/5 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                                placeholder="مثال: اليوم 20:00"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 mb-1">حالة الفعالية</label>
                              <select 
                                value={ev.status}
                                onChange={(e) => updateEvent(ev.id, 'status', e.target.value as EventItem['status'])}
                                className="w-full bg-[#1e2124] border border-white/5 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                              >
                                <option value="upcoming">قريباً</option>
                                <option value="live">مباشر الآن</option>
                                <option value="ended">انتهت</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">رابط الصورة (اختياري)</label>
                            <input 
                              type="text" 
                              value={ev.imageUrl} 
                              onChange={(e) => updateEvent(ev.id, 'imageUrl', e.target.value)}
                              className="w-full bg-[#1e2124] border border-white/5 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none text-left font-mono text-sm"
                              placeholder="https://example.com/image.png"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {events.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-20 border-2 border-dashed border-white/10 rounded-xl text-gray-500 bg-[#2f3136]/50">
                      لم يتم إضافة أي فعاليات بعد.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Render BotConfigSection for other tabs */}
            {!['overview', 'events'].includes(activeSection) && (
              <BotConfigSection activeSection={activeSection} password={password} pin={pin} />
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
