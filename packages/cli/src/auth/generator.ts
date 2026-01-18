import fs from "fs";
import path from "path";
import chalk from "chalk";
import { detectAppDirectory, detectComponentsDirectory } from "../utils/paths.js";
import type { AuthConfig } from "./setup.js";
import type { ProjectScan } from "../utils/scanner.js";

/**
 * Generate Better Auth files based on configuration
 */

/**
 * Generate auth instance file
 */
export function generateAuthInstance(
  target: string,
  config: AuthConfig,
  scan: ProjectScan
): string {
  // Determine auth file location
  const libDir = scan.hasSrcDir
    ? path.join(target, "src", "lib")
    : path.join(target, "lib");
  const authPath = path.join(libDir, "auth.ts");

  // Create lib directory if it doesn't exist
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // CRITICAL: If file exists, delete it first to ensure clean generation
  // This prevents any leftover database imports from previous runs
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }

  // Always overwrite the auth.ts file to ensure it matches the current configuration
  // This prevents old database code from persisting when switching to stateless mode

  // VALIDATION: Ensure config is valid for stateless mode
  // If sessionMode is "stateless", force database and orm to "none"
  if (config.sessionMode === "stateless") {
    config.database = "none";
    config.orm = "none";
  }

  let imports = 'import { betterAuth } from "better-auth";\n';
  imports += 'import { nextCookies } from "better-auth/next-js";\n';
  let databaseConfig = "";
  let sessionConfig = "";
  let accountConfig = "";

  // Stateless session configuration (when no database)
  // IMPORTANT: If stateless mode, skip ALL database code generation
  // CRITICAL: Check sessionMode first - if it's "stateless", NEVER generate database code
  const isStateless = config.sessionMode === "stateless" || config.database === "none";

  // DEFENSIVE: If stateless mode is explicitly selected, force stateless regardless of other config
  if (config.sessionMode === "stateless") {
    sessionConfig = `    session: {
        cookieCache: {
            enabled: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
            strategy: "jwe", // can be "jwt" or "compact"
            refreshCache: true, // Enable stateless refresh
        },
    },`;
    accountConfig = `    account: {
        storeStateStrategy: "cookie",
        storeAccountCookie: true, // Store account data after OAuth flow in a cookie
    },`;
    // EXPLICITLY skip all database code generation - do not proceed to database config
  } else if (isStateless) {
    // Fallback: if database is "none" but sessionMode is "database", still use stateless
    sessionConfig = `    session: {
        cookieCache: {
            enabled: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
            strategy: "jwe", // can be "jwt" or "compact"
            refreshCache: true, // Enable stateless refresh
        },
    },`;
    accountConfig = `    account: {
        storeStateStrategy: "cookie",
        storeAccountCookie: true, // Store account data after OAuth flow in a cookie
    },`;
  }

  // Database configuration - ONLY generate if database mode is selected AND database is not "none"
  // CRITICAL: Double-check that we're NOT in stateless mode before generating ANY database code
  // This is a defensive check to prevent database imports in stateless mode
  if (
    !isStateless &&
    config.sessionMode === "database" &&
    config.database !== "none" &&
    config.orm !== "none"
  ) {
    if (config.orm === "drizzle") {
      imports += 'import { drizzleAdapter } from "better-auth/adapters/drizzle";\n';
      imports += 'import { db } from "@/db"; // Your drizzle instance\n';
      databaseConfig = `    database: drizzleAdapter(db, {
        provider: "${config.database === "postgres" ? "pg" : config.database}",
    }),`;
    } else if (config.orm === "prisma") {
      imports += 'import { prismaAdapter } from "better-auth/adapters/prisma";\n';
      imports += 'import { prisma } from "@/lib/prisma"; // Your prisma instance\n';
      databaseConfig = `    database: prismaAdapter(prisma),`;
    } else if (config.orm === "raw") {
      if (config.database === "sqlite") {
        imports += 'import Database from "better-sqlite3";\n';
        databaseConfig = `    database: new Database(process.env.DATABASE_URL || "./sqlite.db"),`;
      } else if (config.database === "postgres") {
        imports += 'import { PostgresJsAdapter } from "better-auth/adapters/postgres";\n';
        imports += 'import postgres from "postgres";\n';
        imports += 'const sql = postgres(process.env.DATABASE_URL!);\n';
        databaseConfig = `    database: new PostgresJsAdapter(sql),`;
      } else if (config.database === "mysql") {
        imports += 'import { MySqlAdapter } from "better-auth/adapters/mysql";\n';
        imports += 'import mysql from "mysql2/promise";\n';
        imports += 'const connection = await mysql.createConnection(process.env.DATABASE_URL!);\n';
        databaseConfig = `    database: new MySqlAdapter(connection),`;
      }
    }
  }

  // Email and password config
  // Email/password works in both database and stateless modes
  let emailPasswordConfig = "";
  if (config.emailPassword) {
    emailPasswordConfig = `    emailAndPassword: {
        enabled: true,
    },`;
  }

  // Social providers config
  let socialProvidersConfig = "";
  const socialProviders: string[] = [];
  if (config.oauthProviders.includes("google")) {
    socialProviders.push(`        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }`);
  }
  if (config.oauthProviders.includes("github")) {
    socialProviders.push(`        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }`);
  }

  if (socialProviders.length > 0) {
    socialProvidersConfig = `    socialProviders: {
${socialProviders.join(",\n")}
    },`;
  }

  // Build the auth configuration
  // CRITICAL: In stateless mode, NEVER include databaseConfig, even if it was somehow set
  const configParts: string[] = [];
  if (!isStateless && databaseConfig) {
    configParts.push(databaseConfig);
  }
  if (sessionConfig) configParts.push(sessionConfig);
  if (accountConfig) configParts.push(accountConfig);
  if (emailPasswordConfig) configParts.push(emailPasswordConfig);
  if (socialProvidersConfig) configParts.push(socialProvidersConfig);

  // Always add nextCookies plugin for Next.js integration
  configParts.push(`    plugins: [nextCookies()],`);

  // Final safety check: Remove any database imports if in stateless mode
  let finalImports = imports;
  if (isStateless) {
    // Remove all database-related imports
    finalImports = finalImports
      .replace(/import Database from "better-sqlite3";\n?/g, "")
      .replace(/import { drizzleAdapter } from "better-auth\/adapters\/drizzle";\n?/g, "")
      .replace(/import { prismaAdapter } from "better-auth\/adapters\/prisma";\n?/g, "")
      .replace(/import { PostgresJsAdapter } from "better-auth\/adapters\/postgres";\n?/g, "")
      .replace(/import { MySqlAdapter } from "better-auth\/adapters\/mysql";\n?/g, "")
      .replace(/import postgres from "postgres";\n?/g, "")
      .replace(/import mysql from "mysql2\/promise";\n?/g, "")
      .replace(/import { db } from "@\/db";.*\n?/g, "")
      .replace(/import { prisma } from "@\/lib\/prisma";.*\n?/g, "")
      .replace(/const sql = postgres\(process\.env\.DATABASE_URL!\);\n?/g, "")
      .replace(/const connection = await mysql\.createConnection\(process\.env\.DATABASE_URL!\);\n?/g, "");
  }

  const authContent = `${finalImports}
export const auth = betterAuth({
${configParts.join("\n")}});
`;

  // Always overwrite the file to ensure clean state
  fs.writeFileSync(authPath, authContent, "utf-8");
  return path.relative(target, authPath);
}

/**
 * Generate auth client file
 */
export function generateAuthClient(target: string, scan: ProjectScan): string {
  const libDir = scan.hasSrcDir
    ? path.join(target, "src", "lib")
    : path.join(target, "lib");
  const clientPath = path.join(libDir, "auth-client.ts");

  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const clientContent = `import { createAuthClient } from "better-auth/react";

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
`;

  fs.writeFileSync(clientPath, clientContent, "utf-8");
  return path.relative(target, clientPath);
}

/**
 * Generate API route handler
 */
export function generateAuthRoute(target: string, scan: ProjectScan): string {
  const appDir = detectAppDirectory(target);
  const routeDir = path.join(target, appDir, "api", "auth", "[...all]");
  const routePath = path.join(routeDir, "route.ts");

  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Calculate relative path to auth file
  const libDir = scan.hasSrcDir ? "src/lib" : "lib";
  const authImport = scan.hasSrcDir ? "@/lib/auth" : "@/lib/auth";

  const routeContent = `import { auth } from "${authImport}";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
`;

  fs.writeFileSync(routePath, routeContent, "utf-8");
  return path.relative(target, routePath);
}

/**
 * Generate middleware
 */
export function generateMiddleware(
  target: string,
  config: AuthConfig,
  scan: ProjectScan
): string | null {
  // Generate middleware if there are protected routes
  // Works for both stateless (JWT/JWE in cookies) and database modes
  if (config.protectedRoutes.length === 0) {
    return null;
  }

  // Next.js < 16 uses proxy.ts, Next.js 16+ uses middleware.ts
  const isNext16Plus = scan.nextVersion &&
    (parseInt(scan.nextVersion.split(".")[0]) >= 16);
  const middlewareFileName = isNext16Plus ? "middleware.ts" : "proxy.ts";
  const middlewarePath = path.join(target, middlewareFileName);

  // Also check for the old filename if migrating
  const oldMiddlewarePath = path.join(target, isNext16Plus ? "proxy.ts" : "middleware.ts");
  if (fs.existsSync(oldMiddlewarePath) && oldMiddlewarePath !== middlewarePath) {
    // Remove old middleware file if it exists
    try {
      fs.unlinkSync(oldMiddlewarePath);
    } catch {
      // Ignore errors
    }
  }

  // Check if middleware already exists
  if (fs.existsSync(middlewarePath)) {
    // Try to update existing middleware
    let content = fs.readFileSync(middlewarePath, "utf-8");
    if (content.includes("better-auth") || content.includes("auth")) {
      // Already has auth middleware, skip
      return null;
    }
  }

  const appDir = scan.hasSrcDir ? "src/lib" : "lib";
  const authImport = scan.hasSrcDir ? "@/lib/auth" : "@/lib/auth";

  // Build matcher array from protected routes
  // Convert protected routes to matcher patterns
  const matcherPatterns = config.protectedRoutes.map((route) => {
    if (route === "/") {
      // Root route - exact match only
      return "/";
    }

    // Handle wildcard routes (e.g., /dashboard/*)
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2); // Remove "/*"
      return `${baseRoute}/:path*`;
    }

    // For other routes, match the route and all sub-routes
    return `${route}/:path*`;
  });

  // Add auth pages to matcher so we can redirect authenticated users away
  const authPages = ["/auth/login", "/auth/signup"];
  const allMatcherPatterns = [...matcherPatterns, ...authPages];

  // Next.js 16+ uses middleware.ts with named export, Next.js < 16 uses proxy.ts with default export
  const middlewareContent = isNext16Plus
    ? `import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if session cookie exists
  const sessionCookie = getSessionCookie(request);

  // Handle auth pages (login/signup)
  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    // If already authenticated, redirect away from auth pages
    if (sessionCookie) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const redirectTo = redirectParam || "/stackpatch";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    // Not authenticated - allow access to auth pages
    return NextResponse.next();
  }

  // Handle protected routes (only protected routes reach here thanks to matcher)
  if (!sessionCookie) {
    // Not authenticated - redirect to login with return URL
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated and accessing protected route - allow access
  return NextResponse.next();
}

export const config = {
  matcher: ${JSON.stringify(allMatcherPatterns)}, // Protected routes + auth pages
};
`
    : `import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function handler(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if session cookie exists
  const sessionCookie = getSessionCookie(request);

  // Handle auth pages (login/signup)
  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    // If already authenticated, redirect away from auth pages
    if (sessionCookie) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const redirectTo = redirectParam || "/stackpatch";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    // Not authenticated - allow access to auth pages
    return NextResponse.next();
  }

  // Handle protected routes (only protected routes reach here thanks to matcher)
  if (!sessionCookie) {
    // Not authenticated - redirect to login with return URL
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated and accessing protected route - allow access
  return NextResponse.next();
}

export const config = {
  matcher: ${JSON.stringify(allMatcherPatterns)}, // Protected routes + auth pages
};
`;

  fs.writeFileSync(middlewarePath, middlewareContent, "utf-8");
  return path.relative(target, middlewarePath);
}

/**
 * Generate environment example file
 */
export function generateEnvExample(target: string, config: AuthConfig): string {
  const envExamplePath = path.join(target, ".env.example");

  // Generate secret - must be at least 32 characters with high entropy
  // Using base64 encoding like openssl rand -base64 32
  const generateSecret = () => {
    let bytes: Uint8Array;

    if (typeof globalThis.crypto !== "undefined" && (globalThis.crypto as any).getRandomValues) {
      bytes = (globalThis.crypto as any).getRandomValues(new Uint8Array(32));
    } else {
      // Fallback for environments without crypto API
      bytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }

    // Convert to base64 (like openssl rand -base64 32)
    // This ensures at least 32 characters (base64 of 32 bytes = 44 chars)
    if (typeof Buffer !== "undefined") {
      // Node.js/Bun environment
      return Buffer.from(bytes).toString("base64");
    } else {
      // Browser-like environment - manual base64 encoding
      const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      let result = "";
      for (let i = 0; i < bytes.length; i += 3) {
        const b1 = bytes[i];
        const b2 = bytes[i + 1] || 0;
        const b3 = bytes[i + 2] || 0;
        const bitmap = (b1 << 16) | (b2 << 8) | b3;
        result += base64Chars.charAt((bitmap >> 18) & 63);
        result += base64Chars.charAt((bitmap >> 12) & 63);
        result += i + 1 < bytes.length ? base64Chars.charAt((bitmap >> 6) & 63) : "=";
        result += i + 2 < bytes.length ? base64Chars.charAt(bitmap & 63) : "=";
      }
      return result;
    }
  };

  let envContent = `# Better Auth Configuration
BETTER_AUTH_SECRET=${generateSecret()}
BETTER_AUTH_URL=http://localhost:3000

`;

  if (config.database !== "none" && config.orm === "raw") {
    envContent += `# Database
DATABASE_URL=your_database_url_here

`;
  }

  if (config.oauthProviders.includes("google")) {
    envContent += `# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

`;
  }

  if (config.oauthProviders.includes("github")) {
    envContent += `# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

`;
  }

  fs.writeFileSync(envExamplePath, envContent, "utf-8");
  return path.relative(target, envExamplePath);
}

/**
 * Generate stackpatch config file
 */
export function generateStackPatchConfig(
  target: string,
  config: AuthConfig
): string {
  const configPath = path.join(target, "stackpatch.config.json");

  const configContent = {
    version: "1.0.0",
    patch: "auth",
    config: {
      sessionMode: config.sessionMode,
      database: config.database,
      orm: config.orm,
      emailPassword: config.emailPassword,
      oauthProviders: config.oauthProviders,
      addUI: config.addUI,
      protectedRoutes: config.protectedRoutes,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), "utf-8");
  return path.relative(target, configPath);
}

/**
 * Generate protected routes config file for client-side use
 */
export function generateProtectedRoutesConfig(
  target: string,
  config: AuthConfig,
  scan: ProjectScan
): string {
  const libDir = scan.hasSrcDir
    ? path.join(target, "src", "lib")
    : path.join(target, "lib");
  const configPath = path.join(libDir, "protected-routes.ts");

  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const configContent = `/**
 * Protected Routes Configuration
 *
 * This file is auto-generated by StackPatch.
 * It defines which routes require authentication.
 */

export const PROTECTED_ROUTES = ${JSON.stringify(config.protectedRoutes, null, 2)} as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => {
    // Handle root route
    if (route === "/") {
      return pathname === "/";
    }

    // Handle wildcard routes (e.g., /dashboard/*)
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2); // Remove "/*"
      return pathname === baseRoute || pathname.startsWith(baseRoute + "/");
    }

    // Handle exact routes and their sub-routes
    return pathname === route || pathname.startsWith(route + "/");
  });
}
`;

  fs.writeFileSync(configPath, configContent, "utf-8");
  return path.relative(target, configPath);
}

/**
 * Generate protected route page (fallback/example)
 */
export function generateProtectedPage(target: string, scan: ProjectScan): string | null {
  const appDir = detectAppDirectory(target);
  const protectedPagePath = path.join(target, appDir, "protected", "page.tsx");

  // Create protected directory if it doesn't exist
  const protectedDir = path.join(target, appDir, "protected");
  if (!fs.existsSync(protectedDir)) {
    fs.mkdirSync(protectedDir, { recursive: true });
  }

  // Use client-side auth check with ProtectedRoute component
  const componentsDir = scan.hasSrcDir ? "src/components" : "components";
  const protectedRouteImport = scan.hasSrcDir ? "@/components/protected-route" : "@/components/protected-route";
  const clientImport = scan.hasSrcDir ? "@/lib/auth-client" : "@/lib/auth-client";

  const pageContent = `"use client";

import { ProtectedRoute } from "${protectedRouteImport}";
import { useSession } from "${clientImport}";

export default function ProtectedPage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Protected Page</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          This page is protected. Only authenticated users can see this.
        </p>
        <div className="mt-4">
          <p>Email: {session?.user?.email}</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
`;

  fs.writeFileSync(protectedPagePath, pageContent, "utf-8");
  return path.relative(target, protectedPagePath);
}
