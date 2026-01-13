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
// Resolve boilerplate path - works for both local dev and published package
let BOILERPLATE_ROOT = path.resolve(CLI_DIR, "../boilerplate");
if (!fs.existsSync(BOILERPLATE_ROOT)) {
  // Fallback to sibling directory (for local development)
  BOILERPLATE_ROOT = path.resolve(CLI_DIR, "../../boilerplate");
}
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



// ---------------- Helpers ----------------
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
  console.log("\n");

  // ASCII art for "StackPatch"
  const asciiArt = [
    "  _________ __                 __     __________         __         .__     ",
    " /   _____//  |______    ____ |  | __ \\______   \\_____ _/  |_  ____ |  |__  ",
    " \\_____  \\\\   __\\__  \\ _/ ___\\|  |/ /  |     ___/\\__  \\\\   __\\/ ___\\|  |  \\ ",
    " /        \\|  |  / __ \\\\  \\___|    <   |    |     / __ \\|  | \\  \\___|   Y  \\",
    "/_______  /|__| (____  /\\___  >__|_ \\  |____|    (____  /__|  \\___  >___|  /",
    "        \\/           \\/     \\/     \\/                 \\/          \\/     \\/ ",
  ];

  // Print ASCII art with rainbow gradient
  asciiArt.forEach((line) => {
    let coloredLine = "";
    const chars = line.split("");
    chars.forEach((char, index) => {
      // Apply rainbow gradient to all visible characters (not just spaces)
      if (char.trim() !== "") {
        coloredLine += getRainbowColor(char, index, chars.length);
      } else {
        coloredLine += char;
      }
    });
    console.log(coloredLine);
  });

  console.log("");
  console.log(chalk.white("  Creating a new StackPatch project"));
  console.log("");
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
    await showWelcome();
  }
  console.log(chalk.blue.bold(`🚀 Creating new StackPatch project: ${chalk.white(projectName)}\n`));

  // Copy template
  await fse.copy(templatePath, targetPath);

  // Replace placeholders in files
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

  // Install dependencies
  console.log(chalk.blue("📦 Installing dependencies...\n"));
  const installResult = spawnSync("pnpm", ["install"], {
    cwd: targetPath,
    stdio: "inherit",
  });

  if (installResult.status !== 0) {
    console.log(chalk.yellow("\n⚠️  Dependency installation had issues. You can run 'pnpm install' manually."));
  } else {
    console.log(chalk.green("\n✅ Dependencies installed!"));
  }

  console.log(chalk.green(`\n✅ Project "${projectName}" created successfully!`));
  console.log(chalk.blue("\n📦 Next steps:"));
  console.log(chalk.white(`  ${chalk.cyan("cd")} ${chalk.yellow(projectName)}`));
  console.log(chalk.white(`  ${chalk.cyan("pnpm")} ${chalk.yellow("dev")}`));
  console.log(chalk.gray("\n💡 Add features:"));
  console.log(chalk.white(`  ${chalk.cyan("npx")} ${chalk.yellow("stackpatch")} ${chalk.green("add")} ${chalk.magenta("auth-ui")}\n`));
}

// ---------------- Main CLI ----------------
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const projectName = args[1];
  const skipPrompts = args.includes("--yes") || args.includes("-y");

  // Handle: bun create stackpatch@latest (no project name)
  // Show welcome and prompt for project name
  if (!command || command.startsWith("-")) {
    await showWelcome();
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
  if (command && !["add", "create"].includes(command) && !PATCHES[command] && !command.startsWith("-")) {
    // Likely called as: bun create stackpatch@latest my-app
    await showWelcome();
    await createProject(command, false, skipPrompts); // Welcome already shown
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
      await createProject(name.trim(), false); // Welcome already shown
      return;
    }
    await showWelcome();
    await createProject(projectName, false, skipPrompts); // Welcome already shown
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

    // For auth patches, update layout.tsx and add Toaster
    if (patchName === "auth" || patchName === "auth-ui") {
      updateLayoutForAuth(target);
      updateLayoutForToaster(target);
    }

    // Final next steps
    console.log(chalk.blue("\n🎉 Patch setup complete!"));
    console.log(chalk.green("- Run your Next.js dev server: pnpm dev"));
    console.log(chalk.green("- Start building your features!\n"));
    return;
  }

  // If no command, show help or interactive mode
  if (!command) {
    await showWelcome();
    console.log(chalk.yellow("Usage:"));
    console.log(chalk.white("  ") + chalk.cyan("bun create stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch create") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch add") + chalk.white(" <patch-name>"));
    console.log(chalk.white("\nExamples:"));
    console.log(chalk.gray("  bun create stackpatch@latest"));
    console.log(chalk.gray("  bun create stackpatch@latest my-app"));
    console.log(chalk.gray("  npx stackpatch create my-app"));
    console.log(chalk.gray("  npx stackpatch add auth-ui"));
    console.log(chalk.gray("\n"));
    process.exit(0);
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

  // 4️⃣ For auth patches, update layout.tsx and add Toaster
  if (patch === "auth" || patch === "auth-ui") {
    updateLayoutForAuth(dest);
    updateLayoutForToaster(dest);
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
