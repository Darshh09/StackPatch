#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Boilerplate should already be in packages/cli/boilerplate
// Check if it exists, if not, try to copy from root boilerplate (if it exists)
const targetBoilerplate = path.resolve(__dirname, "../boilerplate");
const sourceBoilerplate = path.resolve(__dirname, "../../boilerplate");

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

// Check if dist directory exists (build output)
const distDir = path.resolve(__dirname, "../dist");
if (!fs.existsSync(distDir)) {
  console.error("❌ Build output not found!");
  console.error(`   Expected location: ${distDir}`);
  console.error("   Please run 'npm run build' first");
  process.exit(1);
}

// Make the CLI file executable
const cliFile = path.join(distDir, "stackpatch.js");
if (fs.existsSync(cliFile)) {
  fs.chmodSync(cliFile, 0o755);
  console.log("✅ Made stackpatch.js executable");
}

// Check if target boilerplate already exists
if (fs.existsSync(targetBoilerplate)) {
  console.log("✅ Boilerplate already exists in packages/cli/boilerplate");
  console.log("   Skipping copy step (boilerplate is ready for publishing)");
} else if (fs.existsSync(sourceBoilerplate)) {
  // Copy boilerplate from root if target doesn't exist
  console.log("📦 Copying boilerplate from root...");
  copyDirectory(sourceBoilerplate, targetBoilerplate);
  console.log("✅ Boilerplate copied for publishing (excluding node_modules and build artifacts)");
} else {
  console.error("❌ Boilerplate not found!");
  console.error(`   Expected location: ${targetBoilerplate}`);
  console.error(`   Or source location: ${sourceBoilerplate}`);
  process.exit(1);
}

console.log("✅ All files ready for publishing!");
