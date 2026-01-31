/**
 * Mock Authentication Service
 * Provides offline testing capability for auth flow
 */

export interface MockUser {
    id: number;
    fullName: string;
    email: string;
    password: string;
}

// Mock user database (in-memory)
const mockUsers: MockUser[] = [
    {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    }
];

// Mock OTP (always accept '123456')
const MOCK_OTP = '123456';

let nextUserId = 2;

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
                    password: data.password
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
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePicture: null,
                        weeklyGoalHours: 10,
                        stats: {
                            weeklyGoalHours: 10,
                            totalMinutesSpent: 0,
                            classesEnrolled: 0,
                            completionRate: 0
                        }
                    },
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
                if (!match) {
                    resolve(null);
                    return;
                }

                const userId = parseInt(match[1]);
                const user = mockUsers.find(u => u.id === userId);

                if (user) {
                    resolve({
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePicture: null,
                        weeklyGoalHours: 10,
                        stats: {
                            weeklyGoalHours: 10,
                            totalMinutesSpent: 0,
                            classesEnrolled: 0,
                            completionRate: 0
                        }
                    });
                } else {
                    resolve(null);
                }
            }, 300);
        });
    }
};
