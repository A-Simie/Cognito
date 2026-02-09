import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { classService } from "@/lib/services/classService";
import { LoadingScreen } from "@/components/lesson/LoadingScreen";
import { useToastStore } from "@/lib/store/toastStore";

export function LessonGeneration() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("Analyzing topic...");
  const [progress, setProgress] = useState(5);
  const { addToast } = useToastStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!state?.topic) {
      navigate("/teach-me");
      return;
    }

    const createClass = async () => {
      try {
        setProgress(5);
        setStatus(`Analyzing "${state.topic}"...`);


        const newClass = await classService.createTopicClass(state.topic);
        await queryClient.invalidateQueries({ queryKey: ["classes"] });
        const classId = newClass.id;

        setStatus("Structuring core concepts...");
        setProgress(30);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setStatus("Generating lesson modules...");
        setProgress(60);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStatus("Finalizing curriculum...");
        setProgress(90);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setProgress(100);

        localStorage.setItem("currentClassId", classId.toString());

        let displayTitle = newClass.title;
        try {
          if (
            typeof newClass.title === "string" &&
            newClass.title.startsWith("{")
          ) {
            const parsed = JSON.parse(newClass.title);
            displayTitle = parsed.topicText || newClass.title;
          }
        } catch {
          displayTitle = newClass.title;
        }

        setTimeout(() => {
          navigate("/classes", {
            state: {
              newClassId: classId,
              message: `"${displayTitle}" class created successfully!`,
            },
            replace: true,
          });
        }, 300);
      } catch (error) {
        addToast("Failed to generate syllabus. Please try again.", "error");
        setStatus("Failed to generate syllabus. Please try again.");
        setProgress(0);
        setTimeout(() => navigate("/teach-me/topic"), 3000);
      }
    };

    createClass();
  }, []);

  return <LoadingScreen progress={progress} message={status} />;
}
