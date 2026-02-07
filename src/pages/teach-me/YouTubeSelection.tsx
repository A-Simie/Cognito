import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Youtube, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { classService } from '@/lib/services/classService';

export default function YouTubeSelection() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<{ duration: number; title: string, videoId: string } | null>(null);
    const [error, setError] = useState('');
    const playerRef = useRef<any>(null);

    // Load YouTube API
    useEffect(() => {
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }
    }, []);

    const extractVideoId = (inputUrl: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = inputUrl.match(regex);
        return match ? match[1] : null;
    };

    const handleVerify = () => {
        setError('');
        setVideoData(null);
        const videoId = extractVideoId(url);

        if (!videoId) {
            setError('Invalid YouTube URL. Please check and try again.');
            return;
        }

        setIsLoading(true);

        // If player already exists, load new video
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(videoId);
            return; // onStateChange or onReady will handle the rest? 
            // Actually, we need to wait for metadata. 
            // If we rely on existing events, we might need a flag.
            // Simplest is to destroy and recreate or just use the hidden player.
        }

        const onPlayerReady = (event: any) => {
            const duration = event.target.getDuration();
            const data = event.target.getVideoData(); // title, author, etc.

            // Sometimes duration is 0 immediately on ready, might need to wait for metadata
            if (duration > 0) {
                setVideoData({
                    duration,
                    title: data.title || 'Unknown Video',
                    videoId
                });
                setIsLoading(false);
            } else {
                // Retry or play muted to get metadata
                event.target.mute();
                event.target.playVideo();
            }
        };

        const onPlayerStateChange = (event: any) => {
            // If we had to play to get duration
            if (event.data === 1 || event.data === 5) { // Playing or Cued
                const duration = event.target.getDuration();
                if (duration > 0 && !videoData) {
                    const data = event.target.getVideoData();
                    setVideoData({
                        duration,
                        title: data.title || 'YouTube Video',
                        videoId
                    });
                    setIsLoading(false);
                    event.target.pauseVideo();
                }
            }
        };

        // Initialize player
        if ((window as any).YT && (window as any).YT.Player) {
            // Destroy old if exists logic tricky with React, usually ref handles it.
            // But we only create once.
            if (!playerRef.current) {
                playerRef.current = new (window as any).YT.Player('hidden-player', {
                    height: '0',
                    width: '0',
                    videoId: videoId,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange,
                        'onError': () => {
                            setError('Failed to load video. It might be private or restricted.');
                            setIsLoading(false);
                        }
                    }
                });
            }
        } else {
            // Wait for API
            (window as any).onYouTubeIframeAPIReady = () => {
                handleVerify(); // Retry verify once API is ready
            };
        }
    };

    const handleCreateClass = async () => {
        if (!videoData) return;

        setIsLoading(true);
        try {
            await classService.createYoutubeClass(url, videoData.duration);
            // Navigate to classes list with success message
            navigate('/classes', {
                state: {
                    newClassId: 'latest', // We don't have ID easily unless we return it from service (we do).
                    // Service returns the class? Yes, response.data
                    message: 'YouTube Class Created Successfully!'
                }
            });
        } catch (err) {
            console.error(err);
            setError('Failed to create class. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format seconds to HH:MM:SS
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Hidden Player */}
            <div id="hidden-player" className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none" />

            <div className="p-6">
                <button
                    onClick={() => navigate('/classes')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Classes</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 w-full">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Youtube className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            New YouTube Class
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Paste a YouTube URL to generate an interactive lesson.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setVideoData(null); // Reset when URL changes
                                    setError('');
                                }}
                                className="h-14 text-lg"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {videoData && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                                <div className="flex gap-4">
                                    <div className="w-24 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0 overflow-hidden relative">
                                        <img
                                            src={`https://img.youtube.com/vi/${videoData.videoId}/mqdefault.jpg`}
                                            className="w-full h-full object-cover"
                                            alt="Thumbnail"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {videoData.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDuration(videoData.duration)}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!videoData ? (
                            <Button
                                onClick={handleVerify}
                                disabled={!url || isLoading}
                                className="w-full h-12 text-lg font-medium"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Verifying Video...
                                    </>
                                ) : (
                                    'Verify URL'
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCreateClass}
                                disabled={isLoading}
                                className="w-full h-12 text-lg font-medium bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Creating Class...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 mr-2 fill-current" />
                                        Create Class
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
