# GEMINI.md

This file provides a comprehensive overview of the ShopTalk project for future interactions with the Gemini CLI.

## Project Overview

**ShopTalk** is an AI-powered, mobile-first progressive web application (PWA) designed to help UPS Teamster workers quickly and accurately find information within their union contracts. The project aims to replace an existing, poorly-rated application by providing a frictionless, reliable, and user-friendly experience.

The core functionality revolves around a conversational AI assistant that allows users to ask natural language questions about their contracts. The assistant provides answers with direct citations and links to the source PDF documents.

### Key Features

*   **User Profile Management:** Users create profiles by specifying their local union number and job classification. This information is used to scope contract queries to the relevant documents.
*   **Natural Language Queries:** A simple interface allows users to ask questions in plain English.
*   **Cited AI Responses:** The AI assistant, powered by Anthropic's Claude, generates answers grounded in the contract text and provides citations for every factual claim.
*   **Source Document Viewer:** Users can tap on a citation to view the exact page and passage in the source PDF document.
*   **Frictionless Authentication:** The application uses passwordless, magic link authentication via Clerk to eliminate common login issues.
*   **Progressive Web App (PWA):** Built for the web with mobile-first principles, it can be installed on a user's home screen for easy access.

## Architecture and Technology

The project is a modern full-stack application built on the Vercel and Next.js ecosystem.

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    (Mobile Safari / Chrome)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js React 19 Application               │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │  App      │  │  Query    │  │  PDF Viewer       │   │   │
│  │  │  Shell    │  │  Interface│  │  (react-pdf)      │   │   │
│  │  └───────────┘  └───────────┘  └───────────────────┘   │   │
│  │                                                         │   │
│  │  Service Worker (offline shell, asset caching)          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Edge Middleware                       │   │
│  │            (Auth validation, rate limiting)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js Server (Node.js Runtime)            │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │   │
│  │  │ API Routes │  │ Server     │  │ Server Actions  │    │   │
│  │  └────────────┘  └────────────┘  └─────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │   Vector    │     │   User DB   │     │  Document   │
   │   Database  │     │             │     │  Storage    │
   │             │     │  Supabase   │     │             │
   │  Pinecone   │     │  Postgres   │     │  Vercel     │
   │             │     │             │     │  Blob       │
   └─────────────┘     └─────────────┘     └─────────────┘
          │                   │
          │                   │
          ▼                   │
   ┌─────────────┐            │
   │   LLM API   │            │
   │             │            │
   │  Anthropic  │◄───────────┘
   │  Claude API │   (context: user profile, retrieved chunks)
   └─────────────┘
```

### Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js | v16 (App Router) |
| **UI Library** | React | v19 |
| **Language** | TypeScript | v5 (Strict Mode) |
| **Styling** | Tailwind CSS | v4 |
| **UI Components** | shadcn/ui | Accessible component primitives |
| **Hosting** | Vercel | Edge functions, serverless compute |
| **Authentication**| Clerk | Magic link authentication |
| **User Database** | Supabase | Managed Postgres for user profiles and query history |
| **Vector DB** | Pinecone | For similarity search on contract embeddings |
| **Embeddings** | OpenAI | `text-embedding-3-large` for creating vector embeddings |
| **LLM** | Anthropic | `Claude 3.5 Sonnet` for response generation |
| **File Storage**| Vercel Blob | For storing and serving PDF contract documents |
| **PDF Viewer** | react-pdf | For client-side PDF rendering |

## Building and Running

### Prerequisites

*   Node.js (v20+)
*   pnpm
*   Supabase CLI
*   Environment variables (see `.env.local.example` or `docs/ENVIRONMENT.md`)

### Key Commands

The following commands are defined in `package.json`:

*   **Run development server:**
    ```bash
    pnpm dev
    ```
    This starts the Next.js application on `http://localhost:3000`.

*   **Build for production:**
    ```bash
    pnpm build
    ```

*   **Run production server:**
    ```bash
    pnpm start
    ```

*   **Linting and Type-Checking:**
    ```bash
    pnpm lint
    pnpm type-check
    ```

### Supabase Database Commands

The project uses Supabase for the user database. The local development environment is managed via the Supabase CLI.

*   **Start local Supabase services:**
    ```bash
    supabase start
    ```

*   **Generate database types:**
    ```bash
    pnpm db:generate-types
    ```
    This command introspects the database schema and generates TypeScript types, saving them to `src/lib/supabase/database.types.ts`.

*   **Manage database migrations:**
    ```bash
    pnpm db:migrate  # Create a new migration
    pnpm db:push     # Apply local migrations to the local database
    pnpm db:pull     # Pull remote migrations to the local setup
    pnpm db:reset    # Reset the local database and apply migrations + seed data
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint for code linting. Adhere to the existing rules and formatting.
*   **File Structure:** The project follows the Next.js App Router conventions. A detailed structure is outlined in the `docs/mvp-prd-contract-retrieval-web.md` file.
*   **Components:** Reusable UI components are located in `src/components/ui`. Feature-specific components are in `src/components/<feature-name>`.
*   **Database Access:** All database interactions are handled through functions defined in `src/lib/db/queries.ts`. This centralizes data access logic and promotes reuse.
*   **Type Safety:** The project uses TypeScript in strict mode. Ensure all new code is strongly typed. Database types are generated, not written manually.
*   **State Management:** State is primarily managed using React server components and client component state. There is no global state management library.
*   **Path Aliases:** The project uses the alias `@/*` to refer to the `src/` directory for cleaner import paths.
