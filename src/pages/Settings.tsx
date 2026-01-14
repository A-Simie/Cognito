import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, HelpCircle, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { MOCK_USER } from '@/lib/constants';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const { theme, setTheme } = useTheme();

    return (
        <AppLayout>
            <div className="max-w-[1440px] mx-auto p-6 lg:p-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="p-4">
                            <nav className="space-y-1">
                                {MENU_ITEMS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                            activeTab === item.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </button>
                                ))}
                                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    Log Out
                                </button>
                            </nav>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        {activeTab === 'profile' && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                                <div className="flex items-center gap-6 mb-8">
                                    <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size="lg" ring />
                                    <div>
                                        <Button variant="secondary" size="sm">Change Photo</Button>
                                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Full Name" defaultValue={MOCK_USER.name} />
                                    <Input label="Email" type="email" defaultValue={MOCK_USER.email} />
                                    <Input label="Username" defaultValue="alex_learner" />
                                    <Input label="Phone" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button>Save Changes</Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'appearance' && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(['light', 'dark'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={cn(
                                                    'p-4 rounded-xl border-2 transition-all text-center',
                                                    theme === t
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                                )}
                                            >
                                                <div className={cn(
                                                    'w-full h-20 rounded-lg mb-3',
                                                    t === 'light' && 'bg-white border border-gray-200',
                                                    t === 'dark' && 'bg-gray-800'
                                                )} />
                                                <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                                                    {t}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {['Email notifications', 'Push notifications', 'Weekly summary', 'Quiz reminders'].map((item) => (
                                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <span className="text-gray-900 dark:text-white font-medium">{item}</span>
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {(activeTab === 'privacy' || activeTab === 'help') && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    {activeTab === 'privacy' ? 'Privacy & Security' : 'Help & Support'}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {activeTab === 'privacy'
                                        ? 'Manage your privacy settings and security preferences.'
                                        : 'Get help with using Cognito or contact our support team.'}
                                </p>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
