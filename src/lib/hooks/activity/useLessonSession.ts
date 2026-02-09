import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLessonWebSocket } from "@/lib/hooks/activity/useLessonWebSocket";

export function useLessonSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const unit = state?.unit;
  const isYouTubeMode = !!unit?.youtubeUrl;

  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null); // YouTube Player ref
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Session states
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [manualChatEnabled, setManualChatEnabled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAudioFinished, setIsAudioFinished] = useState(false);

  // Latest Fix States
  const [ttsRequestedForStep, setTtsRequestedForStep] = useState<string | null>(
    null,
  );
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [introStatus, setIntroStatus] = useState<
    "NONE" | "REQUESTED" | "FINISHED"
  >("NONE");
  const [isCurrentlyPausing, setIsCurrentlyPausing] = useState(false);
  const [isAjibadeSpeaking, setIsAjibadeSpeaking] = useState(false);
  const [timeUntilNextStep, setTimeUntilNextStep] = useState<number | null>(
    null,
  );

  const {
    steps,
    isConnected,
    sendMessage,
    clarificationResponse,
    isLoadingClarification,
    sendStepCompleted,
    requestTTS,
    isCompleted,
    completionStats,
  } = useLessonWebSocket(hasStarted ? sessionId || null : null, isYouTubeMode);

  const currentStep = steps[steps.length - 1];

  const handleAudioEnded = () => {
    setIsAudioFinished(true);

    if (isYouTubeMode && introStatus === "REQUESTED") {
      console.log("Intro finished. Starting video...");
      setIntroStatus("FINISHED");
      if (
        playerRef.current &&
        typeof playerRef.current.playVideo === "function"
      ) {
        playerRef.current.playVideo();
      }
      return;
    }

    if (isYouTubeMode && isCurrentlyPausing) {
      if (isQuizActive) {
        console.log("Audio ended for Quiz. Showing quiz modal...");
        return;
      }
      console.log("Explanation finished. Resuming video...");
      setIsCurrentlyPausing(false);
      if (
        playerRef.current &&
        typeof playerRef.current.playVideo === "function"
      ) {
        playerRef.current.playVideo();
      }

      sendStepCompleted();
      return;
    }

    if (!isQuizActive && !manualChatEnabled) {
      console.log("Audio ended - Auto-advancing step...");
      sendStepCompleted();
    }
  };

  useEffect(() => {
    setIsAudioFinished(!currentStep?.stepPayload?.textToSpeak);
    setIsCurrentlyPausing(false);
    if (
      currentStep?.stepPayload?.quizzesJson &&
      currentStep.stepPayload.quizzesJson.length > 0
    ) {
      setIsQuizActive(true);
      setIsQuizFinished(false);
      setCurrentQuizIndex(0);
      setQuizScore(0);
      setSelectedAnswerIndex(null);
      setIsShowingFeedback(false);
      setManualChatEnabled(false);
    } else {
      setIsQuizActive(false);
      setManualChatEnabled(false);
    }
    setTtsRequestedForStep(null);
  }, [currentStep]);

  useEffect(() => {
    const targetStep = clarificationResponse || currentStep;
    if (targetStep?.stepPayload?.canvasHtmlContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(targetStep.stepPayload.canvasHtmlContent);
        doc.close();
      }
    }
  }, [currentStep, clarificationResponse]);

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = unit?.youtubeUrl ? extractVideoId(unit.youtubeUrl) : null;

  const stateRef = useRef({
    isQuizActive,
    manualChatEnabled,
    currentStep,
    isAudioFinished,
    ttsRequestedForStep,
  });

  useEffect(() => {
    stateRef.current = {
      isQuizActive,
      manualChatEnabled,
      currentStep,
      isAudioFinished,
      ttsRequestedForStep,
    };
  }, [
    isQuizActive,
    manualChatEnabled,
    currentStep,
    isAudioFinished,
    ttsRequestedForStep,
  ]);

  const onPlayerReady = useCallback(() => {
    console.log("YouTube Player Ready");
    setIsPlayerReady(true);
  }, []);

  const onStateChange = useCallback(
    (event: any) => {
      setIsPlaying(event.data === 1);
      // Auto-advance if video finishes naturally (State 0 = Ended)
      if (event.data === 0) {
        const {
          isQuizActive,
          manualChatEnabled,
          currentStep,
          isAudioFinished,
          ttsRequestedForStep,
        } = stateRef.current;

        // If video ended but we have a quiz or explanation that hasn't finished yet,
        // we must show it now.
        if (
          isQuizActive ||
          (currentStep?.stepPayload?.textToSpeak && !isAudioFinished)
        ) {
          console.log("Video ended with pending content. Triggering pause...");
          setIsCurrentlyPausing(true);

          if (
            currentStep?.stepPayload?.textToSpeak &&
            ttsRequestedForStep !== currentStep.id
          ) {
            requestTTS(currentStep.stepPayload.textToSpeak);
            setTtsRequestedForStep(currentStep.id);
          }
        } else if (
          !isQuizActive &&
          !manualChatEnabled &&
          currentStep?.stepType !== "CONCLUSION"
        ) {
          console.log("Video ended naturally. Auto-advancing...");
          sendStepCompleted();
        }
      }
    },
    [sendStepCompleted, requestTTS],
  );

  useEffect(() => {
    if (isYouTubeMode && hasStarted && isConnected && introStatus === "NONE") {
      const introText = `I am Ajibade, your AI tutor. We will be watching this lesson on ${unit?.title || "the topic"}. Just watch, and I will pause the video if I need to explain something or ask a question. Let's get started!`;
      requestTTS(introText);
      setIntroStatus("REQUESTED");
    }
  }, [isYouTubeMode, hasStarted, isConnected, introStatus, unit, requestTTS]);

  // The interval MUST run even if isQuizActive is true, 
  // because we need to REACH the pause mark before showing the quiz.
  useEffect(() => {
    console.log(`[YouTube Monitor] Effect Triggered. currentStep: ${currentStep?.id}, isYouTubeMode: ${isYouTubeMode}`);
    if (!currentStep?.id || !isYouTubeMode) return;

    console.log(`[YouTube Monitor] Starting interval for step: ${currentStep.id}. Target: ${currentStep.stepPayload.pauseAtSeconds}s`);

    const interval = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        if (!isPlayerReady) {
          console.log("[YouTube Monitor] Player detected as ready!");
          setIsPlayerReady(true);
        }

        const currentTime = playerRef.current.getCurrentTime();
        const pauseTime = currentStep?.stepPayload?.pauseAtSeconds;

        if (typeof pauseTime === "number") {
          const diff = pauseTime - currentTime;
          if (diff > 0) setTimeUntilNextStep(diff);

          // Log every ~1 second to identify if it's running without flooding
          if (Math.floor(currentTime * 5) % 5 === 0) {
            console.log(`[YouTube Monitor] Time: ${currentTime.toFixed(2)}s, Target: ${pauseTime}s, Diff: ${diff.toFixed(2)}s`);
          }

          // Robust check: Catch if we reached or slightly passed the mark (up to 1.5s tolerance)
          if (currentTime >= pauseTime && currentTime < pauseTime + 1.5) {
            const state = playerRef.current.getPlayerState();
            console.log(`[YouTube Monitor] TARGET MATCH! State: ${state}, isCurrentlyPausing: ${isCurrentlyPausing}`);

            // State 1 = Playing
            if (state === 1 && !isCurrentlyPausing) {
              console.log(`🎯 PAUSE TRIGGERED at ${currentTime.toFixed(2)}s (Target: ${pauseTime}s)`);
              setIsCurrentlyPausing(true);
              playerRef.current.pauseVideo();
              setTimeUntilNextStep(0);

              // Reset audio state for this segment so the quiz waits
              setIsAudioFinished(!currentStep.stepPayload.textToSpeak);

              if (
                currentStep.stepPayload.textToSpeak &&
                ttsRequestedForStep !== currentStep.id
              ) {
                console.log(`[YouTube Monitor] Requesting TTS for step ${currentStep.id}`);
                requestTTS(currentStep.stepPayload.textToSpeak);
                setTtsRequestedForStep(currentStep.id);
              }
            }
          } else if (currentTime > pauseTime + 1.5) {
            // Already past the window
            if (timeUntilNextStep !== null) setTimeUntilNextStep(null);
          }
        }
      } else {
        // If no player, log occasionally
        if (Math.random() < 0.05) console.log("[YouTube Monitor] Player not yet available in interval...");
      }
    }, 200);

    return () => {
      console.log(`[YouTube Monitor] Clearing interval for step: ${currentStep.id}`);
      clearInterval(interval);
    };
  }, [
    currentStep,
    requestTTS,
    isPlayerReady,
    ttsRequestedForStep,
    isQuizActive,
    isCurrentlyPausing,
    isYouTubeMode,
    setIsAudioFinished // Added dependency
  ]);

  useEffect(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.playVideo === "function" &&
      !isAjibadeSpeaking
    ) {
      const state = playerRef.current.getPlayerState();
      if (state === 2 || state === 5) {
        console.log("Resuming video for next segment...");
        setIsCurrentlyPausing(false);
        playerRef.current.playVideo();
      }
    }
  }, [currentStep?.id]);

  const handleBackClick = () => setShowExitDialog(true);
  const handleConfirmExit = () => {
    setShowExitDialog(false);
    sendMessage("CLOSE_SESSION", { sessionId });
    setTimeout(() => {
      navigate("/teach-me/class/units", { replace: true });
    }, 100);
  };

  const handleQuizOptionClick = (_option: string, index: number) => {
    if (isShowingFeedback) return;
    const quizzes = currentStep?.stepPayload?.quizzesJson;
    if (!quizzes) return;
    const quiz = quizzes[currentQuizIndex];
    setSelectedAnswerIndex(index);
    setIsShowingFeedback(true);
    if (index === quiz.correctAnswerIndex) setQuizScore((prev) => prev + 1);
    setTimeout(() => {
      if (currentQuizIndex < quizzes.length - 1) {
        setCurrentQuizIndex((prev) => prev + 1);
        setSelectedAnswerIndex(null);
        setIsShowingFeedback(false);
      } else {
        setIsQuizFinished(true);
      }
    }, 1500);
  };

  const handlePostQuizResponse = (hasQuestion: boolean) => {
    if (hasQuestion) setManualChatEnabled(true);
    else sendStepCompleted();
  };

  const handleAudioStatusChange = useCallback(
    (isPlayingAudio: boolean) => {
      setIsAjibadeSpeaking(isPlayingAudio);
      if (isPlayingAudio) setIsAudioFinished(false);

      if (
        !isYouTubeMode ||
        !playerRef.current ||
        typeof playerRef.current.pauseVideo !== "function"
      )
        return;

      if (isPlayingAudio) {
        console.log("🔊 Ajibade started speaking - PAUSING video");
        playerRef.current.pauseVideo();
      } else {
        console.log("Mw Ajibade stopped speaking");
        if (
          !isCurrentlyPausing &&
          introStatus === "FINISHED" &&
          !isQuizActive
        ) {
          console.log("▶️ Resuming video after Ajibade speech");
          playerRef.current.playVideo();
        }
      }
    },
    [isYouTubeMode, isCurrentlyPausing, introStatus, isQuizActive],
  );

  useEffect(() => {
    if (isAjibadeSpeaking && isYouTubeMode && isPlaying && playerRef.current) {
      console.log("🛑 Force pausing video because Ajibade is still speaking");
      playerRef.current.pauseVideo();
    }
  }, [isAjibadeSpeaking, isPlaying, isYouTubeMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        if (
          playerRef.current &&
          typeof playerRef.current.getPlayerState === "function"
        ) {
          const state = playerRef.current.getPlayerState();
          if (state === 1) playerRef.current.pauseVideo();
          else playerRef.current.playVideo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePlayback = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (
      playerRef.current &&
      typeof playerRef.current.getPlayerState === "function"
    ) {
      const state = playerRef.current.getPlayerState();
      if (state === 1) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();
    }
  };

  return {
    sessionId,
    unit,
    isYouTubeMode,
    isPlaying,
    iframeRef,
    playerRef,
    videoId: videoId || "", // Ensure string type
    onPlayerReady,
    onStateChange,
    showExitDialog,
    isQuizActive,
    isQuizFinished,
    currentQuizIndex,
    selectedAnswerIndex,
    isShowingFeedback,
    quizScore,
    manualChatEnabled,
    hasStarted,
    isAudioFinished,
    currentStep,
    steps,
    isConnected,
    clarificationResponse,
    isLoadingClarification,
    isCompleted,
    completionStats,
    introStatus,
    isCurrentlyPausing,
    isAjibadeSpeaking,
    timeUntilNextStep,

    // Actions
    setHasStarted,
    setShowExitDialog,
    setIsQuizActive,
    handleBackClick,
    handleConfirmExit,
    handleQuizOptionClick,
    handlePostQuizResponse,
    handleAudioEnded,
    handleAudioStatusChange,
    sendMessage,
    requestTTS,
    togglePlayback,
  };
}
