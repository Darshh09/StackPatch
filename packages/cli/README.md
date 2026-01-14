# StackPatch CLI

> Composable frontend features for modern React & Next.js apps - Add authentication, UI components, and more with zero configuration.

[![npm version](https://img.shields.io/npm/v/stackpatch.svg)](https://www.npmjs.com/package/stackpatch)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

StackPatch is a CLI tool that helps you quickly add production-ready features to your Next.js applications. No more copy-pasting boilerplate code or configuring complex setups - just run a command and you're done.

## ✨ Features

- 🚀 **Zero Configuration** - Add features with a single command
- 🔐 **Authentication** - Full NextAuth.js setup with customizable OAuth providers
- 🛡️ **Protected Routes** - Easy route protection with components or middleware
- 🎨 **UI Components** - Pre-built, production-ready components
- 📦 **Composable** - Add only what you need, when you need it
- ⚡ **Fast** - Built with Bun for lightning-fast execution
- 🛡️ **Type-Safe** - Full TypeScript support
- 🧠 **Smart Detection** - Automatically detects `app/` vs `src/app/` and places files correctly
- 🔄 **Revert Support** - Safely revert any installation with `npx stackpatch revert`
- 🎯 **Path Alias Aware** - Automatically uses your `tsconfig.json` path aliases for imports
- 🔧 **Provider Selection** - Choose which OAuth providers to configure (Google, GitHub, Email/Password)

## 📋 Prerequisites

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh))
- **Node.js** >= 18.0.0 (for npm/npx)
- A Next.js project (App Router)

## 🚀 Quick Start

### Install

```bash
npm install -g stackpatch
# or
bun add -g stackpatch
```

### Create a New Project

```bash
# Using npm create (recommended - works with create-stackpatch bin)
npm create stackpatch@latest my-app

# Using npx (recommended alternative)
npx create-stackpatch@latest my-app
# or
npx stackpatch create my-app

# Using bunx (Bun's npx equivalent)
bunx create-stackpatch@latest my-app
# or
bunx stackpatch create my-app
```

> **Note:**
> - `bun create stackpatch@latest` won't work because Bun's `create` command looks for packages named `create-*` in npm. Use `bunx` instead.
> - `npm create stackpatch` works because it uses the `create-stackpatch` binary from the `stackpatch` package.
> - All commands will prompt you for a project name if not provided.

### Add Features to Existing Project

Navigate to your Next.js project directory and run:

```bash
# Add authentication with UI
npx stackpatch add auth
# or
npx stackpatch add auth-ui
```

> **Note:** Both `auth` and `auth-ui` commands are identical - they add the complete authentication setup.

### Revert an Installation

If you want to undo a StackPatch installation:

```bash
npx stackpatch revert
```

This will:
- Remove all files added by StackPatch
- Restore modified files to their original state
- Clean up the `.stackpatch` tracking directory

> **Note:** The revert command only works if you're in the directory where you ran `stackpatch add`. It uses a manifest file (`.stackpatch/manifest.json`) to track changes.

## 📖 What Gets Added

### Authentication Setup

When you run `npx stackpatch add auth`, StackPatch:

1. **Asks which OAuth providers** you want to configure:
   - Google OAuth
   - GitHub OAuth
   - Email/Password (Credentials)

2. **Adds the following files**:
   - ✅ NextAuth.js configuration with your selected providers
- ✅ Login and signup pages (`/auth/login`, `/auth/signup`)
   - ✅ OAuth buttons for selected providers with email/password forms
   - ✅ Protected route component (`components/protected-route.tsx` or `src/components/protected-route.tsx`)
- ✅ Middleware for route protection (`middleware.ts`)
- ✅ Session provider and toaster components
- ✅ Environment file template (`.env.example`)

3. **Smart file placement**:
   - Detects if your app is in `app/` or `src/app/`
   - Places components in matching location (`components/` or `src/components/`)
   - Uses your `tsconfig.json` path aliases for imports
   - Generates correct import paths automatically

4. **Tracks all changes** in `.stackpatch/manifest.json` for safe reversion

## 🔐 OAuth Setup

When you run `npx stackpatch add auth`, you'll be prompted to select which OAuth providers you want to configure. StackPatch will only set up the providers you select.

### Google OAuth

If you selected Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials
3. Create OAuth client ID (Web application)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### GitHub OAuth

If you selected GitHub OAuth:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Secret
5. Add to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

### Environment Variables

Your `.env.local` will include only the variables for providers you selected:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Only included if you selected Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Only included if you selected GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🧭 Auth Navbar (Demo)

An example navbar component (`components/auth-navbar.tsx`) is included that shows:
- **When logged out**: Sign In button
- **When logged in**: User name/email, avatar, and Sign Out button

> **Note**: This is a demo component named `auth-navbar.tsx` to avoid conflicts with existing navbars. You can rename it or use it as reference.

### Usage

```tsx
// app/layout.tsx or any page
import { AuthNavbar } from "@/components/auth-navbar";

export default function Layout({ children }) {
  return (
    <>
      <AuthNavbar />
      {children}
    </>
  );
}
```

The auth navbar is included in example pages (`app/page.tsx` and `app/dashboard/page.tsx`) as a reference.

## 🛡️ Protecting Routes

### Method 1: Component-Based (Recommended)

Wrap any page or component:

```tsx
// app/dashboard/page.tsx
import { ProtectedRoute } from "@/components/protected-route";
import { AuthNavbar } from "@/components/auth-navbar";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <AuthNavbar />
      <h1>Protected Dashboard</h1>
    </ProtectedRoute>
  );
}
```

### Method 2: Middleware-Based

Edit `middleware.ts` and add routes to protect:

```ts
// middleware.ts
export const config = {
  matcher: [
    "/dashboard/:path*",  // Protect all dashboard routes
    "/profile/:path*",    // Protect all profile routes
  ],
};
```

## ⚠️ Email/Password Auth (Demo Mode)

The email/password authentication is in **demo mode** with placeholder credentials:

- **Demo credentials**: `demo@example.com` / `demo123`

### To Implement Real Auth:

1. **Set up a database** (PostgreSQL, MongoDB, Prisma, etc.)
2. **Install bcrypt**: `npm install bcryptjs @types/bcryptjs`
3. **Update `app/api/auth/[...nextauth]/route.ts`**:
   - Replace the `authorize` function with database lookup
   - Hash and compare passwords using bcrypt
4. **Create signup API** (`app/api/auth/signup/route.ts`):
   - Hash passwords before storing
   - Validate and create users in database

See code comments in the files for detailed implementation examples.

## 📁 File Locations

After running `npx stackpatch add auth`, you'll find files in locations that match your project structure:

### If your app is in `app/`:
- **Auth pages**: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- **NextAuth config**: `app/api/auth/[...nextauth]/route.ts`
- **Components**: `components/auth-navbar.tsx`, `components/protected-route.tsx`, etc.
- **Middleware**: `middleware.ts` (root)
- **Environment**: `.env.example`, `.env.local`
- **Tracking**: `.stackpatch/manifest.json` (for revert)

### If your app is in `src/app/`:
- **Auth pages**: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`
- **NextAuth config**: `src/app/api/auth/[...nextauth]/route.ts`
- **Components**: `src/components/auth-navbar.tsx`, `src/components/protected-route.tsx`, etc.
- **Middleware**: `middleware.ts` (root)
- **Environment**: `.env.example`, `.env.local`
- **Tracking**: `.stackpatch/manifest.json` (for revert)

StackPatch automatically detects your project structure and places files accordingly. It also:
- Uses your `tsconfig.json` path aliases (e.g., `@/components`) for imports
- Generates correct relative paths if no aliases are found
- Never hardcodes paths like `../../` - always uses smart detection

## 🔧 Customization

### Change Login Redirect

Edit `app/api/auth/[...nextauth]/route.ts`:

```ts
pages: {
  signIn: "/your-custom-login", // Change this
}
```

### Custom Protected Route Redirect

```tsx
<ProtectedRoute redirectTo="/custom-login">
  <YourComponent />
</ProtectedRoute>
```

### Protect API Routes

```ts
// app/api/protected/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ data: "Protected data" });
}
```

## 🐛 Troubleshooting

### OAuth redirect_uri_mismatch

- Ensure redirect URIs match exactly in OAuth provider settings
- Check `NEXTAUTH_URL` matches your app URL

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
│           └── [...nextauth]/route.ts  # NextAuth config
├── components/
│   ├── protected-route.tsx      # Route protection component
│   ├── auth-button.tsx          # Auth button component
│   └── session-provider.tsx    # Session provider
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
│   │           └── [...nextauth]/route.ts
│   └── components/
│       ├── protected-route.tsx
│       ├── auth-button.tsx
│       └── session-provider.tsx
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
npx stackpatch revert
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
- ✅ Safe reversion with `npx stackpatch revert`

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## 📄 License

ISC
