import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { AJIBADE_AVATAR } from '@/lib/constants';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface AjibadePanelProps {
    className?: string;
    onSendMessage: (message: string) => void;
    clarificationResponse?: { id?: string, stepPayload: { textToSpeak: string } } | null;
    isLoadingClarification?: boolean;
    disabled?: boolean;
    currentStepText?: string | null;
    onPlaybackEnded?: () => void;
}

const INITIAL_MESSAGES: Message[] = [];

// Simple waveform component mock for now - in real app would use Web Audio API or Canvas
const Waveform = ({ isPlaying }: { isPlaying: boolean }) => (
    <div className="flex items-center gap-1 h-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <motion.div
                key={i}
                className="w-1 bg-emerald-400 rounded-full"
                animate={isPlaying ? {
                    height: [8, 16, 8, 24, 8],
                } : {
                    height: 4
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);

export function AjibadePanel({
    className,
    onSendMessage,
    clarificationResponse,
    isLoadingClarification,
    disabled = false,
    currentStepText,
    onPlaybackEnded
}: AjibadePanelProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Default collapsed on mobile
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const onPlaybackEndedRef = useRef(onPlaybackEnded);

    // Update ref when prop changes
    useEffect(() => {
        onPlaybackEndedRef.current = onPlaybackEnded;
    }, [onPlaybackEnded]);

    // Stream Handling State
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);

    // Helper: Create WAV Header
    const createWavUrl = (pcmData: Uint8Array): string => {
        const numChannels = 1;
        const sampleRate = 24000; // Standard for Google TTS 'HD' voices (Chirp)
        const format = 1; // PCM
        const bitDepth = 16;

        const dataLength = pcmData.length;
        const buffer = new ArrayBuffer(44 + dataLength);
        const view = new DataView(buffer);

        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true); // ChunkSize
        writeString(view, 8, 'WAVE');

        // fmt sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
        view.setUint16(20, format, true); // AudioFormat
        view.setUint16(22, numChannels, true); // NumChannels
        view.setUint32(24, sampleRate, true); // SampleRate
        view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // ByteRate
        view.setUint16(32, numChannels * (bitDepth / 8), true); // BlockAlign
        view.setUint16(34, bitDepth, true); // BitsPerSample

        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true); // Subchunk2Size

        // Write Audio Data
        new Uint8Array(buffer, 44).set(pcmData);

        const blob = new Blob([buffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    // Process and Queue Audio Chunks
    useEffect(() => {
        const handleAudioChunk = (event: CustomEvent<string>) => {
            const base64Audio = event.detail;
            if (!base64Audio) return;

            try {
                // Decode chunk (Raw PCM)
                const binaryString = window.atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // Wrap in WAV container and Queue
                const url = createWavUrl(bytes);
                queueAudio(url);

            } catch (e) {
                console.error("Failed to process audio chunk", e);
            }
        };

        const queueAudio = (url: string) => {
            audioQueueRef.current.push(url);
            if (!isPlayingRef.current) {
                playNextInQueue();
            }
        };

        const playNextInQueue = () => {
            if (audioQueueRef.current.length === 0) {
                isPlayingRef.current = false;
                setIsPlayingAudio(false);
                onPlaybackEndedRef.current?.(); // Queue finished
                return;
            }

            const url = audioQueueRef.current.shift();
            if (!url) return;

            isPlayingRef.current = true;
            setIsPlayingAudio(true);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                URL.revokeObjectURL(url);
                playNextInQueue();
            };

            audio.onerror = (e) => {
                console.error("Audio playback error", e);
                // Try to play next if this one fails
                playNextInQueue();
            };

            audio.play().catch(e => {
                console.error("Audio play failed", e);
                playNextInQueue();
            });
        };

        // Reset state on step change or explicit stop
        const resetAudioState = () => {
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };

        window.addEventListener('lesson-audio-chunk', handleAudioChunk as EventListener);

        return () => {
            window.removeEventListener('lesson-audio-chunk', handleAudioChunk as EventListener);
            resetAudioState();
        };
    }, [currentStepText]); // Dependency on step text allows partial resets if needed

    // This prop needs to be passed in to handle normal step transcripts
    // For now, let's assume the parent passes relevant transcript info or we can't do it easily without a new prop.
    // Let's add a `currentStepText` prop.

    // Handle Normal Step Transcripts
    useEffect(() => {
        if (currentStepText) {
            const newMsg: Message = {
                id: `transcript-${Date.now()}`,
                role: 'assistant',
                content: currentStepText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => {
                // Avoid duplicate if last message is same
                if (prev.length > 0 && prev[prev.length - 1].content === currentStepText) return prev;
                return [...prev, newMsg];
            });
        }
    }, [currentStepText]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isMobileOpen]);

    useEffect(() => {
        if (clarificationResponse) {
            const aiMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: clarificationResponse.stepPayload.textToSpeak,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMessage]);
            if (!isMobileOpen) {
                // Optional: Auto-open on new message if crucial, or just show indicator
                // setIsMobileOpen(true);
            }
        }
    }, [clarificationResponse]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        onSendMessage(input.trim());
        setInput('');
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false);
                setInput((prev) => prev + (prev ? ' ' : '') + 'Voice message transcribed...');
            }, 2000);
        }
    };

    return (
        <>
            {/* Desktop View container - applied via className, uses existing structure */}
            <div className={cn(
                'flex flex-col bg-slate-900/95 backdrop-blur-xl border-l border-white/10 relative transition-transform duration-300',
                // Mobile handling: controlled by fixed positioning override if needed, or parent layout
                // But specifically for mobile bottom sheet request:
                'lg:relative lg:translate-y-0',
                className
            )}>
                {/* Mobile Handle / Toggle (Visible only on mobile) */}
                <div
                    className="lg:hidden absolute -top-8 left-0 right-0 h-8 bg-slate-900/95 rounded-t-xl flex items-center justify-center border-t border-x border-white/10 cursor-pointer"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
                </div>

                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar src={AJIBADE_AVATAR} alt="Ajibade" size="lg" ring className="relative" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white tracking-tight">Ajibade AI</h3>
                            {/* Removed "Online Ready to help" text as requested */}
                        </div>
                    </div>
                    {/* Waveform Visualization (Always visible in header when playing) */}
                    <div className="flex items-center gap-2">
                        {isPlayingAudio && <Waveform isPlaying={isPlayingAudio} />}
                    </div>
                </div>

                {/* Chat Area */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/50">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                            Today
                        </span>
                    </div>
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                            avatar={message.role === 'assistant' ? AJIBADE_AVATAR : undefined}
                        />
                    ))}
                    {isLoadingClarification && (
                        <div className="flex items-center gap-2 text-slate-400 pl-2">
                            <span className="text-xs animate-pulse">Ajibade is typing...</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 shrink-0">
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-white/10 focus-within:border-primary/40 transition-all">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={disabled}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                className="flex-1 bg-transparent border-0 py-2 px-3 text-sm focus:ring-0 focus:outline-none text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder={disabled ? "Complete the quiz first..." : "Message..."}
                            />

                            <button
                                type="button"
                                onClick={toggleRecording}
                                disabled={disabled}
                                className={cn(
                                    "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    isRecording
                                        ? "bg-red-500/20 text-red-500"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>

                            <button
                                type="submit"
                                disabled={disabled || !input.trim()}
                                className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile Bottom Sheet Overlay (Only renders on mobile via CSS/logic if we want true separation, but here we are using the main div structure. 
                Wait, the requirement is "bottom slidable panel showing by default".
                The current parent layout in LessonSession passes `w-full lg:w-1/3...`. 
                On mobile, it is `w-full h-[40vh]`. 
                If we want it slidable, we might need a Portal or fixed positioning here or in parent.
                Given the provided task context, simply resizing via `h-[40vh]` in parent (LessonSession) handles the "bottom panel" aspect. 
                The `isMobileOpen` state here could toggle height.
            */}
        </>
    );
}
