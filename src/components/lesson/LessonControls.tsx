import React from 'react';
import './LessonControls.css';

interface LessonControlsProps {
    onNext: () => void;
    onComeAgain: () => void;
    canProceed: boolean;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
    onNext,
    onComeAgain,
    canProceed
}) => {
    return (
        <div className="lesson-controls">
            <button
                className="control-btn primary"
                onClick={onNext}
                disabled={!canProceed}
                title={canProceed ? "Proceed to next step" : "Wait for Ajibade to finish speaking"}
            >
                {canProceed ? 'Next Step →' : 'Please wait...'}
            </button>

            <button
                className="control-btn secondary"
                onClick={onComeAgain}
            >
                🔄 Come Again
            </button>
        </div>
    );
};
