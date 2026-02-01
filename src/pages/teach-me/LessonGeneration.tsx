import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MockBackend } from '@/services/mockBackend';
import { Loader2 } from 'lucide-react';

export function LessonGeneration() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Analyzing topic...');
    const [progress, setProgress] = useState(5); // Start at 5% (user's fun idea! 😂)
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Prevent duplicate execution in React Strict Mode
        if (hasInitialized.current) {
            return;
        }
        hasInitialized.current = true;

        if (!state?.topic) {
            navigate('/teach-me');
            return;
        }

        // Create class using mock backend
        const createClass = async () => {
            try {
                // Progress starts at 5%
                setProgress(5);
                setStatus(`Analyzing "${state.topic}"...`);

                // Step 1: Create class via mock backend
                const newClass = await MockBackend.generatePlan(state.topic);
                const classId = newClass.id;

                // Step 2: Fetch units
                setStatus('Structuring core concepts...');
                await MockBackend.getLessonUnits(classId);

                setStatus('Generating lesson modules...');
                await new Promise(resolve => setTimeout(resolve, 600));

                setStatus('Finalizing curriculum...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                // SUCCESS! Jump to 100%
                setProgress(100);

                // Store classId for later use
                localStorage.setItem('currentClassId', classId.toString());

                // Navigate to My Classes with success state
                setTimeout(() => {
                    navigate('/classes', {
                        state: {
                            newClassId: classId,
                            message: `"${state.topic}" class created successfully!`
                        },
                        replace: true
                    });
                }, 300); // Brief delay to show 100%

            } catch (error) {
                console.error('Failed to create class:', error);
                setStatus('Failed to generate syllabus. Please try again.');
                setProgress(0);
                // Show error for 3 seconds then go back
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

            {/* Progress Bar (fun 5% → 100% animation!) */}
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
