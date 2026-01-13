# StackPatch CLI

> Composable frontend features for modern React & Next.js apps - Add authentication, UI components, and more with zero configuration.

[![npm version](https://img.shields.io/npm/v/stackpatch.svg)](https://www.npmjs.com/package/stackpatch)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

StackPatch is a CLI tool that helps you quickly add production-ready features to your Next.js applications. No more copy-pasting boilerplate code or configuring complex setups - just run a command and you're done.

## ✨ Features

- 🚀 **Zero Configuration** - Add features with a single command
- 🔐 **Authentication** - Full NextAuth.js setup with Google, GitHub, and email/password
- 🛡️ **Protected Routes** - Easy route protection with components or middleware
- 🎨 **UI Components** - Pre-built, production-ready components
- 📦 **Composable** - Add only what you need, when you need it
- ⚡ **Fast** - Built with Bun for lightning-fast execution
- 🛡️ **Type-Safe** - Full TypeScript support

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

## 📖 What Gets Added

### Authentication Setup

When you run `npx stackpatch add auth`, StackPatch adds:

- ✅ NextAuth.js configuration with Google, GitHub, and email/password providers
- ✅ Login and signup pages (`/auth/login`, `/auth/signup`)
- ✅ OAuth buttons (Google & GitHub) with email/password forms
- ✅ Protected route component (`components/protected-route.tsx`)
- ✅ Middleware for route protection (`middleware.ts`)
- ✅ Session provider and toaster components
- ✅ Environment file template (`.env.example`)

## 🔐 OAuth Setup

### Google OAuth

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

Your `.env.local` should include:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

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

After running `npx stackpatch add auth`, you'll find:

- **Auth pages**: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- **NextAuth config**: `app/api/auth/[...nextauth]/route.ts`
- **Components**:
  - `components/auth-navbar.tsx` - Example navbar with session and sign out (demo)
  - `components/protected-route.tsx` - Route protection component
  - `components/auth-button.tsx` - Auth button component
- **Example pages**:
  - `app/page.tsx` - Landing page with navbar
  - `app/dashboard/page.tsx` - Protected dashboard example
- **Middleware**: `middleware.ts` (root)
- **Environment**: `.env.example`, `.env.local`

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

### Email/password not working

- Currently in demo mode - implement database auth (see above)

## 📚 Project Structure

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
└── .env.local                   # Your environment variables
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## 📄 License

ISC
