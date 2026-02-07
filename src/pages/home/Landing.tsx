import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  GraduationCap,
  Play,
  FileText,
  ChevronRight,
  Menu,
  X,
  Activity,
  BookOpen,
  Brain,
  Zap,
  Target,
  Sparkles,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils/utils";

const FEATURES = [
  {
    icon: Play,
    title: "Semantic Video Intelligence",
    description:
      "Transmute passive consumption into active dialogue. Query moments, extract visual models, and synthesize hours of footage into seconds of insight.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: FileText,
    title: "Contextual Fabric",
    description:
      "Weave disparate data sources—PDFs, papers, lectures—into a unified knowledge graph. Identify latent connections and architect a holistic understanding.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Target,
    title: "Precision Curricula",
    description:
      "Dynamic paths that evolve in real-time. Our engine maps your neural proficiency, targeting knowledge gaps with surgical precision to ensure retention.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Brain,
    title: "Socratic Core",
    description:
      "Interact with an AI that challenges you. Strengthen mental models through recursive challenge-response cycles designed to fortify understanding.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Activity,
    title: "Swarm Analytics",
    description:
      "Benchmark against a global neural network of learners. Visualize your trajectory relative to the cohort and identify vectors for accelerated mastery.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: BookOpen,
    title: "Deep Retention",
    description:
      "Algorithmic reinforcement that predicts memory decay. We reinject key concepts at the precise moment of forgetting to crystalize long-term knowledge.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
];

const WORKFLOW_STEPS = [
  {
    n: "01",
    t: "Acquisition",
    d: "Paste raw links or upload research. Cognito's neural engine builds a contextual knowledge landscape instantly.",
    icon: Activity,
  },
  {
    n: "02",
    t: "Synthesis",
    d: "Engage with your intelligence layer. Bridge comprehension gaps through structured, responsive dialogue with any material.",
    icon: Brain,
  },
  {
    n: "03",
    t: "Retention",
    d: "Validate and crystalize understanding through adaptive assessments designed for long-term neural retention.",
    icon: BookOpen,
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoStatus, setDemoStatus] = useState<"extracting" | "active">(
    "extracting",
  );
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const innerMockupY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const ecoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ecoScroll } = useScroll({
    target: ecoRef,
    offset: ["start end", "end start"],
  });

  const ecoY1 = useTransform(ecoScroll, [0, 1], [0, -60]);
  const ecoY2 = useTransform(ecoScroll, [0, 1], [0, -30]);
  const ecoY3 = useTransform(ecoScroll, [0, 1], [0, -80]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02040c] text-slate-900 dark:text-white selection:bg-blue-500/30 font-['Outfit'] overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#02040c]" />

        <div className="absolute inset-0 opacity-10 dark:opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] blur-[140px]" />
          <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.08)_0%,transparent_70%)] blur-[160px]" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_100%)] dark:bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.18)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.12)_0%,transparent_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[6rem_6rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-6 transition-all duration-300",
          scrolled ? "py-3 md:py-4" : "",
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto flex items-center px-6 py-2.5 rounded-full border transition-all duration-700",
            scrolled
              ? "bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl"
              : "bg-transparent border-transparent shadow-none",
          )}
        >
          <div className="flex-1 flex justify-start">
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-3 group shrink-0"
            >
              <div className="w-8 h-8 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm md:text-base font-black tracking-tight uppercase">
                Cognito
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            <a
              href="/#ecosystem"
              className="hover:text-blue-600 transition-colors"
            >
              Ecosystem
            </a>
            <a
              href="/#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="/#workflow"
              className="hover:text-blue-600 transition-colors"
            >
              Workflow
            </a>
          </nav>

          <div className="flex-1 flex items-center justify-end gap-1 md:gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center">
              <Link to="/signup">
                <Button className="h-10 px-6 rounded-full bg-blue-600 dark:bg-white text-white dark:text-white font-black text-[10px] uppercase tracking-wider hover:scale-105 transition-all border-none">
                  Get Started
                </Button>
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-[#02040a]/95 backdrop-blur-2xl pt-32 px-10 md:hidden"
          >
            <nav className="flex flex-col gap-10">
              {[
                { t: "Ecosystem", h: "/#ecosystem" },
                { t: "Features", h: "/#features" },
                { t: "Workflow", h: "/#workflow" },
              ].map((item) => (
                <a
                  key={item.t}
                  href={item.h}
                  className="text-5xl font-black tracking-tighter hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.t}
                </a>
              ))}
              <div className="pt-10 border-t border-slate-200 dark:border-white/10 flex flex-col">
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-16 text-xl bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
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
              learners. Transform YouTube videos, PDFs, and any documentation
              into personalized lessons with your AI study partner, Ajibade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5"
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="w-full h-14 px-10 rounded-2xl cursor-pointer bg-blue-700 text-white font-black text-lg hover:bg-blue-900 transition-all border-t border-white/10">
                  Start Learning
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full h-14 px-10 rounded-2xl cursor-pointer border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
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
                            {[
                              "Chain Rule",
                              "Backprop",
                              "Neurons",
                              "Weights",
                            ].map((tag, i) => (
                              <div
                                key={i}
                                className="px-2 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter"
                              >
                                {tag}
                              </div>
                            ))}
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
                              Based on the video at 04:22, backpropagation is
                              the core engine here. Ready to test your intuition
                              on the chain rule?
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
                              Synthesizing the visual layer from page 12...
                              done. What happens if the weight at node A drops
                              to zero?
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
                              That's the &quot;Vanishing Gradient&quot; problem.
                              You just derived why we need ReLU functions.
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

        <section
          id="ecosystem"
          ref={ecoRef}
          className="pt-24 pb-32 md:pt-32 md:pb-56 px-6 relative bg-slate-50/50 dark:bg-[#05070a]/50 border-b border-slate-100 dark:border-white/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
              >
                <Brain className="w-3.5 h-3.5" />
                The Intelligence Layer
              </motion.div>
              <h2 className="text-4xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                Cognitive Learning <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-sky-400 animate-gradient-x">
                  Ecosystem.
                </span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Autonomous modules designed to reconstruct passive data streams
                into living, interactive expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 md:gap-8 lg:gap-10">
              {/* Feature 1: Topic Tutor - Large Square */}
              <motion.div
                style={{ y: ecoY1 }}
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all min-h-[300px] md:min-h-[350px]"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 uppercase leading-none tracking-tight">
                    Topic
                    <br />
                    Architect
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Generate personalized, hierarchical lessons on any subject,
                    tailored specifically to your existing mental models.
                  </p>
                </div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
              </motion.div>

              {/* Feature 2: YouTube Tutor - Wide */}
              <motion.div
                style={{ y: ecoY2 }}
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-[#f8fafc] dark:bg-blue-900/10 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-10 items-center shadow-sm hover:shadow-2xl transition-all min-h-[300px] md:min-h-[350px]"
              >
                <div className="flex-1 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center mb-8 shadow-lg shadow-red-500/20">
                    <Play className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                    Video Intelligence
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Cognito decodes video data streams into navigable knowledge
                    structures, enabling real-time dialogue with any content.
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
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all min-h-[300px] md:min-h-[280px]"
              >
                <div className="w-14 h-14 rounded-xl bg-sky-500 flex items-center justify-center mb-8">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                    Neural Synthesis
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Upload complex research or textbooks and watch as they are
                    reconstructed into interactive tutored sessions.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4: Ajibade - Wide/Medium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-blue-600 p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-10 shadow-xl shadow-blue-500/20 transition-all min-h-[300px] md:min-h-[280px]"
              >
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase text-white tracking-tight">
                    Ajibade Co-Pilot
                  </h3>
                  <p className="text-sm text-blue-50/80 font-medium leading-relaxed">
                    Your cognitive co-pilot. Ajibade doesn't just answer; it
                    mentors, challenging assumptions and bridging skill gaps.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-10">
                  <ArrowUpRight className="w-7 h-7 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </motion.div>

              {/* Feature 5: Quizzes - Vertical */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all min-h-[300px]"
              >
                <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center mb-8">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                    Adaptive Quizzes
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    AI-generated quizzes tailored to your learning progress to
                    ensure validated mastery.
                  </p>
                </div>
              </motion.div>

              {/* Feature 6: Analytics - Small Square */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-6 md:p-12 flex flex-col justify-between shadow-2xl transition-all min-h-[300px]"
              >
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center mb-8">
                    <Activity className="w-7 h-7 text-white" />
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

              {/* Feature 7: Real-time - Small */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="md:col-span-6 lg:col-span-4 group cursor-pointer relative overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all min-h-[300px]"
              >
                <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center mb-8">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                    Real-time Protocol
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    WebSocket-powered live lesson sessions for seamless
                    bidirectional communication.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-32 md:py-56 px-6 relative border-t border-slate-100 dark:border-white/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 leading-tight tracking-tight">
                  Structured for <br /> efficiency.
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed tracking-tight">
                  Specialized modules designed to bridge the gap between
                  information and understanding.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "group relative p-10 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 hover:bg-white dark:hover:bg-white/2 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/20",
                    feature.className,
                  )}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-10px] group-hover:translate-y-[10px] transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 flex items-center justify-center mb-10 relative">
                      {/* Premium Glassy Icon Design */}
                      <div className="absolute inset-0 bg-blue-500/5 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-inner" />
                      <div className="absolute -inset-1 bg-blue-600/10 rounded-[20px] blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <feature.icon className="w-7 h-7 text-blue-600 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <h3 className="text-2xl font-black mb-4 tracking-[-0.02em] leading-none">
                      {feature.title}
                    </h3>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Aesthetic Background Detail */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6 bg-slate-50/50 dark:bg-white/1 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight leading-tight">
              "Cognito helps you build a solid mental model of the world's most
              complex topics through structured dialogue."
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1 overflow-hidden">
                <img src="./vite.svg" alt="Ajibade" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest leading-none">
                  Ajibade AI
                </p>
                <p className="text-[9px] text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase mt-1">
                  Core Intelligence
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="workflow"
          className="py-32 md:py-64 px-6 relative overflow-hidden"
        >
          {/* Background Narrative: The Void */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600 mb-6"
            >
              The Synthesis Protocol
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-black mb-24 leading-[0.85] tracking-tight">
              Information <br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-slate-400 to-slate-900 dark:from-white dark:to-white/20">
                Refined.
              </span>
            </h2>

            <div className="relative space-y-40">
              {/* The Signal Stream (Vertical Line) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/50 to-transparent -translate-x-1/2" />

              {WORKFLOW_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative flex flex-col items-center group"
                >
                  {/* The "Crystal" - A bespoke geometric representation of the step */}
                  <div className="relative mb-16">
                    <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative">
                      {/* Custom Geometric Shapes instead of generic icons */}
                      {i === 0 && (
                        <div className="w-full h-full border border-blue-500/20 rotate-45 flex items-center justify-center group-hover:rotate-135 transition-transform duration-1000">
                          <div className="w-1/2 h-1/2 border border-blue-500/40" />
                        </div>
                      )}
                      {i === 1 && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-full h-px bg-blue-500/30 absolute rotate-45" />
                          <div className="w-full h-px bg-blue-500/30 absolute -rotate-45" />
                          <div className="w-12 h-12 rounded-full border border-blue-500/60 bg-blue-500/5 animate-pulse" />
                        </div>
                      )}
                      {i === 2 && (
                        <div className="w-full h-full flex items-center justify-center">
                          {[...Array(3)].map((_, j) => (
                            <div
                              key={j}
                              className="absolute w-16 h-16 border-t border-l border-blue-500/40"
                              style={{
                                transform: `rotate(${j * 120}deg) translateY(-8px) rotate(-${j * 120}deg)`,
                              }}
                            />
                          ))}
                          <div className="w-4 h-4 bg-blue-600 rotate-45 shadow-[0_0_20px_rgba(37,99,235,1)]" />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-black text-blue-600/40 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                          {step.n}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-lg">
                    <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                      {step.t}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed tracking-tight text-center">
                      {step.d}
                    </p>
                  </div>

                  {/* Connection Indicator */}
                  {i !== WORKFLOW_STEPS.length - 1 && (
                    <div className="mt-20 flex flex-col items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500/20" />
                      <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                      <div className="w-1 h-1 rounded-full bg-blue-500/60" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 px-6 md:mb-12">
          <div className="max-w-4xl mx-auto rounded-3xl md:rounded-[48px] bg-slate-900 p-8 md:p-16 text-center relative overflow-hidden group border border-slate-800 dark:border-blue-500/20 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-8 md:mb-10 max-w-3xl mx-auto">
                Master any domain.
              </h2>
              <p className="text-base md:text-lg text-blue-100/60 font-medium mb-10 md:mb-12 max-w-lg mx-auto tracking-tight leading-relaxed">
                Join students and researchers worldwide using Cognito to
                redefine their learning potential.
              </p>
              <Link to="/signup" className="inline-block w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 rounded-2xl bg-blue-600 text-white font-black text-lg md:text-xl shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all border-none">
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-20 md:py-32 px-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#02040c]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                  Cognito
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Redefining the architecture of human knowledge acquisition
                through neural synthesis and adaptive mastery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                  Platform
                </p>
                <div className="flex flex-col gap-4 text-sm font-bold tracking-tight text-slate-500 dark:text-slate-400">
                  <a
                    href="#features"
                    className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#ecosystem"
                    className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    Ecosystem
                  </a>
                  <a
                    href="#workflow"
                    className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    Workflow
                  </a>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                  Legal
                </p>
                <div className="flex flex-col gap-4 text-sm font-bold tracking-tight text-slate-500 dark:text-slate-400">
                  <Link
                    to="/privacy"
                    className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 md:mt-24 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Cognito Inc.
            </p>
            <div className="flex items-center gap-6">
              {/* Socials or extra links could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
