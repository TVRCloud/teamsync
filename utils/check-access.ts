import { routeAccessMap } from "@/lib/access-list";

const isPathMatch = (pattern: string, path: string): boolean => {
  const patternSegments = pattern.split("/");
  const pathSegments = path.split("/");

  if (patternSegments.length !== pathSegments.length) return false;

  return patternSegments.every((segment, index) => {
    const pathSegment = pathSegments[index];
    return (
      segment === pathSegment || segment.startsWith("[") || segment === "*"
    );
  });
};

export const canAccessRoute = ({
  path,
  role,
}: {
  path: string;
  role?: string;
}) => {
  const matchingRule = Object.entries(routeAccessMap).find(([pattern]) =>
    isPathMatch(pattern, path)
  );

  const access = matchingRule?.[1];

  if (!matchingRule) return true;

  if (access?.roles && !access.roles.includes(role || "")) return false;

  return true;
};
