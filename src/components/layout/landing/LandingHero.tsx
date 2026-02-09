import { Link } from "react-router-dom";
import { motion, MotionValue } from "framer-motion";
import { Play } from "lucide-react";

interface LandingHeroProps {
  heroRef: React.RefObject<HTMLDivElement>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export const LandingHero = ({ heroRef, opacity, scale }: LandingHeroProps) => {
  return (
    <section ref={heroRef} className="pt-32 pb-20 md:pt-48 md:pb-40 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] mb-8 md:mb-12 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          Cognition Agent
        </motion.div>

        <motion.div style={{ opacity, scale }}>
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-black leading-[0.9] tracking-[-0.05em] mb-8 md:mb-12 max-w-6xl mx-auto">
            {["The", "Intelligence", "Layer."].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-700 via-blue-600 to-blue-800 bg-size-[200%_auto] animate-gradient-x drop-shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              {["Master", "Any", "Topic."].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>
        </motion.div>

        <motion.p
          style={{ opacity }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed tracking-tight px-4"
        >
          Cognito is an AI-powered educational platform for self-directed
          learners. Transform YouTube videos, PDFs, and any documentation into
          personalized lessons with your AI study partner, Ajibade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full h-14 px-10 rounded-2xl cursor-pointer bg-blue-700 text-white font-black text-lg hover:bg-blue-900 transition-all active:scale-95 border-t border-white/10 active:bg-blue-900">
              Start Learning
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full h-14 px-10 rounded-2xl cursor-pointer border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-200 hover:border-stone-700 dark:hover:bg-white/10 transition-all active:scale-95 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:bg-slate-200 dark:active:bg-white/10">
              <Play className="w-3 h-3 fill-current" />
              Watch Overview
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
