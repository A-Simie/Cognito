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
    title: "Video Intelligence",
    description:
      "Transform passive viewing into active learning. Cognito breaks down complex videos into manageable concepts with interactive dialogue.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description:
      "Process hundreds of pages in seconds. Extract insights and clarify complex segments instantly.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Target,
    title: "Adaptive Learning",
    description:
      "Master any subject. Cognito architects a progressive learning path tailored to your current knowledge for maximum efficiency.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
];

const WORKFLOW_STEPS = [
  {
    n: "01",
    t: "Ingestion",
    d: "Paste links or upload documents. Cognito analyzes the structure and creates a localized knowledge base.",
    icon: Activity,
  },
  {
    n: "02",
    t: "Synthesis",
    d: "Interact with your material. Ask questions and bridge knowledge gaps through natural dialogue.",
    icon: Brain,
  },
  {
    n: "03",
    t: "Mastery",
    d: "Track progress through validated assessments and automated reviews to ensure long-term retention.",
    icon: BookOpen,
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02040c] text-slate-900 dark:text-white selection:bg-blue-500/30 font-['Outfit'] overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#02040c]" />

        <div className="absolute inset-0 opacity-40 dark:opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] blur-[140px]" />
          <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.08)_0%,transparent_70%)] blur-[160px]" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.18)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.06)_0%,transparent_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.12)_0%,transparent_100%)]" />

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
        <section ref={heroRef} className="pt-32 pb-10 md:pt-48 md:pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] mb-8 md:mb-12 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Next-Generation Learning
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
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 md:mt-32 max-w-5xl mx-auto px-4 relative group"
          >
            <div className="relative p-1 bg-linear-to-b from-slate-200 dark:from-white/10 to-transparent rounded-3xl md:rounded-[40px] border border-slate-100 dark:border-white/5">
              <div className="bg-slate-50 dark:bg-[#05070a]/80 backdrop-blur-3xl rounded-[28px] md:rounded-[36px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col min-h-[400px] lg:aspect-16/10">
                <div className="h-10 border-b border-slate-200 dark:border-white/5 flex items-center px-4 md:px-6 gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="ml-4 h-5 w-48 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center px-3 gap-2">
                    <Lock className="w-2 h-2 text-slate-400" />
                    <div className="w-20 h-1 rounded-full bg-slate-300/50 dark:bg-white/10" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 p-4 flex flex-col gap-4">
                    <div className="p-3 rounded-xl bg-blue-600/5 border border-blue-500/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="w-16 h-2 bg-blue-600/20 rounded-full" />
                          <div className="w-10 h-1 bg-blue-600/10 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full" />
                        <div className="w-3/4 h-1 bg-slate-200 dark:bg-white/5 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-3 px-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded bg-slate-200 dark:bg-white/5" />
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-10 flex flex-col gap-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.03),transparent)]" />

                    <div className="relative z-20 space-y-3 pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0, x: -10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex gap-2 max-w-[240px]"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-3 rounded-2xl rounded-bl-none shadow-xl">
                          <p className="text-[9px] font-bold leading-relaxed opacity-90">
                            I've analyzed the PDF. Ready to start the synthesis?
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                        className="flex gap-2 max-w-[200px] ml-auto"
                      >
                        <div className="bg-blue-600 p-3 rounded-2xl rounded-br-none shadow-xl border border-blue-500">
                          <p className="text-[9px] font-bold text-white">
                            Yes, focus on the summary first.
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0 border border-slate-300 dark:border-white/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-white/40" />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 4.5, duration: 0.5 }}
                        className="flex gap-2 max-w-[260px]"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-3 rounded-2xl rounded-bl-none shadow-xl">
                          <div className="flex gap-1 mb-1">
                            <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" />
                            <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                          </div>
                          <p className="text-[9px] font-bold leading-relaxed opacity-90">
                            Perfect. Generating cross-modal links from YouTube
                            now...
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="relative z-10 space-y-6 opacity-40">
                      <div className="space-y-3">
                        <div className="w-32 h-2 bg-blue-600/40 rounded-full" />
                        <div className="w-full h-4 bg-slate-900 dark:bg-white rounded-full opacity-10" />
                        <div className="w-2/3 h-4 bg-slate-900 dark:bg-white rounded-full opacity-10" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-4/3 rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center">
                          <Play className="w-8 h-8 text-blue-600/20" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex-1 rounded-2xl bg-blue-600/5 border border-blue-500/10 p-4">
                            <Brain className="w-4 h-4 text-blue-600 mb-2" />
                            <div className="space-y-1">
                              <div className="w-full h-1.5 bg-blue-600/20 rounded-full" />
                              <div className="w-5/6 h-1.5 bg-blue-600/20 rounded-full" />
                            </div>
                          </div>
                          <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 flex items-center px-4 gap-3 shadow-sm relative z-20">
                      <div className="w-48 h-2 bg-slate-200 dark:bg-white/5 rounded-full" />
                      <div className="ml-auto w-10 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
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
          className="py-24 md:py-40 px-6 relative bg-slate-50/50 dark:bg-[#05070a]/50 border-y border-slate-100 dark:border-white/5"
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
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-sky-500">
                  Ecosystem.
                </span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                Autonomous AI modules that convert passive information into
                living, interactive knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-[240px]">
              {/* Feature 1: Topic Tutor - Large Square */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase leading-none tracking-tight">
                    Topic
                    <br />
                    Tutor
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    AI generates personalized lessons on any topic you want to
                    learn, architecting custom curriculum instantly.
                  </p>
                </div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
              </motion.div>

              {/* Feature 2: YouTube Tutor - Wide */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[2.5rem] bg-[#f8fafc] dark:bg-blue-900/10 border border-slate-200 dark:border-blue-500/10 p-10 flex flex-col md:flex-row gap-8 items-center shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="flex-1 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">
                    YouTube Intelligence
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Transform any video into an interactive learning experience
                    with AI-guided explanations and real-time breakdowns.
                  </p>
                </div>
                <div className="w-full md:w-1/3 aspect-video rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Play className="w-4 h-4 text-slate-500 fill-current" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: PDF Tutor - Small */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                    PDF Tutor
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Upload documents and get AI-powered summaries, explanations,
                    and interactive lessons.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4: Ajibade - Wide/Medium */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-10 flex flex-col justify-between shadow-xl shadow-blue-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase text-white tracking-tight">
                    Ajibade AI
                  </h3>
                  <p className="text-sm text-blue-50/80 font-medium leading-relaxed">
                    Your personal AI tutor available during lessons for
                    real-time clarifications and natural dialogue.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-8">
                  <ArrowUpRight className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </motion.div>

              {/* Feature 5: Quizzes - Vertical */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                    Adaptive Quizzes
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    AI-generated quizzes tailored to your learning progress to
                    ensure validated mastery.
                  </p>
                </div>
              </motion.div>

              {/* Feature 6: Analytics - Wide */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-6 lg:col-span-8 cursor-pointer group relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-900 border border-slate-800 p-10 flex flex-col md:flex-row gap-8 items-center shadow-2xl transition-all"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase text-white tracking-tight">
                    Progress Analytics
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Monitor learning streaks, total minutes spent learning, and
                    your global ranking in real-time.
                  </p>
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-32 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-end p-2 gap-2"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${20 + i * 20}%` }}
                        className="w-full bg-blue-500 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature 7: Real-time - Small */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-6 lg:col-span-4 group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                    Real-time Updates
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
          className="py-10 md:py-20 px-6 border-t border-slate-100 dark:border-white/5"
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
              <div className="h-px flex-1 bg-slate-100 dark:bg-white/5 mx-12 hidden lg:block" />
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500">
                Features
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

        <section className="py-20 md:py-40 px-6 bg-slate-50/50 dark:bg-white/1 border-y border-slate-100 dark:border-white/5 text-center">
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
                <img
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=ajibade"
                  alt="Ajibade"
                />
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
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/50 to-transparent -translate-x-1/2 hidden md:block" />

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

      <footer className="py-20 md:py-32 px-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight uppercase">
                  Cognito
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                  Platform
                </p>
                <div className="flex flex-col gap-4 text-sm font-bold tracking-tight text-slate-500">
                  <a
                    href="/#features"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="/#ecosystem"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Ecosystem
                  </a>
                  <a
                    href="/#workflow"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Workflow
                  </a>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                  Institutional
                </p>
                <div className="flex flex-col gap-4 text-sm font-bold tracking-tight text-slate-500">
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 md:mt-24 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
              © {new Date().getFullYear()} Cognito
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
