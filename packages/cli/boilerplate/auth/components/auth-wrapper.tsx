"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { isProtectedRoute } from "@/lib/protected-routes";

/**
 * Auth Wrapper Component
 *
 * This wrapper checks authentication for protected routes and handles redirects.
 * It works alongside middleware to ensure routes are properly protected.
 */
export function AuthWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Don't do anything while loading
    if (isPending) return;

    // Handle auth pages (login/signup)
    if (pathname === "/auth/login" || pathname === "/auth/signup") {
      if (session?.user) {
        // Already authenticated - redirect away from auth pages
        const redirectParam = searchParams.get("redirect");
        const redirectTo = redirectParam || "/stackpatch";
        router.push(redirectTo);
      }
      return; // Allow access to auth pages if not authenticated
    }

    // Handle protected routes
    if (isProtectedRoute(pathname)) {
      if (!session?.user) {
        // Not authenticated - redirect to login with return URL
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      }
      return; // Allow access if authenticated
    }

    // For all other routes, allow access
  }, [pathname, session, isPending, router, searchParams]);

  // Show loading state while checking session (only on protected routes)
  if (isPending && isProtectedRoute(pathname) && !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
