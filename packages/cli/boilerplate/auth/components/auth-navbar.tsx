"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

/**
 * Auth Navbar Component (Demo/Example)
 *
 * Displays a navigation bar with session status and sign in/out button.
 * This is a demo component - rename or customize it to fit your needs.
 *
 * Usage:
 * ```tsx
 * import { AuthNavbar } from "@/components/auth-navbar";
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <AuthNavbar />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 */
export function AuthNavbar() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200"
            >
              Your App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Home
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {session.user?.name || session.user?.email}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {session.user?.email}
                  </span>
                </div>

                {/* User Avatar */}
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600 text-sm font-medium text-white dark:bg-zinc-700">
                    {session.user?.name?.charAt(0).toUpperCase() ||
                      session.user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
