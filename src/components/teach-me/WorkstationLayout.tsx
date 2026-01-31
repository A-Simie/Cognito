import { ReactNode, useState, useEffect } from 'react';
import { Menu, X, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkstationLayoutProps {
    navigation: ReactNode;
    workspace: ReactNode;
    tutor: ReactNode;
}

export function WorkstationLayout({ navigation, workspace, tutor }: WorkstationLayoutProps) {
    const [navOpen, setNavOpen] = useState(false);
    const [tutorOpen, setTutorOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="h-dvh flex flex-col lg:flex-row bg-background-light dark:bg-background-dark overflow-hidden relative">
            {/* Left Column (Navigation) - Desktop: Fixed, Mobile: Drawer */}
            <aside className="hidden lg:block w-[280px] shrink-0 h-full border-r border-gray-200 dark:border-gray-800 z-20">
                {navigation}
            </aside>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {navOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setNavOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-white dark:bg-gray-900 shadow-xl lg:hidden"
                        >
                            {navigation}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {/* Center Column (Workspace) - Mobile: Top Half (60%), Desktop: Flex-1 */}
            <main className="flex-1 flex flex-col min-w-0 h-[60%] lg:h-full relative z-10 border-b lg:border-b-0 border-gray-200 dark:border-gray-800">
                {/* Mobile Header (Absolute) */}
                <header className="absolute top-4 left-4 right-4 z-50 lg:hidden flex justify-between items-center">
                    <button onClick={() => setNavOpen(true)} className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-gray-900 dark:text-white">Teach Me</span>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {workspace}
                </div>
            </main>

            {/* Right Column (Tutor) - Mobile: Bottom Half (40%), Desktop: Fixed Side */}
            <aside className="h-[40%] lg:h-full lg:w-[320px] shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 flex flex-col">
                {tutor}
            </aside>
        </div>
    );
}
