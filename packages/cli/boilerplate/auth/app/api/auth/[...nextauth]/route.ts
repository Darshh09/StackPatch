import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
        // ⚠️ DEMO MODE: This is a placeholder implementation
        //
        // TO IMPLEMENT REAL AUTHENTICATION:
        // 1. Set up a database (PostgreSQL, MongoDB, Prisma, etc.)
        // 2. Install bcrypt: npm install bcryptjs @types/bcryptjs
        // 3. Replace this function with database lookup:
        //
        // Example implementation:
        // ```ts
        // import bcrypt from "bcryptjs";
        // import { db } from "@/lib/db"; // Your database connection
        //
        // async authorize(credentials) {
        //   if (!credentials?.email || !credentials?.password) {
        //     return null;
        //   }
        //
        //   // Find user in database
        //   const user = await db.user.findUnique({
        //     where: { email: credentials.email },
        //   });
        //
        //   if (!user) {
        //     return null;
        //   }
        //
        //   // Verify password
        //   const isValid = await bcrypt.compare(
        //     credentials.password,
        //     user.password
        //   );
        //
        //   if (!isValid) {
        //     return null;
        //   }
        //
        //   return {
        //     id: user.id,
        //     email: user.email,
        //     name: user.name,
        //   };
        // }
        // ```
        //
        // Current demo credentials (REMOVE IN PRODUCTION):
        // Email: demo@example.com
        // Password: demo123

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo check - REMOVE THIS IN PRODUCTION
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

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
