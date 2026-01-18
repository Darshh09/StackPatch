"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

/**
 * StackPatch Landing Page
 *
 * Landing page with ProductHunt, GitHub links, user session info, and sign out button
 *
 * 📝 TO CHANGE THIS ROUTE:
 * 1. Rename this file/folder: app/stackpatch/page.tsx → app/YOUR_ROUTE/page.tsx
 * 2. Update redirects in:
 *    - app/page.tsx (line 21)
 *    - app/auth/login/page.tsx (line 19, 40)
 *    - app/auth/signup/page.tsx (line 21, 69)
 *    - middleware.ts (if protecting this route)
 */
export default function StackPatchPage() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({ callbackUrl: "/" });
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
                StackPatch
              </h1>
              <p className="mt-4 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
                Composable frontend features for modern React & Next.js apps
              </p>
            </div>

            {/* Authentication Status Card */}
            <div className="mx-auto mt-8 max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <svg
                    className="h-8 w-8 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Authentication Required
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Please sign in to access the StackPatch dashboard and manage your account.
              </p>
              <div className="mt-6">
                <a
                  href="/auth/login"
                  className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Sign In
                </a>
              </div>
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                Don't have an account?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  Sign up
                </a>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <a
                href="https://www.producthunt.com/posts/stackpatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                🚀 Support us on ProductHunt
              </a>
              <a
                href="https://github.com/Darshh09/StackPatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      {/* Header with Sign Out */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">StackPatch</h1>
            {session?.user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
            StackPatch
          </h1>
          <p className="mt-6 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Composable frontend features for modern React & Next.js apps
          </p>

          {/* User Session Info */}
          {session?.user && (
            <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Welcome back! 👋
              </h2>
              <div className="mt-4 space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <span className="font-medium">Name:</span> {session.user.name || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {session.user.email}
                </p>
                {session.user.image && (
                  <div className="mt-3">
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="mx-auto h-16 w-16 rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://www.producthunt.com/posts/stackpatch"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              🚀 Support us on ProductHunt
            </a>
            <a
              href="https://github.com/Darshh09/StackPatch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              ⭐ Star on GitHub
            </a>
          </div>

          {/* Setup Instructions */}
          {session?.user && (
            <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                🎉 Authentication Setup Complete!
              </h2>
              <div className="mt-4 space-y-3 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Next Steps:</p>
                  <ol className="mt-2 ml-4 list-decimal space-y-2">
                    <li>Create <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">.env.local</code> from <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">.env.example</code></li>
                    <li>Add your OAuth credentials (Google/GitHub) to <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">.env.local</code></li>
                    <li>Configure your database (if using database mode)</li>
                    <li>Start building your app!</li>
                  </ol>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-700">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">Protected Routes:</p>
                  <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
                    <p>Routes are automatically protected. Use <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">/*</code> to protect all sub-routes:</p>
                    <ul className="ml-4 mt-1 space-y-0.5 list-disc">
                      <li><code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">/dashboard</code> → Protects only /dashboard</li>
                      <li><code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">/dashboard/*</code> → Protects /dashboard and all sub-routes</li>
                      <li><code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">/admin/*</code> → Protects /admin and all sub-routes</li>
                    </ul>
                    <p className="mt-2">Edit <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">lib/protected-routes.ts</code> to modify protected routes.</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-700">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Documentation:</p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <a href="https://better-auth.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                        Better Auth Docs
                      </a>
                    </li>
                    <li>
                      <a href="https://stackpatch.darshitdev.in/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                        StackPatch Auth Guide
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
