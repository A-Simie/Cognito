import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLessonWebSocket } from '@/hooks/useLessonWebSocket';
import { AjibadePanel } from '@/components/features/ajibade';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';

export function LessonSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [showExitDialog, setShowExitDialog] = useState(false);


    const [isQuizActive, setIsQuizActive] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [isShowingFeedback, setIsShowingFeedback] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [manualChatEnabled, setManualChatEnabled] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const {
        steps,
        isConnected,
        sendMessage,
        clarificationResponse,
        isLoadingClarification,
        sendStepCompleted,
        completedAudioSteps,
    } = useLessonWebSocket(hasStarted ? (sessionId || null) : null);

    const currentStep = steps[steps.length - 1];

    // Auto-advance is now handled by onPlaybackEnded callback from AjibadePanel
    const handleAudioEnded = () => {
        // Only auto-advance if it's NOT a quiz and NOT waiting for clarification
        if (!isQuizActive && !manualChatEnabled && !clarificationResponse) {
            console.log("Audio ended - Auto-advancing step...");
            sendStepCompleted();
        }
    };

    useEffect(() => {
        // Detect if current step is a quiz and reset states
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
    }, [currentStep]);

    useEffect(() => {
        if (currentStep?.stepPayload?.canvasHtmlContent && iframeRef.current) {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(currentStep.stepPayload.canvasHtmlContent);
                doc.close();
            }
        }
    }, [currentStep]);

    const handleBackClick = () => {
        setShowExitDialog(true);
    };

    const handleConfirmExit = () => {
        setShowExitDialog(false);
        navigate('/teach-me/class/units', { replace: true });
    };

    const handleQuizOptionClick = (option: string, index: number) => {
        if (isShowingFeedback) return;

        const quizzes = currentStep?.stepPayload?.quizzesJson;
        if (!quizzes) return;
        const quiz = quizzes[currentQuizIndex];

        setSelectedAnswerIndex(index);
        setIsShowingFeedback(true);

        const isCorrect = index === quiz.correctAnswerIndex;
        if (isCorrect) {
            setQuizScore(prev => prev + 1);
        }

        // Delay to show feedback before moving on
        setTimeout(() => {
            if (currentQuizIndex < quizzes.length - 1) {
                setCurrentQuizIndex(prev => prev + 1);
                setSelectedAnswerIndex(null);
                setIsShowingFeedback(false);
            } else {
                // All questions finished
                setIsQuizFinished(true);
            }
        }, 1500);
    };

    const handlePostQuizResponse = (hasQuestion: boolean) => {
        if (hasQuestion) {
            // User has a question, enable chat
            setManualChatEnabled(true);
        } else {
            // No question, move to next step
            sendStepCompleted();
        }
    };

    const handleContinueAfterQuestion = () => {
        setManualChatEnabled(false); // Disable chat again
        sendStepCompleted();
    };


    if (!sessionId) {
        return null;
    }

    const isChatDisabled = isQuizActive && !manualChatEnabled;

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

            {/* Start Session Overlay */}
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
                            onClick={() => setHasStarted(true)}
                            className="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Lesson
                        </button>
                    </div>
                </div>
            )}

            {/* Header - Minimal and absolute positioned or top bar */}
            <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
                <button onClick={handleBackClick} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium text-sm hidden sm:inline">Back</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
                        {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
                {/* Sandbox / Whiteboard Area - Full width on mobile, Left side on desktop */}
                <div className="w-full lg:w-2/3 xl:w-3/4 h-[55vh] lg:h-full bg-slate-100 dark:bg-slate-900 relative order-1 lg:order-1 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out">
                    <iframe
                        ref={iframeRef}
                        title="Interactive Sandbox"
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0"
                    />

                    {/* Real Quiz UI Overlay - Now a Modal */}
                    {isQuizActive && !manualChatEnabled && currentStep?.stepPayload?.quizzesJson && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">

                                {!isQuizFinished ? (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                                                Question {currentQuizIndex + 1} <span className="text-slate-400 font-normal text-sm">of {currentStep.stepPayload.quizzesJson.length}</span>
                                            </h3>
                                            <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                                    style={{ width: `${((currentQuizIndex + 1) / currentStep.stepPayload.quizzesJson.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium leading-relaxed">
                                            {currentStep.stepPayload.quizzesJson[currentQuizIndex].question}
                                        </p>

                                        <div className="space-y-3">
                                            {currentStep.stepPayload.quizzesJson[currentQuizIndex].options.map((option: string, idx: number) => {
                                                const quiz = currentStep.stepPayload?.quizzesJson?.[currentQuizIndex];
                                                const isCorrect = idx === quiz?.correctAnswerIndex;
                                                const isSelected = idx === selectedAnswerIndex;

                                                let buttonClass = "border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10";

                                                if (isShowingFeedback) {
                                                    if (isCorrect) {
                                                        buttonClass = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                                                    } else if (isSelected) {
                                                        buttonClass = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                                                    } else {
                                                        buttonClass = "border-slate-100 dark:border-slate-800 text-slate-400 opacity-50";
                                                    }
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {isShowingFeedback && isSelected && !isCorrect && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500 animate-in zoom-in duration-300">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
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
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-emerald-500">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.23z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-lg leading-relaxed">
                                            You scored <span className="text-emerald-500 font-bold">{quizScore}</span> out of {currentStep?.stepPayload?.quizzesJson?.length || 0}. Great job!
                                        </p>

                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
                                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">
                                                Do you have any questions about this topic before we move on?
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

                    {manualChatEnabled && (
                        <div className="absolute bottom-6 right-6 z-30">
                            <button
                                onClick={handleContinueAfterQuestion}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all font-medium flex items-center gap-2"
                            >
                                Continue to Next Step
                            </button>
                        </div>
                    )}


                    {/* Optional: Add a subtle loading indicator if needed, but not the full blocking screen */}
                    {!currentStep?.stepPayload?.canvasHtmlContent && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Ajibade Panel - Bottom Sheet on Mobile, Right Sidebar on Desktop */}
                <AjibadePanel
                    className="w-full lg:w-1/3 xl:w-1/4 h-[45vh] lg:h-auto order-2 lg:order-2 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out"
                    onSendMessage={(msg) => sendMessage('USER_QUESTION', { questionText: msg })}
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
