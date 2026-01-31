import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Lock, PlayCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonUnit {
    id: number;
    title: string;
    description: string;
    duration: number;              // Matches backend field name
    unitOrder: number;             // Added - backend uses this
    unitType: string;              // Added - backend uses this
    unitStatus: 'LOCKED' | 'IN_PROGRESS' | 'AVAILABLE' | 'COMPLETED';  // Added IN_PROGRESS
}


export function LessonUnitsList() {
    const navigate = useNavigate();
    const [units, setUnits] = useState<LessonUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [classId, setClassId] = useState<number | null>(null);

    useEffect(() => {
        // Get classId from localStorage or navigation state
        const storedClassId = localStorage.getItem('currentClassId');
        if (!storedClassId) {
            navigate('/classes');
            return;
        }

        const id = parseInt(storedClassId);
        setClassId(id);

        // Fetch units from real backend - with polling if needed
        const checkUnits = async (attempts = 0): Promise<void> => {
            const maxAttempts = 25; // 50 seconds max (2s interval)

            try {
                const response = await api.get(`/${id}/lesson-units`);

                if (response.data && response.data.length > 0) {
                    // Units ready!
                    setUnits(response.data);
                    setLoading(false);
                } else if (attempts < maxAttempts) {
                    // Units not ready yet, poll again in 2s
                    console.log(`Units not ready yet, retrying... (${attempts + 1}/${maxAttempts})`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return checkUnits(attempts + 1);
                } else {
                    // Timeout
                    console.error('Timeout waiting for units');
                    setLoading(false);
                    navigate('/classes');
                }
            } catch (error) {
                console.error('Failed to load units:', error);
                setLoading(false);
                navigate('/classes');
            }
        };

        checkUnits();
    }, []); // Empty deps - run ONLY on mount!

    const handleUnitClick = (unit: LessonUnit) => {
        if (unit.unitStatus === 'LOCKED') return;
        navigate('/teach-me/session/setup', { state: { unit } });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#1a1b26]">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0 bg-[#1a1b26]/95 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={() => navigate('/classes')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors mr-2">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-lg tracking-tight text-white">
                    Course <span className="text-purple-500 font-normal">Curriculum</span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 max-w-4xl mx-auto w-full">
                <div className="flex flex-col gap-3 pb-6">
                    {units.map((unit) => {
                        const isLocked = unit.unitStatus === 'LOCKED';
                        const isCompleted = unit.unitStatus === 'COMPLETED';
                        const isCurrent = unit.unitStatus === 'IN_PROGRESS';

                        return (
                            <button
                                key={unit.id}
                                disabled={isLocked}
                                onClick={() => handleUnitClick(unit)}
                                className={cn(
                                    "group w-full p-4 rounded-xl border-2 flex items-center justify-between text-left transition-all duration-300",
                                    isCurrent
                                        ? "bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                        : isCompleted
                                            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                                            : "bg-gray-900/50 border-transparent opacity-60 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                        isCurrent ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-500"
                                    )}>
                                        {unit.unitOrder}
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-base mb-1",
                                            isCurrent ? "text-white" : isCompleted ? "text-gray-300" : "text-gray-500"
                                        )}>
                                            {unit.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                            <span>{unit.unitType}</span>
                                            <span>•</span>
                                            <span>{unit.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-gray-500">
                                    {isLocked && <Lock className="w-5 h-5" />}
                                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                                    {isCurrent && <PlayCircle className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
