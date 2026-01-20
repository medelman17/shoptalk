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
| **AI Framework** | Mastra | Agent framework with RAG support |
| **Hosting** | Vercel | Edge functions, serverless compute |
| **Authentication**| Clerk | Magic link authentication |
| **User Database** | Supabase | Managed Postgres for user profiles and query history |
| **Vector DB** | Pinecone | For similarity search on contract embeddings (3072 dimensions) |
| **Embeddings** | Vercel AI Gateway | Routes to `openai/text-embedding-3-large` |
| **LLM** | Anthropic | `Claude` via Vercel AI Gateway |
| **File Storage**| Vercel Blob | For storing and serving PDF contract documents |
| **PDF Viewer** | react-pdf | For client-side PDF rendering |

### RAG Pipeline (Implemented)

The document ingestion and retrieval pipeline is fully operational:

| Component | Technology | Location |
|---|---|---|
| PDF Extraction | pdf-parse | `src/lib/documents/extract.ts` |
| Document Manifest | TypeScript config | `src/lib/documents/manifest.ts` |
| Chunking | Mastra MDocument | `src/lib/rag/processor.ts` |
| Vector Store | Mastra PineconeVector | `src/lib/rag/vector-store.ts` |
| Embeddings | Vercel AI Gateway | `gateway.embeddingModel()` |
| Query Tool | Mastra createVectorQueryTool | `src/lib/rag/tools.ts` |

**Current Index Statistics:**
- Documents: 30 UPS Teamster contract PDFs
- Vectors: 4,002 chunks
- Embedding Model: `openai/text-embedding-3-large` (3072 dimensions)
- Index Name: `shoptalk-contracts`

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

### Document Ingestion Commands

The RAG pipeline includes a CLI for managing contract document ingestion:

*   **List available documents:**
    ```bash
    pnpm tsx scripts/ingest-contracts.ts --list
    ```

*   **Setup Pinecone index:**
    ```bash
    pnpm tsx scripts/ingest-contracts.ts --setup
    ```

*   **Ingest all documents:**
    ```bash
    pnpm tsx scripts/ingest-contracts.ts
    ```

*   **Ingest a single document:**
    ```bash
    pnpm tsx scripts/ingest-contracts.ts --id master
    ```

*   **Show index statistics:**
    ```bash
    pnpm tsx scripts/ingest-contracts.ts --stats
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint for code linting. Adhere to the existing rules and formatting.
*   **File Structure:** The project follows the Next.js App Router conventions. A detailed structure is outlined in the `docs/mvp-prd-contract-retrieval-web.md` file.
*   **Components:** Reusable UI components are located in `src/components/ui`. Feature-specific components are in `src/components/<feature-name>`.
*   **Database Access:** All database interactions are handled through functions defined in `src/lib/db/queries.ts`. This centralizes data access logic and promotes reuse.
*   **Type Safety:** The project uses TypeScript in strict mode. Ensure all new code is strongly typed. Database types are generated, not written manually.
*   **State Management:** State is primarily managed using React server components and client component state. There is no global state management library.
*   **Path Aliases:** The project uses the alias `@/*` to refer to the `src/` directory for cleaner import paths.

<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_workflow_overview()` tool to load the tool-oriented overview (it lists the matching guide tools).

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and completion
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->
