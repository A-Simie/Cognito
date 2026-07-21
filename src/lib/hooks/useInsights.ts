import { useMutation } from "@tanstack/react-query";
import { insightsService, type StudyInsights } from "@/lib/services/insightsService";

export const useGenerateInsights = () =>
  useMutation<StudyInsights, Error>({
    mutationFn: () => insightsService.generateInsights(),
  });
