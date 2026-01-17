# New CLI Flow Documentation

## Overview

The StackPatch CLI now uses an interactive, step-by-step flow that automatically scans your project and guides you through the authentication setup process.

## Flow Steps

### Step 1 — Project Scan (Automatic)

The CLI automatically scans your project and displays:

```
✔ Framework: Next.js (App Router)
✔ TypeScript: Yes
✔ Package Manager: pnpm
✔ Runtime: Node
✔ src directory: Yes
✔ Existing auth: None
```

**Detection Logic:**
- **Framework**: Checks `package.json` for `next` dependency
- **Router**: Detects `app/` or `pages/` directory
- **TypeScript**: Checks for `tsconfig.json`
- **Package Manager**: Checks for lock files (`pnpm-lock.yaml`, `yarn.lock`, etc.)
- **Runtime**: Detects Bun from `bun.lockb` or defaults to Node
- **src directory**: Checks for `src/` folder
- **Existing auth**: Checks for `better-auth` or `next-auth` in dependencies

### Step 2 — Session Mode

```
? Choose session mode:
❯ Database (persistent sessions)
  Stateless (JWT only)
```

**Options:**
- **Database**: Persistent sessions stored in database (recommended)
- **Stateless**: JWT-only sessions, no database required

### Step 3 — Database Selection

Only shown if "Database" mode is selected:

```
? Choose database:
❯ PostgreSQL
  MySQL
  SQLite
  MongoDB
```

### Step 4 — ORM Selection

Only shown if "Database" mode is selected:

```
? ORM:
❯ Drizzle
  Prisma
  Raw driver
```

**Notes:**
- **Drizzle**: Uses `drizzleAdapter` from Better Auth
- **Prisma**: Uses `prismaAdapter` from Better Auth
- **Raw driver**: Direct database driver (better-sqlite3, postgres, mysql2)

### Step 5 — Auth Providers

```
? Enable Email + Password?
✔ Yes

? Add OAuth providers?
◯ GitHub
◯ Google
◯ None
```

**Options:**
- **Email + Password**: Native Better Auth email/password authentication
- **OAuth Providers**: Social login options (GitHub, Google)

### Step 6 — UI Selection

```
? Add prebuilt auth UI?
❯ Yes (recommended)
  No
```

**Options:**
- **Yes**: Copies pre-built login/signup pages and components
- **No**: Only sets up backend auth, no UI files

### Step 7 — Protected Routes

```
? Which route should be protected?
❯ /
  /dashboard
  custom
```

**Options:**
- **/**: Protect root route
- **/dashboard**: Protect dashboard route (creates example page)
- **Custom**: Enter comma-separated routes (e.g., `/dashboard,/profile`)

### Step 8 — Confirmation

```
Ready to apply patch:

• Install better-auth
• Create auth config
• Add API route
• Add middleware
• Add login/signup UI
• Protect /

Continue?
❯ Yes
  Cancel
```

Shows a summary of what will be created/modified.

## Generated File Structure

### For Next.js App Router with `src/` directory:

```
project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   └── protected/
│   │       └── page.tsx (if /dashboard selected)
│   ├── lib/
│   │   ├── auth.ts
│   │   └── auth-client.ts
│   └── components/
│       ├── auth-button.tsx
│       ├── protected-route.tsx
│       └── session-provider.tsx
├── middleware.ts (if database mode)
├── .env.example
└── stackpatch.config.json
```

### For Next.js App Router without `src/` directory:

```
project/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   └── protected/
│       └── page.tsx
├── lib/
│   ├── auth.ts
│   └── auth-client.ts
├── components/
│   ├── auth-button.tsx
│   └── protected-route.tsx
├── middleware.ts
├── .env.example
└── stackpatch.config.json
```

## Configuration Files

### `stackpatch.config.json`

Stores the configuration used during setup:

```json
{
  "version": "1.0.0",
  "patch": "auth",
  "config": {
    "sessionMode": "database",
    "database": "postgres",
    "orm": "drizzle",
    "emailPassword": true,
    "oauthProviders": ["github", "google"],
    "addUI": true,
    "protectedRoutes": ["/"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `.env.example`

Generated environment variables template:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=<generated_secret>
BETTER_AUTH_URL=http://localhost:3000

# Database (if raw driver)
DATABASE_URL=your_database_url_here

# OAuth Providers (if selected)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Implementation Details

### Module Structure

1. **`src/utils/scanner.ts`**: Project scanning logic
2. **`src/auth/setup.ts`**: Interactive prompt functions
3. **`src/auth/generator.ts`**: File generation logic
4. **`src/auth/index.ts`**: Main setup orchestrator

### Key Features

- **Smart Detection**: Automatically detects project structure
- **Flexible Configuration**: Supports multiple databases and ORMs
- **Conditional Generation**: Only generates what's needed
- **Path Awareness**: Handles both `src/` and root directory structures
- **Type Safety**: Full TypeScript support

## Migration from Old Flow

The old flow is still available for backward compatibility but is deprecated. The new flow provides:

- Better user experience with step-by-step guidance
- More configuration options (database, ORM selection)
- Automatic project scanning
- Clearer file structure
- Configuration file for tracking

## Next Steps After Installation

1. **Fill environment variables** in `.env.local`
2. **Run database migration** (if database mode):
   ```bash
   npx @better-auth/cli migrate
   ```
3. **Start dev server**:
   ```bash
   pnpm dev
   ```
4. **Visit login page**: `http://localhost:3000/auth/login`

## Documentation Links

- Better Auth: https://better-auth.dev
- StackPatch Docs: https://stackpatch.dev/docs/auth
