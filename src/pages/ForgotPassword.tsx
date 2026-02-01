import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MockAuthService } from '@/services/mockAuth';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await MockAuthService.requestPasswordReset({ email });
            if (result.success) {
                navigate(`/verify-otp?email=${email}&mode=reset`);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Failed to send OTP.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <button
                    type="button"
                    onClick={() => navigate('/login', { replace: true })}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Reset Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <Button type="submit" className="w-full">Send OTP</Button>
                </form>
            </div>
        </div>
    );
}
