import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import VerifyOtp from '@/pages/VerifyOtp';
import ForgotPassword from '@/pages/ForgotPassword';
import Classes from '@/pages/Classes';
import Settings from '@/pages/Settings';
import QuizMode from '@/pages/QuizMode';
import TeachMe from '@/pages/TeachMe';
import Community from '@/pages/Community';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/verify-signup" element={<VerifyOtp type="signup" />} />
                    <Route path="/verify-login" element={<VerifyOtp type="login" />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

                    <Route path="/quiz" element={<PrivateRoute><QuizMode /></PrivateRoute>} />
                    <Route path="/teach-me/*" element={<PrivateRoute><TeachMe /></PrivateRoute>} />
                    <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
