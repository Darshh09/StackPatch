// Use require for CommonJS compatibility with pnpm workspaces
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const json = require("@rollup/plugin-json");

module.exports = {
  input: "src/index.ts",
  output: {
    file: "dist/stackpatch.js",
    format: "es",
    banner: "#!/usr/bin/env node",
    sourcemap: false,
  },
  external: [
    // Don't bundle Node.js built-ins
    "fs",
    "path",
    "child_process",
    "url",
    "os",
    "crypto",
    "stream",
    "util",
    "events",
    // Don't bundle dependencies - they should be in node_modules
    // Note: chalk is bundled for better compatibility
    // Note: inquirer v13 is ESM-only with top-level await, so we externalize it
    // and use dynamic imports at runtime
    "inquirer",
    "fs-extra",
    "jimp",
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ["node", "default"],
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      sourceMap: false,
      compilerOptions: {
        module: "ESNext",
        target: "ES2022",
      },
    }),
  ],
};
