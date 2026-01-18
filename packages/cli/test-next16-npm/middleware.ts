import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if session cookie exists
  const sessionCookie = getSessionCookie(request);

  // Handle auth pages (login/signup)
  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    // If already authenticated, redirect away from auth pages
    if (sessionCookie) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const redirectTo = redirectParam || "/stackpatch";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    // Not authenticated - allow access to auth pages
    return NextResponse.next();
  }

  // Handle protected routes (only protected routes reach here thanks to matcher)
  if (!sessionCookie) {
    // Not authenticated - redirect to login with return URL
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated and accessing protected route - allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/","/stackpatch/:path*","/auth/login","/auth/signup"], // Protected routes + auth pages
};
