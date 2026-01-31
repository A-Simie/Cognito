import React from 'react';
import './LoadingScreen.css';

const AJIBADE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkH0kka7DRgS-jI7Ly3Of2i2wqkEdRvuAbPmhSPvb0UK1bQ8j5N9IKTM_osJ2ZJjMeyr-uKs50xFNFKGocFqESzHXw6y8_U1OVb95PYLYshFSMqAfK_sqprcZRIEm1swDinLba1DP2flEI7gg2gcP_sBmTW36RDuuOh5Zc8PtkfxdunITyPK2Un-ZvNycNDJmBqfa1FKWvAIwOoglokkaoonVbXUzYa_gL8O_eDfMA9cpJwQgf4ks9BbNOIzr-qz-3iHEov1jxzIz9';

interface LoadingScreenProps {
    progress: number; // 0-100
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
