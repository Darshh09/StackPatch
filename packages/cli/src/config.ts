import path from "path";

/**
 * Configuration constants and types for StackPatch CLI
 */

// Get directory path - Bun supports import.meta.dir
// @ts-expect-error - Bun-specific API, not in Node types
const CLI_DIR = import.meta.dir || path.dirname(new URL(import.meta.url).pathname);

// Resolve boilerplate path - use local boilerplate inside CLI package
export const BOILERPLATE_ROOT = path.resolve(CLI_DIR, "../boilerplate");

/**
 * Available patches and their configurations
 */
export const PATCHES: Record<string, { path: string; dependencies: string[] }> = {
  auth: {
    path: "auth",
    dependencies: ["better-auth", "react-hot-toast"],
  },
  "auth-ui": {
    path: "auth",
    dependencies: ["better-auth", "react-hot-toast"],
  },
  // Example for future patches:
  // stripe: { path: "stripe", dependencies: ["stripe"] },
  // redux: { path: "redux", dependencies: ["@reduxjs/toolkit", "react-redux"] },
};

/**
 * Manifest structure for tracking changes
 */
export interface StackPatchManifest {
  version: string;
  patchName: string;
  target: string;
  timestamp: string;
  files: {
    added: string[];
    modified: {
      path: string;
      originalContent: string;
    }[];
    backedUp: string[];
    envFiles?: string[]; // Track .env.local and .env.example if created
  };
  dependencies: string[];
  oauthProviders: string[];
}

export const MANIFEST_VERSION = "1.0.0";
