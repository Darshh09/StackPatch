// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/pnpm-lock.yaml",
      "**/vitest.config.ts",
      ".lintstagedrc.js",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // CommonJS files configuration
  {
    files: ["**/*.js"],
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/*.config.js",
      "**/*.config.mjs",
      ".lintstagedrc.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script", // Allow CommonJS
      },
    },
    rules: {
      "no-console": "off", // Allow console in scripts
      "no-undef": "off", // Node globals are available
      "@typescript-eslint/no-require-imports": "off", // Allow require in CommonJS files
    },
  },
  // TypeScript/TSX files configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/out/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/pnpm-lock.yaml",
      "**/vitest.config.ts",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // CLI scripts - allow console and more lenient rules
  {
    files: ["packages/cli/**/*.ts", "packages/cli/**/*.js"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
