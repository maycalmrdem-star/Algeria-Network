"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Shield, Users, Gamepad2, Mic, Code, Trophy } from "lucide-react";
import { MagicCard } from "./ui/magic-card";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "مجتمع متفاعل",
    desc: "آلاف الأعضاء يتشاركون الاهتمامات ويبنون صداقات حقيقية يومياً.",
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "ألعاب وترفيه",
    desc: "بطولات، تنسيق فرق، ونقاشات حول أحدث الألعاب والرياضات الإلكترونية.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "تطوير وتقنية",
    desc: "مجتمع مطورين نشط: أسئلة برمجية، مشاريع مفتوحة المصدر وفرص عمل.",
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "قنوات صوتية",
    desc: "تحدث مباشرةً مع أعضاء المجتمع في قنوات نقية ومنظمة.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "بيئة آمنة",
    desc: "إشراف صارم ونظام قواعد واضح لضمان بيئة محترمة ومناسبة للجميع.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "مكافآت وإنجازات",
    desc: "نظام نقاط متكامل، رتب حصرية، وجوائز للأعضاء الأكثر تفاعلاً.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const Features = () => {
  return (
    <section className="relative py-32 overflow-hidden t-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 t-text-primary">
            صُمم ليكون أفضل مكان لك.
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed t-text-secondary">
            كل ما تحتاجه للتواصل، اللعب، والتعلم في بيئة واحدة متكاملة ومريحة.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={container} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={item}>
              <div className="h-full group">
                <MagicCard 
                  gradientColor="rgba(255,255,255,0.08)" 
                  gradientOpacity={1} 
                  className="h-full p-8 glass-mono transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 t-bg-secondary t-border t-text-primary shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 tracking-tight t-text-primary">
                    {f.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed t-text-secondary">
                    {f.desc}
                  </p>
                </MagicCard>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
