import { useEffect, useRef } from 'react';

interface CanvasProps {
    lessonTitle: string;
    lessonContent: string; // HTML content from AI backend
    onTriggerQuiz: () => void;
}

export function Canvas({ lessonTitle, lessonContent, onTriggerQuiz }: CanvasProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current && lessonContent) {
            // Inject HTML content into iframe
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;

            if (doc) {
                doc.open();
                doc.write(lessonContent);
                doc.close();

                // Inject quiz trigger function into iframe
                if (iframe.contentWindow) {
                    (iframe.contentWindow as any).triggerQuiz = onTriggerQuiz;
                }
            }
        }
    }, [lessonContent, onTriggerQuiz]);

    return (
        <div className="h-full w-full bg-gray-900 relative">
            {/* Iframe Container */}
            <iframe
                ref={iframeRef}
                title={lessonTitle}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0"
                style={{
                    backgroundColor: '#0f1419',
                    colorScheme: 'dark'
                }}
            />
        </div>
    );
}
