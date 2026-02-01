import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto p-6 lg:p-10">
                <button
                    type="button"
                    onClick={() => navigate('/signup', { replace: true })}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign Up
                </button>
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: January 2026</p>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to facilitate and improve our services. This includes:</p>
                    <ul>
                        <li>Providing and maintaining our services</li>
                        <li>Improving and personalizing user experience</li>
                        <li>Understanding and analyzing usage trends</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
