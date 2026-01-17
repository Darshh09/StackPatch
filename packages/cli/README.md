<p align="center">
  <h2 align="center">
    StackPatch ⚡
  </h2>

  <p align="center">
    Composable frontend features for modern React & Next.js apps
    <br />
    Add production-ready features to existing projects without restructuring
    <br />
    <a href="https://stackpatch.darshitdev.in"><strong>Visit Website »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Darshh09/StackPatch/issues">Issues</a>
    ·
    <a href="https://github.com/Darshh09/StackPatch">GitHub</a>
    ·
    <a href="https://www.producthunt.com/products/stackpatch">Product Hunt</a>
  </p>

  <p align="center">
    <a href="https://www.producthunt.com/products/stackpatch?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-stackpatch" target="_blank" rel="noopener noreferrer">
      <img alt="StackPatch - Patch authentication into your Next.js app with one command | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1063012&theme=light&t=1768419170786" />
    </a>
  </p>

[![npm](https://img.shields.io/npm/dm/stackpatch?style=flat&colorA=000000&colorB=000000)](https://npm.chart.dev/stackpatch?primary=neutral&gray=neutral&theme=dark)
[![npm version](https://img.shields.io/npm/v/stackpatch.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/stackpatch)
[![GitHub stars](https://img.shields.io/github/stars/Darshh09/StackPatch?style=flat&colorA=000000&colorB=000000)](https://github.com/Darshh09/StackPatch/stargazers)
[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-Featured-orange?style=flat&colorA=000000&colorB=000000)](https://www.producthunt.com/products/stackpatch)
</p>

## About the Project

StackPatch is a CLI tool that helps you quickly add production-ready features to your Next.js applications. No more copy-pasting boilerplate code or configuring complex setups—just run a command and you're done.

Think of StackPatch as **shadcn/ui, but for complete features** instead of components. Each patch is self-contained, fully reversible, and designed to work with your existing project structure.

### Why StackPatch

Adding features to existing Next.js projects often means:
- Copy-pasting boilerplate code from multiple sources
- Manually configuring complex setups
- Worrying about breaking existing code
- Struggling with path aliases and directory structures

StackPatch solves this by:
- ✅ **Zero Configuration** - Interactive setup guides you through everything
- ✅ **Smart Detection** - Automatically adapts to your project structure (`app/` vs `src/app/`)
- ✅ **Fully Reversible** - Track and revert any installation safely
- ✅ **Own Your Code** - Every line of code is yours to modify
- ✅ **Production-Ready** - Battle-tested patterns, not toy examples

## 🚀 Quick Start

### Add to Existing Project

Navigate to your Next.js project directory and run:

```bash
npx stackpatch@latest add auth
```

The CLI will guide you through an interactive setup:
1. **Session Mode** - Choose Database (persistent) or Stateless (JWT)
2. **Database** (if database mode) - Select PostgreSQL, MySQL, SQLite, or MongoDB
3. **ORM** (if database mode) - Choose Drizzle, Prisma, or Raw SQL
4. **Auth Providers** - Enable Email/Password and select OAuth (Google, GitHub)
5. **UI Components** - Choose whether to add prebuilt login/signup pages
6. **Protected Routes** - Select which routes to protect (supports wildcards like `/dashboard/*`)

### Create New Project

```bash
# Using npx (recommended - always gets latest version)
npx stackpatch@latest create my-app
# or
npx create-stackpatch@latest my-app
# or (shorter, but may use cached version)
npx stackpatch create my-app

# Or without project name (will prompt)
npx stackpatch@latest create

# Using bunx (Bun's npx equivalent - if you have Bun installed)
bunx create-stackpatch@latest my-app
```

> **Note:**
> - `npx stackpatch@latest create` or `npx create-stackpatch@latest` always gets the latest version from npm
> - `npx stackpatch create` may use a cached version - use `@latest` to force the latest version
> - `npm create stackpatch@latest` will work after the package is published to npm
> - All commands will prompt you for a project name if not provided
> - The CLI automatically detects and uses Bun if available, otherwise falls back to Node.js with tsx

### Revert an Installation

If you want to undo a StackPatch installation:

```bash
npx stackpatch@latest revert
```

This will:
- Remove all files added by StackPatch
- Restore modified files to their original state
- Clean up the `.stackpatch` tracking directory

> **Note:** The revert command only works if you're in the directory where you ran `stackpatch add`. It uses a manifest file (`.stackpatch/manifest.json`) to track changes.

## 📖 What Gets Added

### Setup Flow

When you run `npx stackpatch@latest add auth`, StackPatch automatically generates:

- ✅ **Better Auth configuration** (`lib/auth.ts` or `src/lib/auth.ts`)
- ✅ **Auth client utilities** (`lib/auth-client.ts` or `src/lib/auth-client.ts`)
- ✅ **Protected routes config** (`lib/protected-routes.ts` - only if protected routes are configured)
- ✅ **API route handler** (`app/api/auth/[...all]/route.ts`)
- ✅ **Middleware** (`middleware.ts` - only if protected routes are configured)
- ✅ **Login/Signup pages** (`app/auth/login/page.tsx`, `app/auth/signup/page.tsx` - if UI enabled)
- ✅ **Landing page** (`app/stackpatch/page.tsx` - if UI enabled)
- ✅ **Auth wrapper** (`components/auth-wrapper.tsx` - if UI enabled, added to layout.tsx)
- ✅ **Toaster component** (`components/toaster.tsx` - if UI enabled, added to layout.tsx)
- ✅ **Environment template** (`.env.example`)

### Smart File Placement

StackPatch automatically:
- ✅ Detects if your app is in `app/` or `src/app/`
- ✅ Places components in matching location (`components/` or `src/components/`)
- ✅ Uses your `tsconfig.json` path aliases for imports
- ✅ Generates correct import paths automatically
- ✅ Tracks all changes in `.stackpatch/manifest.json` for safe reversion

## 🔐 OAuth Setup

When you run `npx stackpatch@latest add auth`, you'll be prompted to select which OAuth providers you want to configure. StackPatch will only set up the providers you select.

### Google OAuth

If you selected Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials
3. Create OAuth client ID (Web application)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google` (or your production URL)
5. Copy Client ID and Secret to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### GitHub OAuth

If you selected GitHub OAuth:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github` (or your production URL)
4. Copy Client ID and generate Secret
5. Add to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

### Environment Variables

Your `.env.local` will include only the variables for providers you selected:

```env
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000

# Only included if you selected Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Only included if you selected GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🛡️ Protecting Routes

StackPatch automatically protects routes based on your configuration. Routes are protected via:
- **Middleware** - Server-side protection with automatic redirects
- **AuthWrapper** - Client-side protection in your root layout

### How It Works

1. **During Setup**: You'll be prompted to select which routes to protect
2. **Automatic Protection**: StackPatch configures middleware and AuthWrapper automatically
3. **Redirects**: Unauthenticated users are redirected to `/auth/login?redirect=<original-path>`
4. **After Login**: Users are automatically redirected back to the original protected route

### Wildcard Routes

Use `/*` to protect a route and all its sub-routes:

- `/dashboard` → Protects only `/dashboard`
- `/dashboard/*` → Protects `/dashboard` and ALL sub-routes (`/dashboard/settings`, `/dashboard/users`, etc.)

**Examples:**
```
/dashboard/*    → Protects /dashboard and all sub-routes
/admin/*        → Protects /admin and all sub-routes
/profile        → Protects only /profile (not sub-routes)
```

**To Modify Protected Routes:**
Edit `lib/protected-routes.ts` (or `src/lib/protected-routes.ts`):

```ts
export const PROTECTED_ROUTES = [
  "/dashboard/*",  // Protects /dashboard and all sub-routes
  "/admin/*",      // Protects /admin and all sub-routes
  "/profile",      // Protects only /profile
] as const;
```

## ⚙️ Configuration Options

### Session Modes

**Database Mode** (Recommended for production):
- Persistent sessions stored in your database
- Supports session management and revocation
- Requires database setup (PostgreSQL, MySQL, SQLite, or MongoDB)
- Choose an ORM: Drizzle, Prisma, or Raw SQL

**Stateless Mode** (JWT/JWE):
- No database required
- Sessions stored in encrypted cookies
- Perfect for serverless deployments
- Limited session management features

### Email/Password Authentication

Email/password authentication works out of the box with Better Auth. If you selected database mode:

1. **Generate database schema**:
   ```bash
   npx @better-auth/cli generate
   # or
   npx @better-auth/cli migrate
   ```

2. **Configure in `lib/auth.ts`** (already set up by StackPatch):
   - Database adapter is configured based on your selection
   - Email/password is enabled if you selected it

See Better Auth documentation for advanced configuration: https://better-auth.dev/docs

## 📁 File Locations

After running `npx stackpatch@latest add auth`, you'll find files in locations that match your project structure:

### If your app is in `app/`:
- **Auth pages**: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- **Auth config**: `lib/auth.ts`, `lib/auth-client.ts`
- **Protected routes config**: `lib/protected-routes.ts`
- **API routes**: `app/api/auth/[...all]/route.ts`
- **Components**: `components/auth-wrapper.tsx`, `components/toaster.tsx`
- **Middleware**: `middleware.ts` (root)
- **Environment**: `.env.example`, `.env.local`
- **Tracking**: `.stackpatch/manifest.json` (for revert)

### If your app is in `src/app/`:
- **Auth pages**: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`
- **Auth config**: `src/lib/auth.ts`, `src/lib/auth-client.ts`
- **Protected routes config**: `src/lib/protected-routes.ts`
- **API routes**: `src/app/api/auth/[...all]/route.ts`
- **Components**: `src/components/auth-wrapper.tsx`, `src/components/toaster.tsx`
- **Middleware**: `middleware.ts` (root)
- **Environment**: `.env.example`, `.env.local`
- **Tracking**: `.stackpatch/manifest.json` (for revert)

StackPatch automatically detects your project structure and places files accordingly. It also:
- Uses your `tsconfig.json` path aliases (e.g., `@/components`) for imports
- Generates correct relative paths if no aliases are found
- Never hardcodes paths like `../../` - always uses smart detection

## 🔧 Customization

### Change Default Redirect After Login

The login/signup pages automatically redirect users based on:
1. The `redirect` query parameter (set by middleware when protecting routes)
2. Fallback to `/stackpatch` if no redirect parameter

To change the fallback route, edit `app/auth/login/page.tsx` and `app/auth/signup/page.tsx`:

```tsx
// Change the fallback route (default: "/stackpatch")
const redirectTo = searchParams.get("redirect") || "/your-custom-route";
```

### Protect API Routes

```ts
// app/api/protected/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ data: "Protected data" });
}
```

## 🐛 Troubleshooting

### OAuth redirect_uri_mismatch

- Ensure redirect URIs match exactly in OAuth provider settings
- Check `BETTER_AUTH_URL` matches your app URL (defaults to `http://localhost:3000` in development)

### OAuth buttons not working

- Verify credentials in `.env.local`
- Restart dev server after adding credentials
- Make sure you selected the provider during installation

### Email/password not working

- Currently in demo mode - implement database auth (see above)

### Import errors after installation

- StackPatch automatically detects your path aliases from `tsconfig.json`
- If imports are incorrect, check your `tsconfig.json` paths configuration
- The CLI uses your existing alias patterns (e.g., `@/*` → `./*` or `./src/*`)

### Revert not working

- Make sure you're in the directory where you ran `stackpatch add`
- Check that `.stackpatch/manifest.json` exists
- The manifest tracks all changes for safe reversion

## 📚 Project Structure

### Standard Structure (`app/` at root)

```
your-project/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx      # Signup page
│   └── api/
│       └── auth/
│           └── [...all]/route.ts  # Better Auth API route
├── lib/
│   ├── auth.ts                  # Better Auth configuration
│   ├── auth-client.ts           # Client-side auth utilities
│   └── protected-routes.ts     # Protected routes configuration
├── components/
│   ├── auth-wrapper.tsx         # Automatic route protection wrapper
│   └── toaster.tsx             # Toast notifications
├── middleware.ts                # Route protection middleware
├── .env.local                   # Your environment variables
└── .stackpatch/                 # Tracking for revert (git-ignored)
    ├── manifest.json            # Tracks all changes
    └── backups/                 # Original file backups
```

### With `src/` Directory (`src/app/`)

```
your-project/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── api/
│   │       └── auth/
│   │           └── [...all]/route.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   └── protected-routes.ts
│   └── components/
│       ├── auth-wrapper.tsx
│       └── toaster.tsx
├── middleware.ts
├── .env.local
└── .stackpatch/
    ├── manifest.json
    └── backups/
```

StackPatch automatically detects and uses the correct structure!

## 🔄 Reverting Changes

If you want to undo a StackPatch installation:

```bash
npx stackpatch@latest revert
```

This command will:
1. Show you what was installed (patch name, timestamp)
2. Ask for confirmation
3. Remove all files that were added
4. Restore all files that were modified to their original state
5. Clean up the `.stackpatch` directory

> **Important**: The revert command uses the manifest file (`.stackpatch/manifest.json`) to track changes. If you delete this file, you'll need to manually remove files.

## 🧠 Smart Features

### Automatic Directory Detection

StackPatch automatically detects your project structure:
- ✅ Detects `app/` vs `src/app/`
- ✅ Places components in matching location (`components/` vs `src/components/`)
- ✅ Works with both App Router and Pages Router structures

### Path Alias Detection

StackPatch reads your `tsconfig.json` to detect path aliases:
- ✅ Uses your existing aliases (e.g., `@/*` → `./*` or `./src/*`)
- ✅ Generates correct import paths automatically
- ✅ Falls back to relative paths if no aliases are found
- ✅ Never hardcodes paths like `../../`

### Change Tracking

Every installation is tracked:
- ✅ All added files are recorded
- ✅ All modified files are backed up before changes
- ✅ Manifest file stores installation metadata
- ✅ Safe reversion with `npx stackpatch@latest revert`

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## 📄 License

ISC
