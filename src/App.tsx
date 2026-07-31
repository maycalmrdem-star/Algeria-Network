import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import AppleHero from "./components/ui/apple-hero";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IntroScreen } from "./components/ui/intro-screen";

/* ── Lazy-loaded heavy sections ── */
const Features          = lazy(() => import("./components/Features").then(m => ({ default: m.Features })));
const EventsSection     = lazy(() => import("./components/EventsSection").then(m => ({ default: m.EventsSection })));
const TopUsersSection   = lazy(() => import("./components/TopUsersSection").then(m => ({ default: m.TopUsersSection })));
const RolesSection      = lazy(() => import("./components/RolesSection").then(m => ({ default: m.RolesSection })));
const AdminDashboard    = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Stats             = lazy(() => import("./components/Stats").then(m => ({ default: m.Stats })));
const WaitlistHero = lazy(() => import("./components/ui/waitlist-hero").then(module => ({ default: module.WaitlistHero })));
const VideoScrollReveal = lazy(() => import('./components/VideoScrollReveal').then(module => ({ default: module.VideoScrollReveal })));
const GamesGrid         = lazy(() => import("./components/GamesGrid").then(m => ({ default: m.GamesGrid })));
const Footer            = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const DiscoverMoreModal = lazy(() => import("./components/ui/discover-more-modal").then(m => ({ default: m.DiscoverMoreModal })));
const EventNotification = lazy(() => import("./components/EventNotification").then(m => ({ default: m.EventNotification })));
const CommunityFocusRail = lazy(() => import("./components/CommunityFocusRail").then(m => ({ default: m.CommunityFocusRail })));

function SectionFallback() {
  return <div className="h-32 animate-pulse bg-white/[0.02] rounded-2xl mx-6 my-4" />;
}

function HomePage() {
  const [isDiscoverModalOpen, setDiscoverModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref') === 'discord') {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'discord' })
      }).catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="t-bg-primary min-h-screen">
      <Navbar />

            <main>
              <AppleHero
                headline={{ line1: "مجتمعك الجزائري", line2: "على ديسكورد" }}
                subtitle="انضم إلى أكبر مجتمع جزائري على ديسكورد — ألعاب، تقنية، موسيقى، وتواصل بلا حدود."
                buttons={{
                  primary: {
                    label: "انضم الآن مجاناً",
                    onClick: () => window.open("https://discord.gg/34fqkXH6ts", "_blank"),
                  },
                  secondary: {
                    label: "اكتشف المزيد",
                    onClick: () => setDiscoverModalOpen(true),
                  },
                }}
              />


              <div id="features">
                <Suspense fallback={<SectionFallback />}><Features /></Suspense>
              </div>

              <div id="showcase">
                <Suspense fallback={<SectionFallback />}><EventsSection /></Suspense>
              </div>

              <div id="top-users">
                <Suspense fallback={<SectionFallback />}><TopUsersSection /></Suspense>
              </div>

              <div id="roles">
                <Suspense fallback={<SectionFallback />}><RolesSection /></Suspense>
              </div>

              <div id="games">
                <Suspense fallback={<SectionFallback />}><GamesGrid /></Suspense>
              </div>

              <div id="stats">
                <Suspense fallback={<SectionFallback />}><Stats /></Suspense>
              </div>

              <div id="join">
                <Suspense fallback={<SectionFallback />}><WaitlistHero /></Suspense>
              </div>

              <Suspense fallback={<SectionFallback />}>
                <VideoScrollReveal />
              </Suspense>

              <Suspense fallback={<SectionFallback />}>
                <CommunityFocusRail />
              </Suspense>
            </main>

            <Suspense fallback={null}><Footer /></Suspense>
            <Suspense fallback={null}>
              <DiscoverMoreModal isOpen={isDiscoverModalOpen} onClose={() => setDiscoverModalOpen(false)} />
            </Suspense>
            <Suspense fallback={null}>
              <EventNotification />
            </Suspense>
    </div>
  );
}

function GenericPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Format the ID to a readable title
  const title = id ? decodeURIComponent(id).replace(/-/g, ' ') : 'صفحة';

  return (
    <div className="t-bg-primary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 t-text-muted hover:t-text-primary transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
        
        <h1 className="text-3xl md:text-5xl font-bold t-text-primary mb-8">{title}</h1>
        
        <div className="prose prose-invert max-w-none t-text-secondary">
          <p className="text-lg leading-relaxed mb-6">
            أهلاً بك في صفحة {title}. هذه الصفحة قيد التطوير حالياً، وسنقوم بتحديثها قريباً لتوفير المعلومات الكاملة التي تحتاجها.
          </p>
          <div className="p-6 rounded-2xl border t-border bg-[#5865F2]/5 border-[#5865F2]/20">
            <h3 className="text-xl font-semibold t-text-primary mb-4">نبذة مختصرة</h3>
            <p>
              نحن في Algeria Network نحرص دائماً على توفير بيئة آمنة، منظمة، وممتعة لجميع اللاعبين والأعضاء في مجتمعنا على ديسكورد. 
              تهدف هذه الصفحة لتنظيم وتوضيح جميع الجوانب المتعلقة بـ "{title}" لضمان أفضل تجربة ممكنة.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/page/:id" element={<GenericPage />} />
        <Route path="/admin" element={<Suspense fallback={<SectionFallback />}><AdminDashboard /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
