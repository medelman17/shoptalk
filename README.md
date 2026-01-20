# ShopTalk

AI-powered contract assistant for UPS Teamsters. Ask questions about your union contract and get accurate answers with citations.

## Features

- **Contract Q&A**: Ask questions about wages, benefits, working conditions, grievance procedures, and more
- **Smart Retrieval**: RAG-powered search across 30+ contract documents (4,000+ indexed chunks)
- **User Profiles**: Select your Local union and job classification to get personalized results
- **Citation Links**: Every answer includes page references to source documents

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| AI | Mastra AI Framework + Claude via Vercel AI Gateway |
| Vector DB | Pinecone (3072-dim embeddings) |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS v4 + shadcn/ui |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Vercel account (for AI Gateway)
- Pinecone account
- Clerk account
- Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/medelman17/shoptalk.git
cd shoptalk

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys
```

### Environment Variables

```bash
# Vercel AI Gateway
VERCEL_AI_GATEWAY_KEY=

# Pinecone Vector Database
PINECONE_API_KEY=
PINECONE_INDEX_NAME=shoptalk-contracts

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Document Ingestion

Contract PDFs are stored in `data/contracts/`. To ingest documents into Pinecone:

```bash
# Create the Pinecone index
pnpm tsx scripts/ingest-contracts.ts --setup

# Ingest all documents
pnpm tsx scripts/ingest-contracts.ts

# Check index statistics
pnpm tsx scripts/ingest-contracts.ts --stats
```

### Development

```bash
# Start dev server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Production build
pnpm build
```

## Architecture

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (ui/, ai-elements/)
├── lib/
│   ├── auth.ts       # Clerk utilities
│   ├── db/           # Database access layer
│   ├── documents/    # PDF extraction
│   ├── rag/          # RAG pipeline (processor, vector-store, tools)
│   ├── supabase/     # Supabase clients
│   └── union/        # Local union data & supplement mapping
├── mastra/           # AI agents, tools, workflows
└── middleware.ts     # Route protection

data/contracts/       # Contract PDF files
scripts/              # CLI tools (ingestion, etc.)
supabase/migrations/  # Database migrations
```

## Contract Documents

The system indexes 30 UPS Teamster contract documents:

- **National Master Agreement** - Applies to all workers
- **Regional Supplements** - Western, Central, Southern, Atlantic, Eastern, New England
- **Local Agreements** - Local 804, Local 243, NorCal, SoCal, etc.
- **Riders** - JC3, JC28, JC37, SW Package, etc.
- **Specialty** - Automotive, Cartage, Trailer Conditioners

## License

Private - All rights reserved.
