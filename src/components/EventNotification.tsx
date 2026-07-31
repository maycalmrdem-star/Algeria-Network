import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ArrowLeft, Users } from 'lucide-react';
import type { EventItem } from './EventsSection';

export function EventNotification() {
  const [liveEvent, setLiveEvent] = useState<EventItem | null>(null);
  const [activeVoiceCount, setActiveVoiceCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const checkEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        
        if (mounted) {
          if (data && data.events) {
            const currentLive = data.events.find((e: EventItem) => e.status === 'live');
            if (currentLive) {
              setLiveEvent(currentLive);
              setActiveVoiceCount(data.activeVoiceCount || 0);
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check events", err);
      }
    };

    checkEvents();
    // Poll every 15 seconds
    const interval = setInterval(checkEvents, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && liveEvent && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[100] pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-[#5865F2]/30 shadow-2xl p-1 group cursor-pointer"
               onClick={() => window.open("https://discord.gg/34fqkXH6ts", "_blank")}>
            
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/20 via-red-500/10 to-[#5865F2]/20 animate-pulse opacity-50" />
            
            <div className="relative bg-[#111111]/90 backdrop-blur-md rounded-xl p-4 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 relative">
                <Radio className="w-6 h-6 text-red-500 animate-pulse" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111111] rounded-full animate-ping" />
              </div>
              
              <div className="flex-1 min-w-0 text-right" dir="rtl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">
                    مباشر الآن
                  </span>
                  {activeVoiceCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-white/50">
                      <Users className="w-3 h-3" />
                      {activeVoiceCount}
                    </span>
                  )}
                </div>
                <h4 className="text-white font-bold truncate text-sm">{liveEvent.title}</h4>
                <p className="text-white/50 text-xs truncate mt-0.5">{liveEvent.description}</p>
              </div>

              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#5865F2] group-hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
