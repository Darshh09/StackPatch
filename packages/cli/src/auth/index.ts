import fs from "fs";
import path from "path";
import chalk from "chalk";
import fse from "fs-extra";
import { detectAppDirectory, detectComponentsDirectory } from "../utils/paths.js";
import { ProgressTracker, withSpinner } from "../ui/progress.js";
import { installDependencies } from "../utils/dependencies.js";
import {
  performProjectScan,
  collectAuthConfig,
  type AuthConfig,
} from "./setup.js";
import type { ProjectScan } from "../utils/scanner.js";
import {
  generateAuthInstance,
  generateAuthClient,
  generateAuthRoute,
  generateMiddleware,
  generateEnvExample,
  generateStackPatchConfig,
  generateProtectedRoutesConfig,
  generateProtectedPage,
} from "./generator.js";
import { BOILERPLATE_ROOT } from "../config.js";
import { copyFiles } from "../fileOps/copy.js";
import { writeManifest } from "../manifest.js";
import { MANIFEST_VERSION, type StackPatchManifest } from "../config.js";
import { updateLayoutForToaster, updateLayoutForAuthWrapper } from "../fileOps/layout.js";

/**
 * Main authentication setup function using new CLI flow
 */
export async function setupAuthNew(target: string): Promise<boolean> {
  const tracker = new ProgressTracker();

  try {
    // Step 1: Scan project
    const scan = performProjectScan(target);

    // Collect configuration
    const config = await collectAuthConfig(target, scan);
    if (!config) {
      console.log(chalk.yellow("\n← Setup cancelled"));
      return false;
    }

    tracker.addStep("Installing dependencies");
    tracker.addStep("Creating auth configuration");
    tracker.addStep("Setting up API routes");
    tracker.addStep("Configuring middleware");
    tracker.addStep("Adding UI components");
    tracker.addStep("Protecting routes");

    tracker.startStep(0);

    // Install dependencies
    // Note: better-auth includes React hooks, no need for separate better-auth/react package
    const deps = ["better-auth"];
    // Only add better-sqlite3 if database mode is selected AND sqlite + raw driver
    if (config.sessionMode === "database" && config.database === "sqlite" && config.orm === "raw") {
      deps.push("better-sqlite3");
    }
    // Add react-hot-toast if UI is enabled
    if (config.addUI) {
      deps.push("react-hot-toast");
    }

    try {
      installDependencies(target, deps);
      tracker.completeStep(0);
    } catch (error) {
      tracker.failStep(0);
      console.log(chalk.yellow("\n⚠️  Dependency installation failed. You can install them manually:"));
      console.log(chalk.white(`   cd ${path.relative(process.cwd(), target)}`));
      console.log(chalk.white(`   pnpm add ${deps.join(" ")}`));
      throw error;
    }

    // Generate files
    tracker.startStep(1);
    const authPath = generateAuthInstance(target, config, scan);
    const clientPath = generateAuthClient(target, scan);
    generateEnvExample(target, config);
    generateStackPatchConfig(target, config);
    const protectedRoutesConfigPath = generateProtectedRoutesConfig(target, config, scan);
    tracker.completeStep(1);

    tracker.startStep(2);
    const routePath = generateAuthRoute(target, scan);
    tracker.completeStep(2);

    tracker.startStep(3);
    const middlewarePath = generateMiddleware(target, config, scan);
    if (middlewarePath) {
      tracker.completeStep(3);
    } else {
      tracker.completeStep(3);
    }

    // Copy UI files if requested
    const addedFiles: string[] = [authPath, clientPath, routePath, protectedRoutesConfigPath];
    if (middlewarePath) {
      addedFiles.push(middlewarePath);
    }

    // Track modified files (layout.tsx)
    const modifiedFiles: Array<{ path: string; originalContent: string }> = [];

    if (config.addUI) {
      tracker.startStep(4);
      const uiSrc = path.join(BOILERPLATE_ROOT, "auth");

      // SAFETY: Always preserve the root page.tsx - never overwrite it
      // We only want to add /stackpatch page, not modify the existing root page
      const appDir = detectAppDirectory(target);
      const rootPagePath = path.join(target, appDir, "page.tsx");
      const rootPageExists = fs.existsSync(rootPagePath);

      // Backup root page if it exists (before copying, we might temporarily overwrite it)
      let rootPageOriginalContent: string | undefined;
      if (rootPageExists) {
        rootPageOriginalContent = fs.readFileSync(rootPagePath, "utf-8");
      }

      const copyResult = await copyFiles(uiSrc, target);
      if (copyResult.success) {
        addedFiles.push(...copyResult.addedFiles);
      }

      // ALWAYS restore the original root page.tsx - we never want to change it
      // The boilerplate page.tsx is only for reference, we preserve user's existing code
      const copiedRootPagePath = path.join(target, appDir, "page.tsx");
      if (rootPageOriginalContent) {
        // Restore the original content immediately - preserve all existing code, pages, links
        fs.writeFileSync(copiedRootPagePath, rootPageOriginalContent, "utf-8");
        // Remove from addedFiles since we're restoring the original (not using boilerplate version)
        const rootPageRelative = path.relative(target, copiedRootPagePath).replace(/\\/g, "/");
        const index = addedFiles.indexOf(rootPageRelative);
        if (index > -1) {
          addedFiles.splice(index, 1);
        }
      } else if (fs.existsSync(copiedRootPagePath)) {
        // Original didn't exist, but boilerplate copied one - delete it since user didn't have one
        // We don't want to add a redirecting page.tsx if user didn't have one
        fs.unlinkSync(copiedRootPagePath);
        const rootPageRelative = path.relative(target, copiedRootPagePath).replace(/\\/g, "/");
        const index = addedFiles.indexOf(rootPageRelative);
        if (index > -1) {
          addedFiles.splice(index, 1);
        }
      }

      // Update layout.tsx to include AuthWrapper and Toaster component
      // We track the original content so we can restore the file to its state before StackPatch changes

      // Add AuthWrapper first (wraps children)
      const authWrapperResult = updateLayoutForAuthWrapper(target);
      if (authWrapperResult.modified && authWrapperResult.originalContent) {
        // Track the original content before AuthWrapper was added
        modifiedFiles.push({
          path: authWrapperResult.filePath,
          originalContent: authWrapperResult.originalContent,
        });
      }

      // Add Toaster (uses the content after AuthWrapper was added, but we track the original)
      const toasterLayoutResult = updateLayoutForToaster(target);
      // Only track if AuthWrapper wasn't already tracked (use the original originalContent)
      if (toasterLayoutResult.modified) {
        const existingIndex = modifiedFiles.findIndex((f) => f.path === toasterLayoutResult.filePath);
        if (existingIndex === -1) {
          // AuthWrapper wasn't added, track Toaster's original
          if (toasterLayoutResult.originalContent) {
            modifiedFiles.push({
              path: toasterLayoutResult.filePath,
              originalContent: toasterLayoutResult.originalContent,
            });
          }
        }
        // If AuthWrapper was already tracked, keep the original originalContent (before any modifications)
      }

      tracker.completeStep(4);
    } else {
      tracker.completeStep(4);
    }

    tracker.startStep(5);
    // Generate protected page for /dashboard or custom routes (not for "/")
    const needsProtectedPage = config.protectedRoutes.some(
      (route) => route !== "/" && (route === "/dashboard" || !route.startsWith("/"))
    );
    if (needsProtectedPage || config.protectedRoutes.includes("/dashboard")) {
      const protectedPagePath = generateProtectedPage(target, scan);
      if (protectedPagePath) {
        addedFiles.push(protectedPagePath);
      }
    }
    tracker.completeStep(5);

    // Create manifest
    const manifest: StackPatchManifest = {
      version: MANIFEST_VERSION,
      patchName: "auth",
      target,
      timestamp: new Date().toISOString(),
      files: {
        added: addedFiles,
        modified: modifiedFiles,
        backedUp: [],
        envFiles: [".env.example"],
      },
      dependencies: deps,
      oauthProviders: config.oauthProviders,
    };
    writeManifest(target, manifest);

    // Show success message
    showSuccessMessage(target, config, scan);

    return true;
  } catch (error) {
    tracker.failStep(0);
    console.error(chalk.red("Error setting up Better Auth:"), error);
    return false;
  }
}

/**
 * Show success message with next steps
 */
function showSuccessMessage(
  target: string,
  config: AuthConfig,
  scan: ProjectScan
): void {
  console.log(chalk.green.bold("\n✅ Auth installed successfully\n"));

  console.log(chalk.blue.bold("📦 Configuration Summary:"));
  console.log(chalk.white(`   Session Mode: ${config.sessionMode === "stateless" ? "Stateless (JWT)" : "Database"}`));
  if (config.sessionMode === "database" && config.database !== "none") {
    console.log(chalk.white(`   Database: ${config.database}`));
    console.log(chalk.white(`   ORM: ${config.orm}`));
  }
  console.log(chalk.white(`   Email/Password: ${config.emailPassword ? "Enabled" : "Disabled"}`));
  if (config.oauthProviders.length > 0) {
    console.log(chalk.white(`   OAuth Providers: ${config.oauthProviders.join(", ")}`));
  } else {
    console.log(chalk.white(`   OAuth Providers: None`));
  }
  console.log(chalk.white(`   UI Components: ${config.addUI ? "Added" : "Not added"}`));
  console.log(chalk.white(`   Protected Routes: ${config.protectedRoutes.join(", ")}`));
  if (config.protectedRoutes.some((r) => r.endsWith("/*"))) {
    console.log(chalk.blue("   💡 Tip: Routes ending with /* protect all sub-routes"));
  }

  console.log(chalk.blue.bold("\n📁 Created Files:"));
  const libDir = scan.hasSrcDir ? "src/lib" : "lib";
  console.log(chalk.white(`   - ${libDir}/auth.ts`));
  console.log(chalk.white(`   - ${libDir}/auth-client.ts`));
  console.log(chalk.white(`   - app/api/auth/[...all]/route.ts`));
  if (config.protectedRoutes.length > 0) {
    console.log(chalk.white(`   - middleware.ts`));
  }
  if (config.protectedRoutes.length > 0) {
    console.log(chalk.white(`   - ${libDir}/protected-routes.ts`));
  }
  if (config.addUI) {
    console.log(chalk.white(`   - app/auth/login/page.tsx`));
    console.log(chalk.white(`   - app/auth/signup/page.tsx`));
    console.log(chalk.white(`   - app/stackpatch/page.tsx`));
  }
  console.log(chalk.white(`   - .env.example`));

  console.log(chalk.blue.bold("\n📦 Installed Dependencies:"));
  console.log(chalk.white("   - better-auth"));
  if (config.addUI) {
    console.log(chalk.white("   - react-hot-toast"));
  }
  if (config.sessionMode === "database" && config.database === "sqlite" && config.orm === "raw") {
    console.log(chalk.white("   - better-sqlite3"));
  }

  console.log(chalk.blue.bold("\n🚀 Next Steps:\n"));
  console.log(chalk.white("1. Create .env.local file:"));
  console.log(chalk.cyan(`   cp .env.example .env.local`));
  console.log(chalk.white("\n2. Add OAuth credentials to .env.local:"));
  if (config.oauthProviders.includes("google")) {
    console.log(chalk.yellow("   - Get Google OAuth credentials:"));
    console.log(chalk.white("     https://console.cloud.google.com/apis/credentials"));
    console.log(chalk.white("     Add redirect URI: http://localhost:3000/api/auth/callback/google"));
    console.log(chalk.cyan("     GOOGLE_CLIENT_ID=your_client_id"));
    console.log(chalk.cyan("     GOOGLE_CLIENT_SECRET=your_client_secret"));
  }
  if (config.oauthProviders.includes("github")) {
    console.log(chalk.yellow("   - Get GitHub OAuth credentials:"));
    console.log(chalk.white("     https://github.com/settings/developers"));
    console.log(chalk.white("     Add callback URL: http://localhost:3000/api/auth/callback/github"));
    console.log(chalk.cyan("     GITHUB_CLIENT_ID=your_client_id"));
    console.log(chalk.cyan("     GITHUB_CLIENT_SECRET=your_client_secret"));
  }
  if (config.sessionMode === "database" && config.database !== "none") {
    console.log(chalk.white("\n3. Generate database schema:"));
    console.log(chalk.cyan("   npx @better-auth/cli generate"));
    console.log(chalk.white("   Or migrate directly:"));
    console.log(chalk.cyan("   npx @better-auth/cli migrate"));
    console.log(chalk.white("\n4. Start dev server:"));
  } else {
    console.log(chalk.white("\n3. Start dev server:"));
  }
  console.log(chalk.cyan("   pnpm dev"));
  console.log(chalk.white("\n5. Visit your app:"));
  console.log(chalk.cyan("   http://localhost:3000/stackpatch"));
  console.log(chalk.gray("\n   💡 Tip: To change the /stackpatch route, see comments in:"));
  console.log(chalk.gray(`      - ${scan.hasSrcDir ? "src" : ""}app/stackpatch/page.tsx`));
  console.log(chalk.gray(`      - ${scan.hasSrcDir ? "src" : ""}app/page.tsx`));
  console.log(chalk.gray(`      - ${scan.hasSrcDir ? "src" : ""}app/auth/login/page.tsx`));

  console.log(chalk.blue.bold("\n🔒 Protected Routes Guide:"));
  console.log(chalk.white("   Routes are automatically protected based on your configuration."));
  console.log(chalk.white("   Examples:"));
  console.log(chalk.cyan("   - /dashboard        → Protects only /dashboard"));
  console.log(chalk.cyan("   - /dashboard/*      → Protects /dashboard and ALL sub-routes"));
  console.log(chalk.cyan("   - /admin/*          → Protects /admin and ALL sub-routes"));
  console.log(chalk.white("   To modify protected routes, edit:"));
  console.log(chalk.cyan(`   - ${scan.hasSrcDir ? "src" : ""}lib/protected-routes.ts`));

  console.log(chalk.blue.bold("\n📚 Documentation:"));
  console.log(chalk.white("   https://better-auth.dev"));
  console.log(chalk.white("   https://stackpatch.dev/docs/auth\n"));
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use setupAuthNew instead
 */
export async function setupAuth(
  target: string,
  selectedProviders: string[]
): Promise<boolean> {
  // Redirect to new flow
  return setupAuthNew(target);
}

/**
 * Legacy OAuth provider selection
 * @deprecated
 */
export async function askOAuthProviders(): Promise<string[]> {
  // This is kept for backward compatibility but won't be used in new flow
  return [];
}

/**
 * Legacy database type selection
 * @deprecated
 */
export async function askDatabaseType(): Promise<string> {
  return "sqlite";
}

/**
 * Legacy OAuth setup instructions
 * @deprecated
 */
export async function showOAuthSetupInstructions(
  target: string,
  selectedProviders: string[] = [],
  dbType: string = "sqlite"
): Promise<void> {
  // Legacy function, kept for compatibility
}
