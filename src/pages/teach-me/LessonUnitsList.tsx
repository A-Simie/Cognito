import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '@/lib/services/classService';
import { Lock, PlayCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonUnit } from '@/lib/types';

export function LessonUnitsList() {
    const navigate = useNavigate();
    const [units, setUnits] = useState<LessonUnit[]>([]);
    const [classTitle, setClassTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedClassId = localStorage.getItem('currentClassId');
        if (!storedClassId) {
            navigate('/classes');
            return;
        }

        const id = parseInt(storedClassId);

        classService.getClassById(id)
            .then((cls) => {
                if (cls) {
                    let extractedUnits: LessonUnit[] = [];
                    if (cls.learningMode === 'YOUTUBE_TUTOR' && cls.youtubeLessonUnits) {
                        extractedUnits = cls.youtubeLessonUnits;
                    } else if (cls.learningMode === 'PDF_TUTOR' && cls.pdfLessonUnits) {
                        extractedUnits = cls.pdfLessonUnits;
                    } else {
                        extractedUnits = cls.lessonUnits || [];
                    }
                    
                    extractedUnits.sort((a, b) => a.unitOrder - b.unitOrder);
                    
                    setUnits(extractedUnits);
                    
                    try {
                        if (cls.title.startsWith('{')) {
                            const parsed = JSON.parse(cls.title);
                            setClassTitle(parsed.topicText || cls.title);
                        } else {
                            setClassTitle(cls.title);
                        }
                    } catch {
                        setClassTitle(cls.title);
                    }
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load class:', error);
                setLoading(false);
                navigate('/classes');
            });
    }, [navigate]);

    const handleUnitClick = (unit: LessonUnit) => {
        if (unit.unitStatus === 'NOT_STARTED' && unit.unitOrder > 0) {
        }
        navigate('/teach-me/session/setup', { state: { unit }, replace: true });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b26] text-gray-900 dark:text-white">
                Loading units...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#1a1b26]">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white/95 dark:bg-[#1a1b26]/95 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={() => navigate('/classes')} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white truncate">
                    {classTitle || 'Class Curriculum'}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 max-w-4xl mx-auto w-full">
                <div className="flex flex-col gap-3 pb-6">
                    {units.length > 0 ? units.map((unit) => {
                        const isCompleted = unit.unitStatus === 'COMPLETED';
                        const isCurrent = unit.unitStatus === 'IN_PROGRESS';
                        const isLocked = false;

                        return (
                            <button
                                key={unit.unitOrder} 
                                disabled={isLocked}
                                onClick={() => handleUnitClick(unit)}
                                className={cn(
                                    "group w-full p-4 rounded-xl border-2 flex items-center justify-between text-left transition-all duration-300 bg-white dark:bg-transparent",
                                    isCurrent
                                        ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-md"
                                        : isCompleted
                                            ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                            : "border-gray-100 dark:border-gray-800 opacity-80 hover:opacity-100 hover:border-gray-200 dark:hover:border-gray-700"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                        isCurrent ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                    )}>
                                        {unit.unitOrder + 1}
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-base mb-1 text-gray-900 dark:text-white",
                                            isCompleted && "text-gray-500 dark:text-gray-400"
                                        )}>
                                            {unit.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                            <span>{unit.unitType || 'Lesson'}</span>
                                            {/* Duration logic if available */}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-gray-400 dark:text-gray-500">
                                    {isLocked && <Lock className="w-5 h-5" />}
                                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                                    {isCurrent && <PlayCircle className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />}
                                    {!isLocked && !isCompleted && !isCurrent && <PlayCircle className="w-5 h-5 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                </div>
                            </button>
                        );
                    }) : (
                        <div className="text-center text-gray-500 mt-10">No units found for this class.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
