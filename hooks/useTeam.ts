import { createTeam, fetchTeams } from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-teams"] });
    },
  });
};

export const useInfiniteTeams = (search: string) =>
  useInfiniteQuery({
    queryKey: ["all-teams", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchTeams({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
