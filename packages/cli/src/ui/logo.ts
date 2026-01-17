import chalk from "chalk";

/**
 * Display StackPatch logo
 */
export function showLogo(): void {
  console.log("\n");

  // StackPatch logo ASCII art
  const logo = [
    chalk.magentaBright("  _________ __                 __     __________         __         .__"),
    chalk.magentaBright(" /   _____//  |______    ____ |  | __ \\\\______   \\_____ _/  |_  ____ |  |__"),
    chalk.magentaBright(" \\_____  \\\\   __\\__  \\ _/ ___\\|  |/ /  |     ___/\\__  \\\\   __\\/ ___\\|  |  \\"),
    chalk.magentaBright(" /        \\|  |  / __ \\\\  \\___|    <   |    |     / __ \\|  | \\  \\___|   Y  \\"),
    chalk.magentaBright("/_______  /|__| (____  /\\___  >__|_ \\  |____|    (____  /__|  \\___  >___|  /"),
    chalk.magentaBright("        \\/           \\/     \\/     \\/                 \\/          \\/     \\/"),
    "",
    chalk.white("  Composable frontend features for modern React & Next.js"),
    chalk.gray("  Add authentication, UI components, and more with zero configuration"),
    "",
  ];

  logo.forEach((line) => console.log(line));
}
