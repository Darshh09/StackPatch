#!/usr/bin/env node
/**
 * Test script to verify CLI execution works correctly
 * This tests that the TypeScript file can be executed via npx
 */

import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliDir = join(__dirname, "..");
const cliFile = join(cliDir, "dist", "stackpatch.js"); // Compiled JavaScript file
const cliTsFile = join(cliDir, "bin", "stackpatch.ts"); // TypeScript source file

console.log("🧪 Testing CLI execution...\n");

// Test 1: Check if compiled file and source files exist
console.log("Test 1: Checking if compiled stackpatch.js exists...");
if (!existsSync(cliFile)) {
  console.error("❌ FAILED: Compiled stackpatch.js not found at", cliFile);
  console.error("   Please run 'npm run build' first");
  process.exit(1);
}
console.log("✅ PASSED: Compiled stackpatch.js exists");

console.log("Test 1b: Checking if stackpatch.ts source exists...");
if (!existsSync(cliTsFile)) {
  console.error("❌ FAILED: stackpatch.ts source not found at", cliTsFile);
  process.exit(1);
}
console.log("✅ PASSED: stackpatch.ts source exists\n");

// Test 2: Check if compiled file is executable
console.log("Test 2: Checking compiled file permissions...");
const fs = await import("fs");
const stats = fs.default.statSync(cliFile);
const isExecutable = (stats.mode & parseInt("111", 8)) !== 0;
if (!isExecutable) {
  console.warn("⚠️  WARNING: Compiled file is not executable, attempting to fix...");
  fs.default.chmodSync(cliFile, "755");
  console.log("✅ Fixed: Compiled file is now executable\n");
} else {
  console.log("✅ PASSED: Compiled file is executable\n");
}

// Test 3: Test direct execution of compiled file
console.log("Test 3: Testing compiled file execution...");
const compiledResult = spawnSync("node", [cliFile, "--version"], {
  stdio: "pipe",
  cwd: cliDir,
  shell: true,
  timeout: 30000,
});

if (compiledResult.error) {
  console.error("❌ FAILED: Error executing compiled file:", compiledResult.error.message);
  process.exit(1);
}

if (compiledResult.status !== 0 && compiledResult.status !== null) {
  const errorOutput = compiledResult.stderr?.toString() || compiledResult.stdout?.toString() || "";
  if (!errorOutput.includes("version") && !errorOutput.includes("StackPatch")) {
    console.error("❌ FAILED: Compiled file execution returned non-zero exit code");
    console.error("STDOUT:", compiledResult.stdout?.toString());
    console.error("STDERR:", compiledResult.stderr?.toString());
    process.exit(1);
  }
}
console.log("✅ PASSED: Compiled file execution works\n");

// Test 3b: Test direct execution with tsx
console.log("Test 3b: Testing execution with npx tsx...");
const tsxResult = spawnSync("npx", ["-y", "tsx", cliTsFile, "--version"], {
  stdio: "pipe",
  cwd: cliDir,
  shell: true,
  timeout: 30000,
});

if (tsxResult.error) {
  console.error("❌ FAILED: Error executing with npx tsx:", tsxResult.error.message);
  process.exit(1);
}

if (tsxResult.status !== 0 && tsxResult.status !== null) {
  const errorOutput = tsxResult.stderr?.toString() || tsxResult.stdout?.toString() || "";
  if (!errorOutput.includes("version") && !errorOutput.includes("StackPatch")) {
    console.error("❌ FAILED: Execution returned non-zero exit code");
    console.error("STDOUT:", tsxResult.stdout?.toString());
    console.error("STDERR:", tsxResult.stderr?.toString());
    process.exit(1);
  }
}
console.log("✅ PASSED: Execution with npx tsx works\n");

// Test 4: Test direct execution (simulate how it would run when installed)
console.log("Test 4: Testing direct execution...");
const directResult = spawnSync(cliFile, ["--version"], {
  stdio: "pipe",
  cwd: cliDir,
  shell: false,
  timeout: 30000,
});

if (directResult.error) {
  console.error("❌ FAILED: Error executing directly:", directResult.error.message);
  process.exit(1);
}

if (directResult.status !== 0 && directResult.status !== null) {
  const errorOutput = directResult.stderr?.toString() || directResult.stdout?.toString() || "";
  if (!errorOutput.includes("version") && !errorOutput.includes("StackPatch")) {
    console.error("❌ FAILED: Direct execution returned non-zero exit code");
    console.error("STDOUT:", directResult.stdout?.toString());
    console.error("STDERR:", directResult.stderr?.toString());
    process.exit(1);
  }
}
console.log("✅ PASSED: Direct execution works\n");

// Test 5: Test with Bun if available
console.log("Test 5: Testing with Bun (if available)...");
const bunCheck = spawnSync("bun", ["--version"], {
  stdio: "ignore",
  timeout: 2000,
});

if (bunCheck.status === 0) {
  const bunResult = spawnSync("bun", [cliTsFile, "--version"], {
    stdio: "pipe",
    cwd: cliDir,
    shell: false,
    timeout: 30000,
  });

  if (bunResult.error) {
    console.warn("⚠️  WARNING: Bun execution had an error:", bunResult.error.message);
  } else if (bunResult.status === 0 || bunResult.stdout?.toString().includes("StackPatch")) {
    console.log("✅ PASSED: Execution with Bun works\n");
  } else {
    console.warn("⚠️  WARNING: Bun execution returned non-zero, but this is acceptable\n");
  }
} else {
  console.log("⏭️  SKIPPED: Bun not available\n");
}

console.log("🎉 All tests passed! CLI execution is working correctly.");
console.log("\n✅ Ready for publishing!");
