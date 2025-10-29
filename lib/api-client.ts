import { apiClient } from "@/utils/axios";

export const fetchUsers = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/users?${params.toString()}`);
  return res.data;
};
