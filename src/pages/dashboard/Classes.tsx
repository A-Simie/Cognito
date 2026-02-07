import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Play, Check, X, FileText, Youtube } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { classService } from '@/lib/services/classService';
import { Class } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';

export default function Classes() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(!!state?.message);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const newClassId = state?.newClassId;

    useEffect(() => {
        classService.getClasses()
            .then(setClasses)
            .catch((err) => {
                console.error(err);
                setClasses([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Creation Dialog Component inline for simplicity (or can be separate)
    const CreationDialog = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Class</h2>
                    <button onClick={() => setShowCreateDialog(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid gap-4">
                    <button
                        onClick={() => navigate('/teach-me/topic')}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">From a Topic</h3>
                            <p className="text-sm text-slate-500">Let AI generate a curriculum from any topic you choose.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/teach-me/youtube-setup')}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left"
                    >
                        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                            <Youtube className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">From YouTube</h3>
                            <p className="text-sm text-slate-500">Turn any YouTube video into an interactive lesson.</p>
                        </div>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                            <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">Coming Soon</span>
                        </div>
                        <button disabled className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 opacity-60 text-left">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">From PDF</h3>
                                <p className="text-sm text-slate-500">Upload a document to get summaries and quizzes.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    return (
        <AppLayout>
            <div className="max-w-[1440px] mx-auto p-6 lg:p-10 relative">
                <AnimatePresence>
                    {showBanner && state?.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-between shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-green-800 dark:text-green-200 font-medium">
                                    {state.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="p-1 hover:bg-green-100 cursor-pointer dark:hover:bg-green-800 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Track your enrolled courses and progress
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Create New Class
                    </Button>
                </motion.div>

                {loading ? (
                    <div className="col-span-full text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400">Loading your classes...</p>
                    </div>
                ) : classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls: Class, i: number) => {
                            const isNew = newClassId === cls.id;
                            const progress = cls.classCompletionPercentage || 0;
                            const hasProgress = progress > 0;

                            // Determine icon based on mode
                            const ModeIcon = cls.learningMode === 'YOUTUBE_TUTOR' ? Youtube :
                                cls.learningMode === 'PDF_TUTOR' ? FileText : BookOpen;

                            return (
                                <motion.div
                                    key={cls.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to="/teach-me/class/units"
                                        className="block group"
                                        onClick={() => {
                                            localStorage.setItem('currentClassId', cls.id.toString());
                                        }}
                                    >
                                        <Card
                                            variant="interactive"
                                            className="p-5 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-shadow relative overflow-hidden"
                                        >
                                            {/* Mode Indicator */}
                                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                                <ModeIcon className="w-24 h-24" />
                                            </div>

                                            <div className="flex items-center justify-between mb-3 relative z-10">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 pr-4">
                                                    {(() => {
                                                        try {
                                                            if (typeof cls.title === 'string' && cls.title.startsWith('{')) {
                                                                const parsed = JSON.parse(cls.title);
                                                                return parsed.topicText || cls.title;
                                                            }
                                                            return cls.title;
                                                        } catch {
                                                            return cls.title;
                                                        }
                                                    })()}
                                                </h3>
                                                {isNew && (
                                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 shrink-0">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 relative z-10">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    {cls.classStatus || 'ACTIVE'}
                                                </span>
                                                <span>•</span>
                                                <span>{cls.lessons || 0} units</span>
                                                <span>•</span>
                                                <span className="uppercase font-bold tracking-wider text-[10px]">
                                                    {cls.learningMode?.replace('_TUTOR', '') || 'TOPIC'}
                                                </span>
                                            </div>

                                            <div className="mb-4 relative z-10">
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                    <span>Progress</span>
                                                    <span className="font-bold">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-500",
                                                            progress === 100
                                                                ? "bg-linear-to-r from-green-500 to-emerald-500"
                                                                : "bg-linear-to-r from-primary to-indigo-500"
                                                        )}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <Button className="w-full relative z-10">
                                                {progress === 100 ? (
                                                    <>
                                                        <Check className="w-4 h-4" /> Review
                                                    </>
                                                ) : hasProgress ? (
                                                    <>
                                                        <Play className="w-4 h-4 fill-current" /> Resume Learning
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4 fill-current" /> Start Learning
                                                    </>
                                                )}
                                            </Button>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                            <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center border-2 border-primary/20">
                                <BookOpen className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No classes yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                            Start your learning journey by creating your first class.
                            Ajibade will guide you every step of the way!
                        </p>
                        <Button
                            size="lg"
                            className="shadow-lg shadow-primary/20"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="w-5 h-5" /> Create Your First Class
                        </Button>
                    </motion.div>
                )}

                {/* Creation Dialog */}
                <AnimatePresence>
                    {showCreateDialog && <CreationDialog />}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
