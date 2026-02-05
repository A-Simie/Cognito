import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

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

    // Track the LAST step ID that arrived, so we can associate AUDIO_END with it reliably.
    // This avoids "stale closure" issues where we look at `steps` state in a callback.
    const lastStepIdRef = useRef<string | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [completedAudioSteps, setCompletedAudioSteps] = useState<Set<string>>(new Set());

    const [clarificationResponse, setClarificationResponse] = useState<LessonStep | null>(null);
    const [isLoadingClarification, setIsLoadingClarification] = useState(false);


    // Ref to hold the latest sendStepCompleted function
    // This allows us to call it inside handleMessage without creating a circular dependency
    // or stale checks, satisfying the "sendStepCompleted must be in scope" requirement.
    const sendStepCompletedRef = useRef<() => void>(() => { });



    useEffect(() => {
        if (!sessionId) return;

        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

        if (!token) {
            console.error("No auth token found for WS connection");
            return;
        }

        // Fix: Encode token to handle special characters help
        // URL Pattern: ws://[host]/ws/lesson/{sessionId}?token={JWT_TOKEN}
        const wsUrl = `${WS_BASE_URL}/lesson/${sessionId}?token=${encodeURIComponent(token)}`;
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
            case 'INITIALIZING':
                console.log("Lesson Initializing:", message.message);
                break;
            case 'NEXT_STEP':
                if (message.step) {
                    // Fix: Use ID from message if available, else generate UUID. 
                    // Do NOT overwrite with Date.now() to ensure backend sync.
                    const stepWithId = { ...message.step, id: message.step.id || crypto.randomUUID() };

                    // Track this ID as the active one for audio association
                    lastStepIdRef.current = stepWithId.id;

                    setSteps(prev => [...prev, stepWithId]);
                }
                break;
            case 'CLARIFICATION_RESPONSE':
                if (message.step) {
                    const stepWithId = { ...message.step, id: message.step.id || crypto.randomUUID() };
                    setClarificationResponse(stepWithId);
                    setIsLoadingClarification(false);
                }
                break;
            case 'LOAD_INSTRUCTION':
                setIsLoadingClarification(true);
                break;
            case 'AUDIO_CHUNK':
                if (message.audioData) {
                    window.dispatchEvent(new CustomEvent('lesson-audio-chunk', { detail: message.audioData }));
                }
                break;
            case 'AUDIO_END':
                console.log("AUDIO_END received");
                const stepId = lastStepIdRef.current;
                if (stepId) {
                    setCompletedAudioSteps(prev => new Set(prev).add(stepId));
                    // Fix: We do NOT trigger next step request when audio ends blindly.
                    // The UI (AjibadePanel) listens for audio end and calls sendStepCompleted if appropriate (non-quiz).
                    // sendStepCompletedRef.current();
                }

                // Fix: Explicitly DO NOT advance mock step index here.
                // We wait for the client to call sendStepCompleted() after it finishes playing audio
                // or after the user completes the quiz.
                // if (sessionId === 'dev-session') {
                //      setMockStepIndex(prev => prev + 1);
                // }
                break;
            case 'StepCompleted':
                // Ack if needed
                break;
            default:
                console.log("Unhandled WS message", message.type);
        }
    };

    const sendStepCompleted = useCallback(() => {
        socketRef.current?.send(JSON.stringify({ type: 'STEP_COMPLETED', data: {} }));
    }, [sessionId]);

    // Keep the ref updated with the latest function
    useEffect(() => {
        sendStepCompletedRef.current = sendStepCompleted;
    }, [sendStepCompleted]);

    const sendMessage = useCallback((type: string, data: any) => {
        socketRef.current?.send(JSON.stringify({ type, data }));
    }, [sessionId]);

    return {
        steps,
        isConnected,
        sendMessage,
        clarificationResponse,
        isLoadingClarification,
        sendStepCompleted,
        completedAudioSteps,
    };
}
