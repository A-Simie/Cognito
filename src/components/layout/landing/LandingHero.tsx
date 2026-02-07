import { Link } from "react-router-dom";
import { motion, MotionValue } from "framer-motion";
import { Play, Zap, Sparkles, Lock, FileText, Brain } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { DemoStatus } from "@/lib/types/landing";

interface LandingHeroProps {
  heroRef: React.RefObject<HTMLDivElement>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  mockupY: MotionValue<number>;
  innerMockupY: MotionValue<number>;
  demoStatus: DemoStatus;
  setDemoStatus: (status: DemoStatus) => void;
}

export const LandingHero = ({
  heroRef,
  opacity,
  scale,
  mockupY,
  innerMockupY,
  demoStatus,
  setDemoStatus,
}: LandingHeroProps) => {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed tracking-tight px-4"
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
            <button className="w-full h-14 px-10 rounded-2xl cursor-pointer bg-blue-700 text-white font-black text-lg hover:bg-blue-900 transition-all active:scale-95 border-t border-white/10">
              Start Learning
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full h-14 px-10 rounded-2xl cursor-pointer border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <Play className="w-3 h-3 fill-current" />
              Watch Overview
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={{ y: mockupY }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onViewportEnter={() => {
          setTimeout(() => setDemoStatus("active"), 2000);
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-32 md:mt-20 max-w-5xl mx-auto px-4 relative group"
      >
        <div className="relative p-1 bg-linear-to-b from-slate-200 dark:from-white/10 to-transparent rounded-3xl md:rounded-[40px] border border-slate-100 dark:border-white/5">
          <div className="bg-slate-50 dark:bg-[#05070a]/80 backdrop-blur-3xl rounded-[28px] md:rounded-[36px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col min-h-[500px] lg:aspect-16/10">
            {/* Mac Header Decorations */}
            <div className="h-12 border-b border-slate-200 dark:border-white/5 flex items-center px-6 gap-2 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
              </div>
              <div className="ml-10 h-6 w-64 rounded-xl bg-slate-200/50 dark:bg-white/5 flex items-center px-3 gap-2 border border-slate-300 dark:border-white/10">
                <Lock className="w-2.5 h-2.5 text-slate-400" />
                <div className="text-[9px] font-bold text-slate-400/80 tracking-tight">
                  cognition-agent.ai
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Navigation Context */}
              <motion.div
                style={{ y: innerMockupY }}
                className="hidden md:flex w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 p-6 flex-col gap-6 bg-slate-100/30 dark:bg-white/2"
              >
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Resources
                  </p>
                  {[
                    {
                      icon: Play,
                      label: "Neural Networks 101",
                      color: "text-red-500",
                      active: true,
                    },
                    {
                      icon: FileText,
                      label: "Backprop_Paper.pdf",
                      color: "text-blue-500",
                    },
                    {
                      icon: Brain,
                      label: "Vector Math Notes",
                      color: "text-purple-500",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-xl transition-all",
                        item.active
                          ? "bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10"
                          : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg bg-current/10 flex items-center justify-center",
                          item.color,
                        )}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold truncate">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">
                      Level 12
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Chat & Workspace Area */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-white/50 dark:bg-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />

                <div className="flex-1 p-3 md:p-8 flex flex-col gap-3 md:gap-6">
                  {/* Active Learning Component */}
                  <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 h-48 mb-4">
                    <div className="rounded-2xl overflow-hidden relative group border border-slate-200 dark:border-white/10 shadow-lg transition-transform hover:scale-[1.02]">
                      <img
                        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                        className="w-full h-full object-cover opacity-80"
                        alt="AI Visualization"
                      />
                      <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-widest">
                        Live Stream Synthesis
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/10 p-4 md:p-5 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            demoStatus === "active"
                              ? "bg-green-500"
                              : "bg-blue-500",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-tight transition-colors duration-500",
                            demoStatus === "active"
                              ? "text-green-500"
                              : "text-blue-500",
                          )}
                        >
                          {demoStatus === "active"
                            ? "Session Active"
                            : "Ajibade Extracting"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Chain Rule", "Backprop", "Neurons", "Weights"].map(
                          (tag, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter"
                            >
                              {tag}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat Thread */}
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col overflow-y-auto pb-2 min-h-0 relative scrollbar-hide">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-3 max-w-[85%]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none shadow-xl border-t border-r">
                        <p className="text-[12px] font-bold leading-relaxed text-slate-700 dark:text-slate-200">
                          Based on the video at 04:22, backpropagation is the
                          core engine here. Ready to test your intuition on the
                          chain rule?
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex gap-3 max-w-[80%] ml-auto justify-end"
                    >
                      <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-2xl shadow-blue-500/40 border border-blue-500 ring-1 ring-white/20">
                        <p className="text-[12px] font-bold text-white">
                          Yes, I'm ready. Use the diagram from the PDF!
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/20">
                        <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-white/40" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.0 }}
                      className="flex gap-3 max-w-[85%]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none shadow-xl border-t border-r">
                        <div className="flex gap-1.5 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <p className="text-[12px] font-bold leading-relaxed text-slate-700 dark:text-slate-200">
                          Synthesizing the visual layer from page 12... done.
                          What happens if the weight at node A drops to zero?
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.2 }}
                      className="flex gap-3 max-w-[80%] ml-auto justify-end"
                    >
                      <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-2xl shadow-blue-500/40 border border-blue-500 ring-1 ring-white/20">
                        <p className="text-[12px] font-bold text-white">
                          The signal dies? So the network stops learning
                          downstream?
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/20">
                        <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-white/40" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 4.2 }}
                      className="flex gap-3 max-w-[85%]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none shadow-xl border-t border-r">
                        <p className="text-[12px] font-bold leading-relaxed text-slate-700 dark:text-slate-200">
                          <span className="text-blue-600 dark:text-blue-400">
                            Correct.
                          </span>{" "}
                          That's the &quot;Vanishing Gradient&quot; problem. You
                          just derived why we need ReLU functions.
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Input Simulation */}
                  <div className="mt-auto h-14 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl flex items-center px-5 gap-4 shadow-sm border-t border-b shrink-0 z-20 relative">
                    <div className="flex-1 text-sm font-bold text-slate-400 dark:text-white/20">
                      Message Ajibade...
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform active:scale-95">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
