import React from 'react';

const AJIBADE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkH0kka7DRgS-jI7Ly3Of2i2wqkEdRvuAbPmhSPvb0UK1bQ8j5N9IKTM_osJ2ZJjMeyr-uKs50xFNFKGocFqESzHXw6y8_U1OVb95PYLYshFSMqAfK_sqprcZRIEm1swDinLba1DP2flEI7gg2gcP_sBmTW36RDuuOh5Zc8PtkfxdunITyPK2Un-ZvNycNDJmBqfa1FKWvAIwOoglokkaoonVbXUzYa_gL8O_eDfMA9cpJwQgf4ks9BbNOIzr-qz-3iHEov1jxzIz9';

interface AjibadeAvatarProps {
    isSpeaking: boolean;
}

export const AjibadeAvatar: React.FC<AjibadeAvatarProps> = ({ isSpeaking }) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                {/* Glow effect */}
                <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-500 ${
                    isSpeaking 
                        ? 'bg-gradient-to-r from-cyan-400/50 to-indigo-500/50 animate-pulse' 
                        : 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30'
                }`} />
                
                {/* Avatar frame */}
                <div className={`relative w-28 h-28 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                    isSpeaking 
                        ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]' 
                        : 'border-white/20'
                }`}>
                    <img
                        src={AJIBADE_AVATAR}
                        alt="Ajibade - Your AI Teacher"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            
            {/* Status badge */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                isSpeaking 
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300' 
                    : 'bg-white/10 border-white/20 text-white/80'
            }`}>
                <span className={`w-2 h-2 rounded-full ${
                    isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
                }`} />
                <span className="text-sm font-medium">
                    {isSpeaking ? 'Speaking...' : 'Ready'}
                </span>
            </div>
        </div>
    );
};
