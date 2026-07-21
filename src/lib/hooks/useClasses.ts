import { useQuery } from "@tanstack/react-query";
import { classService } from "@/lib/services/classService";

const queryKeys = {
  all: ["classes"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (type: string) => [...queryKeys.lists(), type] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
};

export const useClasses = () => {
  return useQuery({
    queryKey: queryKeys.list("all"),
    queryFn: classService.getClasses,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecentClasses = () => {
  return useQuery({
    queryKey: queryKeys.list("recent"),
    queryFn: classService.getRecentClasses,
    staleTime: 1000 * 60 * 5,
  });
};

export const useClassById = (id: number | null) => {
  return useQuery({
    queryKey: queryKeys.detail(id!),
    queryFn: () => classService.getClassById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
