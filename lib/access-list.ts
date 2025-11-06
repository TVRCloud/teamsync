export type AccessControlRule = {
  roles?: string[];
};

export const routeAccessMap: Record<string, AccessControlRule> = {
  "/dashboard": {
    roles: ["admin", "manager", "lead", "member"],
  },
  "/members": {
    roles: ["admin", "manager"],
  },
  "/projects": {
    roles: ["admin", "manager"],
  },
};
