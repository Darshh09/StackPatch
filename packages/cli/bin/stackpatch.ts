#!/usr/bin/env bun

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import fse from "fs-extra";
import { spawnSync } from "child_process";

// ---------------- CONFIG ----------------
// Get directory path - Bun supports import.meta.dir
// @ts-expect-error - Bun-specific API, not in Node types
const CLI_DIR = import.meta.dir || path.dirname(new URL(import.meta.url).pathname);
const BOILERPLATE_ROOT = path.resolve(CLI_DIR, "../../boilerplate");
const PATCHES: Record<
  string,
  { path: string; dependencies: string[] }
> = {
  auth: {
    path: "auth",
    dependencies: ["next-auth"],
  },
  "auth-ui": {
    path: "auth",
    dependencies: ["next-auth"],
  },
  // Example for future patches:
  // stripe: { path: "stripe", dependencies: ["stripe"] },
  // redux: { path: "redux", dependencies: ["@reduxjs/toolkit", "react-redux"] },
};

// ---------------- Helpers ----------------
async function copyFiles(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.log(chalk.red(`❌ Boilerplate folder not found: ${src}`));
    return false;
  }

  await fse.ensureDir(dest);

  const conflicts: string[] = [];
  fse.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const srcPath = path.join(src, entry.name);
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
    console.log(chalk.green("✅ All dependencies already installed!"));
    return;
  }

  console.log(chalk.blue(`\nInstalling dependencies: ${missingDeps.join(", ")}...`));
  const result = spawnSync("pnpm", ["add", ...missingDeps], { cwd: target, stdio: "inherit" });
  if (result.status !== 0) {
    console.log(chalk.red("❌ Failed to install dependencies. Please run manually."));
  } else {
    console.log(chalk.green("✅ Dependencies installed!"));
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
  } catch (error: any) {
    console.log(chalk.red(`❌ Failed to update layout.tsx: ${error?.message || error}`));
    return false;
  }
}

// ---------------- Main CLI ----------------
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const patchName = args[1];

  // Handle: npx stackpatch add auth-ui
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

    // For auth patches, update layout.tsx
    if (patchName === "auth" || patchName === "auth-ui") {
      updateLayoutForAuth(target);
    }

    // Final next steps
    console.log(chalk.blue("\n🎉 Patch setup complete!"));
    console.log(chalk.green("- Run your Next.js dev server: pnpm dev"));
    console.log(chalk.green("- Start building your features!\n"));
    return;
  }

  // Interactive mode (fallback)
  console.log(chalk.blue.bold("\n🚀 Welcome to StackPatch CLI v2\n"));

  // 1️⃣ Select patch
  const { patch } = await inquirer.prompt([
    {
      type: "list",
      name: "patch",
      message: "Which patch do you want to add?",
      choices: Object.keys(PATCHES).filter(p => p !== "auth-ui"), // Don't show duplicate
    },
  ]);

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

  // 4️⃣ For auth patches, update layout.tsx
  if (patch === "auth" || patch === "auth-ui") {
    updateLayoutForAuth(dest);
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
