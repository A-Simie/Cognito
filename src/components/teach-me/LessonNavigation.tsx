import { ChevronDown, ChevronRight, Check, Lock, Book, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export interface Lesson {
    id: string;
    title: string;
    completed: boolean;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface LessonNavigationProps {
    lessons: Lesson[];
    currentLessonId: string;
    onSelectLesson: (id: string) => void;
    className?: string;
}

export function LessonNavigation({ lessons, currentLessonId, onSelectLesson, className }: LessonNavigationProps) {
    const isLessonLocked = (index: number) => {
        if (index === 0) return false;
        return !lessons[index - 1].completed;
    };

    const getProgress = () => {
        const total = lessons.length;
        const completed = lessons.filter(l => l.completed).length;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#1a1b26] border-r border-gray-800", className)}>
            <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
                <h2 className="font-bold text-lg tracking-tight text-white">
                    Cognito <span className="text-purple-500 font-normal">Teach Me</span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col py-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-6">
                    Course Modules
                </h3>

                <div className="flex flex-col">
                    {lessons.map((lesson, index) => {
                        const locked = isLessonLocked(index);
                        const active = currentLessonId === lesson.id;

                        return (
                            <button
                                key={lesson.id}
                                disabled={locked}
                                onClick={() => onSelectLesson(lesson.id)}
                                className={cn(
                                    "px-6 py-3 flex items-center justify-between text-sm font-medium transition-colors text-left w-full",
                                    active
                                        ? "bg-gray-800/50 text-white"
                                        : locked
                                            ? "text-gray-500 cursor-not-allowed"
                                            : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                                )}
                            >
                                <span className="truncate pr-4">
                                    {index + 1}. {lesson.title}
                                </span>
                                {locked && (
                                    <Lock className="w-4 h-4 shrink-0 text-gray-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 border-t border-gray-800 shrink-0 mb-safe">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500">Course Progress</span>
                    <span className="text-xs font-bold text-purple-500">{getProgress()}%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${getProgress()}%` }} />
                </div>
            </div>
        </div>
    );
}
