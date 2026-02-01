import { getToken } from './auth';
import { MockAuthService } from '@/services/mockAuth';
import { MockBackend } from '@/services/mockBackend';

export const auth = {
    getProfile: async () => {
        const token = getToken();
        if (!token) return null;
        return MockAuthService.getCurrentUser(token);
    },
    updateProfile: async (data: { profilePicture?: string; weeklyGoalHours?: number }) => {
        const token = getToken();
        if (!token) throw new Error('No auth token');
        const result = await MockAuthService.updateProfile(token, data);
        if (!result.success) throw new Error(result.message);
        return result.user;
    }
};

export const learning = {
    getClasses: () => MockBackend.getClasses(),
    getRecentActivity: () => MockBackend.getRecentActivity()
};

const api = {};
export default api;
