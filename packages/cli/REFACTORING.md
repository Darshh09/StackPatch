# StackPatch CLI Refactoring

This document explains the refactored structure of the StackPatch CLI package.

## Overview

The CLI has been refactored from a single 2444-line file into a modular, maintainable structure. The code is now organized into logical modules that are easier to understand, test, and maintain.

## Directory Structure

```
packages/cli/
├── bin/
│   └── stackpatch.ts          # Entry point (delegates to src/index.ts)
├── src/
│   ├── index.ts                # Main CLI router
│   ├── config.ts               # Configuration constants and types
│   ├── manifest.ts              # Manifest management (read/write/backup)
│   ├── auth/
│   │   └── index.ts            # Authentication setup logic
│   ├── commands/
│   │   ├── create.ts           # Create new project command
│   │   ├── add.ts              # Add patch command
│   │   └── revert.ts           # Revert patch command
│   ├── fileOps/
│   │   ├── copy.ts             # File copying operations
│   │   ├── layout.ts           # Layout file modifications
│   │   └── protected.ts        # Protected route file operations
│   ├── ui/
│   │   ├── logo.ts             # Logo display
│   │   └── progress.ts         # Progress tracking and spinners
│   └── utils/
│       ├── paths.ts            # Path detection utilities
│       ├── dependencies.ts     # Dependency management
│       └── files.ts            # File utility functions
├── boilerplate/                # Template files (unchanged)
└── package.json
```

## Module Descriptions

### Core Modules

#### `config.ts`
- **Purpose**: Central configuration and type definitions
- **Exports**:
  - `BOILERPLATE_ROOT`: Path to boilerplate directory
  - `PATCHES`: Available patches configuration
  - `StackPatchManifest`: Type definition for manifest
  - `MANIFEST_VERSION`: Manifest version constant

#### `manifest.ts`
- **Purpose**: Manifest file management for tracking installations
- **Functions**:
  - `readManifest()`: Read manifest from target directory
  - `writeManifest()`: Write manifest to target directory
  - `backupFile()`: Backup a file before modification
  - `restoreFile()`: Restore a file from backup

### Command Modules (`commands/`)

#### `create.ts`
- **Purpose**: Handle project creation
- **Function**: `createProject()`
- **Responsibilities**:
  - Copy template files
  - Replace placeholders
  - Install dependencies
  - Automatically add auth-ui patch

#### `add.ts`
- **Purpose**: Handle adding patches to existing projects
- **Function**: `addPatch()`
- **Responsibilities**:
  - Copy patch files
  - Install dependencies
  - Setup authentication (if auth patch)
  - Create manifest

#### `revert.ts`
- **Purpose**: Handle reverting patch installations
- **Function**: `revertPatch()`
- **Responsibilities**:
  - Remove added files
  - Restore modified files
  - Remove dependencies
  - Clean up directories
  - Remove manifest

### File Operations (`fileOps/`)

#### `copy.ts`
- **Purpose**: File copying with smart directory detection
- **Functions**:
  - `copyFiles()`: Main copy function with conflict detection
  - `updateImportsInFiles()`: Update import paths in copied files

#### `layout.ts`
- **Purpose**: Modify layout.tsx files
- **Functions**:
  - `updateLayoutForAuth()`: Add AuthSessionProvider
  - `updateLayoutForToaster()`: Add Toaster component

#### `protected.ts`
- **Purpose**: Copy protected route files
- **Function**: `copyProtectedRouteFiles()`

### Authentication (`auth/`)

#### `index.ts`
- **Purpose**: Authentication setup and OAuth configuration
- **Functions**:
  - `askOAuthProviders()`: Prompt for OAuth provider selection
  - `setupAuth()`: Setup authentication with selected providers
  - `showOAuthSetupInstructions()`: Display OAuth setup instructions
  - Internal helpers for env file generation and NextAuth configuration

### UI Modules (`ui/`)

#### `logo.ts`
- **Purpose**: Display StackPatch logo
- **Function**: `showLogo()`

#### `progress.ts`
- **Purpose**: Progress tracking and visual feedback
- **Classes**: `ProgressTracker`
- **Functions**: `withSpinner()`

### Utility Modules (`utils/`)

#### `paths.ts`
- **Purpose**: Path detection and manipulation
- **Functions**:
  - `detectAppDirectory()`: Detect app/ or src/app/
  - `detectComponentsDirectory()`: Detect components/ or src/components/
  - `detectPathAliases()`: Read tsconfig.json path aliases
  - `generateComponentImportPath()`: Generate correct import paths
  - `getParentDirectories()`: Get parent directories of a path
  - `detectTargetDirectory()`: Auto-detect Next.js project directory

#### `dependencies.ts`
- **Purpose**: Dependency management
- **Functions**:
  - `hasDependency()`: Check if dependency exists
  - `installDependencies()`: Install missing dependencies
  - `removeDependencies()`: Remove dependencies from package.json

#### `files.ts`
- **Purpose**: File utility functions
- **Functions**:
  - `removeEmptyDirectories()`: Recursively remove empty directories
  - `findTypeScriptFiles()`: Find all TS/TSX files recursively

## Entry Point

### `bin/stackpatch.ts`
Simple entry point that imports and executes `src/index.ts`.

### `src/index.ts`
Main CLI router that:
1. Parses command-line arguments
2. Routes to appropriate command handler
3. Handles interactive mode
4. Shows help/usage information

## Benefits of Refactoring

1. **Maintainability**: Code is organized into logical modules
2. **Testability**: Each module can be tested independently
3. **Readability**: Clear separation of concerns
4. **Reusability**: Utility functions can be reused across commands
5. **Scalability**: Easy to add new patches or commands
6. **Documentation**: Each module has a clear purpose

## Migration Notes

- The original `bin/stackpatch.ts` (2444 lines) has been replaced with a simple import
- All functionality remains the same
- No breaking changes to CLI interface
- All imports use `.js` extension (required for ES modules)

## Adding New Features

### Adding a New Patch

1. Add patch configuration to `src/config.ts`:
   ```typescript
   export const PATCHES = {
     // ... existing patches
     "new-patch": {
       path: "new-patch",
       dependencies: ["dependency1", "dependency2"],
     },
   };
   ```

2. Create boilerplate files in `boilerplate/new-patch/`

3. The existing `add.ts` command will automatically handle it

### Adding a New Command

1. Create `src/commands/newcommand.ts`
2. Export the command function
3. Add routing logic to `src/index.ts`

### Adding New Utilities

1. Add to appropriate `utils/` module or create new one
2. Export functions
3. Import where needed

## Testing

Each module can be tested independently. The modular structure makes it easier to:
- Mock dependencies
- Test individual functions
- Write integration tests for commands
