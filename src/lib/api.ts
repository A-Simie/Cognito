import axios from 'axios';
import { getToken, removeToken } from './auth';
import { USE_MOCK_BACKEND } from './apiConfig';
import { MockAuthService } from '@/services/mockAuth';

const api = axios.create({
    baseURL: '/cognito/api/v1',
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    getProfile: () => {
        if (USE_MOCK_BACKEND) {
            const token = getToken();
            return MockAuthService.getCurrentUser(token || '');
        }
        return api.get<any>('/me').then(res => res.data);
    },
    updateProfile: (data: { profilePicture?: string, weeklyGoalHours?: number }) => {
        if (USE_MOCK_BACKEND) {
            // Mock update - update the value in memory
            const token = getToken();
            if (token && data.weeklyGoalHours) {
                // Store updated goal (in a real app this would persist)
                console.log('🎭 Mock: Updated weekly goal to', data.weeklyGoalHours);
            }
            return Promise.resolve('Profile updated');
        }
        return api.put<string>('/users/me', data);
    }
};

export const learning = {
    getClasses: () => {
        if (USE_MOCK_BACKEND) {
            return MockBackend.getClasses();
        }
        return api.get<any[]>('/classes').then(res => res.data);
    },
    getRecentActivity: () => {
        if (USE_MOCK_BACKEND) {
            // Mock mode - return empty array (no recent activity yet)
            return Promise.resolve([]);
        }
        return api.get<any[]>('/classes/recent').then(res => res.data);
    },
};

export default api;
