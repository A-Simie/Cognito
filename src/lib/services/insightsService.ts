import apiClient from "./apiClient";

export interface StudyInsights {
  overallAssessment: string;
  strengths: string[];
  areasToImprove: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  suggestedNextTopics: string[];
  weeklyPlan: {
    summary: string;
    dailyMinutes: number;
    focusArea: string;
  };
  motivationalNote: string;
}

export const insightsService = {
  async generateInsights(): Promise<StudyInsights> {
    const response = await apiClient.post<StudyInsights>("/study-insights");
    return response.data;
  },
};
