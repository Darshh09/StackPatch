import chalk from "chalk";

/**
 * Progress tracker with checkmarks
 */
export class ProgressTracker {
  private steps: Array<{
    name: string;
    status: "pending" | "processing" | "completed" | "failed";
    interval?: NodeJS.Timeout;
  }> = [];

  addStep(name: string): void {
    this.steps.push({ name, status: "pending" });
  }

  startStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.steps[index].status = "processing";
      const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frameIndex = 0;
      const step = this.steps[index];

      const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.yellow(frames[frameIndex])} ${step.name}`);
        frameIndex = (frameIndex + 1) % frames.length;
      }, 100);

      this.steps[index].interval = interval;
    }
  }

  completeStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      if (this.steps[index].interval) {
        clearInterval(this.steps[index].interval);
        this.steps[index].interval = undefined;
      }
      process.stdout.write(`\r${chalk.green("✓")} ${this.steps[index].name}\n`);
      this.steps[index].status = "completed";
    }
  }

  failStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      if (this.steps[index].interval) {
        clearInterval(this.steps[index].interval);
        this.steps[index].interval = undefined;
      }
      process.stdout.write(`\r${chalk.red("✗")} ${this.steps[index].name}\n`);
      this.steps[index].status = "failed";
    }
  }

  getSteps() {
    return this.steps;
  }
}

/**
 * Helper function with spinner and checkmark
 */
export async function withSpinner<T>(text: string, fn: () => Promise<T> | T): Promise<T> {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frameIndex = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r${chalk.yellow(frames[frameIndex])} ${text}`);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 100);

  try {
    const result = await fn();
    clearInterval(interval);
    process.stdout.write(`\r${chalk.green("✓")} ${text}\n`);
    return result;
  } catch (error) {
    clearInterval(interval);
    process.stdout.write(`\r${chalk.red("✗")} ${text}\n`);
    throw error;
  }
}
