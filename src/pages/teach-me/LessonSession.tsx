import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLessonWebSocket } from '@/hooks/useLessonWebSocket';
import { AjibadePanel } from '@/components/features/ajibade';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';
import './LessonSession.css';

export function LessonSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [showExitDialog, setShowExitDialog] = useState(false);

    const {
        steps,
        isConnected,
        sendMessage,
        clarificationResponse,
        isLoadingClarification,
    } = useLessonWebSocket(sessionId || null);

    const currentStep = steps[steps.length - 1];

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

    if (!sessionId) {
        return null;
    }

    return (
        <div className="lesson-session-container">
            <ConfirmDialog
                isOpen={showExitDialog}
                title="End Session?"
                message="Are you sure you want to leave? Your current session will end and you'll need to restart this lesson from the beginning."
                confirmText="End Session"
                cancelText="Continue Learning"
                onConfirm={handleConfirmExit}
                onCancel={() => setShowExitDialog(false)}
            />

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

            <div className="lesson-layout">
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

                <AjibadePanel 
                    className="ajibade-panel" 
                    onSendMessage={(msg) => sendMessage('USER_QUESTION', { questionText: msg })}
                    clarificationResponse={clarificationResponse}
                    isLoadingClarification={isLoadingClarification}
                />
            </div>
        </div>
    );
}
