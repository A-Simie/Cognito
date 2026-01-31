import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { USE_MOCK_BACKEND } from '@/lib/apiConfig';
import { MockAuthService } from '@/services/mockAuth';
import axios from 'axios';

export default function Signup() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (USE_MOCK_BACKEND) {
                // Mock mode - offline testing
                const result = await MockAuthService.signup(formData);
                if (result.success) {
                    navigate(`/verify-otp?email=${formData.email}&mode=signup`);
                } else {
                    alert(result.message);
                }
            } else {
                // Real API mode
                await axios.post('/cognito/api/v1/signup', formData);
                navigate(`/verify-otp?email=${formData.email}&mode=signup`);
            }
        } catch (error) {
            console.error(error);
            alert("Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-purple-500 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            icon={<User className="w-5 h-5" />}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            icon={<Mail className="w-5 h-5" />}
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            icon={<Lock className="w-5 h-5" />}
                        />
                        <div className="flex items-start gap-3 pt-2">
                            <input type="checkbox" required className="mt-0.5" />
                            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                            </label>
                        </div>
                        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                            Sign Up
                        </Button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account? <Link to="/login" className="text-primary font-bold">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
