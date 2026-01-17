import fs from "fs";
import path from "path";

/**
 * Utility functions for file operations
 */

/**
 * Remove empty directories recursively
 */
export function removeEmptyDirectories(dirPath: string, rootPath: string): void {
  if (!fs.existsSync(dirPath)) return;

  // Don't remove the root directory or .stackpatch
  if (dirPath === rootPath || dirPath.includes(".stackpatch")) return;

  try {
    const entries = fs.readdirSync(dirPath);

    // Recursively remove empty subdirectories
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        removeEmptyDirectories(fullPath, rootPath);
      }
    }

    // Check if directory is now empty (after removing subdirectories)
    const remainingEntries = fs.readdirSync(dirPath);
    if (remainingEntries.length === 0) {
      fs.rmdirSync(dirPath);
    }
  } catch {
    // Ignore errors when removing directories
  }
}

/**
 * Find all TypeScript/TSX files in a directory recursively
 */
export function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileList.push(filePath);
    }
  }

  return fileList;
}
