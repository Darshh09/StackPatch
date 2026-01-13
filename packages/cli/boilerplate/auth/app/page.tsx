"use client";

import React from "react";
import { AuthNavbar } from "@/components/auth-navbar";
import Link from "next/link";

/**
 * Landing Page Example
 *
 * This is an example landing page with auth navbar.
 *
 * To use this:
 * 1. This replaces your existing app/page.tsx (only if it's the default Next.js page)
 * 2. The AuthNavbar automatically shows sign in/out based on session
 * 3. Customize this page with your content
 * 4. If you have an existing navbar, you can use AuthNavbar as reference or integrate its features
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <AuthNavbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Welcome to Your App
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Get started by exploring the features below.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50"
            >
              Sign In <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
