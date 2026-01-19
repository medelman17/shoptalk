---
name: nextjs-app-router
description: Next.js 16 App Router patterns and best practices. Auto-applies when creating pages, layouts, API routes, server components, or working with Next.js routing, data fetching, and caching.
---

# Next.js App Router Patterns

## Directory Structure

```
src/app/
├── layout.tsx        # Root layout (required)
├── page.tsx          # Home page
├── globals.css       # Global styles
├── api/              # API routes
│   └── [route]/
│       └── route.ts
└── [feature]/        # Feature routes
    ├── page.tsx
    └── layout.tsx
```

## Server vs Client Components

### Default: Server Components
```tsx
// This is a Server Component by default
export default function Page() {
  // Can use async/await directly
  // Can access server-only resources
  // Cannot use hooks or browser APIs
  return <div>Server rendered</div>;
}
```

### Client Components (when needed)
```tsx
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [state, setState] = useState(false);
  // Can use hooks, event handlers, browser APIs
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

### When to Use Client Components
- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, useContext)
- Browser-only APIs (localStorage, window)
- Third-party libraries that use hooks

## Data Fetching

### Server Component Fetching (Preferred)
```tsx
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache", // Default: cached
    // cache: "no-store", // Always fresh
    // next: { revalidate: 60 }, // Revalidate every 60s
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Client-side Fetching (when needed)
```tsx
"use client";

import useSWR from "swr";

export default function ClientPage() {
  const { data, error, isLoading } = useSWR("/api/data", fetcher);
  // ...
}
```

## API Routes

### Route Handler Pattern
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello" });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Dynamic Route Parameters
```typescript
// src/app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ userId: id });
}
```

## Layouts and Templates

### Root Layout (required)
```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Nested Layouts
```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Loading and Error States

### Loading UI
```tsx
// src/app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Error Handling
```tsx
"use client";

// src/app/dashboard/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Metadata

### Static Metadata
```tsx
export const metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Dynamic Metadata
```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return { title: product.name };
}
```

## Best Practices

1. **Default to Server Components** - Only use "use client" when necessary
2. **Colocate related files** - Keep components, tests, styles together
3. **Use route groups** - `(group)` folders for organization without URL impact
4. **Parallel routes** - `@slot` for simultaneous route rendering
5. **Intercepting routes** - `(.)`, `(..)` for modals and overlays
