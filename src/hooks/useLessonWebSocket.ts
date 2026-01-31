import { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioStreaming } from './useAudioStreaming';

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

interface WebSocketMessage {
    type: 'SESSION_BOOTSTRAP' | 'NEW_STEPS' | 'AUDIO_CHUNK' | 'AUDIO_END' |
    'AUDIO_ERROR' | 'STEP_COMPLETED_ACK' | 'SESSION_COMPLETED' | 'PONG';
    [key: string]: any;
}

export const useLessonWebSocket = (sessionId: string | null) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [steps, setSteps] = useState<PlanStep[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAudioStep, setCurrentAudioStep] = useState<number | null>(null);
    const [completedAudioSteps, setCompletedAudioSteps] = useState<Set<number>>(new Set());

    // Audio streaming with callbacks
    const { handleAudioChunk, handleAudioEnd, handleAudioError, replayAudio } = useAudioStreaming({
        onAudioStart: (stepId) => {
            console.log(`🎤 Audio started for step ${stepId}`);
            setCurrentAudioStep(stepId);
        },
        onAudioComplete: (stepId) => {
            console.log(`✅ Audio completed for step ${stepId}`);
            setCompletedAudioSteps(prev => new Set([...prev, stepId]));
            setCurrentAudioStep(null);
        }
    });

    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;

    useEffect(() => {
        if (!sessionId) return;

        // Get JWT token (same as HTTP requests)
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('❌ No auth token found');
            setError('Authentication required. Please log in.');
            return;
        }

        // WebSocket URL with token as query param (WebSocket doesn't support headers)
        const wsUrl = `ws://localhost:8080/ws/lesson/${sessionId}?token=${encodeURIComponent(token)}`;
        console.log('🔌 Connecting to WebSocket:', `ws://localhost:8080/ws/lesson/${sessionId}`);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            setError(null);
            reconnectAttempts.current = 0;
        };

        socket.onmessage = (event) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                console.log('📨 WebSocket message:', data.type, data);

                switch (data.type) {
                    case 'SESSION_BOOTSTRAP':
                        console.log('🚀 Session bootstrapped with', data.steps?.length || 0, 'steps');
                        setSteps(data.steps || []);
                        break;

                    case 'NEW_STEPS':
                        console.log('📝 New steps received:', data.steps?.length || 0);
                        setSteps(prev => [...prev, ...(data.steps || [])]);
                        break;

                    case 'AUDIO_CHUNK':
                        // Progressive audio playback via MediaSource API
                        handleAudioChunk({
                            stepId: data.stepId,
                            chunkIndex: data.chunkIndex,
                            audioData: data.audioData,
                            encoding: data.encoding || 'ogg-opus'
                        });
                        break;

                    case 'AUDIO_END':
                        // Signal end of audio stream
                        handleAudioEnd(data.stepId, data.totalChunks);
                        break;

                    case 'AUDIO_ERROR':
                        console.warn('⚠️ Audio error:', data.message);
                        handleAudioError(data.stepId, data.message);
                        break;

                    case 'STEP_COMPLETED_ACK':
                        console.log('✅ Step completion acknowledged');
                        break;

                    case 'SESSION_COMPLETED':
                        console.log('🎉 Lesson completed!', data.message);
                        break;

                    case 'PONG':
                        // Keepalive response
                        break;

                    default:
                        console.warn('❓ Unknown message type:', data.type);
                }
            } catch (err) {
                console.error('❌ Failed to parse WebSocket message:', err);
            }
        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            setError('Connection error occurred');
        };

        socket.onclose = (event) => {
            console.log('🔌 WebSocket closed:', event.code, event.reason);
            setIsConnected(false);

            // Auto-reconnect logic (max 3 attempts)
            if (reconnectAttempts.current < maxReconnectAttempts && !event.wasClean) {
                reconnectAttempts.current++;
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`);

                setTimeout(() => {
                    // Trigger reconnect by re-running effect
                    setWs(null);
                }, delay);
            } else if (reconnectAttempts.current >= maxReconnectAttempts) {
                setError('Connection lost. Please refresh the page.');
            }
        };

        setWs(socket);

        // Cleanup on unmount
        return () => {
            console.log('🧹 Cleaning up WebSocket connection');
            socket.close(1000, 'Component unmounted');
        };
    }, [sessionId]); // Only reconnect when sessionId changes, NOT when audio handlers change

    // Send step completion to backend
    const sendStepCompleted = useCallback((stepId: number) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('📤 Sending STEP_COMPLETED for step', stepId);
            ws.send(JSON.stringify({
                type: 'STEP_COMPLETED',
                data: { stepId }
            }));
        } else {
            console.warn('⚠️ Cannot send step completed - WebSocket not connected');
        }
    }, [ws]);

    // Send keepalive ping
    const sendPing = useCallback(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
        }
    }, [ws]);

    // Setup ping interval (every 30 seconds)
    useEffect(() => {
        if (!isConnected) return;

        const pingInterval = setInterval(() => {
            sendPing();
        }, 30000);

        return () => clearInterval(pingInterval);
    }, [isConnected, sendPing]);

    return {
        ws,
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
