import { useRef, useCallback } from 'react';

interface AudioChunkData {
    stepId: number;
    chunkIndex: number;
    audioData: string;
    encoding: string;
}

interface StepAudioState {
    mediaSource: MediaSource;
    sourceBuffer: SourceBuffer | null;
    audioElement: HTMLAudioElement;
    chunkQueue: Uint8Array[];
    expectedChunkIndex: number;
    isAppending: boolean;
    hasError: boolean;
    cachedChunks: Uint8Array[];
}

interface AudioStreamingCallbacks {
    onAudioComplete?: (stepId: number) => void; 
    onAudioStart?: (stepId: number) => void;     
}

export const useAudioStreaming = (callbacks?: AudioStreamingCallbacks) => {
    const activeAudioStreams = useRef<Map<number, StepAudioState>>(new Map());
    const stepAudioCache = useRef<Map<number, Uint8Array[]>>(new Map()); 

    const handleAudioChunk = useCallback((data: AudioChunkData) => {
        const { stepId, chunkIndex, audioData } = data;

        // Decode base64 to binary
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        let state = activeAudioStreams.current.get(stepId);

        // First chunk - initialize MediaSource
        if (!state) {
            // CRITICAL: Chunk 1 contains OGG_OPUS header
            if (chunkIndex !== 1) {
                console.error(`❌ Missing header chunk for step ${stepId}. Expected chunk 1, got ${chunkIndex}`);
                return;
            }

            const mediaSource = new MediaSource();
            const audioElement = new Audio();
            audioElement.src = URL.createObjectURL(mediaSource);

            state = {
                mediaSource,
                sourceBuffer: null,
                audioElement,
                chunkQueue: [],
                expectedChunkIndex: 1,
                isAppending: false,
                hasError: false,
                cachedChunks: []
            };

            activeAudioStreams.current.set(stepId, state);

            mediaSource.addEventListener('sourceopen', () => {
                try {
                    const sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs=opus');
                    state!.sourceBuffer = sourceBuffer;

                    sourceBuffer.addEventListener('updateend', () => {
                        state!.isAppending = false;
                        processChunkQueue(stepId);
                    });

                    // Start playback immediately
                    audioElement.play().catch(err => {
                        console.warn('⚠️ Audio autoplay blocked:', err);
                        console.log('ℹ️ User may need to interact with page first');
                    });

                    // Notify audio started
                    callbacks?.onAudioStart?.(stepId);

                    // Cache and append first chunk
                    state!.cachedChunks.push(bytes);
                    state!.chunkQueue.push(bytes);
                    processChunkQueue(stepId);

                } catch (err) {
                    console.error('❌ Failed to create SourceBuffer:', err);
                    state!.hasError = true;
                }
            });

            return;
        }

        // Validate chunk order
        if (chunkIndex !== state.expectedChunkIndex) {
            console.error(`❌ Out-of-order chunk for step ${stepId}. Expected ${state.expectedChunkIndex}, got ${chunkIndex}`);
            state.hasError = true;
            cleanupAudioStream(stepId);
            return;
        }

        state.expectedChunkIndex++;

        // Cache and queue chunk
        if (!state.hasError) {
            state.cachedChunks.push(bytes);
            state.chunkQueue.push(bytes);
            processChunkQueue(stepId);
        }

    }, [callbacks]);

    const handleAudioEnd = useCallback((stepId: number, totalChunks: number) => {
        const state = activeAudioStreams.current.get(stepId);
        if (!state) return;

        // Save cached chunks for replay
        stepAudioCache.current.set(stepId, [...state.cachedChunks]);
        console.log(`✅ Audio cached for step ${stepId}: ${state.cachedChunks.length} chunks`);

        // End of stream
        if (state.mediaSource.readyState === 'open') {
            state.mediaSource.endOfStream();
            console.log(`✅ Audio stream completed for step ${stepId}: ${totalChunks} chunks`);
        }

        // Notify that audio is complete (enable Next button)
        callbacks?.onAudioComplete?.(stepId);

        // Cleanup after playback ends
        state.audioElement.onended = () => {
            cleanupAudioStream(stepId);
        };
    }, [callbacks]);

    const processChunkQueue = (stepId: number) => {
        const state = activeAudioStreams.current.get(stepId);
        if (!state || state.isAppending || state.chunkQueue.length === 0) {
            return;
        }

        const sourceBuffer = state.sourceBuffer;
        if (!sourceBuffer || sourceBuffer.updating) {
            return;
        }

        // Append next chunk
        const chunk = state.chunkQueue.shift()!;
        state.isAppending = true;

        try {
            sourceBuffer.appendBuffer(chunk.buffer as ArrayBuffer);
        } catch (err) {
            console.error('❌ Failed to append audio chunk:', err);
            state.hasError = true;
            cleanupAudioStream(stepId);
        }
    };

    const cleanupAudioStream = (stepId: number) => {
        const state = activeAudioStreams.current.get(stepId);
        if (!state) return;

        try {
            state.audioElement.pause();
            URL.revokeObjectURL(state.audioElement.src);
        } catch (err) {
            console.warn('Cleanup error:', err);
        }

        activeAudioStreams.current.delete(stepId);
    };

    const handleAudioError = (stepId: number, message: string) => {
        console.warn(`⚠️ Audio error for step ${stepId}: ${message}`);
        cleanupAudioStream(stepId);
    };

    /**
     * Replay audio from cache (Come Again button)
     */
    const replayAudio = useCallback((stepId: number) => {
        console.log(`🔄 Replaying audio for step ${stepId}`);

        const cachedChunks = stepAudioCache.current.get(stepId);
        if (!cachedChunks || cachedChunks.length === 0) {
            console.warn(`⚠️ No cached audio for step ${stepId}`);
            return false;
        }

        // Cleanup any existing stream
        cleanupAudioStream(stepId);

        // Create fresh MediaSource for replay
        const mediaSource = new MediaSource();
        const audioElement = new Audio();
        audioElement.src = URL.createObjectURL(mediaSource);

        const state: StepAudioState = {
            mediaSource,
            sourceBuffer: null,
            audioElement,
            chunkQueue: [],
            expectedChunkIndex: 1,
            isAppending: false,
            hasError: false,
            cachedChunks: cachedChunks
        };

        activeAudioStreams.current.set(stepId, state);

        mediaSource.addEventListener('sourceopen', () => {
            try {
                const sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs=opus');
                state.sourceBuffer = sourceBuffer;

                sourceBuffer.addEventListener('updateend', () => {
                    state.isAppending = false;
                    processChunkQueue(stepId);
                });

                // Start playback
                audioElement.play().catch(err => {
                    console.warn('⚠️ Replay autoplay blocked:', err);
                });

                // Notify audio started
                callbacks?.onAudioStart?.(stepId);

                // Queue all cached chunks
                state.chunkQueue.push(...cachedChunks);
                processChunkQueue(stepId);

                // Close stream after all chunks appended
                const checkComplete = () => {
                    if (state.chunkQueue.length === 0 && !state.isAppending) {
                        if (mediaSource.readyState === 'open') {
                            mediaSource.endOfStream();
                        }
                        callbacks?.onAudioComplete?.(stepId);
                    } else {
                        setTimeout(checkComplete, 100);
                    }
                };
                checkComplete();

            } catch (err) {
                console.error('❌ Failed to replay audio:', err);
                state.hasError = true;
                cleanupAudioStream(stepId);
            }
        });

        return true;
    }, [callbacks]);

    return {
        handleAudioChunk,
        handleAudioEnd,
        handleAudioError,
        replayAudio  // Export for Come Again button
    };
};
