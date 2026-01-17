import fs from "fs";
import path from "path";
import fse from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
import {
  detectAppDirectory,
  detectComponentsDirectory,
  generateComponentImportPath,
} from "../utils/paths.js";
import { findTypeScriptFiles } from "../utils/files.js";

/**
 * File copying operations
 */

/**
 * Copy files from source to destination with smart directory detection
 */
export async function copyFiles(
  src: string,
  dest: string
): Promise<{ success: boolean; addedFiles: string[] }> {
  const addedFiles: string[] = [];

  if (!fs.existsSync(src)) {
    console.log(chalk.red(`❌ Boilerplate folder not found: ${src}`));
    return { success: false, addedFiles: [] };
  }

  await fse.ensureDir(dest);

  // Detect app directory location in target
  const appDir = detectAppDirectory(dest);
  const appDirPath = path.join(dest, appDir);
  const componentsDir = detectComponentsDirectory(dest);
  const componentsDirPath = path.join(dest, componentsDir);

  // Detect lib directory (src/lib or lib)
  const hasSrcDir = fs.existsSync(path.join(dest, "src"));
  const libDir = hasSrcDir ? "src/lib" : "lib";
  const libDirPath = path.join(dest, libDir);

  const conflicts: string[] = [];

  // Check for conflicts before copying
  const entries = fse.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "app") {
      // For app directory, check conflicts in the detected app directory
      if (fs.existsSync(appDirPath)) {
        const appEntries = fse.readdirSync(path.join(src, "app"), { withFileTypes: true });
        for (const appEntry of appEntries) {
          const destAppPath = path.join(appDirPath, appEntry.name);
          if (fs.existsSync(destAppPath)) {
            conflicts.push(destAppPath);
          }
        }
      }
    } else if (entry.name === "components") {
      // For components directory, check conflicts in the detected components directory
      if (fs.existsSync(componentsDirPath)) {
        const componentEntries = fse.readdirSync(path.join(src, "components"), {
          withFileTypes: true,
        });
        for (const componentEntry of componentEntries) {
          const destComponentPath = path.join(componentsDirPath, componentEntry.name);
          if (fs.existsSync(destComponentPath)) {
            conflicts.push(destComponentPath);
          }
        }
      }
    } else if (entry.name === "lib") {
      // For lib directory, check conflicts in the detected lib directory
      if (fs.existsSync(libDirPath)) {
        const libEntries = fse.readdirSync(path.join(src, "lib"), {
          withFileTypes: true,
        });
        for (const libEntry of libEntries) {
          const destLibPath = path.join(libDirPath, libEntry.name);
          if (fs.existsSync(destLibPath)) {
            conflicts.push(destLibPath);
          }
        }
      }
    } else {
      // For other files/directories (middleware, etc.), check in root
      const destPath = path.join(dest, entry.name);
      if (fs.existsSync(destPath)) {
        conflicts.push(destPath);
      }
    }
  }

  if (conflicts.length) {
    console.log(chalk.yellow("\n⚠️ The following files already exist:"));
    conflicts.forEach((f) => console.log(`  ${f}`));

    const { overwrite } = await inquirer.prompt([
      {
        type: "list",
        name: "overwrite",
        message: "Do you want to overwrite them?",
        choices: [
          { name: "Yes, overwrite", value: "yes" },
          { name: "No, skip", value: "no" },
        ],
        default: "no",
      },
    ]);

    if (overwrite !== "yes") {
      console.log(chalk.red("\nAborted! No files were copied."));
      return { success: false, addedFiles: [] };
    }
  }

  // Track files from SOURCE (boilerplate) before copying
  // This ensures we only track files that are actually from StackPatch
  function trackSourceFiles(srcDir: string, baseDir: string, targetBase: string): void {
    if (!fs.existsSync(srcDir)) return;

    const files = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const file of files) {
      const srcFilePath = path.join(srcDir, file.name);
      if (file.isDirectory()) {
        trackSourceFiles(srcFilePath, baseDir, targetBase);
      } else {
        const relativePath = path.relative(baseDir, srcFilePath);
        const targetPath = targetBase
          ? path.join(targetBase, relativePath).replace(/\\/g, "/")
          : relativePath.replace(/\\/g, "/");
        addedFiles.push(targetPath);
      }
    }
  }

  // Copy files with smart app directory handling
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    if (entry.name === "app") {
      // Track files from SOURCE boilerplate before copying
      trackSourceFiles(srcPath, srcPath, appDir);

      // Copy app directory contents to the detected app directory location
      await fse.ensureDir(appDirPath);
      await fse.copy(srcPath, appDirPath, { overwrite: true });
    } else if (entry.name === "components") {
      // Track files from SOURCE boilerplate before copying
      trackSourceFiles(srcPath, srcPath, componentsDir);

      // Copy components directory to the detected components directory location
      await fse.ensureDir(componentsDirPath);
      await fse.copy(srcPath, componentsDirPath, { overwrite: true });
    } else if (entry.name === "lib") {
      // Track files from SOURCE boilerplate before copying
      trackSourceFiles(srcPath, srcPath, libDir);

      // Copy lib directory to the detected lib directory location
      await fse.ensureDir(libDirPath);
      await fse.copy(srcPath, libDirPath, { overwrite: true });
    } else {
      // For root-level files/directories, track from source
      const srcStat = fs.statSync(srcPath);
      if (srcStat.isDirectory()) {
        trackSourceFiles(srcPath, srcPath, "");
      } else {
        addedFiles.push(entry.name);
      }

      // Copy other files/directories (middleware, etc.) to root
      const destPath = path.join(dest, entry.name);
      await fse.copy(srcPath, destPath, { overwrite: true });
    }
  }

  // Update imports in copied files to use correct paths
  updateImportsInFiles(dest);

  return { success: true, addedFiles };
}

/**
 * Update imports in copied files to use correct paths
 */
function updateImportsInFiles(target: string): void {
  const appDir = detectAppDirectory(target);
  const appDirPath = path.join(target, appDir);

  if (!fs.existsSync(appDirPath)) {
    return;
  }

  const files = findTypeScriptFiles(appDirPath);

  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, "utf-8");
      let updated = false;

      // Match imports like: from "@/components/component-name"
      const importRegex = /from\s+["']@\/components\/([^"']+)["']/g;
      const matches = Array.from(content.matchAll(importRegex));

      for (const match of matches) {
        const componentName = (match as RegExpMatchArray)[1];
        const oldImport = (match as RegExpMatchArray)[0];
        const newImportPath = generateComponentImportPath(target, componentName, filePath);
        const newImport = oldImport.replace(/@\/components\/[^"']+/, newImportPath);

        content = content.replace(oldImport, newImport);
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(filePath, content, "utf-8");
      }
    } catch (error) {
      // Silently skip files that can't be processed
      continue;
    }
  }
}
