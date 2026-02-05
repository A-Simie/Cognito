import { useState } from 'react';
import { LogOut, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AjibadePanel } from '@/components/features/ajibade';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { useIsMobile } from '@/hooks/useMediaQuery';


const VIDEO_THUMBNAIL =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7w9Xy9C9ekWE905vm3T_PQ7uCsAbTED9DlTJrdSAfpe083geJTcpDLrQEkc_q8v_W-SuY46MjbljrkpW8XmW9kkvxMGx-motQEgfcE3axq8s5CXPue6uAQpskEVwM-8g_4skaiF2Ml3mmSw3kAYYefbYfTePIL4SIX-DBDq_2tqbkPJvV8nOdCAQBfp86OSlCLuOkVYyGf96_w-UsNjAsB_YztVlSSvuV16c8cdqCFQaA_cNuw7X3kboXOf_GRDn8FGmev0QlJ2k4';

export default function YouTubeTutor() {
    const [isAjibadeOpen, setIsAjibadeOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800 shrink-0 z-20">
                <Link to="/" className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-8 h-8 text-primary flex items-center justify-center">
                        <svg className="h-full w-full" fill="none" viewBox="0 0 48 48">
                            <path
                                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                        Cognito
                    </h2>
                </Link>

                <div className="flex flex-col items-center flex-1 max-w-md mx-4">
                    <div className="flex justify-between w-full mb-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Lesson Progress
                        </span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Segment 3 of 12
                        </span>
                    </div>
                    <Progress value={25} variant="gradient" />
                </div>

                <div className="min-w-[200px] flex justify-end">
                    <Link to="/">
                        <Button variant="secondary" size="sm">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Exit Session</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10 scrollbar-hide">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                <img
                                    alt="Calculus lecture background"
                                    className="w-full h-full object-cover opacity-60"
                                    src={VIDEO_THUMBNAIL}
                                />
                                <button className="absolute flex cursor-pointer shrink-0 items-center justify-center rounded-full w-20 h-20 bg-primary/90 text-white hover:scale-105 transition-transform shadow-2xl backdrop-blur-sm z-10 group-hover:bg-primary">
                                    <svg className="w-12 h-12 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-4 gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative">
                                    <div className="absolute left-0 top-0 bottom-0 bg-primary w-1/3 rounded-full" />
                                </div>
                                <svg className="w-6 h-6 text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                </svg>
                                <svg className="w-6 h-6 text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Introduction to Calculus: Limits and Continuity
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                                            <img
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUpgpx89vJMoZvphOGSkkeSsUfGjuA1hlLM1LGCY6jHyhBqmZK8249a4hbPuJm_PyfGlHYaUjWGxkRNSbHhmYsp6Qh9ylMgU-wBInTmy6wOpxFuaAnpg5nKErKsv4Sl62mknbQgzSuQ3FV5-VOVRHxz4OfRB0DOCg_hrCblIE_EH-7cHiYq60IK1we9nLbDvBzPx_AA5BgpcrBoIJ5VKNb6IPIdSMI5ptfUgXygWLdbbE6Sx08OvspChtbFjv6S_I7v2JdQ1yWDlf9"
                                                alt="Professor"
                                            />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                            Prof. Smith
                                        </span>
                                    </div>
                                    <span>•</span>
                                    <span>12k views</span>
                                    <span>•</span>
                                    <span>2 days ago</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                                    About this lesson
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    In this segment, we explore the fundamental theorem of calculus,
                                    breaking down the concepts of limits and continuity with real-world
                                    examples. This forms the bedrock for understanding derivatives in the
                                    next module.
                                </p>
                                <button className="mt-2 text-primary cursor-pointer text-sm font-semibold hover:underline">
                                    Show more
                                </button>
                            </div>
                        </div>
                    </div>

                    {isMobile && (
                        <button
                            onClick={() => setIsAjibadeOpen(true)}
                            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors z-30"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </button>
                    )}
                </main>

                {!isMobile && (
                    <AjibadePanel 
                        className="w-[400px] shrink-0 hidden lg:flex" 
                        onSendMessage={(msg) => console.log('YouTube Question:', msg)}
                    />
                )}
            </div>

            {isMobile && (
                <BottomSheet isOpen={isAjibadeOpen} onClose={() => setIsAjibadeOpen(false)}>
                    <AjibadePanel 
                        className="h-[70vh] border-0" 
                        onSendMessage={(msg) => console.log('YouTube Question:', msg)}
                    />
                </BottomSheet>
            )}
        </div>
    );
}
