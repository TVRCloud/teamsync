import { fetchLogs } from "@/lib/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";

interface LogFilters {
  action: string;
  entityType: string;
}

export const useInfiniteLogs = (filters?: LogFilters) => {
  return useInfiniteQuery({
    queryKey: ["logs", filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchLogs({
        skip: pageParam,
        action: filters?.action,
        entityType: filters?.entityType,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};
