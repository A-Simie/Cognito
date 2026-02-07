import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useLessonWebSocket } from "@/lib/hooks/activity/useLessonWebSocket";
import { AjibadePanel } from "@/components/features/ajibade";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

export function LessonSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation(); // Get unit state
  const unit = state?.unit;
  const isYouTubeMode = !!unit?.youtubeUrl;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null); // YouTube Player ref
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Session states
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [manualChatEnabled, setManualChatEnabled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAudioFinished, setIsAudioFinished] = useState(false);

  // Latest Fix States
  const [ttsRequestedForStep, setTtsRequestedForStep] = useState<string | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const {
    steps,
    isConnected,
    sendMessage,
    clarificationResponse,
    isLoadingClarification,
    sendStepCompleted,
    requestTTS,
  } = useLessonWebSocket(hasStarted ? sessionId || null : null, isYouTubeMode);

  const currentStep = steps[steps.length - 1];

  const handleAudioEnded = () => {
    setIsAudioFinished(true);
    if (!isQuizActive && !manualChatEnabled) {
      console.log("Audio ended - Auto-advancing step...");
      sendStepCompleted();
    }
  };

  useEffect(() => {
    // Detect if current step is a quiz and reset states
    setIsAudioFinished(false);
    if (currentStep?.stepPayload?.quizzesJson && currentStep.stepPayload.quizzesJson.length > 0) {
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
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
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
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'rel': 0,
        },
        events: {
          'onReady': (event: any) => {
            console.log("YouTube Player Ready");
            setIsPlayerReady(true);
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      (window as any).onYouTubeIframeAPIReady();
    }
  }, [isYouTubeMode, videoId]);

  // Combined Monitoring loop
  useEffect(() => {
    if (!isPlayerReady || typeof currentStep?.stepPayload?.pauseAtSeconds !== 'number') return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const pauseTime = currentStep.stepPayload.pauseAtSeconds;
        const canGetTime = typeof playerRef.current.getCurrentTime === 'function';

        if (canGetTime && typeof pauseTime === 'number' && currentTime >= pauseTime) {
          const state = playerRef.current.getPlayerState();
          if (state === 1 || (pauseTime === 0 && (state === 5 || state === -1))) {
            console.log("Reached pause point. Pausing...");
            playerRef.current.pauseVideo();
            if (currentStep.stepPayload.textToSpeak && ttsRequestedForStep !== currentStep.id) {
              requestTTS(currentStep.stepPayload.textToSpeak);
              setTtsRequestedForStep(currentStep.id);
            }
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentStep, requestTTS, isPlayerReady, ttsRequestedForStep]);

  // Dedicated effect for 0s step
  useEffect(() => {
    if (isYouTubeMode && currentStep?.stepPayload?.pauseAtSeconds === 0 && ttsRequestedForStep !== currentStep.id) {
      console.log("🚀 [YouTubeMode] Intro step detected (0s). Requesting TTS immediately.");
      requestTTS(currentStep.stepPayload.textToSpeak);
      setTtsRequestedForStep(currentStep.id);
    }
  }, [currentStep, requestTTS, ttsRequestedForStep, isYouTubeMode]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      const state = playerRef.current.getPlayerState();
      if (state === 2 || state === 5) {
        console.log("New step arrived. Resuming video...");
        playerRef.current.playVideo();
      }
    }
  }, [currentStep]);

  const handleBackClick = () => setShowExitDialog(true);
  const handleConfirmExit = () => {
    setShowExitDialog(false);
    navigate("/teach-me/class/units", { replace: true });
  };

  const handleQuizOptionClick = (option: string, index: number) => {
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

  if (!sessionId) return null;
  const isChatDisabled = !manualChatEnabled;

  return (
    <div className="fixed inset-0 flex flex-col bg-background-light dark:bg-slate-950 overflow-hidden">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to Start?</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Join the interactive lesson with Ajibade. Make sure your audio is on.
            </p>
            <button
              onClick={() => {
                setHasStarted(true);
                if (isYouTubeMode && playerRef.current && typeof playerRef.current.playVideo === 'function') {
                  console.log("Priming YouTube player on user gesture...");
                  playerRef.current.playVideo();
                  setTimeout(() => playerRef.current.pauseVideo(), 100);
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ajibade is thinking...</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Generating your answer</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
        <button onClick={handleBackClick} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        <div className="w-full lg:w-2/3 xl:w-3/4 h-[55vh] lg:h-full bg-slate-100 dark:bg-slate-900 relative order-1 lg:order-1 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out">
          {isYouTubeMode && (
            <div id="youtube-player" className={`w-full h-full ${clarificationResponse?.stepPayload?.canvasHtmlContent ? "hidden" : "block"}`} />
          )}

          {(!isYouTubeMode || clarificationResponse?.stepPayload?.canvasHtmlContent) && (
            <iframe
              key={(clarificationResponse || currentStep)?.id}
              ref={iframeRef}
              title="Interactive Sandbox"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
            />
          )}

          {isQuizActive && isAudioFinished && !manualChatEnabled && currentStep?.stepPayload?.quizzesJson && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {!isQuizFinished ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                        Question {currentQuizIndex + 1} <span className="text-slate-400 font-normal text-sm">of {currentStep.stepPayload.quizzesJson.length}</span>
                      </h3>
                      <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${((currentQuizIndex + 1) / currentStep.stepPayload.quizzesJson.length) * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium leading-relaxed">{currentStep.stepPayload.quizzesJson[currentQuizIndex].question}</p>
                    <div className="space-y-3">
                      {currentStep.stepPayload.quizzesJson[currentQuizIndex].options.map((option: string, idx: number) => {
                        const quiz = currentStep.stepPayload?.quizzesJson?.[currentQuizIndex];
                        const isCorrect = idx === quiz?.correctAnswerIndex;
                        const isSelected = idx === selectedAnswerIndex;
                        let buttonClass = "border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10";
                        if (isShowingFeedback) {
                          if (isCorrect) buttonClass = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                          else if (isSelected) buttonClass = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                          else buttonClass = "border-slate-100 dark:border-slate-800 text-slate-400 opacity-50";
                        }
                        return (
                          <button key={idx} onClick={() => handleQuizOptionClick(option, idx)} disabled={isShowingFeedback} className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium group flex items-center justify-between ${buttonClass}`}>
                            <span>{option}</span>
                            <div className="flex items-center gap-2">
                              {isShowingFeedback && isCorrect && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z" clipRule="evenodd" /></svg>}
                              {isShowingFeedback && isSelected && !isCorrect && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500 animate-in zoom-in duration-300"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>}
                              {!isShowingFeedback && <span className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary flex items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /></span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.23z" clipRule="evenodd" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-lg leading-relaxed">You scored <span className="text-emerald-500 font-bold">{quizScore}</span> out of {currentStep?.stepPayload?.quizzesJson?.length || 0}. Great job!</p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">Do you have any questions about this topic before we move on?</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => { setIsQuizActive(false); handlePostQuizResponse(false); }} className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all">No, Continue</button>
                        <button onClick={() => { setIsQuizActive(false); handlePostQuizResponse(true); }} className="flex-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">I have a question</button>
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
          currentStepText={currentStep?.stepPayload?.textToSpeak}
          onPlaybackEnded={handleAudioEnded}
        />
      </div>
    </div>
  );
}
