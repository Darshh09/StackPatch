# Contributing to StackPatch

Thanks for contributing! This doc covers the basics.

## Setup

```bash
pnpm install
pnpm prepare  # Sets up git hooks
```

## Development Workflow

1. **Never commit directly to `main`** - Always use feature branches
2. Create your branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Write tests for new functionality
5. Run tests: `pnpm test`
6. Run linter: `pnpm lint`
7. Commit (hooks will run automatically)
8. Push and create a PR

## Testing

All new features need tests. Place them in `__tests__/` directories.

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Pre-commit Hooks

Husky runs automatically on commit:
- Lints your code
- Runs related tests
- Formats with Prettier

If hooks fail, fix the issues and commit again.

## Pull Requests

- Keep PRs focused and small
- Update tests and docs
- All CI checks must pass
- Get a review before merging

## Branch Protection

The `main` branch is protected:
- ✅ All changes via PR
- ✅ Tests must pass
- ✅ No direct commits (except merges)

This is enforced by GitHub Actions and git hooks.
