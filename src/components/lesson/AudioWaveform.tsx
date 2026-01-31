import React from 'react';
import './AudioWaveform.css';

interface AudioWaveformProps {
    isActive: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isActive }) => {
    const bars = Array.from({ length: 40 }, (_, i) => i);

    return (
        <div className="audio-waveform">
            {bars.map((i) => (
                <div
                    key={i}
                    className={`wave-bar ${isActive ? 'active' : ''}`}
                    style={{
                        animationDelay: `${i * 0.05}s`
                    }}
                />
            ))}
        </div>
    );
};
