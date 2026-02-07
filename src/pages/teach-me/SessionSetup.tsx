import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { classService } from '@/lib/services/classService';
import { LoadingScreen } from '@/components/lesson/LoadingScreen';

export function SessionSetup() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loadingProgress, setLoadingProgress] = useState(5);
    const [loadingMessage, setLoadingMessage] = useState('Initializing session...');

    useEffect(() => {
        const startLesson = async () => {
            if (!state?.unit) {
                navigate('/teach-me/class/units');
                return;
            }

            const classId = parseInt(localStorage.getItem('currentClassId') || '0');
            const unitIndex = Math.max(0, state.unit.unitOrder - 1);

            if (unitIndex === undefined || !classId) {
                navigate('/classes');
                return;
            }

            try {
                setLoadingProgress(5);
                setLoadingMessage('Initializing session...');

                await new Promise(resolve => setTimeout(resolve, 300));

                setLoadingProgress(30);
                setLoadingMessage('Creating your learning session...');

                const response = await classService.startLesson(classId, unitIndex);

                setLoadingProgress(70);
                setLoadingMessage('Loading lesson content...');

                const sessionId = response.sessionId;
                if (!sessionId) {
                    throw new Error('No session ID returned');
                }

                setLoadingProgress(100);
                setLoadingMessage('Ready! Starting lesson...');

                await new Promise(resolve => setTimeout(resolve, 500));

                navigate(`/teach-me/session/${sessionId}`, {
                    replace: true,
                    state: { unit: state.unit }
                });

            } catch (error) {
                navigate('/teach-me/class/units');
            }
        };

        startLesson();
    }, [state, navigate]);

    return <LoadingScreen progress={loadingProgress} message={loadingMessage} />;
}
