import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  getSession,
  listSessions,
  revokeSession,
  revokeOtherSessions,
  revokeSessions
} = authClient;

// IMPORTANT: useSession is a hook available on the authClient instance
//
// ✅ CORRECT - In client components (use the hook from authClient):
//    import { authClient } from "@/lib/auth-client";
//    const { data: session, isPending } = authClient.useSession();
//
// ✅ CORRECT - In server components or API routes (use async getSession):
//    import { authClient } from "@/lib/auth-client";
//    const { data: session } = await authClient.getSession();
//
// ❌ WRONG - Don't import useSession from "better-auth/react":
//    import { useSession } from "better-auth/react"; // This doesn't exist!
//
// ❌ WRONG - Don't use await in client component function body:
//    const { data: session } = await authClient.getSession(); // This will cause an error!
