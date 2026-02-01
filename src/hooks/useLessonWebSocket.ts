import { useEffect, useState, useCallback } from 'react';
import { MockBackend } from '@/services/mockBackend';

interface PlanStep {
    id: number;
    stepIndex: number;
    stepType: string;
    stepStatus: string;
    stepPayload: {
        textToSpeak?: string;
        canvasHtmlContent?: string;
        conversationQuestion?: string;
    };
}

export const useLessonWebSocket = (sessionId: string | null) => {
    const [steps, setSteps] = useState<PlanStep[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAudioStep, setCurrentAudioStep] = useState<number | null>(null);
    const [completedAudioSteps, setCompletedAudioSteps] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!sessionId) return;

        let isMounted = true;

        setIsConnected(false);
        setError(null);

        MockBackend.getSessionSteps(sessionId)
            .then((data) => {
                if (!isMounted) return;
                setSteps(data || []);
                setIsConnected(true);
                setCompletedAudioSteps(new Set((data || []).map(step => step.id)));
                setCurrentAudioStep(null);
            })
            .catch(() => {
                if (!isMounted) return;
                setError('Failed to load session');
                setIsConnected(false);
            });

        return () => {
            isMounted = false;
        };
    }, [sessionId]); // Only reconnect when sessionId changes, NOT when audio handlers change

    // Send step completion to backend
    const sendStepCompleted = useCallback((stepId: number) => {
        setCompletedAudioSteps(prev => new Set([...prev, stepId]));
    }, []);

    // Send keepalive ping
    const sendPing = useCallback(() => {}, []);

    const replayAudio = useCallback(() => {}, []);

    return {
        ws: null,
        steps,
        isConnected,
        error,
        sendStepCompleted,
        sendPing,
        currentAudioStep,        // Track which step is playing audio
        completedAudioSteps,     // Set of steps with completed audio
        replayAudio              // Function to replay audio (Come Again)
    };
};
