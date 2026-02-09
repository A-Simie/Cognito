import { useState, useEffect, forwardRef } from "react";
import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { Play, Zap, Lock, FileText, Cpu } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { DemoStatus } from "@/lib/types/landing";

interface LandingProductMockupProps {
  mockupY: MotionValue<number>;
  innerMockupY: MotionValue<number>;
  demoStatus: DemoStatus;
  setDemoStatus: (status: DemoStatus) => void;
}

interface Message {
  id: number;
  role: "ai" | "user";
  content: string | React.ReactNode;
}

const CHAT_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    content:
      "Based on the video at 04:22, backpropagation is the core engine here.",
  },
  {
    id: 2,
    role: "user",
    content: "Use the diagram from the PDF!",
  },
  {
    id: 3,
    role: "ai",
    content:
      "Synthesizing visual layer... What happens if weight at node A drops to zero?",
  },
  {
    id: 4,
    role: "user",
    content: "Signal dies?",
  },
  {
    id: 5,
    role: "ai",
    content: (
      <span>
        <span className="text-blue-600 dark:text-blue-400">Correct.</span>{" "}
        That's the "Vanishing Gradient" problem.
      </span>
    ),
  },
];

const MacHeader = () => (
  <div className="h-12 border-b border-slate-200 dark:border-white/5 flex items-center px-4 md:px-6 gap-2 shrink-0">
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
      <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
    </div>
    <div className="ml-4 md:ml-10 h-6 flex-1 max-w-[200px] md:max-w-72 rounded-xl bg-slate-200/50 dark:bg-white/5 flex items-center px-3 gap-2 border border-slate-300 dark:border-white/10 shadow-inner">
      <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
      <div className="text-[9px] font-bold text-slate-400/80 tracking-tight truncate">
        cognition-agent.ai
      </div>
    </div>
  </div>
);

const Sidebar = ({ innerMockupY }: { innerMockupY: MotionValue<number> }) => (
  <div className="hidden md:flex w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 flex-col bg-slate-100/30 dark:bg-white/2">
    <motion.div
      style={{ y: innerMockupY }}
      className="p-6 flex flex-col gap-6 h-full"
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
            icon: Cpu,
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
            <span className="text-[11px] font-bold truncate">{item.label}</span>
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
  </div>
);

const ActiveLearningCard = ({ demoStatus }: { demoStatus: DemoStatus }) => (
  <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 h-48 mb-4 shrink-0">
    <div className="rounded-2xl overflow-hidden relative group border border-slate-200 dark:border-white/10 shadow-lg transition-transform hover:scale-[1.02] active:scale-[1.02]">
      <img
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
        className="w-full h-full object-cover opacity-80"
        alt="AI Visualization"
      />
      <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center group-hover:scale-110 group-active:scale-110 transition-transform">
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
            demoStatus === "active" ? "bg-green-500" : "bg-blue-500",
          )}
        />
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-tight transition-colors duration-500",
            demoStatus === "active" ? "text-green-500" : "text-blue-500",
          )}
        >
          {demoStatus === "active" ? "Session Active" : "Ajibade Extracting"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Chain Rule", "Backprop", "Neurons", "Weights"].map((tag, i) => (
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
);

const ChatMessage = forwardRef<HTMLDivElement, { msg: Message }>(
  ({ msg }, ref) => (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
      className={cn(
        "flex gap-3 max-w-[85%]",
        msg.role === "user" ? "ml-auto justify-end max-w-[80%]" : "",
      )}
    >
      {msg.role === "ai" && (
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
          <img
            src="/vite.svg"
            className="w-5 h-5 object-contain"
            alt="AI Agent"
          />
        </div>
      )}

      <div
        className={cn(
          "p-3 md:p-4 rounded-2xl shadow-sm border",
          msg.role === "ai"
            ? "bg-white dark:bg-slate-800/90 backdrop-blur-xl border-slate-200 dark:border-white/5 rounded-tl-none"
            : "bg-linear-to-br from-blue-600 to-blue-700 border-blue-400/20 rounded-tr-none shadow-blue-500/20",
        )}
      >
        {msg.role === "ai" ? (
          <p className="text-[12px] font-bold leading-relaxed text-slate-700 dark:text-slate-200">
            {msg.content}
          </p>
        ) : (
          <p className="text-[12px] font-bold text-white">{msg.content}</p>
        )}
      </div>

      {msg.role === "user" && (
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-blue-400/50" />
        </div>
      )}
    </motion.div>
  ),
);
ChatMessage.displayName = "ChatMessage";

const InputArea = () => (
  <div className="mt-auto h-14 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-xl flex items-center px-5 gap-4 shadow-inner shrink-0 z-20 relative transition-colors hover:bg-white hover:dark:bg-white/10 active:bg-white dark:active:bg-white/10">
    <div className="flex-1 text-sm font-bold text-slate-400 dark:text-slate-500">
      Message Ajibade...
    </div>
    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-105 transition-all active:scale-95 group/send group-active/send:scale-105">
      <Zap className="w-4 h-4 text-white group-hover/send:rotate-12 group-active/send:rotate-12 transition-transform" />
    </div>
  </div>
);

export const LandingProductMockup = ({
  mockupY,
  innerMockupY,
  demoStatus,
  setDemoStatus,
}: LandingProductMockupProps) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      interval = setInterval(() => {
        if (currentIndex < CHAT_MESSAGES.length) {
          const nextMessage = CHAT_MESSAGES[currentIndex];
          if (nextMessage) {
            setVisibleMessages((prev) => {
              if (prev.some((m) => m.id === nextMessage.id)) return prev;
              return [...prev, nextMessage];
            });
          }
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2500);
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      style={{ y: mockupY }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        setTimeout(() => setDemoStatus("active"), 2000);
      }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto px-4 relative mt-10 group"
    >
      <div className="relative p-1 bg-linear-to-b from-slate-200 dark:from-white/10 to-transparent rounded-3xl md:rounded-[40px] border w-fit mx-auto border-slate-100 dark:border-white/5">
        <div className="bg-white/80 dark:bg-[#05070a]/90 backdrop-blur-3xl rounded-[28px] md:rounded-[36px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col h-[400px] md:h-auto md:min-h-[500px] lg:aspect-16/10 lg:max-h-[80vh]">
          <MacHeader />

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            <Sidebar innerMockupY={innerMockupY} />

            {/* Dynamic Chat & Workspace Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white/50 dark:bg-transparent min-h-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />

              <div className="flex-1 p-3 md:p-8 flex flex-col gap-3 md:gap-6 min-h-0">
                <ActiveLearningCard demoStatus={demoStatus} />

                {/* Chat Thread */}
                <div className="flex-1 overflow-hidden relative min-h-0">
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 space-y-4 md:space-y-6 mask-[linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {visibleMessages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <InputArea />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
