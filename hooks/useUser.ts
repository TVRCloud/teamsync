import { createUser, fetchUsers } from "@/lib/api-client";
import { useUserStore } from "@/store/useUserStore";
import { apiClient } from "@/utils/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useAuth() {
  const { user, setUser } = useUserStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !user,
    queryFn: async () => {
      const res = await apiClient.get("/api/me");
      setUser(res.data);
      return res.data;
    },
  });

  return { user: user ?? data, isLoading, isError, error };
}

export const useInfiniteUsers = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-users", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchUsers({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};
