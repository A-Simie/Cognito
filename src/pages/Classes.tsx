import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Play, Check, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { classService } from '@/lib/services/classService';
import { Class } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Classes() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const [showBanner, setShowBanner] = useState(!!state?.message);
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

    return (
        <AppLayout>
            <div className="max-w-[1440px] mx-auto p-6 lg:p-10">
                <AnimatePresence>
                    {showBanner && state?.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-between shadow-sm"
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
                    <Link to="/teach-me/topic">
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" /> Create New Class
                        </Button>
                    </Link>
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
                                            className="p-5 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
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
                                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    {cls.classStatus || 'ACTIVE'}
                                                </span>
                                                <span>•</span>
                                                <span>{cls.lessons || 0} units</span>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                    <span>Progress</span>
                                                    <span className="font-bold">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            progress === 100
                                                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                                : "bg-gradient-to-r from-primary to-indigo-500"
                                                        )}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <Button className="w-full">
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
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center border-2 border-primary/20">
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
                        <Link to="/teach-me/topic">
                            <Button size="lg" className="shadow-lg shadow-primary/20">
                                <Plus className="w-5 h-5" /> Create Your First Class
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
