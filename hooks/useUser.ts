import { useUserStore } from "@/store/useUserStore";
import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

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
