import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";

import { AJIBADE_AVATAR } from "@/lib/types/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  audioUrl?: string;
}

interface AjibadePanelProps {
  className?: string;
  onSendMessage: (message: string, audioData?: string) => void;
  clarificationResponse?: {
    id?: string;
    stepPayload: { textToSpeak: string };
  } | null;
  isLoadingClarification?: boolean;
  disabled?: boolean;
  currentStepText?: string | null;
  onPlaybackEnded?: () => void;
  onAudioStatusChange?: (isPlaying: boolean) => void;
}

const INITIAL_MESSAGES: Message[] = [];

const Waveform = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-center gap-1 h-8">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <motion.div
        key={i}
        className="w-1 bg-emerald-400 rounded-full"
        animate={
          isPlaying
            ? {
                height: [8, 16, 8, 24, 8],
              }
            : {
                height: 4,
              }
        }
        transition={{
          duration: 0.5,
          repeat: Infinity,
          delay: i * 0.05,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export function AjibadePanel({
  className,
  onSendMessage,
  clarificationResponse,
  isLoadingClarification,
  disabled = false,
  currentStepText,
  onPlaybackEnded,
  onAudioStatusChange,
}: AjibadePanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const onPlaybackEndedRef = useRef(onPlaybackEnded);

  useEffect(() => {
    onPlaybackEndedRef.current = onPlaybackEnded;
  }, [onPlaybackEnded]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const playbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }
    };

    initAudioContext();

    return () => {
      stopAudio();
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        /* ignore */
      }
    });
    activeSourcesRef.current = [];
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    onAudioStatusChange?.(false);
    nextStartTimeRef.current = 0;

    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
  };

  const processAudioChunk = (base64Audio: string) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    try {
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const samples = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        if (sample !== undefined) {
          float32Data[i] = sample / 32768.0;
        }
      }

      const buffer = ctx.createBuffer(1, float32Data.length, 24000);
      buffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      const scheduleTime = Math.max(
        currentTime + 0.05,
        nextStartTimeRef.current,
      );

      source.start(scheduleTime);
      nextStartTimeRef.current = scheduleTime + buffer.duration;

      activeSourcesRef.current.push(source);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(
          (s) => s !== source,
        );
      };

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        setIsPlayingAudio(true);
        // Synchronously notify parent that audio is starting
        onAudioStatusChange?.(true);
      }

      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }

      const timeUntilEnd = (nextStartTimeRef.current - currentTime) * 1000;

      playbackTimeoutRef.current = setTimeout(() => {
        if (
          audioContextRef.current &&
          audioContextRef.current.currentTime >= nextStartTimeRef.current - 0.1
        ) {
          isPlayingRef.current = false;
          setIsPlayingAudio(false);
          // Notify parent that audio has ended
          onAudioStatusChange?.(false);
          onPlaybackEndedRef.current?.();
        }
      }, timeUntilEnd + 100);
    } catch (e) {
      console.error("Error processing audio chunk:", e);
    }
  };

  useEffect(() => {
    const handleAudioChunk = (event: CustomEvent<string>) => {
      const base64Audio = event.detail;
      if (!base64Audio) return;

      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }

      processAudioChunk(base64Audio);
    };

    window.addEventListener(
      "lesson-audio-chunk",
      handleAudioChunk as EventListener,
    );

    return () => {
      window.removeEventListener(
        "lesson-audio-chunk",
        handleAudioChunk as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (currentStepText) {
      const newMsg: Message = {
        id: `transcript-${Date.now()}`,
        role: "assistant",
        content: currentStepText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1]?.content === currentStepText
        )
          return prev;
        return [...prev, newMsg];
      });
    }
  }, [currentStepText]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isMobileOpen]);

  useEffect(() => {
    if (clarificationResponse) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: clarificationResponse.stepPayload.textToSpeak,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (audioContextRef.current) {
        nextStartTimeRef.current = audioContextRef.current.currentTime + 0.1;

        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current
            .resume()
            .catch((e) => console.error("Auto-resume failed:", e));
        }
      } else {
        nextStartTimeRef.current = 0;
      }
    }
  }, [clarificationResponse]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e: FormEvent, audioData?: string) => {
    e.preventDefault();
    if (!input.trim() && !audioData) return;

    let audioUrl: string | undefined;
    if (audioData && audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      audioUrl = URL.createObjectURL(blob);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || (audioData ? "🎤 Voice Message" : ""),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      audioUrl: audioUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage(input.trim(), audioData);
    setInput("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use low bitrate Opus for compact message size (prevent 1009 Too Big)
      const options = {
        mimeType: "audio/webm;codecs=opus",
        bitsPerSecond: 16000,
      };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Strip the data:audio/webm;base64, prefix
          const base64Data = base64String.split(",")[1];
          handleSubmit({ preventDefault: () => {} } as FormEvent, base64Data);
        };

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(
        "Could not access microphone. Please ensure permissions are granted.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col bg-slate-900/95 backdrop-blur-xl border-l border-white/10 relative transition-transform duration-300",
          "lg:relative lg:translate-y-0",
          className,
        )}
      >
        <div
          className="lg:hidden absolute -top-8 left-0 right-0 h-8 bg-slate-900/95 rounded-t-xl flex items-center justify-center border-t border-x border-white/10 cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
        </div>

        <div className="p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                src={AJIBADE_AVATAR}
                alt="Ajibade"
                size="lg"
                ring
                className="relative"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">
                Ajibade AI
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPlayingAudio && <Waveform isPlaying={isPlayingAudio} />}
          </div>
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/50"
        >
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              Today
            </span>
          </div>
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1 w-full">
              <MessageBubble
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                avatar={
                  message.role === "assistant" ? AJIBADE_AVATAR : undefined
                }
              />
              {/* Render Audio Player if audioUrl exists */}
              {message.audioUrl && (
                <div
                  className={cn(
                    "flex w-full mt-1",
                    message.role === "user"
                      ? "justify-end pr-12"
                      : "justify-start pl-12",
                  )}
                >
                  <audio
                    controls
                    src={message.audioUrl}
                    className="h-8 w-48 rounded-full shadow-sm bg-slate-100 dark:bg-slate-700"
                  />
                </div>
              )}
            </div>
          ))}
          {isLoadingClarification && (
            <div className="flex items-center gap-2 text-slate-400 pl-2">
              <span className="text-xs animate-pulse">
                Ajibade is typing...
              </span>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 shrink-0">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-white/10 focus-within:border-primary/40 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="flex-1 bg-transparent border-0 py-2 px-3 text-sm focus:ring-0 focus:outline-none text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={
                  disabled ? "Complete the quiz first..." : "Message..."
                }
              />

              <button
                type="button"
                onClick={toggleRecording}
                disabled={disabled}
                className={cn(
                  "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  isRecording
                    ? "bg-red-500/20 text-red-500"
                    : "text-slate-400 hover:text-white",
                )}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
