import { fetchSessions } from "@/lib/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteSessions = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-sessions", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchSessions({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};
