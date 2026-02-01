import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLessonWebSocket } from '@/hooks/useLessonWebSocket';
import { AjibadePanel } from '@/components/features/ajibade';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';
import { MockBackend } from '@/services/mockBackend';
import './LessonSession.css';

export function LessonSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [showExitDialog, setShowExitDialog] = useState(false);

    // WebSocket connection with audio callbacks
    const {
        steps,
        isConnected,
        sendStepCompleted,
        currentAudioStep,
        completedAudioSteps,
    } = useLessonWebSocket(sessionId || null);

    const currentStep = steps[currentStepIndex];
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

    // Auto-advance when audio finishes
    useEffect(() => {
        if (audioFinished && currentStepIndex < steps.length - 1) {
            // Optional: auto-advance or wait for user
        }
    }, [audioFinished, currentStepIndex, steps.length]);

    const handleBackClick = () => {
        setShowExitDialog(true);
    };

    const handleConfirmExit = () => {
        setShowExitDialog(false);
        navigate('/teach-me/class/units', { replace: true });
    };

    if (!sessionId) {
        return null;
    }

    return (
        <div className="lesson-session-container">
            {/* Exit Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showExitDialog}
                title="End Session?"
                message="Are you sure you want to leave? Your current session will end and you'll need to restart this lesson from the beginning."
                confirmText="End Session"
                cancelText="Continue Learning"
                onConfirm={handleConfirmExit}
                onCancel={() => setShowExitDialog(false)}
            />

            {/* Header */}
            <div className="lesson-header">
                <button onClick={handleBackClick} className="back-button">
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
                <AjibadePanel className="ajibade-panel" />
            </div>
        </div>
    );
}
