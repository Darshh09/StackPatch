# StackPatch ⚡

Composable frontend features for modern React & Next.js apps. Add production-ready features to existing projects without restructuring.

## Quick Start

**Create a new project:**
```bash
# Using bun (recommended)
bun create stackpatch@latest

# Or with project name
bun create stackpatch@latest my-app

# Using npx
npx stackpatch create my-app
```

**Add features to existing project:**
```bash
npx stackpatch add auth-ui
```

The CLI will auto-detect your Next.js app and copy the necessary files.

## What's Included

- **Auth UI** - Login, signup, and protected routes with NextAuth
- More patches coming soon (stripe, redux, etc.)

## How It Works

Each patch is self-contained. StackPatch:
- Creates missing folders automatically
- Only adds files it owns
- Never refactors existing code
- Warns before overwriting

## Development

```bash
# Clone the repo
git clone <your-repo-url>
cd StackPatch

# Install dependencies
pnpm install

# Set up git hooks (after first install)
pnpm prepare

# Test the CLI locally
cd packages/cli
pnpm dev
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

Quick guide:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-patch`)
3. Add your patch to `packages/boilerplate/`
4. Update the CLI to support it in `packages/cli/bin/stackpatch.ts`
5. Write tests for your changes
6. Make sure all tests pass (`pnpm test`)
7. Submit a PR

**Important:** Direct commits to `main` are not allowed. All changes must go through pull requests.

### Adding a New Patch

1. Create a new folder in `packages/boilerplate/` (e.g., `stripe`)
2. Add your boilerplate files
3. Register it in the CLI's `PATCHES` object
4. Add tests in `packages/cli/__tests__/`
5. Document any dependencies needed

Keep patches minimal and focused. They should work out of the box.

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

Pre-commit hooks will automatically run linter and tests. Make sure everything passes before pushing.

## License

ISC

## Why StackPatch?

Most tools force you into a new project structure. StackPatch lets you add features to what you already have. Think shadcn/ui, but for complete features instead of components.
