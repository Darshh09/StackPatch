import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware for Protected Routes
 *
 * This middleware protects routes at the file system level.
 *
 * To protect a route, add it to the matcher array below.
 *
 * Example:
 * - To protect all routes under /dashboard: matcher: ["/dashboard/:path*"]
 * - To protect specific routes: matcher: ["/dashboard", "/profile", "/settings"]
 * - To protect all routes except public ones: matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"]
 *
 * Protected routes will automatically redirect to /auth/login if user is not authenticated.
 *
 * Usage:
 * 1. Add your protected route paths to the matcher array
 * 2. Users accessing these routes will be redirected to login if not authenticated
 * 3. Authenticated users can access the routes normally
 */
export default withAuth(
  function middleware(req) {
    // You can add additional logic here if needed
    // For example, role-based access control
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User must be authenticated
    },
    pages: {
      signIn: "/auth/login", // Redirect to login page
    },
  }
);

// Configure which routes to protect
// Add your protected routes here
export const config = {
  matcher: [
    // Example: Protect dashboard routes
    // "/dashboard/:path*",
    // "/profile/:path*",
    // "/settings/:path*",

    // To protect all routes except public ones, uncomment:
    // "/((?!api|auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
