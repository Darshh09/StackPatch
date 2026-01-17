import fs from "fs";
import path from "path";

/**
 * Project scanner to detect project configuration
 */

export interface ProjectScan {
  framework: "nextjs" | "unknown";
  router: "app" | "pages" | "unknown";
  typescript: boolean;
  packageManager: "pnpm" | "npm" | "yarn" | "bun" | "unknown";
  runtime: "node" | "bun" | "unknown";
  hasSrcDir: boolean;
  existingAuth: "better-auth" | "next-auth" | "none";
}

/**
 * Scan project to detect configuration
 */
export function scanProject(target: string): ProjectScan {
  const scan: ProjectScan = {
    framework: "unknown",
    router: "unknown",
    typescript: false,
    packageManager: "unknown",
    runtime: "node",
    hasSrcDir: false,
    existingAuth: "none",
  };

  // Check for Next.js
  const packageJsonPath = path.join(target, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if (deps.next || deps["next"]) {
        scan.framework = "nextjs";
      }

      // Detect package manager from lock files
      if (fs.existsSync(path.join(target, "pnpm-lock.yaml"))) {
        scan.packageManager = "pnpm";
      } else if (fs.existsSync(path.join(target, "yarn.lock"))) {
        scan.packageManager = "yarn";
      } else if (fs.existsSync(path.join(target, "package-lock.json"))) {
        scan.packageManager = "npm";
      } else if (fs.existsSync(path.join(target, "bun.lockb"))) {
        scan.packageManager = "bun";
        scan.runtime = "bun";
      }

      // Check for existing auth
      if (deps["better-auth"]) {
        scan.existingAuth = "better-auth";
      } else if (deps["next-auth"]) {
        scan.existingAuth = "next-auth";
      }
    } catch {
      // Ignore errors
    }
  }

  // Check for TypeScript
  if (
    fs.existsSync(path.join(target, "tsconfig.json")) ||
    fs.existsSync(path.join(target, "src", "tsconfig.json"))
  ) {
    scan.typescript = true;
  }

  // Check for src directory
  if (fs.existsSync(path.join(target, "src"))) {
    scan.hasSrcDir = true;
  }

  // Detect router type
  if (fs.existsSync(path.join(target, "app")) || fs.existsSync(path.join(target, "src", "app"))) {
    scan.router = "app";
  } else if (
    fs.existsSync(path.join(target, "pages")) ||
    fs.existsSync(path.join(target, "src", "pages"))
  ) {
    scan.router = "pages";
  }

  return scan;
}

/**
 * Format scan results for display
 */
export function formatScanResults(scan: ProjectScan): string[] {
  const results: string[] = [];

  results.push(`✔ Framework: ${scan.framework === "nextjs" ? "Next.js" : "Unknown"} ${scan.router !== "unknown" ? `(${scan.router === "app" ? "App Router" : "Pages Router"})` : ""}`);
  results.push(`✔ TypeScript: ${scan.typescript ? "Yes" : "No"}`);
  results.push(`✔ Package Manager: ${scan.packageManager !== "unknown" ? scan.packageManager : "Unknown"}`);
  results.push(`✔ Runtime: ${scan.runtime === "bun" ? "Bun" : "Node"}`);
  results.push(`✔ src directory: ${scan.hasSrcDir ? "Yes" : "No"}`);
  results.push(`✔ Existing auth: ${scan.existingAuth === "none" ? "None" : scan.existingAuth === "better-auth" ? "Better Auth" : "NextAuth"}`);

  return results;
}
