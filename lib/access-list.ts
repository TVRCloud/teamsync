export type AccessControlRule = {
  roles?: string[];
};

export const routeAccessMap: Record<string, AccessControlRule> = {
  "/dashboard": {
    roles: ["admin", "manager", "member"],
  },
};
