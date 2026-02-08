import { ChevronLeft } from "lucide-react";
import { AjibadePanel } from "@/components/features/ajibade";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { useLessonSession } from "@/lib/hooks/activity/useLessonSession";
import { LessonContentArea } from "@/components/lesson/session/LessonContentArea";

export function LessonSession() {
  const {
    sessionId,
    unit,
    isYouTubeMode,
    isPlaying,
    iframeRef,
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
    isConnected,
    clarificationResponse,
    isLoadingClarification,
    isCompleted,
    completionStats,
    introStatus,
    isCurrentlyPausing,

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
    togglePlayback,
    playerRef,
    videoId,
    onPlayerReady,
    onStateChange,
  } = useLessonSession();

  if (!sessionId) return null;
  const isChatDisabled = !manualChatEnabled;

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
            onClick={() => (window.location.href = "/classes")}
            className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  };

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
                if (
                  isYouTubeMode &&
                  playerRef.current &&
                  typeof playerRef.current.playVideo === "function"
                ) {
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
        <LessonContentArea
          isYouTubeMode={isYouTubeMode}
          isPlaying={isPlaying}
          clarificationResponse={clarificationResponse}
          currentStep={currentStep}
          iframeRef={iframeRef}
          togglePlayback={togglePlayback}
          videoId={videoId}
          playerRef={playerRef}
          onPlayerReady={onPlayerReady}
          onStateChange={onStateChange}
          isQuizActive={isQuizActive}
          isCurrentlyPausing={isCurrentlyPausing}
          manualChatEnabled={manualChatEnabled}
          isQuizFinished={isQuizFinished}
          currentQuizIndex={currentQuizIndex}
          selectedAnswerIndex={selectedAnswerIndex}
          isShowingFeedback={isShowingFeedback}
          quizScore={quizScore}
          handleQuizOptionClick={handleQuizOptionClick}
          handlePostQuizResponse={handlePostQuizResponse}
          setIsQuizActive={setIsQuizActive}
        />

        <AjibadePanel
          className="w-full lg:w-1/3 xl:w-1/4 h-[45vh] lg:h-auto order-2 lg:order-2 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out"
          onSendMessage={(msg, audioData) => {
            sendMessage("USER_QUESTION", { questionText: msg, audioData });
          }}
          clarificationResponse={clarificationResponse}
          isLoadingClarification={isLoadingClarification}
          disabled={isChatDisabled}
          currentStepText={
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
