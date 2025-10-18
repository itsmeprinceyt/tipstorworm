import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
// TODO: Add redis rate limiter later
// import { rateLimiter } from "./lib/Redis/rateLimiter";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const path = url.pathname;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const isLoggedIn = Boolean(token);

    if (isLoggedIn && path.startsWith("/login")) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    const protectedPrefix = "/dashboard";
    if (!isLoggedIn && path.startsWith(protectedPrefix)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/dashboard/:path*"],
};
