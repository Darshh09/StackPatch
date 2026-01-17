import fs from "fs";
import path from "path";
import type { StackPatchManifest } from "./config.js";

/**
 * Manifest management for tracking StackPatch installations
 */

/**
 * Get manifest path for a target directory
 */
export function getManifestPath(target: string): string {
  return path.join(target, ".stackpatch", "manifest.json");
}

/**
 * Read manifest if it exists
 */
export function readManifest(target: string): StackPatchManifest | null {
  const manifestPath = getManifestPath(target);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(content) as StackPatchManifest;
  } catch {
    return null;
  }
}

/**
 * Write manifest
 */
export function writeManifest(target: string, manifest: StackPatchManifest): void {
  const manifestDir = path.join(target, ".stackpatch");
  const manifestPath = getManifestPath(target);

  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * Backup a file before modifying it
 */
export function backupFile(filePath: string, target: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const backupDir = path.join(target, ".stackpatch", "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const relativePath = path.relative(target, filePath);
  const backupPath = path.join(backupDir, relativePath.replace(/\//g, "_").replace(/\\/g, "_"));

  // Create directory structure in backup
  const backupFileDir = path.dirname(backupPath);
  if (!fs.existsSync(backupFileDir)) {
    fs.mkdirSync(backupFileDir, { recursive: true });
  }

  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Restore a file from backup
 */
export function restoreFile(backupPath: string, originalPath: string): boolean {
  if (!fs.existsSync(backupPath)) {
    return false;
  }

  const originalDir = path.dirname(originalPath);
  if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir, { recursive: true });
  }

  fs.copyFileSync(backupPath, originalPath);
  return true;
}
