import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || "ws://akimy.me:8080/ws";

export interface LessonStep {
    id: string;
    stepType: 'NORMAL' | 'CLARIFICATION' | 'CONCLUSION' | 'YOUTUBE';
    stepPayload: {
        textToSpeak: string;
        canvasHtmlContent?: string;
        quizzesJson?: any[];
        pauseAtSeconds?: number;
    };
}

export function useLessonWebSocket(sessionId: string | null, isYouTubeMode: boolean = false) {
    const socketRef = useRef<WebSocket | null>(null);
    const [steps, setSteps] = useState<LessonStep[]>([]);

    // Track the LAST step ID that arrived, so we can associate AUDIO_END with it reliably.
    const lastStepIdRef = useRef<string | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [completedAudioSteps, setCompletedAudioSteps] = useState<Set<string>>(new Set());

    const [clarificationResponse, setClarificationResponse] = useState<LessonStep | null>(null);
    const [isLoadingClarification, setIsLoadingClarification] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completionStats, setCompletionStats] = useState<any>(null);

    // Ref to hold the latest sendStepCompleted function
    const sendStepCompletedRef = useRef<() => void>(() => { });

    useEffect(() => {
        if (!sessionId) return;

        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

        if (!token) {
            console.error("No auth token found for WS connection");
            return;
        }

        const wsUrl = `${WS_BASE_URL}/lesson/${sessionId}?token=${encodeURIComponent(token)}`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'PING' }));
            }
        }, 10000);

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

        ws.onclose = (event) => {
            console.log("WS Disconnected", event.code, event.reason);
            setIsConnected(false);
            clearInterval(pingInterval);
        };

        ws.onerror = (error) => {
            console.error("WS Error", error);
        };

        return () => {
            clearInterval(pingInterval);
            ws.close();
        };
    }, [sessionId]);

    const handleMessage = (message: any) => {
        console.log("📩 WS Received:", message.type, message);
        switch (message.type) {
            case 'INITIALIZING':
                console.log("Lesson Initializing:", message.message);
                break;
            case 'NEXT_STEP':
                if (message.step) {
                    const stepWithId = { ...message.step, id: message.step.id || crypto.randomUUID() };
                    lastStepIdRef.current = stepWithId.id;
                    setSteps(prev => [...prev, stepWithId]);
                    setClarificationResponse(null);
                }
                break;
            case 'YOUTUBE_STEP': {
                const step = message.step;
                if (step) {
                    const stepWithId = {
                        ...step,
                        id: step.id || crypto.randomUUID(),
                        // Ensure it's mapped to LessonStep interface if needed
                        stepType: step.stepType || 'YOUTUBE'
                    };
                    lastStepIdRef.current = stepWithId.id;
                    setSteps(prev => [...prev, stepWithId]);
                    setClarificationResponse(null);
                    setIsLoadingClarification(false);
                }
                break;
            }
            case 'YOUTUBE_STEP_LOADING':
                console.log("YouTube step loading...");
                setIsLoadingClarification(true);
                break;
            case 'CLARIFICATION_RESPONSE':
                if (message.step) {
                    let step = message.step;
                    // Detect if flat YouTubeStep
                    if (!step.stepType && (step.textToSpeak || step.pauseAtSeconds)) {
                        let quizzes = step.quizzesJson;
                        if (quizzes && typeof quizzes === 'string') {
                            try {
                                quizzes = JSON.parse(quizzes);
                            } catch (e) { console.error("Failed to parse quizzesJson", e); }
                        }
                        step = {
                            id: step.id || crypto.randomUUID(),
                            stepType: 'CLARIFICATION',
                            stepPayload: {
                                textToSpeak: step.textToSpeak,
                                quizzesJson: quizzes,
                                pauseAtSeconds: step.pauseAtSeconds
                            }
                        };
                    } else if (!step.id) {
                        step.id = crypto.randomUUID();
                    }
                    setClarificationResponse(step);
                    setIsLoadingClarification(false);
                }
                break;
            case 'LOAD_INSTRUCTION':
                setIsLoadingClarification(true);
                break;
            case 'PONG':
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
                    window.dispatchEvent(new CustomEvent('lesson-audio-end', { detail: { stepId } }));

                    // Auto-advance if it's a normal teaching step (no quiz)
                    // We need to check the current step's payload.
                    // Since 'steps' state might be stale in this callback, we use the functional update pattern or a ref.
                    // But accessing 'steps' here is tricky due to closure.
                    // Better approach: Dispatch event or let the component handle logic?
                    // Let's use a ref for the latest steps.
                }
                break;
            case 'YOUTUBE_LESSON_COMPLETED':
            case 'SESSION_COMPLETED':
                console.log("Lesson Completed:", message);
                setIsCompleted(true);
                if (message.stats) setCompletionStats(message.stats);
                break;
            default:
                console.log("Unhandled WS message", message.type);
        }
    };

    const sendMessage = useCallback((type: string, data: any) => {
        console.log(`📤 WS Sending: ${type}`, data);
        socketRef.current?.send(JSON.stringify({ type, data }));
    }, []);

    const sendStepCompleted = useCallback(() => {
        console.log(`Sending step completed. Mode: ${isYouTubeMode ? 'YOUTUBE' : 'NORMAL'}`);
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: isYouTubeMode ? 'YOUTUBE_STEP_COMPLETED' : 'STEP_COMPLETED',
                ...(isYouTubeMode ? {} : { data: { sessionId } }) // STEP_COMPLETED usually wants data object?
                // Wait, GUIDE says STEP_COMPLETED has { sessionId } inside? No, it's inside body usually.
                // Normal mode: { type: 'STEP_COMPLETED', data: { sessionId: ... } } (if using sendMessage style)
                // But here we construct manually. Let's match existing sendMessage style.
                // sendMessage wraps in { type, data }. 
                // So here:
                // Normal: { type: 'STEP_COMPLETED', data: { sessionId } }
                // YouTube: { type: 'YOUTUBE_STEP_COMPLETED' } (no data)
            }));
        }
    }, [sessionId, isYouTubeMode]);

    // Update the ref
    useEffect(() => {
        sendStepCompletedRef.current = sendStepCompleted;
    }, [sendStepCompleted]);

    const requestTTS = useCallback((textToSpeak: string) => {
        console.log("Requesting TTS for YouTube step");
        // GUIDE says type: REQUEST_TTS, data: { textToSpeak }
        // sendMessage wraps in data property, so this works.
        sendMessage('REQUEST_TTS', { textToSpeak });
    }, [sendMessage]);

    return {
        steps,
        isConnected,
        sendMessage,
        clarificationResponse,
        isLoadingClarification,
        sendStepCompleted,
        completedAudioSteps,
        requestTTS,
        isCompleted,
        completionStats,
    };
}
