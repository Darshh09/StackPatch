import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

/**
 * Utility functions for managing dependencies
 */

/**
 * Check if dependency exists in package.json
 */
export function hasDependency(target: string, depName: string): boolean {
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

/**
 * Install dependencies (only missing ones)
 */
export function installDependencies(target: string, deps: string[]): void {
  if (deps.length === 0) return;

  // Check if target directory and package.json exist
  const packageJsonPath = path.join(target, "package.json");
  if (!fs.existsSync(target)) {
    throw new Error(`Target directory does not exist: ${target}`);
  }
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${target}. Make sure you're in a valid project directory.`);
  }

  const missingDeps = deps.filter((dep) => !hasDependency(target, dep));

  if (missingDeps.length === 0) {
    return; // Already installed, spinner will show completion
  }

  // Use non-interactive flags to prevent credential prompts
  const result = spawnSync("pnpm", ["add", ...missingDeps], {
    cwd: target,
    stdio: "pipe",
    env: {
      ...process.env,
      // Prevent Git credential prompts
      GIT_TERMINAL_PROMPT: "0",
      GIT_ASKPASS: "",
      // Prevent npm/pnpm credential prompts
      NPM_CONFIG_PROGRESS: "false",
    },
  });

  if (result.status !== 0) {
    const errorOutput = result.stderr?.toString() || result.stdout?.toString() || "Unknown error";
    // Extract the actual error message if available
    const errorLines = errorOutput.split("\n").filter((line: string) =>
      line.trim() && (line.includes("error") || line.includes("Error") || line.includes("ERR"))
    );
    const errorMessage = errorLines.length > 0 ? errorLines.join("\n") : errorOutput;
    throw new Error(`Failed to install dependencies: ${missingDeps.join(", ")}\n${errorMessage}`);
  }
}

/**
 * Remove dependencies from package.json
 */
export function removeDependencies(target: string, deps: string[]): boolean {
  if (deps.length === 0) return true;

  const packageJsonPath = path.join(target, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    let modified = false;

    // Remove from dependencies
    if (packageJson.dependencies) {
      for (const dep of deps) {
        if (packageJson.dependencies[dep]) {
          delete packageJson.dependencies[dep];
          modified = true;
        }
      }
    }

    // Remove from devDependencies
    if (packageJson.devDependencies) {
      for (const dep of deps) {
        if (packageJson.devDependencies[dep]) {
          delete packageJson.devDependencies[dep];
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
    }

    return modified;
  } catch {
    return false;
  }
}
