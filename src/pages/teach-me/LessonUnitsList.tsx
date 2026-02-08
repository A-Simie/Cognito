import { useNavigate } from "react-router-dom";
import { Lock, PlayCircle, CheckCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { LessonUnit } from "@/lib/types";

import { useClassById } from "@/lib/hooks/useClasses";

export function LessonUnitsList() {
  const navigate = useNavigate();
  const storedClassId = localStorage.getItem("currentClassId");
  const classId = storedClassId ? parseInt(storedClassId) : null;

  const { data: cls, isLoading: loading } = useClassById(classId);

  if (!classId && !loading) {
    navigate("/classes");
    return null;
  }

  let units: LessonUnit[] = [];
  let classTitle = "";

  if (cls) {
    if (cls.learningMode === "YOUTUBE_TUTOR" && cls.youtubeLessonUnits) {
      units = cls.youtubeLessonUnits;
    } else if (cls.learningMode === "PDF_TUTOR" && cls.pdfLessonUnits) {
      units = cls.pdfLessonUnits;
    } else {
      units = cls.lessonUnits || [];
    }
    units = [...units].sort((a, b) => a.unitOrder - b.unitOrder);

    try {
      if (cls.title.startsWith("{")) {
        const parsed = JSON.parse(cls.title);
        classTitle = parsed.topicText || cls.title;
      } else {
        classTitle = cls.title;
      }
    } catch {
      classTitle = cls.title;
    }
  }

  const handleUnitClick = (unit: LessonUnit) => {
    if (unit.unitStatus === "NOT_STARTED" && unit.unitOrder > 0) {
    }
    navigate("/teach-me/session/setup", { state: { unit }, replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-white">
        Loading units...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#1a1b26]">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white/95 dark:bg-[#1a1b26]/95 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => navigate("/classes")}
          className="p-2 -ml-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white truncate">
          {classTitle || "Class Curriculum"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-3 pb-6">
          {units.length > 0 ? (
            units.map((unit, idx) => {
              const isCompleted = unit.unitStatus === "COMPLETED";
              const isCurrent = unit.unitStatus === "IN_PROGRESS";
              // Logic: Locked if not first unit AND previous unit is not completed
              const prevUnit = idx > 0 ? units[idx - 1] : null;
              const isLocked = idx > 0 && prevUnit?.unitStatus !== "COMPLETED";

              return (
                <button
                  key={unit.unitOrder}
                  disabled={isLocked}
                  onClick={() => handleUnitClick(unit)}
                  className={cn(
                    "group w-full p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-300",
                    isCurrent
                      ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]"
                      : isCompleted
                        ? "bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800"
                        : isLocked
                          ? "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:shadow-md",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110",
                        isCurrent
                          ? "bg-primary text-white"
                          : isCompleted
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500",
                      )}
                    >
                      {unit.unitOrder}
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "font-bold text-lg mb-1 transition-colors",
                          isCurrent
                            ? "text-primary"
                            : isLocked
                              ? "text-slate-400 dark:text-slate-600"
                              : "text-slate-900 dark:text-white",
                        )}
                      >
                        {unit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        {isCompleted && (
                          <span className="text-emerald-500 lowercase font-medium">
                          completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center min-w-[40px]">
                    {isLocked && (
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-500">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse">
                        <PlayCircle className="w-8 h-8" />
                      </div>
                    )}
                    {!isLocked && !isCompleted && !isCurrent && (
                      <div className="p-2 text-slate-300 group-hover:text-primary transition-colors">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No units found for this class.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonUnitsList;
