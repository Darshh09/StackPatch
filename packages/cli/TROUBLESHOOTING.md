# Troubleshooting

## Module Resolution Issues

### ENOENT: Cannot find module 'inquirer'

If you encounter this error when running the CLI, it's likely due to Bun's module resolution with pnpm workspaces.

**Solution 1: Install dependencies**
```bash
cd packages/cli
pnpm install
```

**Solution 2: Use Bun install (alternative)**
```bash
cd packages/cli
bun install
```

**Solution 3: Run from workspace root**
```bash
# From project root
pnpm install
pnpm --filter stackpatch dev
```

### Bun and pnpm Workspace Compatibility

Bun sometimes has issues resolving symlinks in pnpm workspaces. If you continue to have issues:

1. **Ensure dependencies are installed:**
   ```bash
   pnpm install
   ```

2. **Try using node instead of bun:**
   ```bash
   node --loader tsx bin/stackpatch.ts
   ```

3. **Or use pnpm exec:**
   ```bash
   pnpm exec tsx bin/stackpatch.ts
   ```

## Other Common Issues

### TypeScript Errors

If you see TypeScript errors about missing types, ensure `@types/node` is installed:

```bash
pnpm add -D @types/node
```

### Import Errors

If imports fail, check:
1. `tsconfig.json` is properly configured
2. Module resolution is set to "bundler" (for Bun) or "node" (for Node.js)
3. All dependencies are installed
