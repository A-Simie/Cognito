import { Send, Mic, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function ChatPanel() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant' as const,
            content: 'Hello! I\'m Ajibade, your AI Tutor. How can I help you understand this lesson?'
        }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        // Add user message
        const newMessages = [
            ...messages,
            { id: Date.now().toString(), role: 'user' as const, content: message }
        ];

        setMessages(newMessages);
        setMessage('');

        // Simulate AI response
        setTimeout(() => {
            setMessages([
                ...newMessages,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant' as const,
                    content: 'I understand your question. Let me explain...'
                }
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 border-l border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-gray-900">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Ajibade AI</h3>
                    <p className="text-xs text-gray-400">Your AI Tutor</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-700 text-gray-100'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-1 bg-gray-800 text-white placeholder:text-gray-500 px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors border border-gray-700">
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
