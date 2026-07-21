import { motion } from "framer-motion";
import { Brain, CheckCircle2, Lightbulb, Quote, Sparkles, Target, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGenerateInsights } from "@/lib/hooks/useInsights";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils/utils";

const reveal = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const priorityStyles = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export default function Insights() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: insights, mutate: generateInsights, isPending, error } = useGenerateInsights();

  const handleGenerate = () => {
    if (!user) return;
    generateInsights();
  };

  return (
    <AppLayout>
      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
        <motion.section {...reveal} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-dark to-primary p-8 md:p-10 text-white shadow-lg shadow-primary/20">
          <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> Powered by GPT-5.6
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">AI Study Insights</h1>
              <p className="mt-2 text-blue-100">Get a focused, personal study strategy from Ajibade based on your real learning progress.</p>
            </div>
            <Button onClick={handleGenerate} loading={isPending} disabled={!user} className="shrink-0 bg-white text-primary hover:bg-blue-50">
              <Brain className="h-5 w-5" /> {insights ? "Refresh Insights" : "Generate Insights"}
            </Button>
          </div>
        </motion.section>

        {error && <Card className="border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">We could not generate your insights. Please try again.</Card>}

        {!insights && !isPending && !error && (
          <Card className="p-10 text-center">
            <Brain className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Your personal study coach is ready</h2>
            <p className="mx-auto mt-2 max-w-lg text-gray-500 dark:text-gray-400">Generate an analysis of your classes, study habits, and next best actions.</p>
          </Card>
        )}

        {isPending && <Card className="p-10 text-center text-gray-500 dark:text-gray-400"><Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-primary" />Ajibade is reviewing your learning journey…</Card>}

        {insights && (
          <div className="space-y-6">
            <motion.section {...reveal} transition={{ delay: 0.05 }}><Card className="p-6 md:p-8"><div className="flex gap-4"><div className="rounded-xl bg-primary/10 p-3 text-primary"><Brain /></div><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Overall Assessment</h2><p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{insights.overallAssessment}</p></div></div></Card></motion.section>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.section {...reveal} transition={{ delay: 0.1 }}><Card className="h-full p-6"><h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"><CheckCircle2 className="text-green-500" /> Strengths</h2><InsightList items={insights.strengths} marker="bg-green-500" /></Card></motion.section>
              <motion.section {...reveal} transition={{ delay: 0.15 }}><Card className="h-full p-6"><h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"><TriangleAlert className="text-amber-500" /> Areas to Improve</h2><InsightList items={insights.areasToImprove} marker="bg-amber-500" /></Card></motion.section>
            </div>

            <motion.section {...reveal} transition={{ delay: 0.2 }}><h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recommended next steps</h2><div className="grid gap-4 lg:grid-cols-3">{insights.recommendations.map((recommendation) => <Card key={recommendation.title} className="p-5"><span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", priorityStyles[recommendation.priority])}>{recommendation.priority} priority</span><h3 className="mt-4 font-bold text-gray-900 dark:text-white">{recommendation.title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{recommendation.description}</p></Card>)}</div></motion.section>

            <motion.section {...reveal} transition={{ delay: 0.25 }}><Card className="border-primary/20 bg-linear-to-r from-primary/10 to-blue-500/10 p-6 md:p-8"><div className="flex flex-col gap-4 md:flex-row md:items-start"><Target className="h-8 w-8 shrink-0 text-primary" /><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Weekly Plan</h2><p className="mt-2 text-gray-600 dark:text-gray-300">{insights.weeklyPlan.summary}</p><div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold"><span className="rounded-full bg-white/70 px-3 py-1.5 text-primary dark:bg-card-dark">{insights.weeklyPlan.dailyMinutes} minutes daily</span><span className="rounded-full bg-white/70 px-3 py-1.5 text-primary dark:bg-card-dark">Focus: {insights.weeklyPlan.focusArea}</span></div></div></div></Card></motion.section>

            <motion.section {...reveal} transition={{ delay: 0.3 }}><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"><Lightbulb className="text-yellow-500" /> Suggested Next Topics</h2><div className="mt-4 flex flex-wrap gap-3">{insights.suggestedNextTopics.map((topic) => <button key={topic} onClick={() => navigate("/teach-me/topic")} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">{topic}</button>)}</div></Card></motion.section>

            <motion.section {...reveal} transition={{ delay: 0.35 }}><Card className="p-6 text-center md:p-8"><Quote className="mx-auto h-8 w-8 text-primary/60" /><p className="mx-auto mt-3 max-w-3xl text-lg italic leading-relaxed text-gray-700 dark:text-gray-200">“{insights.motivationalNote}”</p><p className="mt-3 text-sm font-bold text-primary">— Ajibade</p></Card></motion.section>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

function InsightList({ items, marker }: { items: string[]; marker: string }) {
  return <ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"><span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", marker)} />{item}</li>)}</ul>;
}
