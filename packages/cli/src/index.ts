// Try to import dependencies and show helpful error if they're missing
let chalk: typeof import("chalk").default;
let inquirer: any;

try {
  const chalkModule = await import("chalk");
  const inquirerModule = await import("inquirer");
  chalk = chalkModule.default;
  // Inquirer v13 uses default export
  inquirer = inquirerModule.default || inquirerModule;
} catch (error: any) {
  if (error?.code === "ENOENT" || error?.message?.includes("Cannot find module")) {
    console.error("\n❌ Missing Dependencies\n");
    console.error("Required dependencies are not installed.");
    console.error("\nTo fix this, run:");
    console.error("  cd packages/cli");
    console.error("  pnpm install");
    console.error("\nOr from the project root:");
    console.error("  pnpm install");
    console.error();
    process.exit(1);
  }
  throw error;
}
import { PATCHES } from "./config.js";
import { showLogo } from "./ui/logo.js";
import { createProject } from "./commands/create.js";
import { addPatch } from "./commands/add.js";
import { revertPatch } from "./commands/revert.js";

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const projectName = args[1];
  const skipPrompts = args.includes("--yes") || args.includes("-y");

  // Show logo on startup
  showLogo();

  // Handle: bun create stackpatch@latest (no project name)
  // Show welcome and prompt for project name
  if (!command || command.startsWith("-")) {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.white("Enter your project name or path (relative to current directory)"),
        default: "my-stackpatch-app",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    await createProject(name.trim(), false, skipPrompts); // Don't show welcome again
    return;
  }

  // Handle: npx stackpatch revert
  if (command === "revert") {
    await revertPatch();
    return;
  }

  // Handle: bun create stackpatch@latest my-app
  // When bun runs create, it passes project name as first arg (not "create")
  // Check if first arg looks like a project name (not a known command)
  // Always ask for project name first, even if provided
  if (
    command &&
    !["add", "create", "revert"].includes(command) &&
    !PATCHES[command] &&
    !command.startsWith("-")
  ) {
    // Likely called as: bun create stackpatch@latest my-app
    // But we'll ask for project name anyway to be consistent
    await showLogo();
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.white("Enter your project name or path (relative to current directory)"),
        default: command || "my-stackpatch-app", // Use provided name as default
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    await createProject(name.trim(), false, skipPrompts); // Welcome already shown
    return;
  }

  // Handle: npx stackpatch create my-app
  if (command === "create") {
    if (!projectName) {
      showLogo();
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: chalk.white("Enter your project name or path (relative to current directory)"),
          default: "my-stackpatch-app",
          validate: (input: string) => {
            if (!input.trim()) {
              return "Project name cannot be empty";
            }
            return true;
          },
        },
      ]);
      await createProject(name.trim(), false); // Logo already shown
      return;
    }
    await createProject(projectName, false, skipPrompts); // Logo already shown
    return;
  }

  // Handle: npx stackpatch add auth-ui
  const patchName = args[1];
  if (command === "add" && patchName) {
    await addPatch(patchName);
    return;
  }

  // If no command, show help or interactive mode
  if (!command) {
    await showLogo();
    console.log(chalk.yellow("Usage:"));
    console.log(chalk.white("  ") + chalk.cyan("npm create stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx create-stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("bunx create-stackpatch@latest") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch create") + chalk.gray(" [project-name]"));
    console.log(chalk.white("  ") + chalk.cyan("npx stackpatch add") + chalk.white(" <patch-name>"));
    console.log(
      chalk.white("  ") + chalk.cyan("npx stackpatch revert") + chalk.gray(" - Revert a patch installation")
    );
    console.log(chalk.white("\nExamples:"));
    console.log(chalk.gray("  npm create stackpatch@latest my-app"));
    console.log(chalk.gray("  npx create-stackpatch@latest my-app"));
    console.log(chalk.gray("  bunx create-stackpatch@latest my-app"));
    console.log(chalk.gray("  npx stackpatch create my-app"));
    console.log(chalk.gray("  npx stackpatch add auth-ui"));
    console.log(chalk.gray("\n"));
    process.exit(0);
  }

  // Interactive mode (fallback)
  console.log(chalk.blue.bold("\n🚀 Welcome to StackPatch CLI\n"));

  let selectedPatch: string | null = null;
  let goBack = false;

  // 1️⃣ Select patch with back option
  do {
    const response = await inquirer.prompt([
      {
        type: "list",
        name: "patch",
        message: "Which patch do you want to add?",
        choices: [
          ...Object.keys(PATCHES)
            .filter((p) => p !== "auth-ui") // Don't show duplicate
            .map((p) => ({ name: p, value: p })),
          new inquirer.Separator(),
          {
            name: chalk.gray("← Go back / Cancel"),
            value: "back",
          },
        ],
      },
    ]);

    if (response.patch === "back") {
      goBack = true;
      break;
    }

    selectedPatch = response.patch;
  } while (!selectedPatch);

  if (goBack || !selectedPatch) {
    console.log(chalk.yellow("\n← Cancelled"));
    return;
  }

  const patch = selectedPatch;

  // 2️⃣ Enter target Next.js app folder
  const { target } = await inquirer.prompt([
    {
      type: "input",
      name: "target",
      message:
        "Enter the relative path to your Next.js app folder (e.g., ../../apps/stackpatch-frontend):",
      default: process.cwd(),
    },
  ]);

  await addPatch(patch, target);
}

main().catch((error) => {
  console.error(chalk.red("❌ Error:"), error);
  process.exit(1);
});
