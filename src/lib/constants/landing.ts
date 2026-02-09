import {
  Play,
  FileText,
  Target,
  Brain,
  Activity,
  BookOpen,
} from "lucide-react";
import { Feature, WorkflowStep } from "@/lib/types/landing";

export const FEATURES: Feature[] = [
  {
    icon: Play,
    title: "Video Learning",
    description:
      "Transform passive watching into active understanding. Turn YouTube videos into interactive lessons with summaries and Q&A.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: FileText,
    title: "Smart Study Materials",
    description:
      "Upload PDFs, notes, or slides. We organize everything into a clear, searchable knowledge base for your studies.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Target,
    title: "Personalized Path",
    description:
      "Stop wasting time on what you already know. Build a custom learning path that targets exactly what you need to master.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Brain,
    title: "AI Tutor",
    description:
      "Meet Ajibade, your personal tutor. It doesn't just give answers—it guides you to the solution through thoughtful questions.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: Activity,
    title: "Progress Insights",
    description:
      "Visualize your growth. Track your study streaks, quiz performance, and mastery levels to stay motivated.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
  {
    icon: BookOpen,
    title: "Smart Review",
    description:
      "Never forget what you've learned. Our spaced repetition system reminds you to review key concepts at the perfect time.",
    gradient: "from-blue-600 to-blue-700",
    className: "",
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    n: "01",
    t: "Import",
    d: "Paste a YouTube link or upload your PDF notes. We instantly organize everything for you.",
    icon: Activity,
  },
  {
    n: "02",
    t: "Learn",
    d: "Chat with your content. Ask questions, get summaries, and clarify difficult concepts.",
    icon: Brain,
  },
  {
    n: "03",
    t: "Master",
    d: "Take adaptive quizzes to test your knowledge and ensure you never forget what you learned.",
    icon: BookOpen,
  },
];
