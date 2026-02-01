import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MockBackend } from '@/services/mockBackend';
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
            const unitId = state.unit.id;

            if (!unitId || !classId) {
                navigate('/classes');
                return;
            }

            try {
                // Show initial progress  
                setLoadingProgress(5);
                setLoadingMessage('Initializing session...');

                // Small delay for UX
                await new Promise(resolve => setTimeout(resolve, 300));

                setLoadingProgress(30);
                setLoadingMessage('Creating your learning session...');

                // Start lesson - mock backend creates session
                const response = await MockBackend.startLesson(classId, unitId);

                setLoadingProgress(70);
                setLoadingMessage('Loading lesson content...');

                const sessionId = response.sessionId;
                if (!sessionId) {
                    throw new Error('No session ID returned');
                }

                setLoadingProgress(100);
                setLoadingMessage('Ready! Starting lesson...');

                // Brief pause before navigation for smooth transition
                await new Promise(resolve => setTimeout(resolve, 500));

                // Navigate to lesson session
                navigate(`/teach-me/session/${sessionId}`, { replace: true });

            } catch (error) {
                console.error('Failed to start lesson:', error);
                navigate('/teach-me/class/units');
            }
        };

        startLesson();
    }, [state, navigate]);

    return <LoadingScreen progress={loadingProgress} message={loadingMessage} />;
}
