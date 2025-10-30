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

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await apiClient.post(`/api/users`, data);
  return res.data;
};
