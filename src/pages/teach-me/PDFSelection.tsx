import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    FileText,
    Upload,
    Loader2,
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { classService } from "@/lib/services/classService";
import { useToastStore } from "@/lib/store/toastStore";

export default function PDFSelection() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToastStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload a valid PDF file.");
                addToast("Invalid file type. Please upload a PDF.", "error");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError("");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (droppedFile.type !== "application/pdf") {
                setError("Please upload a valid PDF file.");
                addToast("Invalid file type. Please upload a PDF.", "error");
                setFile(null);
                return;
            }
            setFile(droppedFile);
            setError("");
        }
    };

    const handleCreateClass = async () => {
        if (!file) return;

        setIsLoading(true);
        try {
            await classService.createPdfClass(file);
            await queryClient.invalidateQueries({ queryKey: ["classes"] });
            addToast("PDF Class Created Successfully!", "success");
            navigate("/classes", {
                state: {
                    message: "PDF Class Created Successfully!",
                },
            });
        } catch (err) {
            console.error(err);
            addToast("Failed to create class. Please try again.", "error");
            setError("Failed to create class. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col">
            <div className="p-6">
                <button
                    onClick={() => navigate("/classes")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Classes</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 w-full">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            New PDF Class
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Upload a PDF document to generate an interactive lesson.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {!file ? (
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/5 transition-all"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    className="hidden"
                                />
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-slate-400">PDF files only (max 10MB)</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                            {file.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleCreateClass}
                            disabled={!file || isLoading}
                            className="w-full h-12 text-lg font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing PDF...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 mr-2" />
                                    Create Class
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
