# Testing StackPatch CLI Locally

## Quick Test Methods

### Method 1: Direct Execution (Fastest) ⚡
```bash
# From root directory
pnpm stackpatch

# Or directly with bun
bun run packages/cli/bin/stackpatch.ts

# Or from CLI package
cd packages/cli
pnpm dev
```

**This will:**
- Show the welcome screen
- Prompt for project name if none provided
- Create the project in current directory

### Method 2: Simulate `bun create stackpatch@latest` (Recommended)

1. **Link the package locally:**
```bash
cd packages/cli
bun link
```

2. **Test in a temporary directory:**
```bash
# Create a test directory
mkdir /tmp/test-stackpatch
cd /tmp/test-stackpatch

# Test without project name (will prompt)
bun create stackpatch@latest

# Test with project name
bun create stackpatch@latest my-test-app
```

3. **Unlink when done:**
```bash
bun unlink stackpatch
```

### Method 3: Test with npx (after linking)
```bash
# After linking with bun link
npx stackpatch create my-app
npx stackpatch add auth-ui
```

## Testing Scenarios

### Test 1: Welcome Screen (No Arguments)
```bash
# From root directory
bun run packages/cli/bin/stackpatch.ts

# Expected: Shows welcome screen, then prompts for project name
```

### Test 2: Create Project with Name
```bash
# From root directory
bun run packages/cli/bin/stackpatch.ts my-test-app

# Expected: Shows welcome screen, then creates project immediately
```

### Test 3: Add Patch to Existing Project
```bash
# Navigate to a Next.js app
cd apps/stackpatch-frontent
# Or any Next.js project

# Add auth-ui patch
bun run ../../packages/cli/bin/stackpatch.ts add auth-ui

# Expected: Auto-detects Next.js app and adds auth files
```

### Test 4: Test with `bun create` (After Linking)
```bash
# First, link the package
cd packages/cli
bun link

# Then test in a clean directory
cd ~/Desktop
mkdir test-create && cd test-create
bun create stackpatch@latest

# Expected: Works exactly like published package
```

## Full Local Development Workflow

1. **Make changes to CLI:**
```bash
# Edit packages/cli/bin/stackpatch.ts
```

2. **Test immediately:**
```bash
# Quick test
pnpm stackpatch

# Or test in isolation
cd /tmp
mkdir test-cli && cd test-cli
bun create stackpatch@latest
```

3. **Test patches:**
```bash
# Create a test Next.js app
cd /tmp
bunx create-next-app@latest test-app --typescript --use-pnpm --tailwind --app
cd test-app

# Link stackpatch locally (from StackPatch/packages/cli)
cd ~/path/to/StackPatch/packages/cli
bun link

# Go back to test app
cd /tmp/test-app

# Test adding a patch
npx stackpatch add auth-ui
```

## Troubleshooting

### If `bun link` doesn't work:
```bash
# Make sure you're in packages/cli
cd packages/cli

# Install dependencies first
pnpm install

# Then link
bun link
```

### If boilerplate files aren't found:
The CLI automatically detects the boilerplate path. If you get errors, check:
- `packages/boilerplate/template/` exists
- `packages/boilerplate/auth/` exists (for auth-ui patch)

### Test in a clean environment:
```bash
# Use a completely different directory
cd /tmp
mkdir clean-test && cd clean-test
bun create stackpatch@latest
```
