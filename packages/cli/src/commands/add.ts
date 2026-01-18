import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { BOILERPLATE_ROOT, PATCHES, MANIFEST_VERSION, type StackPatchManifest } from "../config.js";
import { detectTargetDirectory } from "../utils/paths.js";
import { installDependencies } from "../utils/dependencies.js";
import { withSpinner } from "../ui/progress.js";
import { showLogo } from "../ui/logo.js";
import { copyFiles } from "../fileOps/copy.js";
import { writeManifest } from "../manifest.js";

/**
 * Add a patch to an existing project
 */
export async function addPatch(patchName: string, targetDir?: string): Promise<void> {
  if (!PATCHES[patchName]) {
    console.log(chalk.red(`❌ Unknown patch: ${patchName}`));
    console.log(chalk.yellow(`Available patches: ${Object.keys(PATCHES).join(", ")}`));
    process.exit(1);
  }

  // Auto-detect target directory
  let target = targetDir ? path.resolve(targetDir) : detectTargetDirectory();

  // If still can't find, ask user
  const hasAppDir = fs.existsSync(path.join(target, "app")) || fs.existsSync(path.join(target, "src", "app"));
  const hasPagesDir = fs.existsSync(path.join(target, "pages")) || fs.existsSync(path.join(target, "src", "pages"));

  if (!hasAppDir && !hasPagesDir) {
    console.log(chalk.yellow("⚠️  Could not auto-detect Next.js app directory."));

    // Try to find Next.js apps in subdirectories
    let foundApps: string[] = [];
    try {
      const entries = fs.readdirSync(target, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subPath = path.join(target, entry.name);
          const hasSubAppDir = fs.existsSync(path.join(subPath, "app")) || fs.existsSync(path.join(subPath, "src", "app"));
          const hasSubPagesDir = fs.existsSync(path.join(subPath, "pages")) || fs.existsSync(path.join(subPath, "src", "pages"));
          const hasPackageJson = fs.existsSync(path.join(subPath, "package.json"));
          if ((hasSubAppDir || hasSubPagesDir) && hasPackageJson) {
            foundApps.push(entry.name);
          }
        }
      }
    } catch {
      // Ignore errors
    }

    let defaultPath = target;
    if (foundApps.length === 1) {
      defaultPath = path.join(target, foundApps[0]);
      console.log(chalk.green(`💡 Found Next.js app in subdirectory: ${foundApps[0]}`));
    } else if (foundApps.length > 1) {
      console.log(chalk.cyan(`💡 Found multiple Next.js apps: ${foundApps.join(", ")}`));
    }

    const { userTarget } = await inquirer.prompt([
      {
        type: "input",
        name: "userTarget",
        message: "Enter the path to your Next.js app folder:",
        default: defaultPath,
      },
    ]);

    // Resolve the path - handle both absolute and relative paths
    if (path.isAbsolute(userTarget)) {
      target = userTarget;
    } else {
      // If relative, resolve from current working directory
      target = path.resolve(process.cwd(), userTarget);
    }

    // Verify the target exists
    if (!fs.existsSync(target)) {
      console.log(chalk.red(`❌ Error: Directory does not exist: ${target}`));
      console.log(chalk.yellow(`💡 Tip: Make sure you're in the correct directory or provide the full absolute path.`));
      console.log(chalk.yellow(`   Current directory: ${process.cwd()}`));
      if (foundApps.length > 0) {
        console.log(chalk.yellow(`   Found Next.js apps in subdirectories: ${foundApps.join(", ")}`));
      }
      process.exit(1);
    }

    // Verify it's actually a Next.js app
    const finalHasAppDir = fs.existsSync(path.join(target, "app")) || fs.existsSync(path.join(target, "src", "app"));
    const finalHasPagesDir = fs.existsSync(path.join(target, "pages")) || fs.existsSync(path.join(target, "src", "pages"));
    const finalHasPackageJson = fs.existsSync(path.join(target, "package.json"));

    if (!finalHasAppDir && !finalHasPagesDir) {
      console.log(chalk.red(`❌ Error: ${target} does not appear to be a Next.js app directory.`));
      console.log(chalk.yellow(`   Expected to find: app/, src/app/, pages/, or src/pages/ directory`));
      process.exit(1);
    }

    if (!finalHasPackageJson) {
      console.log(chalk.red(`❌ Error: package.json not found in ${target}.`));
      console.log(chalk.yellow(`   Make sure you're pointing to the root of your Next.js project.`));
      process.exit(1);
    }
  }

  // For auth patches, use new setup flow
  if (patchName === "auth" || patchName === "auth-ui") {
    showLogo();

    // Use new setup flow
    const { setupAuthNew } = await import("../auth/index.js");
    const success = await setupAuthNew(target);

    if (!success) {
      console.log(chalk.yellow("\n⚠️  Auth setup was cancelled or failed."));
      return;
    }

    // Manifest is already created in setupAuthNew
    return;
  }

  // For other patches, use old flow
  const src = path.join(BOILERPLATE_ROOT, PATCHES[patchName].path);

  console.log(chalk.blue.bold("\n🚀 StackPatch CLI\n"));
  console.log(chalk.blue(`Copying ${patchName} patch to ${target}...\n`));

  const copyResult = await copyFiles(src, target);
  if (!copyResult.success) process.exit(1);

  const addedFiles = copyResult.addedFiles;
  const modifiedFiles: Array<{ path: string; originalContent: string }> = [];

  // Install dependencies (only if missing)
  installDependencies(target, PATCHES[patchName].dependencies);

  // Create manifest for tracking
  const manifest: StackPatchManifest = {
    version: MANIFEST_VERSION,
    patchName,
    target,
    timestamp: new Date().toISOString(),
    files: {
      added: addedFiles,
      modified: modifiedFiles,
      backedUp: [],
    },
    dependencies: PATCHES[patchName].dependencies,
    oauthProviders: [],
  };
  writeManifest(target, manifest);

  // Final next steps
  console.log(chalk.blue("\n🎉 Patch setup complete!"));
  console.log(chalk.green("\n📝 Next Steps:"));
  console.log(chalk.white("   1. Configure OAuth providers (see instructions above)"));
  console.log(chalk.white("   2. Set up database for email/password auth (see comments in code)"));
  console.log(chalk.white("   3. Visit the landing page at ") + chalk.cyan("/stackpatch"));
  console.log(chalk.white("   4. Protect your routes (see README.md)"));
  console.log(chalk.white("   5. Run your Next.js dev server: ") + chalk.cyan("pnpm dev"));
  console.log(chalk.white("   6. Test authentication at: ") + chalk.cyan("http://localhost:3000/auth/login\n"));

  console.log(chalk.blue.bold("📚 Documentation:"));
  console.log(chalk.white("   - See ") + chalk.cyan("README.md") + chalk.white(" for complete setup guide\n"));

  console.log(chalk.yellow("⚠️  Important:"));
  console.log(chalk.white("   - Email/password auth is in DEMO mode"));
  console.log(chalk.white("   - Demo credentials: ") + chalk.gray("demo@example.com / demo123"));
  console.log(
    chalk.white("   - See code comments in ") +
      chalk.cyan("https://better-auth.com") +
      chalk.white(" for implementation details\n")
  );
}
