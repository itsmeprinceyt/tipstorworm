import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { MyJWT } from "./types/User/JWT.type";
import { rateLimitMiddleware } from "./lib/Redis/rateLimiter";

// ─── Route Registry ───────────────────────────────────────────────────────────

const ROUTES = {
  PUBLIC: {
    LOGIN: ["/login"],
  },
  PROTECTED: {
    DASHBOARD: ["/dashboard"],
    ADMIN: ["/admin"],
    PROFILE_SETTINGS: ["/profile"], // narrowed further in matchesProfileSettings()
  },
  API: {
    DASHBOARD: ["/api/dashboard"],
    ADMIN: ["/api/admin"],
    PROFILE_SETTINGS: ["/api/profile"],
    EXCLUDED_FROM_RATE_LIMIT: [
      "/api/auth/session",
      "/api/public/single-setting",
    ],
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesRoute(path: string, routes: readonly string[]): boolean {
  return routes.some((route) => path === route || path.startsWith(route + "/"));
}

function matchesProfileSettings(path: string): boolean {
  // Matches /profile/:id/settings or /api/profile/:id/settings
  return (
    (path.startsWith("/profile/") || path.startsWith("/api/profile/")) &&
    path.includes("/settings")
  );
}

function shouldRateLimit(path: string): boolean {
  return (
    path.startsWith("/api/") &&
    !ROUTES.API.EXCLUDED_FROM_RATE_LIMIT.some((route) => path.startsWith(route))
  );
}

function isAdminUser(user: MyJWT): boolean {
  return user?.is_admin === true;
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

function handleUnauthorized(
  req: NextRequest,
  url: URL,
  path: string
): NextResponse {
  if (path.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", req.url);
  return NextResponse.redirect(url);
}

function handleForbidden(
  path: string,
  url: URL,
  redirectTo = "/"
): NextResponse {
  if (path.startsWith("/api/")) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  url.pathname = redirectTo;
  return NextResponse.redirect(url);
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const isLoggedIn = Boolean(token);
  const user = token as MyJWT;

  /* ---------------- RATE LIMITING ---------------- */
  if (shouldRateLimit(path)) {
    const rateLimitResponse = await rateLimitMiddleware(req);
    if (rateLimitResponse) {
      return new NextResponse(rateLimitResponse.body, {
        status: rateLimitResponse.status,
        headers: rateLimitResponse.headers,
      });
    }
  }

  /* ---------------- LOGIN PAGE ---------------- */
  if (matchesRoute(path, ROUTES.PUBLIC.LOGIN)) {
    if (isLoggedIn) {
      url.pathname = isAdminUser(user) ? "/admin" : "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /* ---------------- DASHBOARD ---------------- */
  if (
    matchesRoute(path, ROUTES.PROTECTED.DASHBOARD) ||
    matchesRoute(path, ROUTES.API.DASHBOARD)
  ) {
    if (!isLoggedIn) return handleUnauthorized(req, url, path);
    return NextResponse.next();
  }

  /* ---------------- ADMIN ---------------- */
  if (
    matchesRoute(path, ROUTES.PROTECTED.ADMIN) ||
    matchesRoute(path, ROUTES.API.ADMIN)
  ) {
    if (!isLoggedIn) return handleUnauthorized(req, url, path);
    if (!isAdminUser(user)) {
      console.warn(`Unauthorized admin access attempt by user: ${user?.email}`);
      return handleForbidden(path, url, "/");
    }
    return NextResponse.next();
  }

  /* ---------------- PROFILE SETTINGS ---------------- */
  if (matchesProfileSettings(path)) {
    if (!isLoggedIn) return handleUnauthorized(req, url, path);

    const pathSegments = path.split("/").filter(Boolean);
    // /profile/:identifier/settings  →  index 0=profile, 1=identifier
    // /api/profile/:identifier/settings  →  index 0=api, 1=profile, 2=identifier
    const identifierIndex = path.startsWith("/api/") ? 2 : 1;
    const profileIdentifier = pathSegments[identifierIndex];

    const isOwnProfile =
      profileIdentifier === user?.username ||
      profileIdentifier === user?.user_id;

    if (!isOwnProfile) return handleForbidden(path, url, "/");
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*/settings/:path*",
    "/api/dashboard/:path*",
    "/api/admin/:path*",
    "/api/profile/:path*/settings/:path*",
    "/api/user/settings/:path*",
  ],
};
