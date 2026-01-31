import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export function TopicSelection() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!topic.trim() || loading) return;

        setLoading(true);
        try {
            // Create class immediately - backend generates units in background
            const response = await api.post('/topic_class_creation', {
                topicText: topic
            });

            const newClass = response.data; // Full MyClass object

            // Parse title if it's JSON
            let displayTitle = newClass.title;
            try {
                if (typeof newClass.title === 'string' && newClass.title.startsWith('{')) {
                    const parsed = JSON.parse(newClass.title);
                    displayTitle = parsed.topicText || newClass.title;
                }
            } catch {
                // If parsing fails, use original title
                displayTitle = newClass.title;
            }

            // Store classId for later use
            localStorage.setItem('currentClassId', newClass.id.toString());

            // Navigate to Classes page immediately with success message
            navigate('/classes', {
                state: {
                    newClassId: newClass.id,
                    message: `"${displayTitle}" class created! Click to view curriculum.`
                },
                replace: true
            });
        } catch (error) {
            console.error('Failed to create class:', error);
            alert('Failed to create class. Please try again.');
            setLoading(false);
        }
    };

    const suggestions = ['Python Basics', 'React Hooks', 'Quantum Physics', 'French Revolution'];

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark max-w-2xl mx-auto w-full">
            <div className="w-full">
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" /> Topic Selection
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                        What do you want to learn?
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Ajibade will generate a custom curriculum just for you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative mb-8">
                    <Input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Introduction to Astrophysics..."
                        className="w-full h-16 text-lg px-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-primary shadow-lg transition-all"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!topic.trim() || loading}
                        className="absolute right-2 top-2 h-12 px-6 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        {loading ? 'Creating...' : 'Teach Me'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map(s => (
                        <button
                            key={s}
                            onClick={() => setTopic(s)}
                            className="px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary/50 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors shadow-sm"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
