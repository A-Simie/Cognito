import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Quiz, QuizQuestion } from '@/services/mockBackend';
import { cn } from '@/lib/utils';

interface QuizDialogProps {
    quiz: Quiz;
    isOpen: boolean;
    onClose: () => void;
}

export function QuizDialog({ quiz, isOpen, onClose }: QuizDialogProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [answers, setAnswers] = useState<number[]>([]);

    if (!isOpen) return null;

    const question = quiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.totalQuestions - 1;

    const handleAnswerSelect = (index: number) => {
        if (showExplanation) return; // Prevent changing after submission
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowExplanation(true);

        // Track answer
        const newAnswers = [...answers, selectedAnswer];
        setAnswers(newAnswers);

        // Update score if correct
        if (selectedAnswer === question.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setIsComplete(true);
        } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setIsComplete(false);
        setAnswers([]);
    };

    // Score screen
    if (isComplete) {
        const percentage = Math.round((score / quiz.totalQuestions) * 100);
        const passed = percentage >= 60;

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center">
                        <div className={cn(
                            "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6",
                            passed ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"
                        )}>
                            {passed ? (
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {passed ? 'Great Job!' : 'Keep Learning!'}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            You scored {score} out of {quiz.totalQuestions}
                        </p>

                        <div className="mb-8">
                            <div className="text-5xl font-bold text-primary mb-2">
                                {percentage}%
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={cn(
                                        "h-3 rounded-full transition-all duration-500",
                                        passed ? "bg-green-500" : "bg-orange-500"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRestart}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz question screen
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {quiz.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Question {currentQuestion + 1} of {quiz.totalQuestions}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%` }}
                    />
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        {question.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === question.correctAnswer;
                            const showCorrect = showExplanation && isCorrect;
                            const showWrong = showExplanation && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showExplanation}
                                    className={cn(
                                        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium",
                                        !showExplanation && !isSelected && "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5",
                                        !showExplanation && isSelected && "border-primary bg-primary/10",
                                        showCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100",
                                        showWrong && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100",
                                        showExplanation && !isCorrect && !isSelected && "opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                            showCorrect && "border-green-500 bg-green-500",
                                            showWrong && "border-red-500 bg-red-500",
                                            !showExplanation && isSelected && "border-primary bg-primary",
                                            !showExplanation && !isSelected && "border-gray-300 dark:border-gray-600"
                                        )}>
                                            {showCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                                            {showWrong && <XCircle className="w-4 h-4 text-white" />}
                                            {!showExplanation && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="flex-1">{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            💡 Explanation
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            {question.explanation}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {!showExplanation ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            {isLastQuestion ? 'View Results' : 'Next Question'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
