import React from "react";
import { FocusRail, type FocusRailItem } from "./ui/focus-rail";

const DEMO_ITEMS: FocusRailItem[] = [
  {
    id: 1,
    title: "ألعاب وتحديات",
    description: "شارك في بطولات وألعاب ممتعة مع مجتمع جزائري شغوف بـ Gaming.",
    meta: "ترفيه • ألعاب",
    imageSrc: "/images/community/community_gaming_1785476091826.png",
    href: "https://discord.gg/34fqkXH6ts",
  },
  {
    id: 2,
    title: "غرف المذاكرة",
    description: "انضم إلى غرفنا الهادئة واستمتع ببيئة محفزة للدراسة والتركيز مع موسيقى Lo-Fi.",
    meta: "تعليم • تركيز",
    imageSrc: "/images/community/community_study_1785476103973.png",
    href: "https://discord.gg/34fqkXH6ts",
  },
  {
    id: 3,
    title: "دردشة وتعارف",
    description: "تعرف على أصدقاء جدد من مختلف ولايات الجزائر وتبادل معهم أطراف الحديث.",
    meta: "مجتمع • تواصل",
    imageSrc: "/images/community/community_chat_1785476115852.png",
    href: "https://discord.gg/34fqkXH6ts",
  },
  {
    id: 4,
    title: "فعاليات أسبوعية",
    description: "لا تفوت الفعاليات، المسابقات، والجوائز القيمة التي ننظمها باستمرار.",
    meta: "أحداث • جوائز",
    imageSrc: "/images/community/community_events_1785476124968.png",
    href: "https://discord.gg/34fqkXH6ts",
  },
  {
    id: 5,
    title: "غرف الاستماع للموسيقى",
    description: "استرخِ واستمع لأفضل المقاطع الموسيقية مع أصدقائك في غرف مخصصة.",
    meta: "موسيقى • استرخاء",
    imageSrc: "/images/community/community_music_1785476133339.png",
    href: "https://discord.gg/34fqkXH6ts",
  },
];

export function CommunityFocusRail() {
  return (
    <section className="w-full bg-black py-24 border-t border-white/5 relative z-10" id="explore">
      <div className="mb-16 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ماذا ينتظرك في مجتمعنا؟</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">تصفح أبرز النشاطات والغرف التي تجعل سيرفرنا الخيار الأفضل لك.</p>
      </div>

      <FocusRail 
        items={DEMO_ITEMS} 
        autoPlay={true} 
        loop={true} 
      />
    </section>
  );
}
