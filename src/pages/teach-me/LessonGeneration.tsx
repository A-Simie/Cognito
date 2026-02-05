import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { classService } from '@/lib/services/classService';
import { Loader2 } from 'lucide-react';

export function LessonGeneration() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Analyzing topic...');
    const [progress, setProgress] = useState(5);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (!state?.topic) {
            navigate('/teach-me');
            return;
        }

const createClass = async () => {
    try {
        setProgress(5);
        setStatus(`Analyzing "${state.topic}"...`);

        const newClass = await classService.createTopicClass(state.topic);
        const classId = newClass.id;

        setStatus('Structuring core concepts...');
        setProgress(30);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStatus('Generating lesson modules...');
        setProgress(60);
        await new Promise(resolve => setTimeout(resolve, 500));

        setStatus('Finalizing curriculum...');
        setProgress(90);
        await new Promise(resolve => setTimeout(resolve, 500));

        setProgress(100);

        localStorage.setItem('currentClassId', classId.toString());
        
        let displayTitle = newClass.title;
        try {
            if (typeof newClass.title === 'string' && newClass.title.startsWith('{')) {
                const parsed = JSON.parse(newClass.title);
                displayTitle = parsed.topicText || newClass.title;
            }
        } catch {
                displayTitle = newClass.title;
        }

        setTimeout(() => {
            navigate('/classes', {
                state: {
                    newClassId: classId,
                    message: `"${displayTitle}" class created successfully!`
                },
                replace: true
            });
        }, 300);

    } catch (error) {
        setStatus('Failed to generate syllabus. Please try again.');
        setProgress(0);
        setTimeout(() => navigate('/teach-me/topic'), 3000);
    }
};

createClass();
    }, []);

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-xl">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-pulse">
                {status}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                Ajibade is crafting a personalized learning path for you.
            </p>

            <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {progress}%
                </p>
            </div>
        </div>
    );
}
