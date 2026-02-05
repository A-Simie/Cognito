
import apiClient from './apiClient';
import { LoginRequest, SignupRequest, OtpRequest, User } from '@/lib/types';

export const authService = {
  signup: async (data: SignupRequest) => {
    const response = await apiClient.post('/signup', data);
    return response.data;
  },

  verifySignup: async (params: OtpRequest) => {
    const response = await apiClient.post(`/verify-signup?otp=${params.otp}&email=${params.email}`);
    return response.data as string;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },

  verifyLogin: async (params: OtpRequest) => {
    const response = await apiClient.post(`/verify-login?otp=${params.otp}&email=${params.email}`);
    return response.data as string;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/me');
    return response.data;
  },
  
  resetPassword: async(email: string) => {
      const response = await apiClient.post('/resetPassword', { email });
      return response.data;
  },

  verifyResetPassword: async(params: OtpRequest & {newPassword: string}) => {
      const response = await apiClient.post(`/verify-resetPassword?otp=${params.otp}&email=${params.email}&newPassword=${params.newPassword}`);
      return response.data;
  },

  updateProfile: async (data: { base64Image?: string; weeklyGoalHours?: number }) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  }
};
