import React from 'react';
import './StepProgress.css';

interface StepProgressProps {
    current: number;
    total: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ current, total }) => {
    const percentage = Math.round(((current + 1) / total) * 100);

    return (
        <div className="step-progress">
            <div className="progress-header">
                <span className="step-label">Step {current + 1} / {total}</span>
                <span className="progress-percent">{percentage}%</span>
            </div>

            <div className="progress-dots">
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className={`dot ${i < current ? 'completed' :
                                i === current ? 'active' : 'pending'
                            }`}
                    />
                ))}
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
