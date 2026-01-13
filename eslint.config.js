// @ts-check
export default [
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
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
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Add your custom rules here
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];
