import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/api';
import { getToken } from '@/lib/auth'; // Import token checker

interface User {
    email: string;
    fullName: string;
    profilePicture?: string;
    stats?: {
        weeklyGoalHours?: number;
        studyHours?: number;
        completedLessons?: number;
    };
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const profile = await auth.getProfile();
            setUser(profile);
        } catch (error) {
            console.error('Failed to load user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // CRITICAL: Only load user if token exists
        // Prevents unnecessary 403 errors on signup/login pages
        const token = getToken();
        if (token) {
            loadUser();
        } else {
            // No token = not logged in, skip loading
            setLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await loadUser();
    };

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
