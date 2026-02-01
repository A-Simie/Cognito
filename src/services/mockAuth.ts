/**
 * Mock Authentication Service
 * Provides offline testing capability for auth flow
 */

export interface MockUser {
    id: number;
    fullName: string;
    email: string;
    password: string;
    profilePicture?: string | null;
    weeklyGoalHours?: number;
    stats?: {
        weeklyGoalHours?: number;
        totalMinutesSpent?: number;
        classesEnrolled?: number;
        completionRate?: number;
        currentStreak?: number;
        lessonsCompleted?: number;
    };
}

// Mock user database (in-memory)
const mockUsers: MockUser[] = [
    {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        profilePicture: null,
        weeklyGoalHours: 10,
        stats: {
            weeklyGoalHours: 10,
            totalMinutesSpent: 0,
            classesEnrolled: 0,
            completionRate: 0,
            currentStreak: 0,
            lessonsCompleted: 0
        }
    }
];

// Mock OTP (always accept '123456')
const MOCK_OTP = '123456';

let nextUserId = 2;

const buildUserProfile = (user: MockUser) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePicture: user.profilePicture ?? null,
    weeklyGoalHours: user.weeklyGoalHours,
    stats: {
        weeklyGoalHours: user.stats?.weeklyGoalHours ?? user.weeklyGoalHours,
        totalMinutesSpent: user.stats?.totalMinutesSpent ?? 0,
        classesEnrolled: user.stats?.classesEnrolled ?? 0,
        completionRate: user.stats?.completionRate ?? 0,
        currentStreak: user.stats?.currentStreak ?? 0,
        lessonsCompleted: user.stats?.lessonsCompleted ?? 0
    }
});

export const MockAuthService = {
    /**
     * Signup - Creates new user
     */
    signup: async (data: { fullName: string; email: string; password: string }): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Check if user already exists
                const existing = mockUsers.find(u => u.email === data.email);
                if (existing) {
                    resolve({ success: false, message: 'Email already registered' });
                    return;
                }

                // Create new user
                mockUsers.push({
                    id: nextUserId++,
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    profilePicture: null,
                    weeklyGoalHours: undefined,
                    stats: {
                        weeklyGoalHours: undefined,
                        totalMinutesSpent: 0,
                        classesEnrolled: 0,
                        completionRate: 0,
                        currentStreak: 0,
                        lessonsCompleted: 0
                    }
                });

                console.log('🎭 Mock Signup: User created', data.email);
                resolve({ success: true, message: 'OTP sent to email' });
            }, 500); // Simulate network delay
        });
    },

    /**
     * Login - Validates credentials
     */
    login: async (data: { email: string; password: string }): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.email === data.email);

                if (!user) {
                    resolve({ success: false, message: 'User not found' });
                    return;
                }

                if (user.password !== data.password) {
                    resolve({ success: false, message: 'Invalid password' });
                    return;
                }

                console.log('🎭 Mock Login: Credentials valid', data.email);
                resolve({ success: true, message: 'OTP sent to email' });
            }, 500);
        });
    },

    /**
     * Verify OTP - Always accepts '123456'
     */
    verifyOTP: async (data: { email: string; otp: string }): Promise<{ success: boolean; token?: string; message: string; user?: any }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.email === data.email);

                if (!user) {
                    resolve({ success: false, message: 'User not found' });
                    return;
                }

                if (data.otp !== MOCK_OTP) {
                    resolve({ success: false, message: 'Invalid OTP' });
                    return;
                }

                // Generate mock token
                const mockToken = `mock_token_${user.id}_${Date.now()}`;

                console.log('🎭 Mock OTP Verified: Logging in', user.email);
                resolve({
                    success: true,
                    token: mockToken,
                    user: buildUserProfile(user),
                    message: 'Login successful'
                });
            }, 500);
        });
    },

    /**
     * Get current user (for profile fetching)
     */
    getCurrentUser: async (token: string): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Extract user ID from token
                const match = token.match(/mock_token_(\d+)/);
                const userIdStr = match?.[1];

                if (!userIdStr) {
                    resolve(null);
                    return;
                }

                const userId = parseInt(userIdStr, 10);
                const user = mockUsers.find(u => u.id === userId);

                if (user) {
                    resolve(buildUserProfile(user));
                } else {
                    resolve(null);
                }
            }, 300);
        });
    },

    /**
     * Update profile (weekly goal / profile picture)
     */
    updateProfile: async (token: string, data: { profilePicture?: string; weeklyGoalHours?: number }): Promise<{ success: boolean; message: string; user?: any }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const match = token.match(/mock_token_(\d+)/);
                const userIdStr = match?.[1];

                if (!userIdStr) {
                    resolve({ success: false, message: 'Invalid token' });
                    return;
                }

                const userId = parseInt(userIdStr, 10);
                const user = mockUsers.find(u => u.id === userId);

                if (!user) {
                    resolve({ success: false, message: 'User not found' });
                    return;
                }

                if (data.profilePicture !== undefined) {
                    user.profilePicture = data.profilePicture;
                }

                if (data.weeklyGoalHours !== undefined) {
                    user.weeklyGoalHours = data.weeklyGoalHours;
                    user.stats = {
                        ...user.stats,
                        weeklyGoalHours: data.weeklyGoalHours
                    };
                }

                resolve({ success: true, message: 'Profile updated', user: buildUserProfile(user) });
            }, 300);
        });
    },

    /**
     * Request password reset
     */
    requestPasswordReset: async (data: { email: string }): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.email === data.email);
                if (!user) {
                    resolve({ success: false, message: 'User not found' });
                    return;
                }
                resolve({ success: true, message: 'OTP sent to email' });
            }, 400);
        });
    },

    /**
     * Verify reset OTP and update password
     */
    verifyResetOTP: async (data: { email: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.email === data.email);

                if (!user) {
                    resolve({ success: false, message: 'User not found' });
                    return;
                }

                if (data.otp !== MOCK_OTP) {
                    resolve({ success: false, message: 'Invalid OTP' });
                    return;
                }

                user.password = data.newPassword;
                resolve({ success: true, message: 'Password reset successfully' });
            }, 400);
        });
    }
};
