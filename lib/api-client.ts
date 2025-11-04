import { apiClient } from "@/utils/axios";

// ---------------------------
// -----------USER------------
// ---------------------------
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

export const fetchSingleUser = async (id: string) => {
  const res = await apiClient.get(`/api/users/${id}`);
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

// ---------------------------
// -----------LOGS------------
// ---------------------------
export const fetchLogs = async ({
  skip,
  action,
  entityType,
}: {
  skip: number;
  action?: string;
  entityType?: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
  });

  if (action) params.append("action", action);
  if (entityType) params.append("entityType", entityType);

  const res = await apiClient.get(`/api/log?${params.toString()}`);
  return res.data;
};

// ---------------------------
// ----------PROJECTS---------
// ---------------------------

export const createProject = async (data: {
  name: string;
  description?: string;
  color: string;
}) => {
  const res = await apiClient.post(`/api/projects`, data);
  return res.data;
};

export const fetchProjects = async ({
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

  const res = await apiClient.get(`/api/projects?${params.toString()}`);
  return res.data;
};

// ---------------------------
// -----------TEAMS------------
// ---------------------------

export const createTeam = async (data: {
  name: string;
  description?: string;
  members?: string[];
}) => {
  const res = await apiClient.post(`/api/teams`, data);
  return res.data;
};

export const fetchTeams = async ({
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

  const res = await apiClient.get(`/api/teams?${params.toString()}`);
  return res.data;
};
