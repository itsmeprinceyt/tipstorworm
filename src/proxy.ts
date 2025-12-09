import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { MyJWT } from "./types/User/JWT.type";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const isLoggedIn = Boolean(token);
  const user = token as MyJWT;

  const isAdminUser = (user: MyJWT): boolean => {
    return user?.is_admin === true;
  };

  const isApiRoute = path.startsWith("/api/");

  if (isLoggedIn && path.startsWith("/login")) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Already authenticated" },
        { status: 400 }
      );
    }
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      if (isApiRoute) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }

    if (!isAdminUser(user)) {
      console.warn(`Unauthorized admin access attempt by user: ${user?.email}`);
      if (isApiRoute) {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (
    !isLoggedIn &&
    (path.startsWith("/dashboard") || path.startsWith("/api/dashboard"))
  ) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  if (
    (path.startsWith("/profile/") && path.includes("/settings")) ||
    (path.startsWith("/api/profile/") && path.includes("/settings"))
  ) {
    if (!isLoggedIn) {
      if (isApiRoute) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    const pathSegments = path.split("/").filter((segment) => segment);
    if (pathSegments.length >= 2) {
      const profileIdentifier = pathSegments[1];
      const currentUserID = user?.user_id;
      const currentUsername = user?.username;

      const isOwnProfile =
        profileIdentifier === currentUsername ||
        profileIdentifier === currentUserID;

      if (!isOwnProfile) {
        if (isApiRoute) {
          return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Page routes
    "/login",
    "/dashboard/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/profile/:path*/settings/:path*",

    // API routes
    "/api/dashboard/:path*",
    "/api/admin/:path*",
    "/api/profile/:path*/settings/:path*",
    "/api/user/settings/:path*",
  ],
};
