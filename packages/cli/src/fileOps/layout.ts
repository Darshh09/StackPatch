import fs from "fs";
import path from "path";
import chalk from "chalk";
import { detectAppDirectory } from "../utils/paths.js";
import { generateComponentImportPath } from "../utils/paths.js";
import { backupFile } from "../manifest.js";

/**
 * Layout file modification operations
 */

export interface LayoutUpdateResult {
  success: boolean;
  modified: boolean;
  filePath: string;
  originalContent?: string;
}

/**
 * Update layout.tsx to include Toaster
 */
export function updateLayoutForToaster(
  target: string
): LayoutUpdateResult {
  const appDir = detectAppDirectory(target);
  const layoutPath = path.join(target, appDir, "layout.tsx");

  if (!fs.existsSync(layoutPath)) {
    return { success: false, modified: false, filePath: layoutPath };
  }

  try {
    const originalContent = fs.readFileSync(layoutPath, "utf-8");
    let layoutContent = originalContent;

    // Check if already has Toaster
    if (layoutContent.includes("Toaster")) {
      console.log(chalk.green("✅ Layout already has Toaster!"));
      return { success: true, modified: false, filePath: layoutPath };
    }

    // Generate the correct import path
    const importPath = generateComponentImportPath(target, "toaster", layoutPath);

    // Check if import already exists (check for various patterns)
    const hasImport =
      layoutContent.includes("toaster") &&
      (layoutContent.includes("from") || layoutContent.includes("import"));

    if (!hasImport) {
      // Find the last import statement
      const lines = layoutContent.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
          lastImportIndex = i;
        } else if (trimmed && !trimmed.startsWith("//") && lastImportIndex >= 0) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, `import { Toaster } from "${importPath}";`);
        layoutContent = lines.join("\n");
      }
    }

    // Add Toaster component
    if (layoutContent.includes("{children}")) {
      // Add Toaster after children
      layoutContent = layoutContent.replace(/(\{children\})/, '$1\n          <Toaster />');
    } else {
      // Try to find body tag and add Toaster before closing body
      const bodyRegex = /(<body[^>]*>)([\s\S]*?)(<\/body>)/;
      if (bodyRegex.test(layoutContent)) {
        layoutContent = layoutContent.replace(bodyRegex, '$1$2\n        <Toaster />\n      $3');
      }
    }

    // Backup before modifying
    backupFile(layoutPath, target);

    fs.writeFileSync(layoutPath, layoutContent, "utf-8");
    console.log(chalk.green("✅ Updated layout.tsx with Toaster!"));

    const relativePath = path.relative(target, layoutPath).replace(/\\/g, "/");
    return { success: true, modified: true, filePath: relativePath, originalContent };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.yellow(`⚠️  Failed to update layout with Toaster: ${errorMessage}`));
    return { success: false, modified: false, filePath: layoutPath };
  }
}

/**
 * Update layout.tsx to include AuthWrapper
 * This wrapper provides client-side route protection
 */
export function updateLayoutForAuthWrapper(target: string): LayoutUpdateResult {
  const appDir = detectAppDirectory(target);
  const layoutPath = path.join(target, appDir, "layout.tsx");

  if (!fs.existsSync(layoutPath)) {
    console.log(chalk.yellow("⚠️  layout.tsx not found. Skipping layout update."));
    return { success: false, modified: false, filePath: layoutPath };
  }

  try {
    const originalContent = fs.readFileSync(layoutPath, "utf-8");
    let layoutContent = originalContent;

    // Check if already has AuthWrapper
    if (layoutContent.includes("AuthWrapper")) {
      console.log(chalk.green("✅ Layout already has AuthWrapper!"));
      return { success: true, modified: false, filePath: layoutPath };
    }

    // Generate the correct import path
    const importPath = generateComponentImportPath(target, "auth-wrapper", layoutPath);

    // Check if import already exists
    const hasImport =
      layoutContent.includes("auth-wrapper") &&
      (layoutContent.includes("from") || layoutContent.includes("import"));

    if (!hasImport) {
      // Find the last import statement
      const lines = layoutContent.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
          lastImportIndex = i;
        } else if (trimmed && !trimmed.startsWith("//") && lastImportIndex >= 0) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(
          lastImportIndex + 1,
          0,
          `import { AuthWrapper } from "${importPath}";`
        );
        layoutContent = lines.join("\n");
      } else {
        // No imports found, add after the first line
        const firstNewline = layoutContent.indexOf("\n");
        if (firstNewline > 0) {
          layoutContent =
            layoutContent.slice(0, firstNewline + 1) +
            `import { AuthWrapper } from "${importPath}";\n` +
            layoutContent.slice(firstNewline + 1);
        } else {
          layoutContent = `import { AuthWrapper } from "${importPath}";\n` + layoutContent;
        }
      }
    }

    // Wrap children with AuthWrapper
    // Look for {children} pattern
    const childrenPattern = /(\s*)(\{children\})(\s*)/;
    if (childrenPattern.test(layoutContent)) {
      layoutContent = layoutContent.replace(
        childrenPattern,
        '$1<AuthWrapper>{children}</AuthWrapper>$3'
      );
    } else {
      // Try to find body tag and wrap its content
      const bodyRegex = /(<body[^>]*>)([\s\S]*?)(<\/body>)/;
      const bodyMatch = layoutContent.match(bodyRegex);
      if (bodyMatch) {
        const bodyContent = bodyMatch[2].trim();
        if (bodyContent && !bodyContent.includes("AuthWrapper")) {
          layoutContent = layoutContent.replace(
            bodyRegex,
            `$1\n        <AuthWrapper>${bodyContent}</AuthWrapper>\n      $3`
          );
        }
      }
    }

    // Backup before modifying
    backupFile(layoutPath, target);

    fs.writeFileSync(layoutPath, layoutContent, "utf-8");
    console.log(chalk.green("✅ Updated layout.tsx with AuthWrapper!"));

    const relativePath = path.relative(target, layoutPath).replace(/\\/g, "/");
    return { success: true, modified: true, filePath: relativePath, originalContent };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.red(`❌ Failed to update layout.tsx: ${errorMessage}`));
    return { success: false, modified: false, filePath: layoutPath };
  }
}

/**
 * Update layout.tsx to include AuthSessionProvider
 * Note: Better Auth doesn't require a session provider, but we add it for compatibility
 * @deprecated Not used - middleware handles all route protection
 */
export function updateLayoutForAuth(target: string): LayoutUpdateResult {
  const appDir = detectAppDirectory(target);
  const layoutPath = path.join(target, appDir, "layout.tsx");

  if (!fs.existsSync(layoutPath)) {
    console.log(chalk.yellow("⚠️  layout.tsx not found. Skipping layout update."));
    return { success: false, modified: false, filePath: layoutPath };
  }

  try {
    const originalContent = fs.readFileSync(layoutPath, "utf-8");
    let layoutContent = originalContent;

    // Check if already has AuthSessionProvider
    if (layoutContent.includes("AuthSessionProvider")) {
      console.log(chalk.green("✅ Layout already has AuthSessionProvider!"));
      return { success: true, modified: false, filePath: layoutPath };
    }

    // Generate the correct import path
    const importPath = generateComponentImportPath(target, "session-provider", layoutPath);

    // Check if import already exists (check for various patterns)
    const hasImport =
      layoutContent.includes("session-provider") &&
      (layoutContent.includes("from") || layoutContent.includes("import"));

    if (!hasImport) {
      // Find the last import statement (before the first non-import line)
      const lines = layoutContent.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
          lastImportIndex = i;
        } else if (trimmed && !trimmed.startsWith("//") && lastImportIndex >= 0) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(
          lastImportIndex + 1,
          0,
          `import { AuthSessionProvider } from "${importPath}";`
        );
        layoutContent = lines.join("\n");
      } else {
        // No imports found, add after the first line
        const firstNewline = layoutContent.indexOf("\n");
        if (firstNewline > 0) {
          layoutContent =
            layoutContent.slice(0, firstNewline + 1) +
            `import { AuthSessionProvider } from "${importPath}";\n` +
            layoutContent.slice(firstNewline + 1);
        } else {
          layoutContent = `import { AuthSessionProvider } from "${importPath}";\n` + layoutContent;
        }
      }
    }

    // Wrap children with AuthSessionProvider
    // Look for {children} pattern in body tag
    const childrenPattern = /(\s*)(\{children\})(\s*)/;
    if (childrenPattern.test(layoutContent)) {
      layoutContent = layoutContent.replace(
        childrenPattern,
        '$1<AuthSessionProvider>{children}</AuthSessionProvider>$3'
      );
    } else {
      // Try to find body tag and wrap its content
      const bodyRegex = /(<body[^>]*>)([\s\S]*?)(<\/body>)/;
      const bodyMatch = layoutContent.match(bodyRegex);
      if (bodyMatch) {
        const bodyContent = bodyMatch[2].trim();
        if (bodyContent && !bodyContent.includes("AuthSessionProvider")) {
          layoutContent = layoutContent.replace(
            bodyRegex,
            `$1\n        <AuthSessionProvider>${bodyContent}</AuthSessionProvider>\n      $3`
          );
        }
      }
    }

    // Backup before modifying
    backupFile(layoutPath, target);

    fs.writeFileSync(layoutPath, layoutContent, "utf-8");
    console.log(chalk.green("✅ Updated layout.tsx with AuthSessionProvider!"));

    const relativePath = path.relative(target, layoutPath).replace(/\\/g, "/");
    return { success: true, modified: true, filePath: relativePath, originalContent };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.red(`❌ Failed to update layout.tsx: ${errorMessage}`));
    return { success: false, modified: false, filePath: layoutPath };
  }
}
