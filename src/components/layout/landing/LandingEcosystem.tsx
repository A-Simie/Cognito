import { motion, MotionValue } from "framer-motion";
import {
  GraduationCap,
  Play,
  FileText,
  Sparkles,
  ArrowUpRight,
  Target,
  Activity,
  Zap,
} from "lucide-react";
import { useIsMobile } from "@/lib/hooks/activity/useMediaQuery";

interface LandingEcosystemProps {
  ecoRef: React.RefObject<HTMLDivElement>;
  ecoY1: MotionValue<number>;
  ecoY2: MotionValue<number>;
  ecoY3: MotionValue<number>;
}

export const LandingEcosystem = ({
  ecoRef,
  ecoY1,
  ecoY2,
  ecoY3,
}: LandingEcosystemProps) => {
  const isMobile = useIsMobile();
  return (
    <section
      id="ecosystem"
      ref={ecoRef}
      className="pt-24 pb-32 md:pt-32 md:pb-56 px-6 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            Cognito Ecosystem
          </motion.div>
          <h2 className="text-4xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Everything needed to <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-sky-400 animate-gradient-x">
              learn anything.
            </span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            A complete suite of tools designed to turn any content into an
            interactive learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 md:gap-8 lg:gap-10">
          {/* Feature 1: Topic Tutor - Large Square */}
          <motion.div
            style={{ y: ecoY1 }}
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile
                ? { duration: 0.8, times: [0, 0.5, 1] }
                : { duration: 1 },
              y: isMobile
                ? { duration: 0.8, times: [0, 0.5, 1] }
                : { duration: 1 },
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-colors duration-300 min-h-[300px] md:min-h-[350px]"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-6 uppercase leading-none tracking-tight">
                Topic
                <br />
                Guide
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Generate clear, step-by-step lessons on any subject, tailored to
                what you already know.
              </p>
            </div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
          </motion.div>

          {/* Feature 2: YouTube Tutor - Wide */}
          <motion.div
            style={{ y: ecoY2 }}
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-[#f8fafc] dark:bg-blue-900/10 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col lg:flex-row gap-8 md:gap-10 items-center shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-colors duration-300 min-h-[300px] md:min-h-[350px]"
          >
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-8 shadow-lg shadow-red-500/20">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                Video Lessons
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Turn messy YouTube playlists into structured courses. Chat with
                videos to get answers instantly.
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-video rounded-3xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Play className="w-5 h-5 text-slate-500 fill-current" />
              </div>
            </div>
          </motion.div>

          {/* Feature 3: PDF Tutor - Small */}
          <motion.div
            style={{ y: ecoY3 }}
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-colors duration-300 min-h-[300px] md:min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center mb-8">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                Smart Notes
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Upload textbooks or research papers and turn them into
                interactive study sessions.
              </p>
            </div>
          </motion.div>

          {/* Feature 4: Ajibade - Wide/Medium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-blue-600 p-6 md:p-12 flex flex-col lg:flex-row items-start gap-8 md:gap-10 shadow-xl shadow-blue-500/20 transition-colors duration-300 min-h-[300px] md:min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 md:mb-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3 uppercase text-white tracking-tight">
                Ajibade AI Tutor
              </h3>
              <p className="text-sm text-blue-50/80 font-medium leading-relaxed">
                Your personal study companion. Ajibade helps you understand
                concepts, checks your work, and keeps you motivated.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-10">
              <ArrowUpRight className="w-7 h-7 text-white/40 group-hover:text-white transition-colors" />
            </div>
          </motion.div>

          {/* Feature 5: Quizzes - Vertical */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-colors duration-300 min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-8">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                Smart Quizzes
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Quizzes that adapt to your progress to ensure you truly master
                the material.
              </p>
            </div>
          </motion.div>

          {/* Feature 6: Analytics - Small Square */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-6 md:p-12 flex flex-col justify-between shadow-2xl transition-colors duration-300 min-h-[300px]"
          >
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-8">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase text-white tracking-tight">
                Analytics
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                Monitor streaks and global ranking.
              </p>
            </div>
            <div className="flex gap-4 items-end">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-24 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-end p-1.5 gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${20 + i * 20}%` }}
                    className="w-full bg-blue-500 rounded-md"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature 7: Live Sessions - Small Square */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{
              opacity: 1,
              scale: isMobile ? [1, 1.02, 1] : 1,
              y: isMobile ? [0, -8, 0] : 0,
              rotateX: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
              scale: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
              y: isMobile ? { duration: 0.8, times: [0, 0.5, 1] } : {},
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="md:col-span-6 lg:col-span-4 group cursor-pointer relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-colors duration-300 min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center mb-8">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                Live Sessions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Join interactive live lessons for real-time practice and
                feedback.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
