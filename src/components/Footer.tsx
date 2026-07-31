import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  المجتمع: ["قواعد السلوك", "ادعُ صديقاً", "نظام المكافآت"],
  الدعم: ["مركز المساعدة", "تواصل معنا", "الإبلاغ عن مشكلة"],
  قانوني: ["سياسة الخصوصية", "شروط الاستخدام", "سياسة الكوكيز"],
};

export const Footer = () => {
  return (
    <footer className="relative t-bg-primary pt-20 pb-10 border-t t-border overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#5865F2]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/server-icon.gif" alt="Algeria Network" className="w-10 h-10 rounded-xl object-cover shadow-[0_0_20px_rgba(88,101,242,0.5)]" />
              <span className="font-black t-text-primary text-lg">Algeria Network</span>
            </div>
            <p className="t-text-secondary text-sm leading-relaxed mb-6 font-light">
              أكبر مجتمع جزائري على ديسكورد. نبني معاً فضاءً رقمياً للشباب الجزائري.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border t-border t-bg-card flex items-center justify-center t-text-muted hover:t-text-primary hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="t-text-primary font-semibold text-sm tracking-[0.05em] mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link to={`/page/${encodeURIComponent(link.replace(/\s+/g, '-'))}`} className="t-text-secondary hover:t-text-primary text-sm transition-colors duration-200">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t t-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="t-text-muted text-xs">
            © {new Date().getFullYear()} Algeria Network. جميع الحقوق محفوظة.
          </p>
          <p className="t-text-muted text-xs">
            صُنع بـ ❤️ في الجزائر
          </p>
        </div>
      </div>
    </footer>
  );
};
