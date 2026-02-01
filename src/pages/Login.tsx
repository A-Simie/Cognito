import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MockAuthService } from '@/services/mockAuth';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();

    const validate = () => {
        const nextErrors: { email?: string; password?: string } = {};
        const email = formData.email.trim();
        const password = formData.password.trim();

        if (!email) {
            nextErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = 'Enter a valid email address';
        }

        if (!password) {
            nextErrors.password = 'Password is required';
        } else if (password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        try {
            const result = await MockAuthService.login(formData);
            if (result.success) {
                navigate(`/verify-otp?email=${formData.email}&mode=login`);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <button
                        type="button"
                        onClick={() => navigate('/', { replace: true })}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black uppercase tracking-tight">Cognito</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            icon={<Mail className="w-5 h-5" />}
                            error={errors.email}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            icon={<Lock className="w-5 h-5" />}
                            error={errors.password}
                            required
                        />
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                            Sign In
                        </Button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account? <Link to="/signup" className="text-primary font-bold">Sign Up</Link>
                    </p>
                </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
