import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'wss://ubiquitous-waffle-6qvpjpg6gwxhpw6-8080.app.github.dev/ws/lesson/';

export interface LessonStep {
    id: string;
    stepType: 'NORMAL' | 'CLARIFICATION' | 'CONCLUSION';
    stepPayload: {
        textToSpeak: string;
        canvasHtmlContent?: string;
        quizzesJson?: any[];
    };
}

export function useLessonWebSocket(sessionId: string | null) {
    const socketRef = useRef<WebSocket | null>(null);
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [currentAudioStep] = useState<string | null>(null);
    const [completedAudioSteps, setCompletedAudioSteps] = useState<Set<string>>(new Set());
    const [clarificationResponse, setClarificationResponse] = useState<LessonStep | null>(null);
    const [isLoadingClarification, setIsLoadingClarification] = useState(false);

    useEffect(() => {
        if (!sessionId) return;

        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
        
        if (!token) {
            console.error("No auth token found for WS connection");
            return;
        }

        const wsUrl = `${WS_BASE_URL}${sessionId}?token=${token}`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WS Connected");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                handleMessage(message);
            } catch (e) {
                console.error("Failed to parse WS message", e);
            }
        };

        ws.onclose = () => {
            console.log("WS Disconnected");
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("WS Error", error);
        };

        return () => {
            ws.close();
        };
    }, [sessionId]);

    const handleMessage = (message: any) => {
        switch (message.type) {
            case 'NEXT_STEP':
                if (message.step) {
                    const stepWithId = { ...message.step, id: Date.now().toString() };
                    setSteps(prev => [...prev, stepWithId]);
                }
                break;
            case 'CLARIFICATION_RESPONSE':
                if (message.step) {
                    const stepWithId = { ...message.step, id: Date.now().toString() };
                    setClarificationResponse(stepWithId);
                    setIsLoadingClarification(false);
                }
                break;
            case 'LOAD_INSTRUCTION':
                setIsLoadingClarification(true);
                break;
            case 'AUDIO_CHUNK':
                break;
            case 'AUDIO_END':
                 if (steps.length > 0) {
                     const lastStep = steps[steps.length - 1];
                     if (lastStep) {
                        setCompletedAudioSteps(prev => new Set(prev).add(lastStep.id));
                     }
                 }
                break;
            default:
                console.log("Unhandled WS message", message.type);
        }
    };

    const sendStepCompleted = useCallback(() => {
        socketRef.current?.send(JSON.stringify({ type: 'STEP_COMPLETED', data: {} }));
    }, []);

    const sendMessage = useCallback((type: string, data: any) => {
        socketRef.current?.send(JSON.stringify({ type, data }));
    }, []);

    const clearClarification = useCallback(() => {
        setClarificationResponse(null);
    }, []);

    return {
        steps,
        isConnected,
        sendStepCompleted,
        sendMessage,
        currentAudioStep,
        completedAudioSteps,
        clarificationResponse,
        isLoadingClarification,
        clearClarification,
    };
}
