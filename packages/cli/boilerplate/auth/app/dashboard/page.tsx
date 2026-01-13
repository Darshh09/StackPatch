"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthNavbar } from "@/components/auth-navbar";

/**
 * Dashboard Page Example
 *
 * This is an example protected dashboard page.
 *
 * To use this:
 * 1. Copy this file to your app/dashboard/page.tsx
 * 2. The page is automatically protected using ProtectedRoute
 * 3. The AuthNavbar shows session status and sign out button
 *
 * You can customize this page to show your dashboard content.
 * If you have an existing navbar, replace AuthNavbar with your own.
 */
export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <AuthNavbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow dark:bg-zinc-900">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Welcome to your protected dashboard!
            </p>

            {session && (
              <div className="mt-6 rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Session Information
                </h2>
                <div className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {session.user?.name || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {session.user?.email || "Not provided"}
                  </p>
                  {session.user?.image && (
                    <p>
                      <span className="font-medium">Image:</span>{" "}
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="mt-2 h-16 w-16 rounded-full"
                      />
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Getting Started
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                This is a protected page. Only authenticated users can see this
                content.
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Customize this page to add your dashboard features.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
