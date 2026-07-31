import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound, Lock, LogOut, Plus, Trash2, Save, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { EventItem } from '../components/EventsSection';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeVoiceCount, setActiveVoiceCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if previously authenticated in this session
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
      <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">جدار الحماية الإداري</h2>
            <p className="text-gray-400 text-center text-sm mb-8">يُرجى إدخال مفاتيح الوصول السرية للمتابعة</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور السرية</label>
                <div className="relative">
                  <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 text-white rounded-xl py-3 pr-10 pl-4 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">الرقم السري (PIN)</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 text-white rounded-xl py-3 pr-10 pl-4 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all tracking-[0.5em] font-mono"
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
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-[#5865F2]" />
                لوحة التحكم
              </h1>
              <p className="text-gray-400 mt-1">إدارة فعاليات الموقع</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => saveEvents(events)}
              disabled={loading}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] px-5 py-2.5 rounded-xl font-semibold transition"
            >
              <Save className="w-4 h-4" />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 px-5 py-2.5 rounded-xl font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </header>

        <div className="mb-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">الفعاليات الحالية ({events.length})</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              المتواجدون في الرومات الصوتية الآن: <span className="font-bold text-white">{activeVoiceCount}</span>
            </p>
          </div>
          <button 
            onClick={addEvent}
            className="flex items-center gap-2 bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30 px-4 py-2 rounded-xl transition font-semibold"
          >
            <Plus className="w-4 h-4" />
            إضافة فعالية
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {events.map((ev) => (
              <motion.div 
                key={ev.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111111] border border-white/10 p-6 rounded-2xl relative group"
              >
                <button 
                  onClick={() => removeEvent(ev.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="حذف الفعالية"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">عنوان الفعالية</label>
                    <input 
                      type="text" 
                      value={ev.title} 
                      onChange={(e) => updateEvent(ev.id, 'title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">وصف الفعالية</label>
                    <textarea 
                      value={ev.description} 
                      onChange={(e) => updateEvent(ev.id, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none h-20 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">الوقت والتاريخ</label>
                      <input 
                        type="text" 
                        value={ev.time} 
                        onChange={(e) => updateEvent(ev.id, 'time', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                        placeholder="مثال: اليوم 20:00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">حالة الفعالية</label>
                      <select 
                        value={ev.status}
                        onChange={(e) => updateEvent(ev.id, 'status', e.target.value as EventItem['status'])}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none"
                      >
                        <option value="upcoming">قريباً</option>
                        <option value="live">مباشر الآن</option>
                        <option value="ended">انتهت</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">رابط الصورة (اختياري)</label>
                    <input 
                      type="text" 
                      value={ev.imageUrl} 
                      onChange={(e) => updateEvent(ev.id, 'imageUrl', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#5865F2] outline-none text-left font-mono text-sm"
                      placeholder="https://example.com/image.png"
                      dir="ltr"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-white/10 rounded-2xl text-gray-500">
              لم يتم إضافة أي فعاليات بعد. انقر على "إضافة فعالية" للبدء.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
