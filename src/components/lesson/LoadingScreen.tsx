import React from 'react';
import './LoadingScreen.css';

import { AJIBADE_AVATAR } from '@/lib/constants';

interface LoadingScreenProps {
    progress: number;
    message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, message }) => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="ajibade-logo">
                    <img src={AJIBADE_AVATAR} alt="Ajibade" className="loading-avatar" />
                    <div className="loading-pulse"></div>
                </div>

                <h2 className="loading-title">Preparing Your Lesson...</h2>
                <p className="loading-message">{message}</p>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <span className="progress-text">{progress}%</span>
            </div>
        </div>
    );
};
