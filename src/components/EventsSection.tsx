import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  time: string;
  imageUrl: string;
  status: 'upcoming' | 'live' | 'ended';
}

export function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch(err => console.error("Error fetching events:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="px-3 py-1 text-xs font-bold bg-red-500/20 text-red-500 rounded-full border border-red-500/30 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>مباشر الآن</span>;
      case 'ended':
        return <span className="px-3 py-1 text-xs font-bold bg-gray-500/20 text-gray-500 rounded-full border border-gray-500/30">انتهت</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold bg-[#5865F2]/20 text-[#5865F2] rounded-full border border-[#5865F2]/30">قريباً</span>;
    }
  };

  return (
    <section id="events" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold t-text-primary mb-6"
          >
            فعاليات اليوم
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl t-text-secondary max-w-2xl mx-auto"
          >
            لا تفوت أحدث البطولات والفعاليات المنظمة خصيصاً لمجتمعنا
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#5865F2]/20 border-t-[#5865F2] rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl t-border bg-black/5 dark:bg-white/5 backdrop-blur-sm">
            <Calendar className="w-16 h-16 mx-auto mb-4 t-text-muted opacity-50" />
            <h3 className="text-2xl font-bold t-text-primary mb-2">لا توجد فعاليات اليوم</h3>
            <p className="t-text-secondary">ترقبوا فعالياتنا القادمة قريباً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl overflow-hidden border t-border bg-black/5 dark:bg-white/5 backdrop-blur-sm hover:border-[#5865F2]/50 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 t-text-muted opacity-50" />
                  )}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(event.status)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold t-text-primary mb-3">{event.title}</h3>
                  <p className="t-text-secondary mb-6 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium t-text-primary/80">
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-[#5865F2]" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
