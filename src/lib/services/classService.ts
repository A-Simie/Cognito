
import apiClient from './apiClient';
import { Class } from '@/lib/types';

export const classService = {
  getClasses: async () => {
    const response = await apiClient.get<Class[]>('/classes');
    return response.data;
  },

  getRecentClasses: async () => {
    const response = await apiClient.get<Class[]>('/classes/recent');
    return response.data;
  },

  getClassById: async (id: number) => {
      const classes = await classService.getClasses();
      return classes.find(c => c.id === id);
  },

  createTopicClass: async (topic: string) => {
    const response = await apiClient.post<Class>('/topic_class_creation', topic, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  },

  createYoutubeClass: async (youtubeUrl: string, videoDurationSeconds: number) => {
      const response = await apiClient.post<Class>('/youtube_class_creation', { youtubeUrl, videoDurationSeconds });
      return response.data;
  },

  createPdfClass: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<Class>('/pdf_class_creation', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  },

  startLesson: async (classId: number, unitId: string) => {
      const response = await apiClient.post<{sessionId: string}>('/lessons/start', { classId, unitId });
      return response.data;
  }
};
