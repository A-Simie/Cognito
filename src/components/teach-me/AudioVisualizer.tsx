import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    isSpeaking: boolean;
    audioStream?: MediaStream; // Optional: if we have real mic input later
}

export function AudioVisualizer({ isSpeaking }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t = 0;

        const animate = () => {
            // Resize
            if (canvas.width !== canvas.offsetWidth) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }

            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Only animate if speaking
            if (isSpeaking) {
                ctx.beginPath();
                ctx.moveTo(0, cy);

                const segments = 50;
                // Dynamic amplitude based on "voice" simulation
                // In real app, this would use analyserNode.getByteFrequencyData()
                const baseAmp = h * 0.3;

                for (let i = 0; i <= segments; i++) {
                    const x = (i / segments) * w;
                    // Perlin-ish noise simulation for voice wave
                    const y = cy +
                        Math.sin(i * 0.5 + t) * baseAmp * Math.sin(t * 2) * 0.5 +
                        Math.sin(i * 0.2 - t * 1.5) * (baseAmp * 0.5);

                    ctx.lineTo(x, y);
                }

                ctx.strokeStyle = '#a855f7'; // Primary Purple
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();

                // Secondary ghost wave
                ctx.beginPath();
                ctx.moveTo(0, cy);
                for (let i = 0; i <= segments; i++) {
                    const x = (i / segments) * w;
                    const y = cy + Math.sin(i * 0.5 + t - 1) * (baseAmp * 0.7);
                    ctx.lineTo(x, y);
                }
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                t += 0.2; // Speed
            } else {
                // Idle State: Flat-ish line with gentle breathe
                ctx.beginPath();
                ctx.moveTo(0, cy);
                ctx.lineTo(w, cy);
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isSpeaking]);

    return (
        <canvas ref={canvasRef} className="w-full h-12" />
    );
}
