import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { classService } from "@/lib/services/classService";
import { LoadingScreen } from "@/components/lesson/LoadingScreen";
import { useToastStore } from "@/lib/store/toastStore";

export function SessionSetup() {
  const hasStarted = useRef(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(5);
  const [loadingMessage, setLoadingMessage] = useState(
    "Initializing session...",
  );
  const { addToast } = useToastStore();

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startLesson = async () => {
      if (!state?.unit) {
        navigate("/teach-me/class/units");
        return;
      }

      const classId = parseInt(localStorage.getItem("currentClassId") || "0");
      const unitIndex = Math.max(0, state.unit.unitOrder - 1);

      if (unitIndex === undefined || !classId) {
        navigate("/classes");
        return;
      }

      try {
        setLoadingProgress(5);
        setLoadingMessage("Initializing session...");

        await new Promise((resolve) => setTimeout(resolve, 300));

        setLoadingProgress(30);
        setLoadingMessage("Creating your learning session...");

        const response = await classService.startLesson(classId, unitIndex);

        setLoadingProgress(70);
        setLoadingMessage("Loading lesson content...");

        const sessionId = response.sessionId;
        if (!sessionId) {
          throw new Error("No session ID returned");
        }

        setLoadingProgress(100);
        setLoadingMessage("Ready! Starting lesson...");

        await new Promise((resolve) => setTimeout(resolve, 500));

        navigate(`/teach-me/session/${sessionId}`, {
          replace: true,
          state: { unit: state.unit, fromSetup: true },
        });
      } catch (error) {
        hasStarted.current = false;
        addToast("Failed to start lesson session. Please try again.", "error");
        navigate("/teach-me/class/units");
      }
    };

    startLesson();
  }, [state, navigate, addToast]);

  return <LoadingScreen progress={loadingProgress} message={loadingMessage} />;
}
