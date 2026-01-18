import fs from "fs";
import path from "path";

/**
 * Utility functions for detecting project structure and paths
 */

/**
 * Detect the app directory location (app/ or src/app/)
 */
export function detectAppDirectory(target: string): string {
  // Check for src/app first (more common in modern Next.js projects)
  if (fs.existsSync(path.join(target, "src", "app"))) {
    return "src/app";
  }
  // Check for app directory
  if (fs.existsSync(path.join(target, "app"))) {
    return "app";
  }
  // Check for src/pages (legacy)
  if (fs.existsSync(path.join(target, "src", "pages"))) {
    return "src/pages";
  }
  // Check for pages (legacy)
  if (fs.existsSync(path.join(target, "pages"))) {
    return "pages";
  }
  // Default to app if nothing found (will fail gracefully later)
  return "app";
}

/**
 * Detect the components directory location (components/ or src/components/)
 */
export function detectComponentsDirectory(target: string): string {
  const appDir = detectAppDirectory(target);

  // If app is in src/app, components should be in src/components
  if (appDir.startsWith("src/")) {
    // Check if src/components exists
    if (fs.existsSync(path.join(target, "src", "components"))) {
      return "src/components";
    }
    // Even if it doesn't exist yet, return src/components to match app structure
    return "src/components";
  }

  // If app is in root, components should be in root
  if (fs.existsSync(path.join(target, "components"))) {
    return "components";
  }

  // Default to components
  return "components";
}

/**
 * Detect path aliases from tsconfig.json
 */
export function detectPathAliases(target: string): { alias: string; path: string } | null {
  const tsconfigPath = path.join(target, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    return null;
  }

  try {
    const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = JSON.parse(tsconfigContent);

    const paths = tsconfig.compilerOptions?.paths;
    if (!paths || typeof paths !== "object") {
      return null;
    }

    // Look for common aliases like @/*, ~/*, etc.
    for (const [alias, pathsArray] of Object.entries(paths)) {
      if (Array.isArray(pathsArray) && pathsArray.length > 0) {
        // Remove the /* from alias (e.g., "@/*" -> "@")
        const cleanAlias = alias.replace(/\/\*$/, "");
        // Get the first path and remove /* from it
        const cleanPath = pathsArray[0].replace(/\/\*$/, "");
        return { alias: cleanAlias, path: cleanPath };
      }
    }
  } catch (error) {
    // If parsing fails, return null
  }

  return null;
}

/**
 * Generate import path for components
 */
export function generateComponentImportPath(
  target: string,
  componentName: string,
  fromFile: string
): string {
  const pathAlias = detectPathAliases(target);
  const componentsDir = detectComponentsDirectory(target);

  // If we have a path alias, use it
  if (pathAlias) {
    // Check if the alias path matches components directory
    const aliasPath = pathAlias.path.replace(/^\.\//, ""); // Remove leading ./

    // If alias points to root and components is in root, use alias
    if (aliasPath === "" && componentsDir === "components") {
      return `${pathAlias.alias}/components/${componentName}`;
    }

    // If alias points to src and components is in src/components, use alias
    if (aliasPath === "src" && componentsDir === "src/components") {
      return `${pathAlias.alias}/components/${componentName}`;
    }

    // Try to match the alias path structure
    if (componentsDir.startsWith(aliasPath)) {
      const relativeFromAlias = componentsDir.replace(new RegExp(`^${aliasPath}/?`), "");
      return `${pathAlias.alias}/${relativeFromAlias}/${componentName}`;
    }

    // If alias path is "./" (root), components should be accessible via alias
    if (aliasPath === "" || aliasPath === ".") {
      return `${pathAlias.alias}/components/${componentName}`;
    }
  }

  // Fallback: calculate relative path
  // fromFile is the full path to the file we're importing into
  const fromDir = path.dirname(fromFile);
  const toComponents = path.join(target, componentsDir);

  // Calculate relative path from the file's directory to components directory
  const relativePath = path.relative(fromDir, toComponents).replace(/\\/g, "/");
  const normalizedPath = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;

  return `${normalizedPath}/${componentName}`;
}

/**
 * Get all parent directories of a file path
 */
export function getParentDirectories(filePath: string, rootPath: string): string[] {
  const dirs: string[] = [];
  let current = path.dirname(filePath);
  const root = path.resolve(rootPath);

  while (current !== root && current !== path.dirname(current)) {
    dirs.push(current);
    current = path.dirname(current);
  }

  return dirs;
}

/**
 * Check if a directory is a Next.js app
 */
function isNextJsApp(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, "app")) ||
    fs.existsSync(path.join(dir, "src", "app")) ||
    fs.existsSync(path.join(dir, "pages")) ||
    fs.existsSync(path.join(dir, "src", "pages"))
  ) && fs.existsSync(path.join(dir, "package.json"));
}

/**
 * Auto-detect target directory for Next.js app
 */
export function detectTargetDirectory(startDir: string = process.cwd()): string {
  let target = startDir;

  // Check if we're in a Next.js app
  if (isNextJsApp(target)) {
    return target;
  }

  // Try parent directory
  const parent = path.resolve(target, "..");
  if (isNextJsApp(parent)) {
    return parent;
  }

  // Try common monorepo locations: apps/, packages/, or root
  const possiblePaths = [
    path.join(target, "apps"),
    path.join(parent, "apps"),
    path.join(target, "packages"),
    path.join(parent, "packages"),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      // Look for Next.js apps in this directory
      try {
        const entries = fs.readdirSync(possiblePath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const appPath = path.join(possiblePath, entry.name);
            if (isNextJsApp(appPath)) {
              return appPath;
            }
          }
        }
      } catch {
        // Ignore errors reading directory
      }
    }
  }

  // Try searching subdirectories (one level deep) in current directory
  try {
    const entries = fs.readdirSync(target, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subPath = path.join(target, entry.name);
        if (isNextJsApp(subPath)) {
          return subPath;
        }
      }
    }
  } catch {
    // Ignore errors reading directory
  }

  return target;
}
