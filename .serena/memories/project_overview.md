# ShopTalk - Project Overview

## Purpose
ShopTalk is an AI-powered contract retrieval application that helps UPS Teamsters understand their union contracts. It provides a conversational interface for asking questions about contracts, with citations to specific contract sections.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS v4** - Styling with CSS variables for theming
- **shadcn/ui** - UI component library (Radix UI primitives)
- **class-variance-authority (cva)** - Component variant patterns
- **react-pdf** - PDF viewing capabilities
- **react-resizable-panels** - Split-view layout

### Backend
- **Next.js API Routes** - Server endpoints
- **Mastra AI Framework** - Agent orchestration (beta)
- **AI SDK v6** - Streaming chat with `useChat` hook

### AI/ML
- **Claude AI (Anthropic)** - Primary LLM via Vercel AI Gateway
- **Pinecone** - Vector database for RAG
- **Vercel AI Gateway** - Routes to AI providers for embeddings & LLM

### Authentication
- **Clerk** - User authentication and management

### Database
- **Supabase (PostgreSQL)** - Primary database
- **Mastra Memory** - Conversation persistence via PostgreSQL

### Key Dependencies
- `ai` v6.x - Vercel AI SDK for streaming
- `@mastra/*` - Mastra framework packages (beta)
- `@clerk/nextjs` - Clerk authentication
- `@supabase/supabase-js` - Database client
- `@pinecone-database/pinecone` - Vector search
- `zod` - Schema validation

## Package Manager
- **pnpm** - Package manager (uses pnpm-lock.yaml)
