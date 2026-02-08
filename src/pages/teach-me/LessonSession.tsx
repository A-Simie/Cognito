import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { useLessonWebSocket } from "@/lib/hooks/activity/useLessonWebSocket";
import { AjibadePanel } from "@/components/features/ajibade";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

export function LessonSession() {
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

  const [ttsRequestedForStep, setTtsRequestedForStep] = useState<string | null>(
    null,
  );
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [introStatus, setIntroStatus] = useState<
    "NONE" | "REQUESTED" | "FINISHED"
  >("NONE");
  const [isCurrentlyPausing, setIsCurrentlyPausing] = useState(false);

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

    // YouTube: Resume video if we were pausing for an explanation
    if (isYouTubeMode && isCurrentlyPausing) {
      console.log("Explanation finished. Resuming video...");
      setIsCurrentlyPausing(false);
      if (
        playerRef.current &&
        typeof playerRef.current.playVideo === "function"
      ) {
        playerRef.current.playVideo();
      }
      // CRITICAL FIX: Do NOT auto-advance step here either. We resume video until the NEXT pause point.
      return;
    }

    // Safety: Do NOT auto-advance if this is a CONCLUSION step
    if (currentStep?.stepType === "CONCLUSION") {
      console.log(
        "CONCLUSION step audio ended. Waiting for SESSION_COMPLETED signal...",
      );
      return;
    }

    if (!isQuizActive && !manualChatEnabled) {
      console.log("Audio ended - Auto-advancing step...");
      sendStepCompleted();
    }
  };

  useEffect(() => {
    // Detect if current step is a quiz and reset states
    setIsAudioFinished(false);
    setIsCurrentlyPausing(false); // Reset pause state for new steps
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

  useEffect(() => {
    if (!isYouTubeMode || !videoId) return;

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
          disablekb: 1, // Disable keyboard controls
          modestbranding: 1,
          fs: 0, // Disable fullscreen to prevent escaping custom controls
        },
        events: {
          onReady: () => {
            console.log("YouTube Player Ready");
            setIsPlayerReady(true);
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === 1);
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      (window as any).onYouTubeIframeAPIReady();
    }
  }, [isYouTubeMode, videoId]);

  // YouTube Intro Trigger (Frontend Side)
  useEffect(() => {
    if (isYouTubeMode && hasStarted && isConnected && introStatus === "NONE") {
      const introText = `I am Ajibade, your AI tutor. We will be watching this lesson on ${unit?.title || "the topic"}. Just watch, and I will pause the video if I need to explain something or ask a question. Let's get started!`;
      console.log("Triggering frontend intro...");
      requestTTS(introText);
      setIntroStatus("REQUESTED");
    }
  }, [isYouTubeMode, hasStarted, isConnected, introStatus, unit, requestTTS]);

  // Monitoring loop for pausing video at specific timestamps
  useEffect(() => {
    if (!isPlayerReady || isQuizActive || !currentStep?.id) return;

    const interval = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        const currentTime = playerRef.current.getCurrentTime();
        const pauseTime = currentStep?.stepPayload?.pauseAtSeconds;

        // Use a small buffer (0.8s) to ensure we catch the frame but don't re-pause if user resumes
        if (
          typeof pauseTime === "number" &&
          currentTime >= pauseTime &&
          currentTime < pauseTime + 1.5
        ) {
          const state = playerRef.current.getPlayerState();
          // State 1 = Playing
          if (state === 1 && !isCurrentlyPausing) {
            console.log(`🎯 Target reached: ${pauseTime}s. Pausing video...`);
            setIsCurrentlyPausing(true);
            playerRef.current.pauseVideo();

            if (
              currentStep.stepPayload.textToSpeak &&
              ttsRequestedForStep !== currentStep.id
            ) {
              requestTTS(currentStep.stepPayload.textToSpeak);
              setTtsRequestedForStep(currentStep.id);
            }
          }
        }
      }
    }, 200); // Higher frequency check for precision

    return () => clearInterval(interval);
  }, [
    currentStep,
    requestTTS,
    isPlayerReady,
    ttsRequestedForStep,
    isQuizActive,
    isCurrentlyPausing,
  ]);

  // Resume video playback when moving to a new step
  useEffect(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.playVideo === "function"
    ) {
      const state = playerRef.current.getPlayerState();
      // Only resume if we are paused AND it's a new step being processed
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
    // Explicitly notify backend to close this session
    sendMessage("CLOSE_SESSION", { sessionId });
    // Small delay to ensure message is sent before navigation/hook cleanup
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

  const SessionCompleteModal = () => {
    if (!isCompleted || !isAudioFinished) return null;

    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-4xl shadow-2xl max-w-lg w-full p-10 border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-25" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Lesson Mastered!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
            You've successfully completed this unit with Ajibade.
          </p>

          {completionStats && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Time Spent
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.floor((completionStats.durationSeconds || 0) / 60)}m{" "}
                  {(completionStats.durationSeconds || 0) % 60}s
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Completion
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  100%
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/teach-me/class/units", { replace: true })}
            className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (!sessionId) return null;
  const isChatDisabled = !manualChatEnabled;

  const handleAudioStatusChange = useCallback(
    (isPlaying: boolean) => {
      if (
        !isYouTubeMode ||
        !playerRef.current ||
        typeof playerRef.current.pauseVideo !== "function"
      )
        return;

      if (isPlaying) {
        console.log("🔊 Ajibade started speaking - PAUSING video");
        playerRef.current.pauseVideo();
      } else {
        console.log("Mw Ajibade stopped speaking");
        // Only resume if conditions are met
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

  // Keyboard controls for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault(); // Prevent page scroll on Space
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
  return (
    <div className="fixed inset-0 flex flex-col bg-background-light dark:bg-slate-950 overflow-hidden">
      <SessionCompleteModal />
      <ConfirmDialog
        isOpen={showExitDialog}
        title="End Session?"
        message="Are you sure you want to leave? Your current session will end and you'll need to restart this lesson from the beginning."
        confirmText="End Session"
        cancelText="Continue Learning"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitDialog(false)}
      />

      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md mx-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Ready to Start?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Join the interactive lesson with Ajibade. Make sure your audio is
              on.
            </p>
            <button
              onClick={() => {
                setHasStarted(true);
                // Intro logic handles actual playback start, but we can prime here if needed
                if (
                  isYouTubeMode &&
                  playerRef.current &&
                  typeof playerRef.current.playVideo === "function"
                ) {
                  // Mute/Unmute trick to ensure audio context is unlocked
                  playerRef.current.mute();
                  playerRef.current.playVideo();
                  setTimeout(() => {
                    playerRef.current.pauseVideo();
                    playerRef.current.unMute();
                  }, 100);
                }
              }}
              className="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Lesson
            </button>
          </div>
        </div>
      )}

      {isLoadingClarification && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Ajibade is thinking...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Generating your answer
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
          />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        <div className="w-full lg:w-2/3 xl:w-3/4 h-[55vh] lg:h-full bg-slate-100 dark:bg-slate-900 relative order-1 lg:order-1 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out">
          {isYouTubeMode && (
            <div className="relative w-full h-full">
              {/* Pointer events none on the player container prevents clicking YouTube's hidden seek bar */}
              <div
                id="youtube-player"
                className={`w-full h-full pointer-events-none ${clarificationResponse?.stepPayload?.canvasHtmlContent ? "hidden" : "block"}`}
              />

              {/* Custom Play/Pause Overlay */}
              {!clarificationResponse?.stepPayload?.canvasHtmlContent && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-opacity duration-300 opacity-0 hover:opacity-100 peer-hover:opacity-100 group-hover:opacity-100 pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        playerRef.current &&
                        typeof playerRef.current.getPlayerState === "function"
                      ) {
                        const state = playerRef.current.getPlayerState();
                        if (state === 1) playerRef.current.pauseVideo();
                        else playerRef.current.playVideo();
                      }
                    }}
                    className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-colors shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      {isPlaying ? (
                        <path
                          fillRule="evenodd"
                          d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </button>
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    Toggle Playback
                  </span>
                </div>
              )}
              {/* Invisible overlay to catch clicks and toggle playback */}
              <div
                className="absolute inset-0 z-20 group cursor-pointer"
                onClick={() => {
                  if (
                    playerRef.current &&
                    typeof playerRef.current.getPlayerState === "function"
                  ) {
                    const state = playerRef.current.getPlayerState();
                    if (state === 1) playerRef.current.pauseVideo();
                    else playerRef.current.playVideo();
                  }
                }}
              />
            </div>
          )}

          {(!isYouTubeMode ||
            clarificationResponse?.stepPayload?.canvasHtmlContent) && (
            <iframe
              key={(clarificationResponse || currentStep)?.id}
              ref={iframeRef}
              title="Interactive Sandbox"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
            />
          )}

          {isQuizActive &&
            isAudioFinished &&
            (!isYouTubeMode || isCurrentlyPausing) &&
            !manualChatEnabled &&
            currentStep?.stepPayload?.quizzesJson && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                  {!isQuizFinished ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                          Question {currentQuizIndex + 1}{" "}
                          <span className="text-slate-400 font-normal text-sm">
                            of {currentStep.stepPayload.quizzesJson.length}
                          </span>
                        </h3>
                        <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{
                              width: `${((currentQuizIndex + 1) / currentStep.stepPayload.quizzesJson.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium leading-relaxed">
                        {
                          currentStep.stepPayload.quizzesJson[currentQuizIndex]
                            .question
                        }
                      </p>
                      <div className="space-y-3">
                        {currentStep.stepPayload.quizzesJson[
                          currentQuizIndex
                        ].options.map((option: string, idx: number) => {
                          const quiz =
                            currentStep.stepPayload?.quizzesJson?.[
                              currentQuizIndex
                            ];
                          const isCorrect = idx === quiz?.correctAnswerIndex;
                          const isSelected = idx === selectedAnswerIndex;
                          let buttonClass =
                            "border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10";
                          if (isShowingFeedback) {
                            if (isCorrect)
                              buttonClass =
                                "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                            else if (isSelected)
                              buttonClass =
                                "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                            else
                              buttonClass =
                                "border-slate-100 dark:border-slate-800 text-slate-400 opacity-50";
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizOptionClick(option, idx)}
                              disabled={isShowingFeedback}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium group flex items-center justify-between ${buttonClass}`}
                            >
                              <span>{option}</span>
                              <div className="flex items-center gap-2">
                                {isShowingFeedback && isCorrect && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                {isShowingFeedback &&
                                  isSelected &&
                                  !isCorrect && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="w-5 h-5 text-red-500 animate-in zoom-in duration-300"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                {!isShowingFeedback && (
                                  <span className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary flex items-center justify-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 animate-in fade-in duration-500">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 h-10 text-emerald-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.23z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Quiz Completed!
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-lg leading-relaxed">
                        You scored{" "}
                        <span className="text-emerald-500 font-bold">
                          {quizScore}
                        </span>{" "}
                        out of{" "}
                        {currentStep?.stepPayload?.quizzesJson?.length || 0}.{" "}
                        {quizScore ===
                        (currentStep?.stepPayload?.quizzesJson?.length || 0)
                          ? "Great job!"
                          : "Keep practicing!"}
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">
                          Do you have any questions about this topic before we
                          move on?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setIsQuizActive(false);
                              handlePostQuizResponse(false);
                            }}
                            className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all"
                          >
                            No, Continue
                          </button>
                          <button
                            onClick={() => {
                              setIsQuizActive(false);
                              handlePostQuizResponse(true);
                            }}
                            className="flex-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                          >
                            I have a question
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {!isYouTubeMode && !currentStep?.stepPayload?.canvasHtmlContent && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <AjibadePanel
          className="w-full lg:w-1/3 xl:w-1/4 h-[45vh] lg:h-auto order-2 lg:order-2 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out"
          onSendMessage={(msg, audioData) => {
            sendMessage("USER_QUESTION", { questionText: msg, audioData });
            setManualChatEnabled(false);
          }}
          clarificationResponse={clarificationResponse}
          isLoadingClarification={isLoadingClarification}
          disabled={isChatDisabled}
          currentStepText={
            // Show intro text OR clarify response OR current step text (unless video is playing)
            isYouTubeMode && introStatus === "REQUESTED"
              ? `I am Ajibade, your AI tutor. We will be watching this lesson on ${unit?.title || "the topic"}. Just watch, and I will pause the video if I need to explain something or ask a question. Let's get started!`
              : clarificationResponse?.stepPayload?.textToSpeak ||
                (isYouTubeMode &&
                !isCurrentlyPausing &&
                introStatus === "FINISHED"
                  ? ""
                  : currentStep?.stepPayload?.textToSpeak)
          }
          onPlaybackEnded={handleAudioEnded}
          onAudioStatusChange={handleAudioStatusChange}
        />
      </div>
    </div>
  );
}
