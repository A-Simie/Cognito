
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, ToastType } from '@/lib/store/toastStore';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const colors = {
    success: 'bg-green-500/10 border-green-500/20 text-green-500',
    error: 'bg-red-500/10 border-red-500/20 text-red-500',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
};

const ToastItem = ({ id, message, type }: { id: string; message: string; type: ToastType }) => {
    const { removeToast } = useToastStore();
    const Icon = icons[type];
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg min-w-[300px] pointer-events-auto",
                colors[type],
                "bg-white/80 dark:bg-black/80"
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium flex-1 text-slate-900 dark:text-slate-100">{message}</p>
            <button onClick={() => removeToast(id)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                <X className="w-4 h-4 opacity-50" />
            </button>
        </motion.div>
    );
};

export const ToastContainer = () => {
    const { toasts } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};
