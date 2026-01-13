#!/usr/bin/env bun

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import fse from "fs-extra";
import { spawnSync } from "child_process";
import Jimp from "jimp";

// ---------------- CONFIG ----------------
// Get directory path - Bun supports import.meta.dir
// @ts-expect-error - Bun-specific API, not in Node types
const CLI_DIR = import.meta.dir || path.dirname(new URL(import.meta.url).pathname);
// Resolve boilerplate path - use local boilerplate inside CLI package
const BOILERPLATE_ROOT = path.resolve(CLI_DIR, "../boilerplate");
const PATCHES: Record<
  string,
  { path: string; dependencies: string[] }
> = {
  auth: {
    path: "auth",
    dependencies: ["next-auth", "react-hot-toast"],
  },
  "auth-ui": {
    path: "auth",
    dependencies: ["next-auth", "react-hot-toast"],
  },
  // Example for future patches:
  // stripe: { path: "stripe", dependencies: ["stripe"] },
  // redux: { path: "redux", dependencies: ["@reduxjs/toolkit", "react-redux"] },
};



// ---------------- Progress & UI Helpers ----------------
// Show StackPatch logo (based on the actual SVG logo design)
function showLogo() {
  console.log("\n");

  // StackPatch logo ASCII art
  const logo = [
    chalk.magentaBright("  _________ __                 __     __________         __         .__"),
    chalk.magentaBright(" /   _____//  |______    ____ |  | __ \\\\______   \\_____ _/  |_  ____ |  |__"),
    chalk.magentaBright(" \\_____  \\\\   __\\__  \\ _/ ___\\|  |/ /  |     ___/\\__  \\\\   __\\/ ___\\|  |  \\"),
    chalk.magentaBright(" /        \\|  |  / __ \\\\  \\___|    <   |    |     / __ \\|  | \\  \\___|   Y  \\"),
    chalk.magentaBright("/_______  /|__| (____  /\\___  >__|_ \\  |____|    (____  /__|  \\___  >___|  /"),
    chalk.magentaBright("        \\/           \\/     \\/     \\/                 \\/          \\/     \\/"),
    "",
    chalk.white("  Composable frontend features for modern React & Next.js"),
    chalk.gray("  Add authentication, UI components, and more with zero configuration"),
    "",
  ];

  logo.forEach(line => console.log(line));
}

// Progress tracker with checkmarks
class ProgressTracker {
  private steps: Array<{ name: string; status: "pending" | "processing" | "completed" | "failed"; interval?: NodeJS.Timeout }> = [];

  addStep(name: string) {
    this.steps.push({ name, status: "pending" });
  }

  startStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.steps[index].status = "processing";
      const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frameIndex = 0;
      const step = this.steps[index];

      const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.yellow(frames[frameIndex])} ${step.name}`);
        frameIndex = (frameIndex + 1) % frames.length;
      }, 100);

      this.steps[index].interval = interval;
    }
  }

  completeStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      if (this.steps[index].interval) {
        clearInterval(this.steps[index].interval);
        this.steps[index].interval = undefined;
      }
      process.stdout.write(`\r${chalk.green("✓")} ${this.steps[index].name}\n`);
      this.steps[index].status = "completed";
    }
  }

  failStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      if (this.steps[index].interval) {
        clearInterval(this.steps[index].interval);
        this.steps[index].interval = undefined;
      }
      process.stdout.write(`\r${chalk.red("✗")} ${this.steps[index].name}\n`);
      this.steps[index].status = "failed";
    }
  }

  getSteps() {
    return this.steps;
  }
}

// Helper function with spinner and checkmark
async function withSpinner<T>(text: string, fn: () => Promise<T> | T): Promise<T> {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frameIndex = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r${chalk.yellow(frames[frameIndex])} ${text}`);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 100);

  try {
    const result = await fn();
    clearInterval(interval);
    process.stdout.write(`\r${chalk.green("✓")} ${text}\n`);
    return result;
  } catch (error) {
    clearInterval(interval);
    process.stdout.write(`\r${chalk.red("✗")} ${text}\n`);
    throw error;
  }
}

// Ask if user wants to go back
async function askGoBack(): Promise<boolean> {
  const { goBack } = await inquirer.prompt([
    {
      type: "confirm",
      name: "goBack",
      message: chalk.yellow("Do you want to go back and change your selection?"),
      default: false,
    },
  ]);
  return goBack;
}
async function copyFiles(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.log(chalk.red(`❌ Boilerplate folder not found: ${src}`));
    return false;
  }

  await fse.ensureDir(dest);

  const conflicts: string[] = [];
  fse.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const destPath = path.join(dest, entry.name);
    if (fs.existsSync(destPath)) conflicts.push(destPath);
  });

  if (conflicts.length) {
    console.log(chalk.yellow("\n⚠️ The following files already exist:"));
    conflicts.forEach((f) => console.log(`  ${f}`));

    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite them?",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.red("\nAborted! No files were copied."));
      return false;
    }
  }

  await fse.copy(src, dest, { overwrite: true });
  return true;
}

// Check if dependency exists in package.json
function hasDependency(target: string, depName: string): boolean {
  const packageJsonPath = path.join(target, "package.json");
  if (!fs.existsSync(packageJsonPath)) return false;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    return !!deps[depName];
  } catch {
    return false;
  }
}

// Install dependencies (only missing ones)
function installDependencies(target: string, deps: string[]) {
  if (deps.length === 0) return;

  const missingDeps = deps.filter(dep => !hasDependency(target, dep));

  if (missingDeps.length === 0) {
    return; // Already installed, spinner will show completion
  }

  const result = spawnSync("pnpm", ["add", ...missingDeps], {
    cwd: target,
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(`Failed to install dependencies: ${missingDeps.join(", ")}`);
  }
}

// Update layout.tsx to include Toaster
function updateLayoutForToaster(target: string): boolean {
  const layoutPath = path.join(target, "app", "layout.tsx");

  if (!fs.existsSync(layoutPath)) {
    return false;
  }

  try {
    let layoutContent = fs.readFileSync(layoutPath, "utf-8");

    // Check if already has Toaster
    if (layoutContent.includes("Toaster")) {
      console.log(chalk.green("✅ Layout already has Toaster!"));
      return true;
    }

    // Add import if not present
    const hasImport = layoutContent.includes("from \"@/components/toaster\"") ||
                      layoutContent.includes("from '@/components/toaster'");

    if (!hasImport) {
      // Find the last import statement
      const lines = layoutContent.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
          lastImportIndex = i;
        } else if (trimmed && !trimmed.startsWith("//") && lastImportIndex >= 0) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, 'import { Toaster } from "@/components/toaster";');
        layoutContent = lines.join("\n");
      }
    }

    // Add Toaster component before closing AuthSessionProvider
    if (layoutContent.includes("</AuthSessionProvider>")) {
      layoutContent = layoutContent.replace(
        /(<\/AuthSessionProvider>)/,
        '<Toaster />\n        $1'
      );
    } else if (layoutContent.includes("{children}")) {
      // If AuthSessionProvider wraps children, add Toaster after children
      layoutContent = layoutContent.replace(
        /(\{children\})/,
        '$1\n          <Toaster />'
      );
    }

    fs.writeFileSync(layoutPath, layoutContent, "utf-8");
    console.log(chalk.green("✅ Updated layout.tsx with Toaster!"));
    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.yellow(`⚠️  Failed to update layout with Toaster: ${errorMessage}`));
    return false;
  }
}

// Update layout.tsx to include AuthSessionProvider
function updateLayoutForAuth(target: string): boolean {
  const layoutPath = path.join(target, "app", "layout.tsx");

  if (!fs.existsSync(layoutPath)) {
    console.log(chalk.yellow("⚠️  layout.tsx not found. Skipping layout update."));
    return false;
  }

  try {
    let layoutContent = fs.readFileSync(layoutPath, "utf-8");

    // Check if already has AuthSessionProvider
    if (layoutContent.includes("AuthSessionProvider")) {
      console.log(chalk.green("✅ Layout already has AuthSessionProvider!"));
      return true;
    }

    // Add import if not present
    const hasImport = layoutContent.includes("from \"@/components/session-provider\"") ||
                      layoutContent.includes("from '@/components/session-provider'") ||
                      layoutContent.includes("from './components/session-provider'") ||
                      layoutContent.includes("from '../components/session-provider'");

    if (!hasImport) {
      // Find the last import statement (before the first non-import line)
      const lines = layoutContent.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
          lastImportIndex = i;
        } else if (trimmed && !trimmed.startsWith("//") && lastImportIndex >= 0) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, 'import { AuthSessionProvider } from "@/components/session-provider";');
        layoutContent = lines.join("\n");
      } else {
        // No imports found, add after the first line
        const firstNewline = layoutContent.indexOf("\n");
        if (firstNewline > 0) {
          layoutContent =
            layoutContent.slice(0, firstNewline + 1) +
            'import { AuthSessionProvider } from "@/components/session-provider";\n' +
            layoutContent.slice(firstNewline + 1);
        } else {
          layoutContent = 'import { AuthSessionProvider } from "@/components/session-provider";\n' + layoutContent;
        }
      }
    }

    // Wrap children with AuthSessionProvider
    // Look for {children} pattern in body tag
    const childrenPattern = /(\s*)(\{children\})(\s*)/;
    if (childrenPattern.test(layoutContent)) {
      layoutContent = layoutContent.replace(
        childrenPattern,
        '$1<AuthSessionProvider>{children}</AuthSessionProvider>$3'
      );
    } else {
      // Try to find body tag and wrap its content
      const bodyRegex = /(<body[^>]*>)([\s\S]*?)(<\/body>)/;
      const bodyMatch = layoutContent.match(bodyRegex);
      if (bodyMatch) {
        const bodyContent = bodyMatch[2].trim();
        if (bodyContent && !bodyContent.includes("AuthSessionProvider")) {
          layoutContent = layoutContent.replace(
            bodyRegex,
            `$1\n        <AuthSessionProvider>${bodyContent}</AuthSessionProvider>\n      $3`
          );
        }
      }
    }

    fs.writeFileSync(layoutPath, layoutContent, "utf-8");
    console.log(chalk.green("✅ Updated layout.tsx with AuthSessionProvider!"));
    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.red(`❌ Failed to update layout.tsx: ${errorMessage}`));
    return false;
  }
}

// Setup authentication with Google and GitHub providers
async function setupAuth(target: string, authType: "providers"): Promise<boolean> {
  const tracker = new ProgressTracker();
  tracker.addStep("Setting up authentication");
  tracker.addStep("Generating environment files");
  tracker.addStep("Configuring NextAuth with Google and GitHub");
  tracker.addStep("Updating UI components");

  try {
    const nextAuthRoutePath = path.join(target, "app/api/auth/[...nextauth]/route.ts");

    if (!fs.existsSync(nextAuthRoutePath)) {
      console.log(chalk.yellow("⚠️  NextAuth route not found, skipping auth setup"));
      return false;
    }

    tracker.startStep(0);

    // Step 1: Generate .env.example file
    tracker.startStep(1);
    await generateEnvExample(target);
    tracker.completeStep(1);

    // Step 2: Update NextAuth route with Google and GitHub providers
    tracker.startStep(2);
    await updateNextAuthWithProviders(nextAuthRoutePath);
    tracker.completeStep(2);

      // Step 3: Update UI components
      // Note: Boilerplate already includes both email/password and OAuth buttons
      // Only update auth button if needed
      tracker.startStep(3);
      await updateAuthButtonWithProviders(target);
      tracker.completeStep(3);

    tracker.completeStep(0);

    // Show OAuth setup instructions
    await showOAuthSetupInstructions(target);

    return true;
  } catch (error) {
    tracker.failStep(0);
    return false;
  }
}

// Show OAuth setup instructions
async function showOAuthSetupInstructions(target: string) {
  const envLocalPath = path.join(target, ".env.local");
  let hasGoogleCreds = false;
  let hasGitHubCreds = false;

  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf-8");
    hasGoogleCreds = envContent.includes("GOOGLE_CLIENT_ID") &&
                     envContent.includes("GOOGLE_CLIENT_SECRET") &&
                     !envContent.includes("your_google_client_id_here");
    hasGitHubCreds = envContent.includes("GITHUB_CLIENT_ID") &&
                     envContent.includes("GITHUB_CLIENT_SECRET") &&
                     !envContent.includes("your_github_client_id_here");
  }

  console.log(chalk.blue.bold("\n📋 OAuth Setup Instructions\n"));

  if (!hasGoogleCreds || !hasGitHubCreds) {
    console.log(chalk.yellow("⚠️  OAuth credentials not configured yet.\n"));

    if (!hasGoogleCreds) {
      console.log(chalk.cyan.bold("🔵 Google OAuth Setup:"));
      console.log(chalk.white("   1. Go to: ") + chalk.underline("https://console.cloud.google.com/"));
      console.log(chalk.white("   2. Create a new project or select existing one"));
      console.log(chalk.white("   3. Navigate to: APIs & Services > Credentials"));
      console.log(chalk.white("   4. Click: Create Credentials > OAuth client ID"));
      console.log(chalk.white("   5. Choose: Web application"));
      console.log(chalk.white("   6. Add Authorized redirect URI:"));
      console.log(chalk.magentaBright("      → ") + chalk.bold("http://localhost:3000/api/auth/callback/google"));
      console.log(chalk.white("   7. Copy Client ID and Client Secret"));
      console.log(chalk.white("   8. Add them to your .env.local file:\n"));
      console.log(chalk.gray("      GOOGLE_CLIENT_ID=your_client_id_here"));
      console.log(chalk.gray("      GOOGLE_CLIENT_SECRET=your_client_secret_here\n"));
    }

    if (!hasGitHubCreds) {
      console.log(chalk.cyan.bold("🐙 GitHub OAuth Setup:"));
      console.log(chalk.white("   1. Go to: ") + chalk.underline("https://github.com/settings/developers"));
      console.log(chalk.white("   2. Click: New OAuth App"));
      console.log(chalk.white("   3. Fill in the form:"));
      console.log(chalk.white("      - Application name: Your app name"));
      console.log(chalk.white("      - Homepage URL: http://localhost:3000"));
      console.log(chalk.white("      - Authorization callback URL:"));
      console.log(chalk.magentaBright("        → ") + chalk.bold("http://localhost:3000/api/auth/callback/github"));
      console.log(chalk.white("   4. Click: Register application"));
      console.log(chalk.white("   5. Copy Client ID"));
      console.log(chalk.white("   6. Generate a new Client Secret"));
      console.log(chalk.white("   7. Add them to your .env.local file:\n"));
      console.log(chalk.gray("      GITHUB_CLIENT_ID=your_client_id_here"));
      console.log(chalk.gray("      GITHUB_CLIENT_SECRET=your_client_secret_here\n"));
    }

    console.log(chalk.blue.bold("📝 Required Redirect URIs:"));
    console.log(chalk.white("   For Google: ") + chalk.bold("http://localhost:3000/api/auth/callback/google"));
    console.log(chalk.white("   For GitHub: ") + chalk.bold("http://localhost:3000/api/auth/callback/github"));
    console.log(chalk.gray("\n   For production, also add:"));
    console.log(chalk.gray("   https://yourdomain.com/api/auth/callback/google"));
    console.log(chalk.gray("   https://yourdomain.com/api/auth/callback/github\n"));

    console.log(chalk.green("✅ Once configured, restart your dev server and test OAuth login!"));
  } else {
    console.log(chalk.green("✅ OAuth credentials are configured!"));
    console.log(chalk.white("   Make sure your redirect URIs are set in:"));
    console.log(chalk.cyan("   - Google Cloud Console"));
    console.log(chalk.cyan("   - GitHub OAuth App settings\n"));
  }

  console.log(chalk.blue.bold("\n📚 Documentation:"));
  console.log(chalk.white("   - Complete guide: ") + chalk.cyan("README.md"));
  console.log(chalk.white("   - Custom Auth: See comments in ") + chalk.cyan("app/api/auth/[...nextauth]/route.ts"));
  console.log(chalk.white("   - Login/Signup: See comments in ") + chalk.cyan("app/auth/login/page.tsx") + " and " + chalk.cyan("app/auth/signup/page.tsx\n"));
}

// Generate .env.example file
async function generateEnvExample(target: string) {
  const envExamplePath = path.join(target, ".env.example");
  const envLocalPath = path.join(target, ".env.local");

  // Generate a random secret for NEXTAUTH_SECRET
  const generateSecret = () => {
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
      return Array.from(globalThis.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    // Fallback: generate random bytes
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateSecret()}

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
`;

  // Write .env.example
  fs.writeFileSync(envExamplePath, envContent, "utf-8");
  console.log(chalk.green("✅ Created .env.example file"));

  // Create .env.local if it doesn't exist
  if (!fs.existsSync(envLocalPath)) {
    fs.writeFileSync(envLocalPath, envContent.replace(/your_.*_here/g, ""), "utf-8");
    console.log(chalk.green("✅ Created .env.local file (update with your credentials)"));
  }
}

// Update NextAuth route with providers
async function updateNextAuthWithProviders(routePath: string) {
  const providerAuthContent = `import NextAuth from "next-auth";
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
        session.provider = token.provider as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
`;

  fs.writeFileSync(routePath, providerAuthContent, "utf-8");
}

// Update login and signup pages with OAuth buttons
async function updateAuthPagesWithProviders(target: string) {
  const loginPagePath = path.join(target, "app/auth/login/page.tsx");
  const signupPagePath = path.join(target, "app/auth/signup/page.tsx");

  // Update login page
  if (fs.existsSync(loginPagePath)) {
    const loginPageContent = `"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      toast.error(\`Failed to sign in with \${provider}\`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <a
              href="/auth/signup"
              className="font-medium text-zinc-950 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              create a new account
            </a>
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-zinc-900 px-3 py-3 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(loginPagePath, loginPageContent, "utf-8");
  }

  // Update signup page
  if (fs.existsSync(signupPagePath)) {
    const signupPageContent = `"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      toast.error(\`Failed to sign in with \${provider}\`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <a
              href="/auth/login"
              className="font-medium text-zinc-950 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-zinc-900 px-3 py-3 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(signupPagePath, signupPageContent, "utf-8");
  }
}

// Copy protected route files
async function copyProtectedRouteFiles(target: string) {
  const protectedRouteSrc = path.join(BOILERPLATE_ROOT, "auth/components/protected-route.tsx");
  const middlewareSrc = path.join(BOILERPLATE_ROOT, "auth/middleware.ts");

  const componentsDir = path.join(target, "components");
  const protectedRouteDest = path.join(componentsDir, "protected-route.tsx");
  const middlewareDest = path.join(target, "middleware.ts");

  // Ensure components directory exists
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Copy protected route component
  if (fs.existsSync(protectedRouteSrc)) {
    fs.copyFileSync(protectedRouteSrc, protectedRouteDest);
  }

  // Copy middleware (only if it doesn't exist)
  if (fs.existsSync(middlewareSrc) && !fs.existsSync(middlewareDest)) {
    fs.copyFileSync(middlewareSrc, middlewareDest);
  }

  // Copy auth navbar component (demo/example - won't overwrite existing navbar)
  const authNavbarSrc = path.join(BOILERPLATE_ROOT, "auth/components/auth-navbar.tsx");
  const authNavbarDest = path.join(componentsDir, "auth-navbar.tsx");
  if (fs.existsSync(authNavbarSrc)) {
    // Only copy if it doesn't exist (won't overwrite)
    if (!fs.existsSync(authNavbarDest)) {
      fs.copyFileSync(authNavbarSrc, authNavbarDest);
    }
  }

  // Copy example pages (only if they don't exist)
  const dashboardPageSrc = path.join(BOILERPLATE_ROOT, "auth/app/dashboard/page.tsx");
  const landingPageSrc = path.join(BOILERPLATE_ROOT, "auth/app/page.tsx");
  const dashboardPageDest = path.join(target, "app/dashboard/page.tsx");
  const landingPageDest = path.join(target, "app/page.tsx");

  // Create dashboard directory if needed
  const dashboardDir = path.join(target, "app/dashboard");
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }

  // Copy dashboard page (only if it doesn't exist)
  if (fs.existsSync(dashboardPageSrc) && !fs.existsSync(dashboardPageDest)) {
    fs.copyFileSync(dashboardPageSrc, dashboardPageDest);
  }

  // Copy landing page (only if it doesn't exist or is default)
  if (fs.existsSync(landingPageSrc)) {
    // Check if current page is just a default Next.js page
    if (fs.existsSync(landingPageDest)) {
      const currentContent = fs.readFileSync(landingPageDest, "utf-8");
      // Only replace if it's the default Next.js page
      if (currentContent.includes("Get started by editing") || currentContent.length < 500) {
        fs.copyFileSync(landingPageSrc, landingPageDest);
      }
    } else {
      fs.copyFileSync(landingPageSrc, landingPageDest);
    }
  }
}

// Update auth button with OAuth providers
async function updateAuthButtonWithProviders(target: string) {
  const authButtonPath = path.join(target, "components/auth-button.tsx");

  if (fs.existsSync(authButtonPath)) {
    const authButtonContent = `"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-700"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>
      <button
        onClick={() => signIn("github")}
        className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        GitHub
      </button>
    </div>
  );
}
`;
    fs.writeFileSync(authButtonPath, authButtonContent, "utf-8");
  }
}

// Generate rainbow gradient color for a character
function getRainbowColor(char: string, index: number, total: number): string {
  const colors = [
    chalk.magentaBright,
    chalk.redBright,
    chalk.yellowBright,
    chalk.greenBright,
    chalk.cyanBright,
    chalk.blueBright,
    chalk.magentaBright,
  ];
  const colorIndex = Math.floor((index / total) * colors.length);
  return colors[colorIndex].bold(char);
}

// Convert PNG to colored ASCII art (unused but kept for future use)
async function _pngToAscii(imagePath: string, width: number = 80): Promise<string[]> {
  try {
    const image = await Jimp.read(imagePath);

    // Resize image to fit terminal width
    const aspectRatio = image.getHeight() / image.getWidth();
    const height = Math.floor(width * aspectRatio * 0.5); // 0.5 for character aspect ratio
    image.resize(width, height);

    const asciiLines: string[] = [];
    const chars = [" ", "░", "▒", "▓", "█"]; // ASCII characters from light to dark

    for (let y = 0; y < image.getHeight(); y++) {
      let line = "  "; // Add some left padding
      for (let x = 0; x < image.getWidth(); x++) {
        const color = Jimp.intToRGBA(image.getPixelColor(x, y));
        const brightness = (color.r + color.g + color.b) / 3;
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
        const char = chars[charIndex];

        // Apply color from image
        const rgb = chalk.rgb(color.r, color.g, color.b);
        line += rgb(char);
      }
      asciiLines.push(line);
    }

    return asciiLines;
  } catch (error) {
    console.error(chalk.red("Error loading PNG image:"), error);
    return [];
  }
}

// Show welcome screen with ASCII art
async function showWelcome() {
  showLogo();
}

// Create a new project from template
async function createProject(projectName: string, showWelcomeScreen: boolean = true, forceOverwrite: boolean = false) {
  const templatePath = path.join(BOILERPLATE_ROOT, "template");
  const targetPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    if (!forceOverwrite) {
      console.log(chalk.yellow(`⚠️  Directory "${projectName}" already exists!`));
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: chalk.white("Do you want to overwrite it? (This will delete existing files)"),
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray("Cancelled. Choose a different name."));
        process.exit(0);
      }
    }

    // Remove existing directory if overwriting
    console.log(chalk.yellow(`Removing existing directory "${projectName}"...`));
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  if (showWelcomeScreen) {
    showLogo();
  }
  console.log(chalk.blue.bold(`🚀 Creating new StackPatch project: ${chalk.white(projectName)}\n`));

  const tracker = new ProgressTracker();
  tracker.addStep("Copying project template");
  tracker.addStep("Processing project files");
  tracker.addStep("Installing dependencies");

  // Step 1: Copy template
  tracker.startStep(0);
  await fse.copy(templatePath, targetPath);
  tracker.completeStep(0);

  // Step 2: Replace placeholders in files
  tracker.startStep(1);
  const filesToProcess = [
    "package.json",
    "app/layout.tsx",
    "app/page.tsx",
    "README.md",
  ];

  for (const file of filesToProcess) {
    const filePath = path.join(targetPath, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
  tracker.completeStep(1);

  // Step 3: Install dependencies
  tracker.startStep(2);
  const installResult = spawnSync("pnpm", ["install"], {
    cwd: targetPath,
    stdio: "pipe",
  });

  if (installResult.status !== 0) {
    tracker.failStep(2);
    console.log(chalk.yellow("\n⚠️  Dependency installation had issues. You can run 'pnpm install' manually."));
  } else {
    tracker.completeStep(2);
  }

  console.log(chalk.green(`\n✅ Project "${projectName}" created successfully!`));

  // Automatically add auth-ui after creating the project
  console.log(chalk.blue.bold(`\n🔐 Adding authentication to your project...\n`));

  const authSrc = path.join(BOILERPLATE_ROOT, PATCHES["auth-ui"].path);
  const authCopied = await copyFiles(authSrc, targetPath);

  if (authCopied) {
    // Install auth dependencies (only if missing)
    installDependencies(targetPath, PATCHES["auth-ui"].dependencies);

    // Setup authentication with Google and GitHub providers
    const success = await setupAuth(targetPath, "providers");

    if (success) {
      await withSpinner("Updating layout with AuthSessionProvider", () => {
        updateLayoutForAuth(targetPath);
        return true;
      });

      await withSpinner("Adding Toaster component", () => {
        updateLayoutForToaster(targetPath);
        return true;
      });

      await withSpinner("Setting up protected routes", () => {
        copyProtectedRouteFiles(targetPath);
        return true;
      });

      // Show OAuth setup instructions
      await showOAuthSetupInstructions(targetPath);

      console.log(chalk.green("\n✅ Authentication added successfully!"));
    } else {
      console.log(chalk.yellow("\n⚠️  Authentication setup had some issues. You can run 'npx stackpatch add auth-ui' manually."));
    }
  } else {
    console.log(chalk.yellow("\n⚠️  Could not add authentication. You can run 'npx stackpatch add auth-ui' manually."));
  }

  console.log(chalk.blue("\n📦 Next steps:"));
  console.log(chalk.white(`  ${chalk.cyan("cd")} ${chalk.yellow(projectName)}`));
  console.log(chalk.white(`  ${chalk.cyan("pnpm")} ${chalk.yellow("dev")}`));
  console.log(chalk.white(`  Test authentication at: ${chalk.cyan("http://localhost:3000/auth/login")}`));
  console.log(chalk.gray("\n📚 See README.md for OAuth setup and protected routes\n"));
}

// ---------------- Main CLI ----------------
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const projectName = args[1];
  const skipPrompts = args.includes("--yes") || args.includes("-y");

  // Show logo on startup
  showLogo();

  // Handle: bun create stackpatch@latest (no project name)
  // Show welcome and prompt for project name
  if (!command || command.startsWith("-")) {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.white("Enter your project name or path (relative to current directory)"),
        default: "my-stackpatch-app",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    await createProject(name.trim(), false, skipPrompts); // Don't show welcome again
    return;
  }

  // Handle: bun create stackpatch@latest my-app
  // When bun runs create, it passes project name as first arg (not "create")
  // Check if first arg looks like a project name (not a known command)
  // Always ask for project name first, even if provided
  if (command && !["add", "create"].includes(command) && !PATCHES[command] && !command.startsWith("-")) {
    // Likely called as: bun create stackpatch@latest my-app
    // But we'll ask for project name anyway to be consistent
    await showWelcome();
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.white("Enter your project name or path (relative to current directory)"),
        default: command || "my-stackpatch-app", // Use provided name as default
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    await createProject(name.trim(), false, skipPrompts); // Welcome already shown
    return;
  }

  // Handle: npx stackpatch create my-app
  if (command === "create") {
    if (!projectName) {
      showWelcome();
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: chalk.white("Enter your project name or path (relative to current directory)"),
          default: "my-stackpatch-app",
          validate: (input: string) => {
            if (!input.trim()) {
              return "Project name cannot be empty";
            }
            return true;
          },
        },
      ]);
      await createProject(name.trim(), false); // Logo already shown
      return;
    }
    await createProject(projectName, false, skipPrompts); // Logo already shown
    return;
  }

  // Handle: npx stackpatch add auth-ui
  const patchName = args[1];
  if (command === "add" && patchName) {
    if (!PATCHES[patchName]) {
      console.log(chalk.red(`❌ Unknown patch: ${patchName}`));
      console.log(chalk.yellow(`Available patches: ${Object.keys(PATCHES).join(", ")}`));
      process.exit(1);
    }

    // Auto-detect target directory (current working directory or common locations)
    let target = process.cwd();

    // Check if we're in a Next.js app (has app/ or pages/ directory)
    const hasAppDir = fs.existsSync(path.join(target, "app"));
    const hasPagesDir = fs.existsSync(path.join(target, "pages"));

    if (!hasAppDir && !hasPagesDir) {
      // Try parent directory
      const parent = path.resolve(target, "..");
      if (fs.existsSync(path.join(parent, "app")) || fs.existsSync(path.join(parent, "pages"))) {
        target = parent;
      } else {
        // Try common monorepo locations: apps/, packages/, or root
        const possiblePaths = [
          path.join(target, "apps"),
          path.join(parent, "apps"),
          path.join(target, "packages"),
          path.join(parent, "packages"),
        ];

        let foundApp = false;
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            // Look for Next.js apps in this directory
            const entries = fs.readdirSync(possiblePath, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isDirectory()) {
                const appPath = path.join(possiblePath, entry.name);
                if (
                  fs.existsSync(path.join(appPath, "app")) ||
                  fs.existsSync(path.join(appPath, "pages"))
                ) {
                  target = appPath;
                  foundApp = true;
                  break;
                }
              }
            }
            if (foundApp) break;
          }
        }

        if (!foundApp) {
          console.log(chalk.yellow("⚠️  Could not auto-detect Next.js app directory."));
          const { target: userTarget } = await inquirer.prompt([
            {
              type: "input",
              name: "target",
              message: "Enter the path to your Next.js app folder:",
              default: target,
            },
          ]);
          target = path.resolve(userTarget);
        }
      }
    }

    const src = path.join(BOILERPLATE_ROOT, PATCHES[patchName].path);

    console.log(chalk.blue.bold("\n🚀 StackPatch CLI\n"));
    console.log(chalk.blue(`Copying ${patchName} patch to ${target}...\n`));

    const copied = await copyFiles(src, target);
    if (!copied) process.exit(1);

    // Install dependencies (only if missing)
    installDependencies(target, PATCHES[patchName].dependencies);

    // For auth patches, setup with Google and GitHub providers
    if (patchName === "auth" || patchName === "auth-ui") {
      showLogo();
      console.log(chalk.blue.bold(`\n🔐 Setting up authentication with Google and GitHub\n`));

      // Always use providers (Google and GitHub)
      const success = await setupAuth(target, "providers");

      if (success) {
        await withSpinner("Updating layout with AuthSessionProvider", () => {
          updateLayoutForAuth(target);
          return true;
        });

        await withSpinner("Adding Toaster component", () => {
          updateLayoutForToaster(target);
          return true;
        });

        await withSpinner("Setting up protected routes", () => {
          copyProtectedRouteFiles(target);
          return true;
        });

        // OAuth instructions are shown in setupAuth function
      }
    }

    // Final next steps
    console.log(chalk.blue("\n🎉 Patch setup complete!"));
    console.log(chalk.green("\n📝 Next Steps:"));
    console.log(chalk.white("   1. Configure OAuth providers (see instructions above)"));
    console.log(chalk.white("   2. Set up database for email/password auth (see comments in code)"));
    console.log(chalk.white("   3. Check out the auth navbar demo in ") + chalk.cyan("components/auth-navbar.tsx"));
    console.log(chalk.white("   4. Protect your routes (see README.md)"));
    console.log(chalk.white("   5. Run your Next.js dev server: ") + chalk.cyan("pnpm dev"));
    console.log(chalk.white("   6. Test authentication at: ") + chalk.cyan("http://localhost:3000/auth/login\n"));

    console.log(chalk.blue.bold("📚 Documentation:"));
    console.log(chalk.white("   - See ") + chalk.cyan("README.md") + chalk.white(" for complete setup guide\n"));

    console.log(chalk.yellow("⚠️  Important:"));
    console.log(chalk.white("   - Email/password auth is in DEMO mode"));
    console.log(chalk.white("   - Demo credentials: ") + chalk.gray("demo@example.com / demo123"));
    console.log(chalk.white("   - See code comments in ") + chalk.cyan("app/api/auth/[...nextauth]/route.ts") + chalk.white(" to implement real auth\n"));
    return;
  }

  // If no command, show help or interactive mode
  if (!command) {
    await showWelcome();
    console.log(chalk.yellow("Usage:"));
    console.log(chalk.white("  ") + chalk.cyan("npm create stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx create-stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("bunx create-stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch create") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch add") + chalk.white(" <patch-name>"));
    console.log(chalk.white("\nExamples:"));
    console.log(chalk.gray("  npm create stackpatch@latest my-app"));
    console.log(chalk.gray("  npx create-stackpatch@latest my-app"));
    console.log(chalk.gray("  bunx create-stackpatch@latest my-app"));
    console.log(chalk.gray("  npx stackpatch create my-app"));
    console.log(chalk.gray("  npx stackpatch add auth-ui"));
    console.log(chalk.gray("\n"));
    process.exit(0);
  }

  // Interactive mode (fallback)
  console.log(chalk.blue.bold("\n🚀 Welcome to StackPatch CLI\n"));

  let selectedPatch: string | null = null;
  let goBack = false;

  // 1️⃣ Select patch with back option
  do {
    const response = await inquirer.prompt([
    {
      type: "list",
      name: "patch",
      message: "Which patch do you want to add?",
        choices: [
          ...Object.keys(PATCHES)
            .filter(p => p !== "auth-ui") // Don't show duplicate
            .map(p => ({ name: p, value: p })),
          new inquirer.Separator(),
          {
            name: chalk.gray("← Go back / Cancel"),
            value: "back",
          },
        ],
    },
  ]);

    if (response.patch === "back") {
      goBack = true;
      break;
    }

    selectedPatch = response.patch;
  } while (!selectedPatch);

  if (goBack || !selectedPatch) {
    console.log(chalk.yellow("\n← Cancelled"));
    return;
  }

  const patch = selectedPatch;

  // 2️⃣ Enter target Next.js app folder
  const { target } = await inquirer.prompt([
    {
      type: "input",
      name: "target",
      message:
        "Enter the relative path to your Next.js app folder (e.g., ../../apps/stackpatch-frontend):",
      default: process.cwd(),
    },
  ]);

  const src = path.join(BOILERPLATE_ROOT, PATCHES[patch].path);
  const dest = path.resolve(target);

  console.log(chalk.blue(`\nCopying ${patch} boilerplate to ${dest}...\n`));

  const copied = await copyFiles(src, dest);
  if (!copied) return;

  // 3️⃣ Install dependencies (only if missing)
  installDependencies(dest, PATCHES[patch].dependencies);

    // 4️⃣ For auth patches, setup with Google and GitHub providers
    if (patch === "auth" || patch === "auth-ui") {
      console.log(chalk.blue.bold(`\n🔐 Setting up authentication with Google and GitHub\n`));

      // Always use providers (Google and GitHub)
      const success = await setupAuth(dest, "providers");

      if (success) {
        await withSpinner("Updating layout with AuthSessionProvider", () => {
          updateLayoutForAuth(dest);
          return true;
        });

        await withSpinner("Adding Toaster component", () => {
          updateLayoutForToaster(dest);
          return true;
        });
      }
    }

  // 5️⃣ Final next steps
  console.log(chalk.blue("\n🎉 Patch setup complete!"));
  console.log(chalk.green("- Run your Next.js dev server: pnpm dev"));
  console.log(chalk.green("- Start building your features!\n"));
}

main().catch((error) => {
  console.error(chalk.red("❌ Error:"), error);
  process.exit(1);
});
