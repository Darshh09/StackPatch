import fs from "fs";
import path from "path";
import fse from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
import { spawnSync } from "child_process";
import { BOILERPLATE_ROOT, PATCHES, MANIFEST_VERSION, type StackPatchManifest } from "../config.js";
import { detectAppDirectory } from "../utils/paths.js";
import { installDependencies } from "../utils/dependencies.js";
import { ProgressTracker, withSpinner } from "../ui/progress.js";
import { showLogo } from "../ui/logo.js";
import { writeManifest } from "../manifest.js";

/**
 * Create a new project from template
 */
export async function createProject(
  projectName: string,
  showWelcomeScreen: boolean = true,
  forceOverwrite: boolean = false
): Promise<void> {
  const templatePath = path.join(BOILERPLATE_ROOT, "template");
  const targetPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    if (!forceOverwrite) {
      console.log(chalk.yellow(`⚠️  Directory "${projectName}" already exists!`));
      const { overwrite } = await inquirer.prompt([
        {
          type: "list",
          name: "overwrite",
          message: chalk.white("Do you want to overwrite it? (This will delete existing files)"),
          choices: [
            { name: "Yes, overwrite", value: "yes" },
            { name: "No, cancel", value: "no" },
          ],
          default: "no",
        },
      ]);

      if (overwrite !== "yes") {
        console.log(chalk.gray("Cancelled. Choose a different name."));
        process.exit(0);
      }
    }

    // Remove existing directory if overwriting
    console.log(chalk.yellow(`Removing existing directory "${projectName}"...`));
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  if (showWelcomeScreen) {
    showLogo();
  }
  console.log(chalk.blue.bold(`🚀 Creating new StackPatch project: ${chalk.white(projectName)}\n`));

  const tracker = new ProgressTracker();
  tracker.addStep("Copying project template");
  tracker.addStep("Processing project files");
  tracker.addStep("Installing dependencies");

  // Step 1: Copy template
  tracker.startStep(0);
  await fse.copy(templatePath, targetPath);
  tracker.completeStep(0);

  // Step 2: Replace placeholders in files
  tracker.startStep(1);
  // Detect app directory for template processing
  const appDir = detectAppDirectory(targetPath);
  const filesToProcess = [
    "package.json",
    `${appDir}/layout.tsx`,
    `${appDir}/page.tsx`,
    "README.md",
  ];

  for (const file of filesToProcess) {
    const filePath = path.join(targetPath, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
  tracker.completeStep(1);

  // Step 3: Install dependencies
  tracker.startStep(2);
  const installResult = spawnSync("pnpm", ["install"], {
    cwd: targetPath,
    stdio: "pipe",
    env: {
      ...process.env,
      // Prevent Git credential prompts
      GIT_TERMINAL_PROMPT: "0",
      GIT_ASKPASS: "",
      // Prevent npm/pnpm credential prompts
      NPM_CONFIG_PROGRESS: "false",
    },
  });

  if (installResult.status !== 0) {
    tracker.failStep(2);
    console.log(chalk.yellow("\n⚠️  Dependency installation had issues. You can run 'pnpm install' manually."));
  } else {
    tracker.completeStep(2);
  }

  console.log(chalk.green(`\n✅ Project "${projectName}" created successfully!`));

  // Automatically add auth-ui after creating the project
  console.log(chalk.blue.bold(`\n🔐 Adding authentication to your project...\n`));

  // Use new setup flow
  const { setupAuthNew } = await import("../auth/index.js");
  const success = await setupAuthNew(targetPath);

  if (!success) {
    console.log(chalk.yellow("\n⚠️  Authentication setup was cancelled. You can run 'npx stackpatch add auth' manually."));
  }

  console.log(chalk.blue("\n📦 Next steps:"));
  console.log(chalk.white(`  ${chalk.cyan("cd")} ${chalk.yellow(projectName)}`));
  console.log(chalk.white(`  ${chalk.cyan("pnpm")} ${chalk.yellow("dev")}`));
  console.log(chalk.white(`  Test authentication at: ${chalk.cyan("http://localhost:3000/auth/login")}`));
  console.log(chalk.gray("\n📚 See README.md for OAuth setup and protected routes\n"));
}
