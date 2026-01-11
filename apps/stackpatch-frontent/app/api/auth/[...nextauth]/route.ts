import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Replace with your actual authentication logic
        // This is a placeholder that accepts any email/password
        // In production, you should:
        // 1. Validate credentials against your database
        // 2. Hash and compare passwords
        // 3. Return user object or null

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Example: Check against hardcoded credentials (REMOVE IN PRODUCTION)
        // Replace this with your database lookup
        if (
          credentials.email === "demo@example.com" &&
          credentials.password === "demo123"
        ) {
          return {
            id: "1",
            email: credentials.email,
            name: "Demo User",
          };
        }

        // If credentials don't match, return null
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
