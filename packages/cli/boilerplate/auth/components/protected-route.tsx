"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 *
 * Wrap any component or page with this to protect it from unauthorized access.
 *
 * Usage:
 * ```tsx
 * import { ProtectedRoute } from "@/components/protected-route";
 *
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <div>Your protected content here</div>
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 *
 * Or protect an entire page:
 * ```tsx
 * // app/dashboard/page.tsx
 * import { ProtectedRoute } from "@/components/protected-route";
 *
 * export default function Dashboard() {
 *   return (
 *     <ProtectedRoute>
 *       <h1>Dashboard</h1>
 *       <p>This page is protected</p>
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return <>{children}</>;
}
