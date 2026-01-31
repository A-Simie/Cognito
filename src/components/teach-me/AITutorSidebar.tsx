import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, User, VolumeX, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioVisualizer } from './AudioVisualizer';

export function AITutorSidebar() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hello! I'm Ajibade, your AI Tutor. How can I help you understand this lesson?" }
    ]);
    const [input, setInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);

    // Audio Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio('/ajibade.mp3');
        audioRef.current.loop = true; // For demo purposes, loop the dummy audio

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Effect to handle play/pause based on isSpeaking and audioEnabled
    useEffect(() => {
        if (!audioRef.current) return;

        if (isSpeaking && audioEnabled) {
            audioRef.current.play().catch(e => console.warn("Audio play blocked", e));
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isSpeaking, audioEnabled]);

    const enableAudio = () => {
        if (!audioEnabled) {
            // Create a dummy context resume or just play/pause to unlock
            const dummy = new Audio();
            dummy.play().catch(() => { }); // Intentional no-op to unlock
            setAudioEnabled(true);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        enableAudio(); // Ensure unlocked
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');

        // Mock Response
        setTimeout(() => {
            setIsSpeaking(true);
            setMessages(prev => [...prev, { role: 'ai', text: "That's a great question! Let me explain..." }]);

            // Stop speaking after 5s
            setTimeout(() => setIsSpeaking(false), 5000);
        }, 1000);
    };

    const handleMicClick = () => {
        enableAudio();
        // Mock voice interaction
        setIsSpeaking(!isSpeaking);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 shadow-xl lg:shadow-none">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            A
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    </div>
                    <div className="hidden sm:block">
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white">Ajibade AI</h3>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            enableAudio();
                            setIsSpeaking(!isSpeaking);
                        }}
                        className={cn(
                            "p-1.5 rounded-full transition-colors",
                            isSpeaking ? "bg-red-100 text-red-500 animate-pulse" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                        )}
                        title="Toggle Voice"
                    >
                        {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                    {/* Moved Controls */}
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <User className="w-4 h-4" />
                    </button>
                    <Link to="/">
                        <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Exit">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                            msg.role === 'ai' ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        )}>
                            {msg.role === 'ai' ? 'A' : <User className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed",
                            msg.role === 'ai'
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                                : "bg-primary text-white rounded-tr-none"
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Typing/Speaking Indicator */}
                <div className="shrink-0 py-2 flex justify-center">
                    <AudioVisualizer isSpeaking={isSpeaking} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-[env(safe-area-inset-bottom)] shrink-0">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="pr-20 py-6 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-1 focus:ring-primary/20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                            onClick={handleMicClick}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
