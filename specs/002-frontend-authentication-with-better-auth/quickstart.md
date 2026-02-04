# Quickstart Guide: Frontend Authentication with Better Auth

## Prerequisites
- Node.js 18+
- npm or yarn
- Next.js 14 project with App Router

## Installation

1. Install Better Auth and related dependencies:
```bash
npm install better-auth @better-fetch/fetch
```

2. Set up environment variables:
```bash
# .env.local
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-long-enough
```

## Configuration

1. Create the Better Auth API route at `app/api/auth/[...better-auth]/route.ts`:
```typescript
import { BetterAuthOptions, betterAuth } from "better-auth";
import { nextjs } from "better-auth/adapter-nextjs";

const authOptions: BetterAuthOptions = {
  plugins: [nextjs()],
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    // Add social providers if needed
  },
  session: {
    expiresIn: 24 * 60 * 60, // 24 hours
    rememberMeExpire: 7 * 24 * 60 * 60, // 7 days
  },
  account: {
    accountModel: {
      additionalFields: {
        name: {
          type: "string",
          required: true,
        },
        username: {
          type: "string",
          required: true,
        },
      },
    },
  },
};

export const auth = betterAuth(authOptions);

export {
  GET,
  POST,
} from "better-auth/next-js";
```

2. Initialize auth client in your application:
```typescript
// lib/auth.ts
import { auth } from "../app/api/auth/[...better-auth]/route";

export const { signIn, signUp, getSession, signOut } = auth;
```

## Creating Login and Register Pages

1. Create login page at `app/login/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("email-password", {
        email,
        password,
        options: {
          rememberMe,
        },
      });

      if (!result?.error) {
        router.push("/tasks");
        router.refresh();
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="remember-me" className="text-sm">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

2. Create register page at `app/register/page.tsx` (similar pattern with form fields for name, username, email, and password)

## Protecting Routes

Create a protected route component at `components/auth/ProtectedRoute.tsx`:
```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "better-auth/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Environment Variables

Required:
- `BETTER_AUTH_SECRET`: Secret key for JWT signing (min 32 characters)
- `DATABASE_URL`: Database connection string for storing user data

Optional:
- `BETTER_AUTH_URL`: Base URL for the auth API (defaults to NEXT_PUBLIC_BASE_URL)