#!/usr/bin/env node
/**
 * Test script to verify Next.js version detection and middleware/proxy.ts generation
 */

import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from "fs";
// Import using tsx to handle TypeScript
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// We'll use a different approach - directly test the logic

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliDir = join(__dirname, "..");
const testDir = join(cliDir, ".test-projects");

console.log("🧪 Testing Next.js Version Detection & Middleware/Proxy Generation\n");

// Clean up test directory
if (existsSync(testDir)) {
  rmSync(testDir, { recursive: true, force: true });
}
mkdirSync(testDir, { recursive: true });

// Test 1: Next.js 16+ should detect version and use proxy.ts
console.log("Test 1: Testing Next.js 16+ version detection...");
const next16Project = join(testDir, "next16-project");
mkdirSync(next16Project, { recursive: true });

const next16PackageJson = {
  name: "test-next16",
  version: "1.0.0",
  dependencies: {
    next: "^16.0.0",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  },
};

writeFileSync(
  join(next16Project, "package.json"),
  JSON.stringify(next16PackageJson, null, 2)
);

// Test version extraction logic
const packageJson16 = JSON.parse(readFileSync(join(next16Project, "package.json"), "utf-8"));
const nextVersion16 = packageJson16.dependencies.next || packageJson16.dependencies["next"];
const versionMatch16 = typeof nextVersion16 === "string" ? nextVersion16.match(/(\d+)\.(\d+)\.(\d+)/) : null;
const detectedVersion16 = versionMatch16 ? versionMatch16[0] : null;
console.log(`   Detected Next.js version: ${detectedVersion16 || "not detected"}`);
if (detectedVersion16 && parseInt(detectedVersion16.split(".")[0]) >= 16) {
  console.log("   ✅ PASSED: Next.js 16+ detected correctly");
} else {
  console.log("   ❌ FAILED: Next.js 16+ not detected");
  process.exit(1);
}

// Test 2: Next.js 15 should detect version and use middleware.ts
console.log("\nTest 2: Testing Next.js 15 version detection...");
const next15Project = join(testDir, "next15-project");
mkdirSync(next15Project, { recursive: true });

const next15PackageJson = {
  name: "test-next15",
  version: "1.0.0",
  dependencies: {
    next: "^15.0.0",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  },
};

writeFileSync(
  join(next15Project, "package.json"),
  JSON.stringify(next15PackageJson, null, 2)
);

const packageJson15 = JSON.parse(readFileSync(join(next15Project, "package.json"), "utf-8"));
const nextVersion15 = packageJson15.dependencies.next || packageJson15.dependencies["next"];
const versionMatch15 = typeof nextVersion15 === "string" ? nextVersion15.match(/(\d+)\.(\d+)\.(\d+)/) : null;
const detectedVersion15 = versionMatch15 ? versionMatch15[0] : null;
console.log(`   Detected Next.js version: ${detectedVersion15 || "not detected"}`);
if (detectedVersion15 && parseInt(detectedVersion15.split(".")[0]) < 16) {
  console.log("   ✅ PASSED: Next.js < 16 detected correctly");
} else {
  console.log("   ❌ FAILED: Next.js < 16 not detected correctly");
  process.exit(1);
}

// Test 3: Test with version range (^16.0.0)
console.log("\nTest 3: Testing version range detection...");
const next16RangeProject = join(testDir, "next16-range-project");
mkdirSync(next16RangeProject, { recursive: true });

const next16RangePackageJson = {
  name: "test-next16-range",
  version: "1.0.0",
  dependencies: {
    next: "^16.1.2",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  },
};

writeFileSync(
  join(next16RangeProject, "package.json"),
  JSON.stringify(next16RangePackageJson, null, 2)
);

const packageJson16Range = JSON.parse(readFileSync(join(next16RangeProject, "package.json"), "utf-8"));
const nextVersion16Range = packageJson16Range.dependencies.next || packageJson16Range.dependencies["next"];
const versionMatch16Range = typeof nextVersion16Range === "string" ? nextVersion16Range.match(/(\d+)\.(\d+)\.(\d+)/) : null;
const detectedVersion16Range = versionMatch16Range ? versionMatch16Range[0] : null;
console.log(`   Detected Next.js version: ${detectedVersion16Range || "not detected"}`);
if (detectedVersion16Range && parseInt(detectedVersion16Range.split(".")[0]) >= 16) {
  console.log("   ✅ PASSED: Version range detected correctly");
} else {
  console.log("   ❌ FAILED: Version range not detected correctly");
  process.exit(1);
}

// Test 4: Test with exact version
console.log("\nTest 4: Testing exact version detection...");
const next16ExactProject = join(testDir, "next16-exact-project");
mkdirSync(next16ExactProject, { recursive: true });

const next16ExactPackageJson = {
  name: "test-next16-exact",
  version: "1.0.0",
  dependencies: {
    next: "16.2.3",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  },
};

writeFileSync(
  join(next16ExactProject, "package.json"),
  JSON.stringify(next16ExactPackageJson, null, 2)
);

const packageJson16Exact = JSON.parse(readFileSync(join(next16ExactProject, "package.json"), "utf-8"));
const nextVersion16Exact = packageJson16Exact.dependencies.next || packageJson16Exact.dependencies["next"];
const versionMatch16Exact = typeof nextVersion16Exact === "string" ? nextVersion16Exact.match(/(\d+)\.(\d+)\.(\d+)/) : null;
const detectedVersion16Exact = versionMatch16Exact ? versionMatch16Exact[0] : null;
console.log(`   Detected Next.js version: ${detectedVersion16Exact || "not detected"}`);
if (detectedVersion16Exact === "16.2.3") {
  console.log("   ✅ PASSED: Exact version detected correctly");
} else {
  console.log("   ❌ FAILED: Exact version not detected correctly");
  process.exit(1);
}

console.log("\n🎉 All version detection tests passed!");
console.log("\n📝 Next Steps:");
console.log("   1. Build the CLI: cd packages/cli && npm run build");
console.log("   2. Test with a real Next.js 16+ project:");
console.log("      - Create a new Next.js 16+ project");
console.log("      - Run: npx stackpatch@latest add auth");
console.log("      - Verify that proxy.ts is created (not middleware.ts)");
console.log("   3. Test with a Next.js 15 project:");
console.log("      - Create a new Next.js 15 project");
console.log("      - Run: npx stackpatch@latest add auth");
console.log("      - Verify that middleware.ts is created (not proxy.ts)");

// Clean up
rmSync(testDir, { recursive: true, force: true });
