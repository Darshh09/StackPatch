import fs from "fs";
import path from "path";

/**
 * Check if required dependencies are installed
 */
export function checkDependencies(): { missing: string[]; allInstalled: boolean } {
  const requiredDeps = ["inquirer", "chalk", "fs-extra"];
  const missing: string[] = [];

  // Get the CLI directory
  // @ts-expect-error - Bun-specific API
  const CLI_DIR = import.meta.dir || path.dirname(new URL(import.meta.url).pathname);
  const nodeModulesPath = path.resolve(CLI_DIR, "../node_modules");

  for (const dep of requiredDeps) {
    const depPath = path.join(nodeModulesPath, dep);
    // Check if it exists (could be a symlink or directory)
    if (!fs.existsSync(depPath)) {
      missing.push(dep);
    }
  }

  return {
    missing,
    allInstalled: missing.length === 0,
  };
}

/**
 * Show helpful error message if dependencies are missing
 * Uses plain console.error to avoid importing chalk (which might not be installed)
 */
export function showDependencyError(missing: string[]): void {
  console.error("\n❌ Missing Dependencies\n");
  console.error("The following dependencies are not installed:");
  missing.forEach((dep) => console.error(`  - ${dep}`));
  console.error("\nTo fix this, run:");
  console.error("  cd packages/cli");
  console.error("  pnpm install");
  console.error("\nOr from the project root:");
  console.error("  pnpm install");
  console.error();
  process.exit(1);
}
