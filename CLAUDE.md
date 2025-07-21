# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linting
npm run lint
```

### Package Management
This project uses npm (based on package-lock.json). Use `npm install` to install dependencies.

## Architecture Overview

This is a **Next.js 15.2.4** application for EcoGrad - a marketplace platform for buying and selling graduation regalia. The application uses:

- **Frontend Framework**: Next.js with App Router (React 19)
- **Styling**: Tailwind CSS with Comic Sans MS font theme
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Form Handling**: react-hook-form with Zod validation
- **State Management**: localStorage for authentication and post data
- **Type Safety**: TypeScript with strict mode enabled

## Key Application Routes

- `/` - Home page with buy/sell options
- `/auth` - Login/signup page (mock authentication)
- `/buy` - Marketplace listing page with filtering
- `/buy/[id]` - Individual product detail page
- `/my-posts` - User's posted items management
- `/create-post` - Form to create new listings
- `/edit-post/[id]` - Edit existing listings

## Data Storage Pattern

The application uses localStorage as a mock database:
- **Authentication**: `isLoggedIn` and `userEmail` keys
- **Posts**: `userPosts` key stores array of post objects with structure:
  ```typescript
  {
    id: string,
    title: string,
    price: number,
    size: string,
    condition: string,
    image?: string,
    status: "active" | "sold"
  }
  ```

## Component Structure

- All pages use client-side rendering (`"use client"`)
- Common header pattern with green theme (#16a34a)
- ProfileDropdown component for user account management
- Extensive use of shadcn/ui components in `/components/ui/`

## Build Configuration Notes

The `next.config.mjs` has ESLint and TypeScript errors disabled for production builds:
```javascript
eslint: { ignoreDuringBuilds: true }
typescript: { ignoreBuildErrors: true }
```

Consider enabling these checks when the codebase is more stable.

## Testing

No test framework is currently configured. When adding tests, you'll need to set up a testing framework like Jest or Vitest.