import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, GraduationCap, Menu, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { MOCK_USER } from '@/lib/constants';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/classes', label: 'My Classes' },
    { href: '/community', label: 'Community' },
    { href: '/settings', label: 'Settings' },
];

export function Header() {
    const location = useLocation();
    const [hasNotifications] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-10">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">
                                Cognito
                            </h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={cn(
                                            'text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-primary font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden lg:block w-64">
                            <Input
                                placeholder="Search topics..."
                                icon={<Search className="w-5 h-5" />}
                                className="bg-gray-100 dark:bg-white/5"
                            />
                        </div>

                        <ThemeToggle />

                        <button className="relative p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            {hasNotifications && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
                            )}
                        </button>

                        <Avatar
                            src={MOCK_USER.avatar}
                            alt={MOCK_USER.name}
                            size="sm"
                            className="cursor-pointer hidden sm:block"
                        />
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile menu panel */}
            <div
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:hidden',
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
                            <div className="w-8 h-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">
                                Cognito
                            </h2>
                        </Link>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile user info */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={MOCK_USER.avatar}
                                alt={MOCK_USER.name}
                                size="sm"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {MOCK_USER.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {MOCK_USER.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
