import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lesson } from './LessonNavigation';

interface LessonWorkspaceProps {
    lesson: Lesson;
}

export function LessonWorkspace({ lesson }: LessonWorkspaceProps) {
    const [showVisual, setShowVisual] = useState(true);

    return (
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark bg-[size:20px_20px] bg-grid-pattern dark:bg-grid-pattern-dark">
            {/* Header / Iframe Container */}
            <div className="flex-1 p-4 lg:p-6 min-h-0 flex flex-col">
                <div className={cn(
                    "flex-1 w-full bg-indigo-50 dark:bg-black rounded-2xl border-2 border-indigo-100 dark:border-gray-800 overflow-hidden relative shadow-sm",
                )}>
                    {showVisual ? (
                        <div className="w-full h-full relative">
                            {/* Mock Canvas Animation */}
                            <CanvasAnimation />

                            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                                <span className="px-2 py-1 bg-black/50 text-white text-[10px] font-mono rounded uppercase">
                                    Canvas Active
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <button
                                onClick={() => setShowVisual(true)}
                                className="text-sm font-bold text-indigo-500 hover:text-indigo-600 underline"
                            >
                                Show Visual
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area Removed as per request */}
        </div>
    );
}

function CanvasAnimation() {
    return (
        <iframe
            srcDoc={`
                <!DOCTYPE html>
                <html>
                <body style="margin:0;overflow:hidden;background:#000;">
                    <canvas id="c"></canvas>
                    <script>
                        const c = document.getElementById('c');
                        const ctx = c.getContext('2d');
                        let w, h;
                        
                        function resize() {
                            w = c.width = window.innerWidth;
                            h = c.height = window.innerHeight;
                        }
                        window.addEventListener('resize', resize);
                        resize();

                        const particles = Array.from({length: 50}, () => ({
                            x: Math.random() * w,
                            y: Math.random() * h,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2,
                            size: Math.random() * 3 + 1,
                            color: \`hsl(\${Math.random() * 60 + 200}, 70%, 60%)\`
                        }));

                        function animate() {
                            ctx.fillStyle = 'rgba(0,0,0,0.1)';
                            ctx.fillRect(0, 0, w, h);
                            
                            particles.forEach(p => {
                                p.x += p.vx;
                                p.y += p.vy;
                                
                                if(p.x < 0 || p.x > w) p.vx *= -1;
                                if(p.y < 0 || p.y > h) p.vy *= -1;
                                
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                                ctx.fillStyle = p.color;
                                ctx.fill();
                            });
                            
                            requestAnimationFrame(animate);
                        }
                        animate();
                    </script>
                </body>
                </html>
            `}
            className="w-full h-full border-none"
            title="Canvas Animation"
        />
    );
}
