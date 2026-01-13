# Publishing StackPatch CLI to npm

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. **Login to npm**: Run `npm login` in your terminal
3. **Verify login**: Run `npm whoami` to confirm you're logged in

## Option 1: Publish with Bun (Recommended - Simpler)

Since your CLI uses Bun, you can publish it directly with TypeScript files. Bun can execute TypeScript natively.

### Steps:

1. **Navigate to the CLI package**:
   ```bash
   cd packages/cli
   ```

2. **Update package.json** (if needed):
   - Ensure `bin` points to the TypeScript file
   - Make sure `files` includes all necessary files

3. **Prepare for publishing**:
   ```bash
   # This runs automatically before publish, but you can test it:
   npm run prepublishOnly
   ```

4. **Check what will be published**:
   ```bash
   npm pack --dry-run
   ```

5. **Publish to npm**:
   ```bash
   # For first publish or new version:
   npm publish

   # For scoped packages (if you want @yourusername/stackpatch):
   npm publish --access public
   ```

6. **Verify publication**:
   ```bash
   npm view stackpatch
   ```

## Option 2: Compile to JavaScript (Better Compatibility)

If you want broader compatibility without requiring Bun, compile TypeScript to JavaScript:

### Setup:

1. **Install build dependencies**:
   ```bash
   cd packages/cli
   pnpm add -D typescript @types/node tsx
   ```

2. **Create `tsconfig.json`**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "node",
       "esModuleInterop": true,
       "skipLibCheck": true,
       "outDir": "./dist",
       "rootDir": "./bin"
     },
     "include": ["bin/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. **Update package.json**:
   - Change `bin` to point to compiled JS files
   - Add build script
   - Update `files` to include `dist`

4. **Build and publish**:
   ```bash
   npm run build
   npm publish
   ```

## Version Management

### Update version before publishing:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git tag
- Commits the change

## Testing Before Publishing

1. **Test locally**:
   ```bash
   # Link the package locally
   npm link

   # In another project, test it:
   npx stackpatch add auth
   ```

2. **Test the tarball**:
   ```bash
   npm pack
   # Creates a .tgz file you can inspect
   ```

## Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Ensure `description` is clear and helpful
- [ ] Add/update `repository` field in `package.json`
- [ ] Add `author` field with your name/email
- [ ] Test `prepublishOnly` script works
- [ ] Verify `files` field includes all necessary files
- [ ] Check that `bin` entry is correct
- [ ] Run `npm pack --dry-run` to see what will be published
- [ ] Test the package locally with `npm link`
- [ ] Login to npm: `npm login`
- [ ] Publish: `npm publish`

## Post-Publishing

1. **Verify on npm**:
   Visit: `https://www.npmjs.com/package/stackpatch`

2. **Test installation**:
   ```bash
   # In a fresh directory:
   npx stackpatch add auth
   ```

3. **Update documentation**:
   - Update README with installation instructions
   - Add usage examples

## Troubleshooting

### "Package name already taken"
- Choose a different name or use a scoped package: `@yourusername/stackpatch`

### "You must verify your email"
- Check your npm email and verify it

### "Insufficient permissions"
- Make sure you're logged in: `npm whoami`
- Check if the package name is already taken by someone else

### "Missing files"
- Check the `files` field in `package.json`
- Run `npm pack --dry-run` to see what will be included
