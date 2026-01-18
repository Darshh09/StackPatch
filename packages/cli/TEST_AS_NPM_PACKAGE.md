# Testing StackPatch CLI as an npm Package

This guide shows you how to test the CLI as an npm package, either locally or after publishing.

## Option 1: Local Testing with `npm link` (Recommended for Development)

This allows you to test the CLI locally without publishing to npm.

### Step 1: Build and Link the Package

```bash
cd packages/cli

# Build the CLI
npm run build

# Link the package globally
npm link
```

This creates a global symlink so you can use `stackpatch` from anywhere.

### Step 2: Test the Linked Package

```bash
# Create a test Next.js project
cd /Users/darshitshukla/Desktop/test-stackpatch
npx create-next-app@latest test-next16-npm --typescript --app --no-tailwind
cd test-next16-npm

# Test with the linked package
npx stackpatch add auth
# Or just:
stackpatch add auth
```

### Step 3: Verify It Works

```bash
# Check that the correct file was created
ls -la middleware.ts  # For Next.js 16+
# or
ls -la proxy.ts       # For Next.js < 16

# Check the content
cat middleware.ts  # or proxy.ts
```

### Step 4: Unlink When Done

```bash
cd packages/cli
npm unlink
```

---

## Option 2: Publish to npm (for Real Testing)

### Step 1: Prepare for Publishing

```bash
cd packages/cli

# Make sure you're logged into npm
npm whoami
# If not logged in:
npm login

# Check current version
cat package.json | grep '"version"'
```

### Step 2: Update Version

```bash
# Bump version (patch, minor, or major)
npm version patch  # 1.2.7 -> 1.2.8
# or
npm version minor  # 1.2.7 -> 1.3.0
# or
npm version major  # 1.2.7 -> 2.0.0
```

### Step 3: Build and Publish

```bash
# Build the CLI
npm run build

# Publish to npm
npm publish

# Or use the publish script
./publish.sh
```

### Step 4: Test the Published Package

```bash
# Create a test project
cd /Users/darshitshukla/Desktop/test-stackpatch
npx create-next-app@latest test-next16-published --typescript --app --no-tailwind
cd test-next16-published

# Test with the published package
npx stackpatch@latest add auth
```

---

## Option 3: Test with Specific Version

If you've published a version, you can test it specifically:

```bash
# Test a specific version
npx stackpatch@1.2.8 add auth

# Or test the latest
npx stackpatch@latest add auth
```

---

## Complete Testing Workflow

### Test Next.js 16+ (should create `middleware.ts`)

```bash
# 1. Create Next.js 16+ project
npx create-next-app@latest test-next16-npm --typescript --app --no-tailwind
cd test-next16-npm

# 2. Verify Next.js version
cat package.json | grep '"next"'
# Should show: "next": "^16.0.0" or similar

# 3. Run StackPatch CLI
npx stackpatch@latest add auth
# Answer prompts:
# - Session mode: 2 (Stateless)
# - Email/Password: 1 (Yes)
# - OAuth: Select GitHub and Google
# - UI: 1 (Yes)
# - Protected route: /dashboard
# - Continue: 1 (yes)

# 4. Verify middleware.ts was created
ls -la middleware.ts
cat middleware.ts
# Should have: export async function middleware

# 5. Verify proxy.ts does NOT exist
ls proxy.ts  # Should fail
```

### Test Next.js 15 (should create `proxy.ts`)

```bash
# 1. Create Next.js 15 project
npx create-next-app@15 test-next15-npm --typescript --app --no-tailwind
cd test-next15-npm

# 2. Verify Next.js version
cat package.json | grep '"next"'
# Should show: "next": "^15.0.0" or similar

# 3. Run StackPatch CLI
npx stackpatch@latest add auth
# Answer prompts (same as above)

# 4. Verify proxy.ts was created
ls -la proxy.ts
cat proxy.ts
# Should have: export default async function handler

# 5. Verify middleware.ts does NOT exist
ls middleware.ts  # Should fail
```

---

## Testing Checklist

### Before Publishing:
- [ ] CLI builds successfully (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Version is updated in `package.json`
- [ ] Changelog/README updated if needed

### After Publishing:
- [ ] Test with Next.js 16+ project → should create `middleware.ts`
- [ ] Test with Next.js 15 project → should create `proxy.ts`
- [ ] Verify correct export syntax in generated files
- [ ] Verify auth installation completes successfully
- [ ] Test from a clean environment (clear npx cache if needed)

---

## Clearing npx Cache

If you need to test a newly published version, you may need to clear npx cache:

```bash
# Clear npx cache
rm -rf ~/.npm/_npx

# Or use specific version
npx stackpatch@1.2.8 add auth
```

---

## Troubleshooting

### Issue: "Package not found" after publishing

**Solution:**
- Wait a few minutes for npm registry to update
- Use specific version: `npx stackpatch@1.2.8 add auth`
- Clear npx cache: `rm -rf ~/.npm/_npx`

### Issue: Old version is being used

**Solution:**
```bash
# Clear npx cache
rm -rf ~/.npm/_npx

# Use specific version
npx stackpatch@1.2.8 add auth

# Or force latest
npx --yes stackpatch@latest add auth
```

### Issue: Local changes not reflected

**Solution:**
- Make sure you rebuilt: `npm run build`
- If using `npm link`, unlink and relink:
  ```bash
  npm unlink
  npm link
  ```

---

## Quick Test Script

Create a quick test script:

```bash
#!/bin/bash
# Quick test script for npm package

echo "🧪 Testing StackPatch CLI from npm"
echo ""

# Test Next.js 16+
echo "Test 1: Next.js 16+ (should create middleware.ts)"
npx create-next-app@latest test-next16-npm --typescript --app --no-tailwind --yes
cd test-next16-npm
npx stackpatch@latest add auth
# Answer prompts manually
ls -la middleware.ts
cd ..

# Test Next.js 15
echo "Test 2: Next.js 15 (should create proxy.ts)"
npx create-next-app@15 test-next15-npm --typescript --app --no-tailwind --yes
cd test-next15-npm
npx stackpatch@latest add auth
# Answer prompts manually
ls -la proxy.ts
cd ..

echo "✅ Tests complete!"
```

---

## Publishing Checklist

Before publishing to npm:

1. **Update version** in `package.json`
2. **Build the CLI**: `npm run build`
3. **Run tests**: `npm test`
4. **Test locally**: `npm link` and test
5. **Publish**: `npm publish` or `./publish.sh`
6. **Test published version**: `npx stackpatch@latest add auth`

---

## Version Management

```bash
# Check current version
npm version

# Bump patch version (1.2.7 -> 1.2.8)
npm version patch

# Bump minor version (1.2.7 -> 1.3.0)
npm version minor

# Bump major version (1.2.7 -> 2.0.0)
npm version major

# Publish after version bump
npm publish
```
