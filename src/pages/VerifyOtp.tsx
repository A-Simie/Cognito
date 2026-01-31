import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { USE_MOCK_BACKEND } from '@/lib/apiConfig';
import { MockAuthService } from '@/services/mockAuth';
import { setToken } from '@/lib/auth';
import { useUser } from '@/contexts/UserContext'; // Import useUser

export default function VerifyOtp() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useUser(); // Get refreshUser function
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [mode, setMode] = useState<'signup' | 'login' | 'reset'>('signup');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        const e = searchParams.get('email');
        const m = searchParams.get('mode');
        if (e) setEmail(e);
        if (m) setMode(m as any);
    }, [searchParams]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; // Prevent double submission

        setLoading(true);
        try {
            if (USE_MOCK_BACKEND) {
                // Mock mode - offline testing
                const result = await MockAuthService.verifyOTP({ email, otp });
                if (result.success && result.token) {
                    setToken(result.token);
                    await refreshUser(); // Load user profile after setting token
                    navigate('/dashboard', { replace: true }); // Use replace for temp screen
                } else {
                    alert(result.message);
                }
            } else {
                // Real API mode
                let url = '';
                let params = new URLSearchParams();
                params.append('email', email);
                params.append('otp', otp);

                if (mode === 'signup') {
                    url = '/verify-signup';
                } else if (mode === 'login') {
                    url = '/verify-login';
                } else if (mode === 'reset') {
                    url = '/verify-resetPassword';
                    params.append('newPassword', newPassword);
                }

                const response = await axios.post(`/cognito/api/v1${url}`, null, { params });

                if (mode === 'reset') {
                    alert("Password reset successfully. Please login.");
                    navigate('/login', { replace: true }); // Use replace for temp screen
                } else {
                    setToken(response.data);
                    await refreshUser(); // Load user profile after setting token
                    navigate('/dashboard', { replace: true }); // Use replace for temp screen
                }
            }
        } catch (error) {
            console.error(error);
            alert("Verification failed. Check OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Verify OTP
                </h1>
                <p className="text-center text-gray-500 mb-6">Sent to {email}</p>
                {USE_MOCK_BACKEND && (
                    <p className="text-center text-xs text-primary font-bold mb-4 bg-primary/10 p-2 rounded-lg">
                        🎭 Mock Mode: Use OTP <code className="font-mono bg-white/50 px-2 py-1 rounded">123456</code>
                    </p>
                )}
                <form onSubmit={handleVerify} className="space-y-4">
                    <Input
                        label="OTP Code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 8-digit code"
                    />
                    {mode === 'reset' && (
                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                        />
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
