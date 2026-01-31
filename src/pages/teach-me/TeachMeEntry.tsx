import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TeachMeEntry() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 h-full flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <button
                onClick={() => navigate('/teach-me/topic')}
                className="group relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 text-left border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75" />

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                        Teach Me
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed mb-8">
                        Learn any topic step by step with Ajibade. <br />
                        Just pick a subject, and we'll create a personalized lesson plan for you.
                    </p>

                    <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:translate-x-2 transition-transform">
                        Start Learning <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </button>
        </div>
    );
}
