import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MockBackend, AgentPlan } from '@/services/mockBackend';
import { BookOpen, Play, Calendar } from 'lucide-react';

export function MyClassDashboard() {
    const navigate = useNavigate();
    const [plan, setPlan] = useState<AgentPlan | null>(null);

    useEffect(() => {
        MockBackend.getMyClass()
            .then(data => setPlan(data.plan))
            .catch(() => navigate('/teach-me'));
    }, []);

    if (!plan) return null;

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Class</h1>

            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary to-purple-600 relative">
                    <div className="absolute bottom-6 left-8">
                        <span className="px-3 py-1 bg-black/30 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            Active Course
                        </span>
                        <h2 className="text-3xl font-black text-white mt-2">{plan.topic}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="flex items-center gap-8 mb-8 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                            <span>{plan.totalUnits} Units</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>Created Today</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-8">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500 uppercase">Progress</span>
                            <span className="text-2xl font-bold text-primary">0%</span>
                        </div>
                        <div className="flex-1 mx-6 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-0" />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/teach-me/class/units')}
                        className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/25"
                    >
                        <Play className="w-5 h-5 fill-current" /> Continue Learning
                    </button>
                </div>
            </div>
        </div>
    );
}
