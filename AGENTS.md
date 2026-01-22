# AGENTS.md - AI Coding Agent Guidelines

## Project Overview

Next.js 16 Todo application with React 19, TypeScript, Tailwind CSS 4, and Clerk authentication.
File-based JSON storage persists user data in the `data/` directory.

## Build, Lint, and Test Commands

```bash
# Development
npm run dev          # Start dev server (Turbopack)

# Build & Production
npm run build        # Production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Type check without emitting
```

**Note:** No test framework is currently configured. If adding tests, use Vitest or Jest.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (RESTful)
│   │   └── todos/         # Nested CRUD endpoints
│   ├── dashboard/         # Protected dashboard page
│   ├── sign-in/           # Clerk auth pages
│   ├── sign-up/
│   ├── layout.tsx         # Root layout with ClerkProvider
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   └── storage.ts         # File-based JSON storage
├── types/                 # TypeScript type definitions
│   └── todo.ts            # Domain types
└── middleware.ts          # Clerk auth middleware
```

## Code Style Guidelines

### Imports

Order imports as follows:
1. External libraries (next, react, @clerk)
2. Internal modules using `@/*` path alias
3. Relative imports (./components)

```typescript
// External
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Internal (use @/* alias)
import { getUserTodos, saveUserTodos } from "@/lib/storage";
import { Todo } from "@/types/todo";

// Relative
import TodoCard from "./TodoCard";
```

### TypeScript

- **Strict mode is enabled** - no implicit any, strict null checks
- Use `interface` for object shapes, especially props
- Name prop interfaces with `Props` suffix: `TodoCardProps`
- Use `type` imports for type-only imports: `import type { Metadata }`
- Route params are Promise-based in Next.js 16:
  ```typescript
  interface RouteParams {
    params: Promise<{ todoId: string }>;
  }
  ```

### Components

- Add `"use client"` directive for client components (interactivity, hooks)
- Use **default exports** for page and component files
- **PascalCase** for component names matching the filename
- Define props interface above the component:

```typescript
"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";

interface TodoCardProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoCard({ todo, onUpdate }: TodoCardProps) {
  // Component logic
}
```

### API Routes

- Follow RESTful conventions with App Router pattern
- Always authenticate first using `await auth()`
- Return `NextResponse.json()` with appropriate status codes
- Await dynamic params: `const { todoId } = await params;`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TodoCard`, `Subtask` |
| Functions | camelCase | `handleAddTask`, `fetchTodos` |
| Variables | camelCase | `newTodo`, `isEditing` |
| Types/Interfaces | PascalCase | `Todo`, `TaskProps` |
| Files (components) | PascalCase | `TodoCard.tsx` |
| Files (utilities) | camelCase | `storage.ts` |
| CSS variables | kebab-case | `--font-geist-sans` |

### Error Handling

API routes return JSON error objects with appropriate HTTP status codes:
- `400` - Bad Request (validation errors): `{ error: "Title is required" }`
- `401` - Unauthorized: `{ error: "Unauthorized" }`
- `404` - Not Found: `{ error: "Todo not found" }`

### Styling

- Use **Tailwind CSS** utility classes exclusively
- Dynamic classes with template literals
- Color palette: slate for neutrals, purple/pink for accents
- Use responsive prefixes: `sm:`, `md:`, `lg:`

### State Management

- Use React hooks: `useState`, `useEffect`
- Lift state up - parent manages data, passes callbacks to children
- Use `onUpdate` callback pattern for child-to-parent communication
- Async handlers follow pattern: `handleVerbNoun` (e.g., `handleAddTask`)

## Authentication

- Middleware protects routes (see `src/middleware.ts`)
- Public routes: `/`, `/sign-in(.*)`, `/sign-up(.*)`
- Use `auth()` from `@clerk/nextjs/server` in API routes
- Use `<UserButton />` from `@clerk/nextjs` in client components

## Data Layer

File-based JSON storage in `src/lib/storage.ts`:
- Data stored in `data/{userId}.json`
- Use `generateId()` for new entities
- Use `getTimestamp()` for createdAt/updatedAt
- Always call `saveUserTodos()` after mutations

## Key Dependencies

- `next@16.1.1` - Framework
- `react@19.2.3` - UI library
- `@clerk/nextjs@^6` - Authentication
- `tailwindcss@^4` - Styling
- `typescript@^5` - Type safety
