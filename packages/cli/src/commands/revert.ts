import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { BOILERPLATE_ROOT } from "../config.js";
import { readManifest } from "../manifest.js";
import { restoreFile } from "../manifest.js";
import { detectAppDirectory, detectComponentsDirectory, getParentDirectories } from "../utils/paths.js";
import { removeDependencies } from "../utils/dependencies.js";
import { removeEmptyDirectories } from "../utils/files.js";

/**
 * Revert a StackPatch installation
 */
export async function revertPatch(targetDir?: string): Promise<void> {
  let target = targetDir ? path.resolve(targetDir) : process.cwd();

  // Auto-detect target directory
  const hasAppDir = fs.existsSync(path.join(target, "app")) || fs.existsSync(path.join(target, "src", "app"));
  const hasPagesDir = fs.existsSync(path.join(target, "pages")) || fs.existsSync(path.join(target, "src", "pages"));

  if (!hasAppDir && !hasPagesDir) {
    const parent = path.resolve(target, "..");
    if (
      fs.existsSync(path.join(parent, "app")) ||
      fs.existsSync(path.join(parent, "src", "app")) ||
      fs.existsSync(path.join(parent, "pages")) ||
      fs.existsSync(path.join(parent, "src", "pages"))
    ) {
      target = parent;
    }
  }

  const manifest = readManifest(target);
  if (!manifest) {
    console.log(chalk.red("❌ No StackPatch installation found to revert."));
    console.log(chalk.yellow("   Make sure you're in the correct directory where you ran 'stackpatch add'."));
    process.exit(1);
  }

  console.log(chalk.blue.bold("\n🔄 Reverting StackPatch installation\n"));
  console.log(chalk.white(`   Patch: ${chalk.cyan(manifest.patchName)}`));
  console.log(chalk.white(`   Installed: ${chalk.gray(new Date(manifest.timestamp).toLocaleString())}\n`));

  // Show what will be reverted
  console.log(chalk.white("   Files to remove: ") + chalk.cyan(`${manifest.files.added.length}`));
  console.log(chalk.white("   Files to restore: ") + chalk.cyan(`${manifest.files.modified.length}`));
  if (manifest.dependencies.length > 0) {
    console.log(chalk.white("   Dependencies to remove: ") + chalk.cyan(`${manifest.dependencies.join(", ")}`));
  }
  console.log();

  const { confirm } = await inquirer.prompt([
    {
      type: "list",
      name: "confirm",
      message:
        "Are you sure you want to revert this installation? This will remove all added files, restore modified files, and remove dependencies.",
      choices: [
        { name: "Yes, revert the installation", value: "yes" },
        { name: "No, cancel", value: "no" },
      ],
      default: "no",
    },
  ]);

  if (confirm !== "yes") {
    console.log(chalk.yellow("\n← Revert cancelled"));
    return;
  }

  console.log(chalk.blue("\n🔄 Starting revert process...\n"));

  let removedCount = 0;
  let restoredCount = 0;
  let failedRemovals: string[] = [];
  let failedRestorations: string[] = [];
  const directoriesToCheck: Set<string> = new Set();

  // Step 1: Get list of valid StackPatch files from boilerplate
  // This ensures we only remove files that are actually from StackPatch
  const boilerplatePath = path.join(
    BOILERPLATE_ROOT,
    manifest.patchName === "auth-ui" ? "auth" : manifest.patchName
  );
  const validStackPatchFiles = new Set<string>();

  function collectBoilerplateFiles(srcDir: string, baseDir: string, targetBase: string): void {
    if (!fs.existsSync(srcDir)) return;

    const files = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const file of files) {
      const srcFilePath = path.join(srcDir, file.name);
      if (file.isDirectory()) {
        collectBoilerplateFiles(srcFilePath, baseDir, targetBase);
      } else {
        const relativePath = path.relative(baseDir, srcFilePath);
        const targetPath = targetBase
          ? path.join(targetBase, relativePath).replace(/\\/g, "/")
          : relativePath.replace(/\\/g, "/");
        validStackPatchFiles.add(targetPath);
      }
    }
  }

  // Collect files from boilerplate app directory
  const appDir = detectAppDirectory(target);
  const componentsDir = detectComponentsDirectory(target);
  const boilerplateAppPath = path.join(boilerplatePath, "app");
  const boilerplateComponentsPath = path.join(boilerplatePath, "components");

  if (fs.existsSync(boilerplateAppPath)) {
    collectBoilerplateFiles(boilerplateAppPath, boilerplateAppPath, appDir);
  }
  if (fs.existsSync(boilerplateComponentsPath)) {
    collectBoilerplateFiles(boilerplateComponentsPath, boilerplateComponentsPath, componentsDir);
  }

  // Collect root-level files
  if (fs.existsSync(boilerplatePath)) {
    const entries = fs.readdirSync(boilerplatePath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name !== "app" && entry.name !== "components") {
        const srcPath = path.join(boilerplatePath, entry.name);
        if (entry.isDirectory()) {
          collectBoilerplateFiles(srcPath, srcPath, "");
        } else {
          validStackPatchFiles.add(entry.name);
        }
      }
    }
  }

  // Step 1: Remove added files (only if they're actually from StackPatch boilerplate)
  console.log(chalk.white("📁 Removing added files..."));
  const filesToRemove = new Set<string>(); // Track files we actually removed

  for (const filePath of manifest.files.added) {
    // Only remove if this file is actually in the boilerplate
    if (!validStackPatchFiles.has(filePath)) {
      console.log(chalk.gray(`   ⊘ Skipped (not in boilerplate): ${filePath}`));
      continue;
    }

    const fullPath = path.join(target, filePath);
    if (fs.existsSync(fullPath)) {
      try {
        // Double-check: Only remove if file content matches boilerplate (safety check)
        const boilerplateFilePath = path.join(boilerplatePath, filePath.replace(appDir + "/", "app/").replace(componentsDir + "/", "components/"));
        if (fs.existsSync(boilerplateFilePath)) {
          fs.unlinkSync(fullPath);
          console.log(chalk.green(`   ✓ Removed: ${filePath}`));
          removedCount++;
          filesToRemove.add(filePath);

          // Track parent directories for cleanup (only for files we actually removed)
          const parentDirs = getParentDirectories(fullPath, target);
          parentDirs.forEach((dir) => directoriesToCheck.add(dir));
        } else {
          console.log(chalk.yellow(`   ⚠ Skipped (safety check failed): ${filePath}`));
        }
      } catch (error) {
        console.log(chalk.yellow(`   ⚠ Could not remove: ${filePath}`));
        failedRemovals.push(filePath);
      }
    } else {
      console.log(chalk.gray(`   ⊘ Already removed: ${filePath}`));
    }
  }

  // Step 2: Remove .env.local and .env.example if they were created by StackPatch
  console.log(chalk.white("\n🔐 Removing environment files..."));
  const envFilesToRemove = manifest.files.envFiles || [];

  // Fallback: check for common env files if not tracked in manifest (for older manifests)
  if (envFilesToRemove.length === 0) {
    const commonEnvFiles = [".env.local", ".env.example"];
    for (const envFile of commonEnvFiles) {
      const envPath = path.join(target, envFile);
      if (fs.existsSync(envPath)) {
          try {
            // Check if this file was created by StackPatch (contains BETTER_AUTH_SECRET)
            const content = fs.readFileSync(envPath, "utf-8");
            if (content.includes("BETTER_AUTH_SECRET") || content.includes("BETTER_AUTH_URL")) {
              envFilesToRemove.push(envFile);
            }
        } catch {
          // Ignore errors
        }
      }
    }
  }

  for (const envFile of envFilesToRemove) {
    const envPath = path.join(target, envFile);
    if (fs.existsSync(envPath)) {
      try {
        fs.unlinkSync(envPath);
        console.log(chalk.green(`   ✓ Removed: ${envFile}`));
        removedCount++;
      } catch (error) {
        console.log(chalk.yellow(`   ⚠ Could not remove: ${envFile}`));
        failedRemovals.push(envFile);
      }
    } else {
      console.log(chalk.gray(`   ⊘ Already removed: ${envFile}`));
    }
  }

  // Step 3: Restore modified files from originalContent in manifest
  // The manifest contains the original content before StackPatch modifications
  console.log(chalk.white("\n📝 Restoring modified files..."));

  for (const modified of manifest.files.modified) {
    const originalPath = path.join(target, modified.path);

    if (!fs.existsSync(originalPath)) {
      console.log(chalk.gray(`   ⊘ File not found (may have been deleted): ${modified.path}`));
      continue;
    }

    if (modified.originalContent !== undefined) {
      try {
        // Restore from originalContent in manifest (most reliable - this is the exact original content)
        const originalDir = path.dirname(originalPath);
        if (!fs.existsSync(originalDir)) {
          fs.mkdirSync(originalDir, { recursive: true });
        }
        fs.writeFileSync(originalPath, modified.originalContent, "utf-8");
        console.log(chalk.green(`   ✓ Restored: ${modified.path}`));
        restoredCount++;
      } catch (error) {
        // Fallback to backup file if originalContent restore fails
        const backupPath = path.join(
          target,
          ".stackpatch",
          "backups",
          modified.path.replace(/\//g, "_").replace(/\\/g, "_")
        );
        if (fs.existsSync(backupPath)) {
          try {
            restoreFile(backupPath, originalPath);
            console.log(chalk.green(`   ✓ Restored (from backup): ${modified.path}`));
            restoredCount++;
          } catch (backupError) {
            console.log(chalk.yellow(`   ⚠ Could not restore: ${modified.path}`));
            failedRestorations.push(modified.path);
          }
        } else {
          console.log(chalk.yellow(`   ⚠ Could not restore: ${modified.path} (no backup found)`));
          failedRestorations.push(modified.path);
        }
      }
    } else {
      // Fallback: try to restore from backup file
      const backupPath = path.join(
        target,
        ".stackpatch",
        "backups",
        modified.path.replace(/\//g, "_").replace(/\\/g, "_")
      );
      if (fs.existsSync(backupPath)) {
        try {
          restoreFile(backupPath, originalPath);
          console.log(chalk.green(`   ✓ Restored (from backup): ${modified.path}`));
          restoredCount++;
        } catch (error) {
          console.log(chalk.yellow(`   ⚠ Could not restore: ${modified.path}`));
          failedRestorations.push(modified.path);
        }
      } else {
        console.log(chalk.yellow(`   ⚠ Backup not found and no originalContent: ${modified.path}`));
        failedRestorations.push(modified.path);
      }
    }
  }

  // Step 4: Remove dependencies from package.json
  if (manifest.dependencies.length > 0) {
    console.log(chalk.white("\n📦 Removing dependencies from package.json..."));
    const removed = removeDependencies(target, manifest.dependencies);
    if (removed) {
      console.log(chalk.green(`   ✓ Removed dependencies: ${manifest.dependencies.join(", ")}`));
      console.log(chalk.yellow("   ⚠ Run 'pnpm install' to update node_modules"));
    } else {
      console.log(chalk.gray("   ⊘ Dependencies not found in package.json"));
    }
  }

  // Step 5: Clean up empty directories (only if they only contained StackPatch files)
  console.log(chalk.white("\n🧹 Cleaning up empty directories..."));
  const sortedDirs = Array.from(directoriesToCheck).sort((a, b) => b.length - a.length); // Sort by depth (deepest first)
  let removedDirCount = 0;

  // Only check directories that are known StackPatch directories
  const stackPatchDirs = new Set<string>();
  for (const filePath of filesToRemove) {
    const dir = path.dirname(path.join(target, filePath));
    let currentDir = dir;
    while (currentDir !== target && currentDir.length > target.length) {
      stackPatchDirs.add(currentDir);
      currentDir = path.dirname(currentDir);
    }
  }

  for (const dir of sortedDirs) {
    // Only remove directories that are in our StackPatch directories set
    if (!stackPatchDirs.has(dir)) {
      continue;
    }

    if (fs.existsSync(dir)) {
      try {
        const entries = fs.readdirSync(dir);
        if (entries.length === 0) {
          // Only remove if directory is empty AND it's a known StackPatch directory
          fs.rmdirSync(dir);
          removedDirCount++;
          console.log(chalk.green(`   ✓ Removed empty directory: ${path.relative(target, dir)}`));
        } else {
          // Directory has other files - check if they're all StackPatch files
          const allStackPatchFiles = entries.every((entry) => {
            const entryPath = path.join(dir, entry);
            const relativePath = path.relative(target, entryPath).replace(/\\/g, "/");
            return filesToRemove.has(relativePath) || validStackPatchFiles.has(relativePath);
          });

          if (allStackPatchFiles && entries.length > 0) {
            // All files are StackPatch files, but directory isn't empty - this shouldn't happen
            // Skip removal to be safe
            console.log(chalk.gray(`   ⊘ Skipped (has other files): ${path.relative(target, dir)}`));
          }
        }
        // If directory has other files, we don't remove it (silently skip)
      } catch {
        // Ignore errors
      }
    }
  }

  if (removedDirCount === 0) {
    console.log(chalk.gray("   ⊘ No empty directories to remove"));
  }

  // Step 6: Remove manifest and backups
  console.log(chalk.white("\n🗑️  Removing StackPatch tracking files..."));
  const stackpatchDir = path.join(target, ".stackpatch");
  if (fs.existsSync(stackpatchDir)) {
    try {
      fs.rmSync(stackpatchDir, { recursive: true, force: true });
      console.log(chalk.green("   ✓ Removed .stackpatch directory"));
    } catch (error) {
      console.log(chalk.yellow("   ⚠ Could not remove .stackpatch directory"));
    }
  }

  // Step 7: Verification
  console.log(chalk.white("\n✅ Verification..."));
  const remainingManifest = readManifest(target);
  if (remainingManifest) {
    console.log(chalk.red("   ❌ Warning: Manifest still exists. Revert may be incomplete."));
  } else {
    console.log(chalk.green("   ✓ Manifest removed successfully"));
  }

  // Summary
  console.log(chalk.blue.bold("\n📊 Revert Summary:"));
  console.log(chalk.white(`   Files removed: ${chalk.green(removedCount)}`));
  console.log(chalk.white(`   Files restored: ${chalk.green(restoredCount)}`));
  if (failedRemovals.length > 0) {
    console.log(chalk.yellow(`   Failed removals: ${failedRemovals.length}`));
    failedRemovals.forEach((file) => console.log(chalk.gray(`      - ${file}`)));
  }
  if (failedRestorations.length > 0) {
    console.log(chalk.yellow(`   Failed restorations: ${failedRestorations.length}`));
    failedRestorations.forEach((file) => console.log(chalk.gray(`      - ${file}`)));
  }

  if (failedRemovals.length === 0 && failedRestorations.length === 0 && !remainingManifest) {
    console.log(
      chalk.green("\n✅ Revert complete! Your project has been fully restored to its original state.")
    );
    if (manifest.dependencies.length > 0) {
      console.log(chalk.yellow("\n⚠️  Remember to run 'pnpm install' to update your node_modules."));
    }
  } else {
    console.log(chalk.yellow("\n⚠️  Revert completed with some warnings. Please review the output above."));
  }
}
