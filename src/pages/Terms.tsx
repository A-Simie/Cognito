import { AppLayout } from '@/components/layout/AppLayout';

export default function Terms() {
    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto p-6 lg:p-10">
                <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
                <div className="prose dark:prose-invert">
                    <p>Last updated: January 2026</p>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Cognito's website for personal, non-commercial transitory viewing only.</p>

                    <h2>3. Disclaimer</h2>
                    <p>The materials on Cognito's website are provided "as is". Cognito makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </div>
            </div>
        </AppLayout>
    );
}
