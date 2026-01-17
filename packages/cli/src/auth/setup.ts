import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { detectAppDirectory, detectComponentsDirectory } from "../utils/paths.js";
import { scanProject, formatScanResults, type ProjectScan } from "../utils/scanner.js";
import { ProgressTracker } from "../ui/progress.js";

/**
 * Auth configuration options
 */
export interface AuthConfig {
  sessionMode: "database" | "stateless";
  database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none";
  orm: "drizzle" | "prisma" | "raw" | "none";
  emailPassword: boolean;
  oauthProviders: string[];
  addUI: boolean;
  protectedRoutes: string[];
}

/**
 * Step 1: Project Scan (automatic)
 */
export function performProjectScan(target: string): ProjectScan {
  return scanProject(target);
}

/**
 * Step 2: Session Mode Selection
 */
export async function askSessionMode(): Promise<"database" | "stateless"> {
  const { mode } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "mode",
      message: "Choose session mode:",
      choices: [
        { name: "Database (persistent sessions)", value: "database" },
        { name: "Stateless (JWT only, no database)", value: "stateless" },
      ],
      default: "database",
    },
  ]);
  return mode;
}

/**
 * Step 3: Database Selection (only shown if database mode is selected)
 */
export async function askDatabase(): Promise<"postgres" | "mysql" | "sqlite" | "mongodb"> {
  const { database } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "database",
      message: "Choose database:",
      choices: [
        { name: "PostgreSQL", value: "postgres" },
        { name: "MySQL", value: "mysql" },
        { name: "SQLite", value: "sqlite" },
        { name: "MongoDB", value: "mongodb" },
      ],
      default: "postgres",
    },
  ]);
  return database;
}

/**
 * Step 4: ORM Selection (only shown if database mode is selected)
 */
export async function askORM(): Promise<"drizzle" | "prisma" | "raw"> {
  const { orm } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "orm",
      message: "Choose ORM:",
      choices: [
        { name: "Drizzle", value: "drizzle" },
        { name: "Prisma", value: "prisma" },
        { name: "Raw driver", value: "raw" },
      ],
      default: "drizzle",
    },
  ]);
  return orm;
}

/**
 * Step 5: Auth Providers
 */
export async function askAuthProviders(): Promise<{ emailPassword: boolean; oauth: string[] }> {
  const { emailPassword } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "emailPassword",
      message: "Enable Email + Password?",
      choices: [
        { name: "Yes", value: "yes" },
        { name: "No", value: "no" },
      ],
      default: "yes",
    },
  ]);

  const emailPasswordBool = emailPassword === "yes";

  const { oauth } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "oauth",
      message: "Add OAuth providers?",
      choices: [
        { name: "GitHub", value: "github" },
        { name: "Google", value: "google" },
        { name: "None", value: "none" },
      ],
    },
  ]);

  // Remove "none" if other providers are selected
  const oauthProviders = oauth.filter((p: string) => p !== "none" || oauth.length === 1);

  return { emailPassword: emailPasswordBool, oauth: oauthProviders };
}

/**
 * Step 6: UI Selection
 */
export async function askUI(): Promise<boolean> {
  const { addUI } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "addUI",
      message: "Add prebuilt auth UI?",
      choices: [
        { name: "Yes (recommended)", value: "yes" },
        { name: "No", value: "no" },
      ],
      default: "yes",
    },
  ]);
  return addUI === "yes";
}

/**
 * Step 7: Protected Routes
 */
export async function askProtectedRoutes(): Promise<string[]> {
  const { routeType } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "routeType",
      message: "Which route should be protected?",
      choices: [
        { name: "/ and /stackpatch (default)", value: "default" },
        { name: "/dashboard", value: "dashboard" },
        { name: "/dashboard/* (protects dashboard and all sub-routes)", value: "dashboard-wildcard" },
        { name: "Custom", value: "custom" },
      ],
      default: "default",
    },
  ]);

  if (routeType === "custom") {
    const { customRoutes } = await inquirer.prompt([
      {
        type: "input",
        name: "customRoutes",
        message: "Enter routes to protect (comma-separated, e.g., /dashboard,/profile):",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Please enter at least one route";
          }
          return true;
        },
      },
    ]);

    const routes = customRoutes.split(",").map((r: string) => r.trim());

    // Show helpful message about wildcard support
    console.log(chalk.blue("\n💡 Tip: Use /* to protect all sub-routes"));
    console.log(chalk.gray("   Examples:"));
    console.log(chalk.gray("   - /dashboard/* protects /dashboard and all sub-routes"));
    console.log(chalk.gray("   - /admin/* protects /admin and all sub-routes"));
    console.log(chalk.gray("   - /dashboard protects only /dashboard (not sub-routes)"));

    return routes;
  }

  if (routeType === "default") {
    return ["/", "/stackpatch"];
  }

  if (routeType === "dashboard-wildcard") {
    return ["/dashboard/*"];
  }

  return ["/dashboard"];
}

/**
 * Step 8: Confirmation
 */
export async function showConfirmation(config: AuthConfig): Promise<boolean> {
  console.log(chalk.blue.bold("\nReady to apply patch:\n"));

  const items: string[] = [];
  items.push("• Install better-auth");
  items.push("• Create auth config");
  items.push("• Add API route");
  if (config.sessionMode === "database") {
    items.push("• Add middleware");
  }
  if (config.addUI) {
    items.push("• Add login/signup UI");
  }
  config.protectedRoutes.forEach((route) => {
    items.push(`• Protect ${route}`);
  });

  items.forEach((item) => console.log(chalk.white(item)));

  const { confirm } = await inquirer.prompt([
    {
      type: "list",
      name: "confirm",
      message: "\nContinue?",
      choices: [
        { name: "Yes", value: "yes" },
        { name: "Cancel", value: "cancel" },
      ],
      default: "yes",
    },
  ]);

  return confirm === "yes";
}

/**
 * Collect all configuration through interactive prompts
 */
export async function collectAuthConfig(
  target: string,
  scan: ProjectScan
): Promise<AuthConfig | null> {
  // Step 1: Show scan results
  console.log(chalk.blue.bold("\nStep 1 — Project Scan\n"));
  const scanResults = formatScanResults(scan);
  scanResults.forEach((result) => console.log(chalk.green(result)));
  console.log();

  // Step 2: Session Mode
  const sessionMode = await askSessionMode();

  // Step 3-4: Database and ORM (only if database mode)
  let database: "postgres" | "mysql" | "sqlite" | "mongodb" | "none" = "none";
  let orm: "drizzle" | "prisma" | "raw" | "none" = "none";

  if (sessionMode === "database") {
    database = await askDatabase();
    orm = await askORM();
  }

  // Step 5: Auth Providers
  // Both email/password and OAuth work in stateless mode
  const { emailPassword, oauth } = await askAuthProviders();

  // Step 6: UI
  const addUI = await askUI();

  // Step 7: Protected Routes
  const protectedRoutes = await askProtectedRoutes();

  const config: AuthConfig = {
    sessionMode,
    database,
    orm,
    emailPassword,
    oauthProviders: oauth,
    addUI,
    protectedRoutes,
  };

  // Step 8: Confirmation
  const confirmed = await showConfirmation(config);
  if (!confirmed) {
    return null;
  }

  return config;
}
