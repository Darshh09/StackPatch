#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy boilerplate to cli package for publishing
const sourceBoilerplate = path.resolve(__dirname, "../../boilerplate");
const targetBoilerplate = path.resolve(__dirname, "../boilerplate");

// Files and directories to exclude when copying
const excludePatterns = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".git",
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
];

function shouldExclude(filePath, basePath) {
  const relativePath = path.relative(basePath, filePath);
  return excludePatterns.some((pattern) =>
    relativePath.includes(pattern) || relativePath.startsWith(pattern)
  );
}

function copyDirectory(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded files/directories
    if (shouldExclude(srcPath, src)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(sourceBoilerplate)) {
  // Remove old boilerplate if exists
  if (fs.existsSync(targetBoilerplate)) {
    fs.rmSync(targetBoilerplate, { recursive: true, force: true });
  }

  // Copy boilerplate (excluding node_modules and other build artifacts)
  copyDirectory(sourceBoilerplate, targetBoilerplate);
  console.log("✅ Boilerplate copied for publishing (excluding node_modules and build artifacts)");
} else {
  console.error("❌ Source boilerplate not found");
  process.exit(1);
}
