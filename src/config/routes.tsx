import { lazy, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages for better performance
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Signup = lazy(() => import('@/pages/Signup'));
const Login = lazy(() => import('@/pages/Login'));
const VerifyOtp = lazy(() => import('@/pages/VerifyOtp'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const Classes = lazy(() => import('@/pages/Classes'));
const Settings = lazy(() => import('@/pages/Settings'));
const QuizMode = lazy(() => import('@/pages/QuizMode'));
const TeachMe = lazy(() => import('@/pages/TeachMe'));
const Community = lazy(() => import('@/pages/Community'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));



export interface AppRoute {
    path: string;
    element: ReactNode;
    requiresAuth?: boolean;
    title?: string;
}

/**
 * Public routes - accessible without authentication
 */
export const publicRoutes: AppRoute[] = [
    {
        path: '/',
        element: <Landing />,
        title: 'Home',
    },

    {
        path: '/signup',
        element: <Signup />,
        title: 'Sign Up',
    },
    {
        path: '/login',
        element: <Login />,
        title: 'Login',
    },
    {
        path: '/verify-signup',
        element: <VerifyOtp type="signup" />,
        title: 'Verify Signup',
    },
    {
        path: '/verify-login',
        element: <VerifyOtp type="login" />,
        title: 'Verify Login',
    },
    {
        path: '/verify-otp',
        element: <VerifyOtp />,
        title: 'Verify OTP',
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        title: 'Forgot Password',
    },
    {
        path: '/privacy',
        element: <Privacy />,
        title: 'Privacy Policy',
    },
    {
        path: '/terms',
        element: <Terms />,
        title: 'Terms of Service',
    },
];

/**
 * Protected routes - require authentication
 */
export const protectedRoutes: AppRoute[] = [
    {
        path: '/dashboard',
        element: <Dashboard />,
        requiresAuth: true,
        title: 'Dashboard',
    },
    {
        path: '/classes',
        element: <Classes />,
        requiresAuth: true,
        title: 'My Classes',
    },
    {
        path: '/settings',
        element: <Settings />,
        requiresAuth: true,
        title: 'Settings',
    },
    {
        path: '/quiz',
        element: <QuizMode />,
        requiresAuth: true,
        title: 'Quiz Mode',
    },
    {
        path: '/teach-me/*',
        element: <TeachMe />,
        requiresAuth: true,
        title: 'Teach Me',
    },
    {
        path: '/community',
        element: <Community />,
        requiresAuth: true,
        title: 'Community',
    },
];

/**
 * Catch-all route for 404
 */
export const notFoundRoute: AppRoute = {
    path: '*',
    element: <NotFound />,
    title: 'Page Not Found',
};

/**
 * All routes combined
 */
export const routes: AppRoute[] = [
    ...publicRoutes,
    ...protectedRoutes,
    notFoundRoute,
];
