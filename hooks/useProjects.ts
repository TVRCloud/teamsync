import { createProject, fetchProjects } from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
  });
};

export const useInfiniteProjects = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-projects", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchProjects({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};
