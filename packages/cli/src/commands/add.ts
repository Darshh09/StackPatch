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
    const { userTarget } = await inquirer.prompt([
      {
        type: "input",
        name: "userTarget",
        message: "Enter the path to your Next.js app folder:",
        default: target,
      },
    ]);
    target = path.resolve(userTarget);
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
