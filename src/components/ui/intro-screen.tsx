import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroScreenProps {
  onComplete: () => void;
}

const STORAGE_KEY = "algeria_network_intro_seen";
const DISCORD_BG = "#5865F2";

// Framer Motion version of Masked Slide Reveal
function MotionTextReveal({ 
  text, 
  fontSize, 
  onComplete 
}: { 
  text: string; 
  fontSize: number; 
  onComplete: () => void;
}) {
  const words = text.split(" ");
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      onAnimationComplete={onComplete}
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        hidden: {}
      }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: DISCORD_BG }}
    >
      <div 
        style={{
          fontSize,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          textAlign: "center",
          maxWidth: "90%",
          lineHeight: 1.1,
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: 1.15,
              marginRight: "0.28em",
            }}
          >
            <motion.span
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { 
                  y: "0%", 
                  opacity: 1, 
                  transition: { 
                    type: "spring", 
                    damping: 14, 
                    stiffness: 100, 
                    mass: 0.5 
                  } 
                }
              }}
              style={{ display: "inline-block" }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<"video" | "text" | "exit">("video");
  const [lineIndex, setLineIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const textLines = [
    { text: "Welcome to Algeria Network.", duration: 2500, fontSize: 72 },
    { text: "Gaming. Community. No Limits.", duration: 2500, fontSize: 60 },
    { text: "Get ready to join...", duration: 2000, fontSize: 44 },
  ];

  useEffect(() => {
    const desktop = window.innerWidth >= 1024;
    const seen = localStorage.getItem(STORAGE_KEY) === "true";
    setIsDesktop(desktop);
    setHasSeenIntro(seen);
    if (!desktop || seen) onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  const handleVideoEnd = () => {
    setPhase("text");
    setLineIndex(0);
  };

  const handleLineDone = () => {
    // Wait a bit after animation finishes to show the text, then move to next
    setTimeout(() => {
      if (lineIndex < textLines.length - 1) {
        setLineIndex((i) => i + 1);
      } else {
        setPhase("exit");
        localStorage.setItem(STORAGE_KEY, "true");
        setTimeout(onComplete, 900);
      }
    }, textLines[lineIndex].duration - 1000); // subtract approx animation time
  };

  const handleSkip = () => {
    setPhase("exit");
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(onComplete, 800);
  };

  if (!isDesktop || hasSeenIntro) return null;

  const currentLine = textLines[lineIndex];

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden"
        >
          {/* ── VIDEO PHASE ── */}
          <AnimatePresence>
            {phase === "video" && (
              <motion.div
                key="video-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full"
              >
                <video
                  ref={videoRef}
                  src="/images/vidssave.com Discord Logo Animation 1080P.mp4"
                  playsInline
                  autoPlay
                  muted 
                  onEnded={handleVideoEnd}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleSkip}
                  className="absolute top-6 right-6 z-20 px-5 py-2 rounded-full border border-white/20 bg-black/40 text-white/60 text-sm hover:bg-black/60 hover:text-white transition-all duration-300 backdrop-blur-sm font-mono"
                >
                  Skip →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TEXT PHASE ── */}
          <AnimatePresence mode="wait">
            {phase === "text" && (
              <motion.div
                key={`text-${lineIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                style={{ background: DISCORD_BG }}
              >
                <MotionTextReveal 
                  text={currentLine.text} 
                  fontSize={currentLine.fontSize} 
                  onComplete={handleLineDone}
                />

                {/* Progress dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {textLines.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === lineIndex ? 32 : 8,
                        opacity: i <= lineIndex ? 1 : 0.25,
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-2 rounded-full bg-white"
                      style={{ width: 8 }}
                    />
                  ))}
                </div>

                {/* Skip */}
                <button
                  onClick={handleSkip}
                  className="absolute top-6 right-6 z-20 px-5 py-2 rounded-full border border-white/30 bg-white/10 text-white/70 text-sm hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-sm font-mono"
                >
                  Skip →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

