#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// In CommonJS, __dirname and __filename are automatically available

// Path to the TypeScript file
const tsFile = path.join(__dirname, 'stackpatch.ts');
const args = process.argv.slice(2);

// Try to find tsx in node_modules
const tsxPaths = [
  path.join(__dirname, '../node_modules/.bin/tsx'),
  path.join(__dirname, '../../node_modules/.bin/tsx'),
];

let tsxCommand = null;
for (const tsxPath of tsxPaths) {
  try {
    if (fs.existsSync(tsxPath)) {
      tsxCommand = tsxPath;
      break;
    }
  } catch (e) {
    // Continue
  }
}

// Execute with tsx or npx
// Always run from the CLI package directory to ensure dependencies are found
const cliPackageDir = path.join(__dirname, '..');
const nodeModulesPath = path.join(cliPackageDir, 'node_modules');

// Set up environment to help with module resolution
const env = { ...process.env };
// Add node_modules to NODE_PATH if it exists
if (fs.existsSync(nodeModulesPath)) {
  const existingNodePath = env.NODE_PATH || '';
  env.NODE_PATH = existingNodePath
    ? `${nodeModulesPath}:${existingNodePath}`
    : nodeModulesPath;
}

// Use relative path from package directory (tsx resolves modules from cwd)
const relativeTsFile = path.relative(cliPackageDir, path.join(__dirname, 'stackpatch.ts'));

if (tsxCommand) {
  const result = spawnSync(tsxCommand, [relativeTsFile, ...args], {
    stdio: 'inherit',
    shell: true,
    env: env,
    cwd: cliPackageDir, // Run from package directory - this is crucial for module resolution
  });
  process.exit(result.status || 0);
} else {
  // Use npx as fallback
  const result = spawnSync('npx', ['-y', 'tsx', relativeTsFile, ...args], {
    stdio: 'inherit',
    shell: true,
    env: env,
    cwd: cliPackageDir, // Run from package directory - this is crucial for module resolution
  });
  process.exit(result.status || 0);
}
