import React from 'react';
import './AjibadeAvatar.css';

const AJIBADE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkH0kka7DRgS-jI7Ly3Of2i2wqkEdRvuAbPmhSPvb0UK1bQ8j5N9IKTM_osJ2ZJjMeyr-uKs50xFNFKGocFqESzHXw6y8_U1OVb95PYLYshFSMqAfK_sqprcZRIEm1swDinLba1DP2flEI7gg2gcP_sBmTW36RDuuOh5Zc8PtkfxdunITyPK2Un-ZvNycNDJmBqfa1FKWvAIwOoglokkaoonVbXUzYa_gL8O_eDfMA9cpJwQgf4ks9BbNOIzr-qz-3iHEov1jxzIz9';

interface AjibadeAvatarProps {
    isSpeaking: boolean;
}

export const AjibadeAvatar: React.FC<AjibadeAvatarProps> = ({ isSpeaking }) => {
    return (
        <div className="ajibade-avatar-container">
            <div className={`avatar-frame ${isSpeaking ? 'speaking' : ''}`}>
                <img
                    src={AJIBADE_AVATAR}
                    alt="Ajibade - Your AI Teacher"
                    className="avatar-image"
                />
            </div>
            <div className="avatar-status">
                {isSpeaking ? '🎙️ Speaking...' : '📚 Ready'}
            </div>
        </div>
    );
};
