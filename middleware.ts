import { type NextRequest, NextResponse } from "next/server";
import { config as sessionConfig } from "@/lib/config";
import { verifyToken } from "./utils/auth";
import { canAccessRoute } from "./utils/check-access";
import { authRoutes, protectedRoutes, publicRoutes } from "./lib/route-list";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = request.cookies.get(sessionConfig.session.cookieName)?.value;
  const session = token ? await verifyToken(token) : null;

  const role = (session?.role as string | undefined)?.toLowerCase() || "guest";

  if (isPublicRoute) return NextResponse.next();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session) {
    if (role === "guest") {
      return NextResponse.redirect(new URL("/welcome", request.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (isProtectedRoute && session) {
    const hasAccess = canAccessRoute({ path, role });
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/welcome", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
