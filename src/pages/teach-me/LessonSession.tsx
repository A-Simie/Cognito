import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLessonWebSocket } from '@/hooks/useLessonWebSocket';
import { AjibadeAvatar } from '@/components/lesson/AjibadeAvatar';
import { AudioWaveform } from '@/components/lesson/AudioWaveform';
import { StepProgress } from '@/components/lesson/StepProgress';
import { LessonControls } from '@/components/lesson/LessonControls';
import './LessonSession.css';

export function LessonSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // WebSocket connection with audio callbacks
    const {
        steps,
        isConnected,
        sendStepCompleted,
        currentAudioStep,
        completedAudioSteps,
        replayAudio
    } = useLessonWebSocket(sessionId || null);

    const currentStep = steps[currentStepIndex];
    const isAudioPlaying = currentAudioStep === currentStep?.id;
    const audioFinished = currentStep ? completedAudioSteps.has(currentStep.id) : false;

    // Update iframe when step changes
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

    const handleNext = () => {
        if (!audioFinished) return;

        if (currentStep) {
            // Send completion to backend
            sendStepCompleted(currentStep.id);
        }

        //  Move to next step
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            // Lesson complete
            navigate('/teach-me/class/units');
        }
    };

    const handleComeAgain = () => {
        if (currentStep) {
            replayAudio(currentStep.id);
        }
    };

    const handleBack = () => {
        navigate('/teach-me/class/units');
    };

    if (!sessionId) {
        return null;
    }

    return (
        <div className="lesson-session-container">
            {/* Header */}
            <div className="lesson-header">
                <button onClick={handleBack} className="back-button">
                    <ChevronLeft className="w-5 h-5" />
                    Back to Curriculum
                </button>
                <div className="connection-status">
                    {isConnected ? (
                        <><div className="status-dot connected" /> Connected</>
                    ) : (
                        <><div className="status-dot disconnected" /> Disconnected</>
                    )}
                </div>
            </div>

            {/* Main Layout: Sandbox + Ajibade Panel */}
            <div className="lesson-layout">
                {/* Sandbox - 70% */}
                <div className="sandbox-panel">
                    {currentStep?.stepPayload?.canvasHtmlContent ? (
                        <iframe
                            ref={iframeRef}
                            title="Interactive Sandbox"
                            sandbox="allow-scripts allow-same-origin"
                            className="sandbox-iframe"
                        />
                    ) : (
                        <div className="sandbox-loading">
                            <div className="spinner" />
                            <p>Loading Ajibade's Whiteboard...</p>
                        </div>
                    )}
                </div>

                {/* Ajibade Panel - 30% */}
                <div className="ajibade-panel">
                    <AjibadeAvatar isSpeaking={isAudioPlaying} />

                    <AudioWaveform isActive={isAudioPlaying} />

                    {steps.length > 0 && (
                        <StepProgress
                            current={currentStepIndex}
                            total={steps.length}
                        />
                    )}

                    <LessonControls
                        onNext={handleNext}
                        onComeAgain={handleComeAgain}
                        canProceed={audioFinished}
                    />
                </div>
            </div>
        </div>
    );
}
