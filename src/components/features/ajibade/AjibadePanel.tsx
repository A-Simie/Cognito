import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, Mic, MicOff, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface AjibadePanelProps {
    className?: string;
}

const AJIBADE_AVATAR =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkH0kka7DRgS-jI7Ly3Of2i2wqkEdRvuAbPmhSPvb0UK1bQ8j5N9IKTM_osJ2ZJjMeyr-uKs50xFNFKGocFqESzHXw6y8_U1OVb95PYLYshFSMqAfK_sqprcZRIEm1swDinLba1DP2flEI7gg2gcP_sBmTW36RDuuOh5Zc8PtkfxdunITyPK2Un-ZvNycNDJmBqfa1FKWvAIwOoglokkaoonVbXUzYa_gL8O_eDfMA9cpJwQgf4ks9BbNOIzr-qz-3iHEov1jxzIz9';

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm Ajibade, your AI tutor. How can I help you learn today?",
        timestamp: '10:23 AM',
    },
];

export function AjibadePanel({ className }: AjibadePanelProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "That's a great question! Let me help you understand this concept better.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 1500);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Audio recording logic would go here
        if (!isRecording) {
            // Start recording
            setTimeout(() => {
                setIsRecording(false);
                setInput((prev) => prev + (prev ? ' ' : '') + 'Voice message transcribed...');
            }, 2000);
        }
    };

    return (
        <div className={cn('flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl', className)}>
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-full blur-lg opacity-60" />
                        <Avatar src={AJIBADE_AVATAR} alt="Ajibade" size="lg" ring className="relative" />
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-xl text-white tracking-tight">Ajibade AI Tutor</h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm text-emerald-400 font-medium">Online • Ready to help</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/50">
                <div className="flex justify-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest bg-slate-800/80 px-4 py-1.5 rounded-full border border-white/5">
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
                {isTyping && <TypingIndicator />}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/5">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-2xl border border-white/10 focus-within:border-primary/40 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-primary/10">
                        <button
                            type="button"
                            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-xl"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="flex-1 bg-transparent border-0 py-2.5 text-sm focus:ring-0 focus:outline-none text-white placeholder-slate-500"
                            placeholder="Ask a question..."
                        />
                        
                        {/* Audio Record Button */}
                        <button
                            type="button"
                            onClick={toggleRecording}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-300",
                                isRecording 
                                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
                                    : "text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        
                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="p-2.5 bg-gradient-to-r from-primary to-indigo-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
                <p className="text-xs text-center text-slate-500 mt-3">
                    Ajibade can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
}
