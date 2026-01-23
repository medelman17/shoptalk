# ShopTalk - Codebase Structure

## Root Directory
```
/
├── src/                    # Application source code
├── data/                   # Data files
│   ├── contracts/          # Contract PDF files (30 documents)
│   └── eval/               # Evaluation dataset (Reddit Q&A)
├── docs/                   # Documentation
├── scripts/                # CLI scripts
├── supabase/               # Database configuration
│   ├── migrations/         # SQL migrations
│   └── seed.sql            # Test data for local dev
├── public/                 # Static assets
└── .serena/                # Serena configuration
```

## Source Directory (`src/`)

### App Router (`src/app/`)
```
app/
├── (authenticated)/        # Protected routes
│   ├── (app)/              # Routes with sidebar layout
│   │   ├── chat/           # Chat interface
│   │   │   ├── page.tsx    # New conversation (redirects)
│   │   │   └── [conversationId]/  # Conversation view
│   │   ├── pdf/[documentId]/  # Standalone PDF viewer
│   │   ├── history/        # Query history
│   │   └── settings/       # User settings
│   └── onboarding/         # User onboarding flow
├── (auth)/                 # Auth pages (Clerk)
│   ├── sign-in/
│   └── sign-up/
├── api/                    # API routes
│   ├── chat/               # Streaming chat endpoint
│   ├── conversations/      # Conversation CRUD
│   ├── pdf/[documentId]/   # PDF file serving
│   ├── queries/            # Query operations
│   └── webhooks/clerk/     # Clerk webhooks
├── offline/                # PWA offline page
├── globals.css             # Global styles
└── layout.tsx              # Root layout
```

### Components (`src/components/`)
```
components/
├── ui/                     # Reusable UI primitives (shadcn)
├── ai-elements/            # AI output (citations, messages)
├── chat/                   # Chat UI components
├── layout/                 # App shell (SplitViewContainer, AppHeader)
├── pdf/                    # PDF viewer components
├── sidebar/                # Sidebar navigation
├── history/                # Query history components
├── onboarding/             # Onboarding UI
└── pwa/                    # PWA install prompt
```

### Library (`src/lib/`)
```
lib/
├── auth.ts                 # Auth utilities
├── utils.ts                # General utilities (cn, etc.)
├── citations/              # Citation parsing and types
├── db/                     # Data access layer
├── documents/              # Document manifest
├── errors/                 # Error types and factories
├── pwa/                    # PWA utilities
├── rag/                    # RAG pipeline (processor, vector-store)
├── supabase/               # Supabase clients (client, server, admin)
├── union/                  # Local union data & supplement mapping
└── data/                   # Data utilities
```

### Mastra AI (`src/mastra/`)
```
mastra/
├── index.ts                # Mastra configuration
├── agents/
│   ├── contract-agent.ts   # Contract Q&A agent
│   └── weather-agent.ts    # Example weather agent
├── tools/
│   ├── contract-query.ts   # Contract search tool
│   └── weather-tool.ts     # Example weather tool
└── workflows/
    └── weather-workflow.ts # Example workflow
```

### Other Source Directories
```
src/
├── contexts/               # React contexts
│   └── pdf-panel-context.tsx  # PDF panel state (URL-synced)
├── hooks/                  # Custom React hooks
└── middleware.ts           # Route protection middleware
```

## Scripts (`scripts/`)
- `ingest-contracts.ts` - Document ingestion CLI
- `fetch-reddit-eval.ts` - Reddit eval dataset builder
- `validate-mappings.ts` - Contract mapping validation
- `lib/reddit/` - Reddit fetching utilities

## Key Files
- `CLAUDE.md` - Project instructions and conventions
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `next.config.ts` - Next.js configuration
