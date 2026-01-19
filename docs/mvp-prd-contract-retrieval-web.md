# MVP Product Requirements Document: UPS Teamster Contract Assistant

## Mobile-First Web Application

**Document Status:** MVP Specification for Development  
**Target Platform:** Progressive Web App (Next.js 16 / React 19)  
**Hosting:** Vercel  
**Target Timeline:** 6-8 weeks to production deployment  
**Strategic Context:** Trust-building application preceding community chat platform

---

## Executive Summary: Platform Decision

This document specifies a **mobile-first progressive web application** rather than native iOS/Android apps. This decision optimizes for:

1. **Speed to market** — No App Store review cycles; deploy on merge
2. **Distribution simplicity** — Share a URL; workers text links to each other
3. **Iteration velocity** — Ship fixes and improvements same-day
4. **Stack alignment** — Next.js + Vercel represents best-in-class web DX
5. **Risk elimination** — No App Store rejection or removal risk

Trade-offs accepted:
- Less prominent home screen presence (requires user action to install PWA)
- iOS push notifications require PWA installation (acceptable for MVP; users pull information on-demand)
- Some users perceive native apps as more legitimate (mitigated by incumbent's 2.1-star rating setting low bar)

Native apps remain an option for v2+ if adoption metrics indicate App Store presence is necessary.

---

## Strategic Intent

This MVP establishes credibility with UPS Teamster workers by solving a concrete, immediate problem: finding contract language quickly and accurately. Success is measured by displacing the incumbent UPS Teamsters application (2.1/5 stars) on three documented failure modes: authentication that works, updates that don't break the app, and search that actually returns relevant results.

The web-first approach amplifies our competitive advantage: while the incumbent suffers from broken update mechanisms that require full app reinstalls, our users receive improvements automatically on every page load.

This application serves as the foundation for a subsequent peer-to-peer communication platform. User profile data captured here (Local union number, job classification, supplement chain) will power chat room organization and peer discovery in v2.

---

## MVP Scope Definition

### In Scope

- User profile capture (Local union number, job classification)
- Automatic supplement/rider chain determination from Local number
- Natural language contract queries with scoped retrieval
- Cited responses with article/section/page references
- Source document viewing (tap-through to PDF context)
- Magic link authentication (phone or email)
- Progressive Web App configuration (installable, basic offline shell)
- Mobile-first responsive design (320px–428px primary target)
- Vercel deployment with edge functions

### Explicitly Deferred to v2+

| Feature | Rationale for Deferral |
|---------|------------------------|
| Native iOS/Android apps | Validate product-market fit on web first; wrap or build native if metrics warrant |
| Offline document caching | Service worker complexity; cellular coverage sufficient for initial validation |
| Voice input | Valuable but not required to beat incumbent; Web Speech API available when ready |
| Cross-encoder reranking | 200-500ms latency cost; basic retrieval sufficient for MVP accuracy bar |
| Graph-enhanced cross-references | Engineering complexity disproportionate to MVP goals |
| Confidence scoring with abstention | Requires tuning against real usage; ship and learn |
| Grievance templates and checklists | Feature expansion after core retrieval validated |
| Hierarchical parent-child chunking | Optimization; flat chunking acceptable for MVP |
| Full 44-document corpus | Start with 12-15 documents covering majority of users |
| Push notifications | Requires PWA installation on iOS; not critical for pull-based contract lookup |

---

## Functional Requirements

### FR-1: Authentication

**FR-1.1:** User provides phone number or email address  
**FR-1.2:** System sends magic link (no verification codes, no passwords)  
**FR-1.3:** Link tap authenticates and redirects to application  
**FR-1.4:** Session persists via HTTP-only secure cookies until explicit logout  
**FR-1.5:** No account lockout mechanisms that could strand users  
**FR-1.6:** Authentication state hydrates correctly on both server and client (no hydration mismatch)  
**FR-1.7:** Magic link works whether user clicks from same device/browser or different device

*Design rationale:* The incumbent app's authentication failures represent its most documented pain point. Users report multi-year lockouts. Our authentication must be essentially frictionless. Web-based auth has the advantage of no app-specific credential storage that can become corrupted.

*Implementation note:* Clerk's Next.js SDK handles magic link flows with built-in session management. The `/api/auth/callback` route processes the magic link token and establishes the session cookie.

### FR-2: User Profile Configuration

**FR-2.1:** Onboarding captures Local union number (validated against known Locals list)  
**FR-2.2:** Onboarding captures job classification from defined list:
- Package Car Driver (RPCD)
- Feeder Driver
- Part-Time Hub/Sort
- 22.3 Combination
- 22.4 Driver
- Air Driver
- Automotive/Mechanic
- Clerical
- Other (freeform)

**FR-2.3:** System determines applicable supplement/rider chain from Local number via lookup table  
**FR-2.4:** User can modify profile settings without re-authentication  
**FR-2.5:** Profile data structure supports future fields (hub, shift, seniority) without schema migration  
**FR-2.6:** Profile data persists server-side; no reliance on localStorage for critical state

*Data model note:* Design user schema with v2 chat requirements in mind. Include nullable fields for hub identifier, shift assignment, and seniority date that we don't collect in MVP but will need for chat room auto-assignment.

### FR-3: Contract Query Interface

**FR-3.1:** Single text input field for natural language queries  
**FR-3.2:** Query submission via button tap, keyboard submit, or Enter key  
**FR-3.3:** Loading state indication during retrieval (target <3 seconds)  
**FR-3.4:** Response display with clear visual hierarchy:
- Answer text (generated summary of relevant provisions)
- Inline citations (Article X, Section Y, Page Z)
- Tap targets for each citation linking to source view

**FR-3.5:** Query history accessible for repeat reference (persisted server-side, not just sessionStorage)  
**FR-3.6:** Clear mechanism to start new query  
**FR-3.7:** URL structure supports direct linking to queries (e.g., `/query/[id]`) for shareability  
**FR-3.8:** Form maintains state during navigation (no lost input on back button)

### FR-4: Response Generation

**FR-4.1:** All responses scoped to user's applicable document set (Master + their supplement chain)  
**FR-4.2:** Every factual claim includes inline citation to source document  
**FR-4.3:** Responses that cannot be grounded in retrieved documents return "I couldn't find specific contract language addressing this question. Consider consulting your steward for guidance."  
**FR-4.4:** All responses include footer disclaimer: "This is contract reference information, not legal advice. Consult your steward or Local union for guidance on specific situations."  
**FR-4.5:** Response length appropriate to query complexity (brief for simple lookups, detailed for nuanced questions)  
**FR-4.6:** Responses render Markdown formatting correctly (headers, lists, emphasis)

### FR-5: Source Document Access

**FR-5.1:** Citation tap opens source document view  
**FR-5.2:** Source view displays PDF rendered at cited page  
**FR-5.3:** Highlighted or indicated region showing cited passage (where technically feasible)  
**FR-5.4:** Navigation to view surrounding context (scroll, page forward/back)  
**FR-5.5:** Return path to query results (browser back button works correctly)  
**FR-5.6:** PDF loads progressively (don't block on full document download)  
**FR-5.7:** Fallback for browsers with poor PDF support (download link)

*Implementation options:*
- **Primary:** `react-pdf` with `pdfjs-dist` for in-app rendering with page control
- **Fallback:** Direct PDF URL with `#page=N` fragment for native browser rendering
- **Enhancement (post-MVP):** Server-rendered PDF page images for faster loading

### FR-6: Progressive Web App

**FR-6.1:** Valid Web App Manifest with:
- App name: "ShopTalk Contract Assistant"
- Short name: "ShopTalk"
- Theme color aligned with brand
- Icons at required sizes (192px, 512px minimum)
- Display mode: `standalone`
- Start URL: `/`

**FR-6.2:** Service worker providing:
- App shell caching (HTML, CSS, JS bundles)
- Offline fallback page ("You're offline. Contract queries require an internet connection.")
- No document caching in MVP (avoid stale contract data)

**FR-6.3:** iOS-specific meta tags:
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- Apple touch icons

**FR-6.4:** Install prompt strategy:
- Show custom install banner after 3rd query (demonstrates value first)
- Respect dismissal (don't re-prompt for 30 days)
- Track installation events for analytics

---

## Document Corpus: MVP Coverage

### Priority Documents (MVP Launch)

| Document | Coverage | Estimated User Coverage |
|----------|----------|------------------------|
| National Master Agreement | All users | 100% |
| Western Region Supplement | CA, OR, WA, NV, AZ, CO, UT, NM, WY, MT, ID, HI, AK | ~25% |
| Central Region Supplement | IL, IN, OH, MI, WI, MN, IA, MO, KS, NE, ND, SD | ~20% |
| Southern Region Supplement | TX, LA, AR, OK, MS, AL, TN, KY | ~15% |
| Atlantic Area Supplement | PA, NJ, DE, MD, VA, WV, DC | ~12% |
| Eastern Region Supplement | NY (outside 804), CT, MA, NH, VT, ME, RI | ~10% |
| Local 804 Agreement | NYC metropolitan | ~3% |
| Southwest Package Rider | Select Western locals | Subset of Western |
| Northern California Rider | Select Western locals | Subset of Western |

*Coverage estimate:* These 8-9 documents cover approximately 85% of UPS Teamsters nationally. Remaining supplements added based on user request volume post-launch.

### Document Processing Requirements

**DP-1:** PDF ingestion preserving text extraction quality  
**DP-2:** Chunking at section level (target 300-500 tokens per chunk)  
**DP-3:** Metadata captured per chunk:
- Document identifier
- Article number
- Section number  
- Subsection (if applicable)
- Page number in source PDF
- Effective date

**DP-4:** Local-to-document mapping table maintained as configuration (environment variable or database, not hardcoded)  
**DP-5:** Document update process defined for contract amendments  
**DP-6:** PDF files served from Vercel Blob Storage or equivalent CDN-backed storage

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    (Mobile Safari / Chrome)                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js React 19 Application               │   │
│  │                                                         │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │  App      │  │  Query    │  │  PDF Viewer       │   │   │
│  │  │  Shell    │  │  Interface│  │  (react-pdf)      │   │   │
│  │  └───────────┘  └───────────┘  └───────────────────┘   │   │
│  │                                                         │   │
│  │  Service Worker (offline shell, asset caching)          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Edge Middleware                       │   │
│  │            (Auth validation, rate limiting)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js Server (Node.js Runtime)            │   │
│  │                                                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │   │
│  │  │ API Routes │  │ Server     │  │ Server Actions  │    │   │
│  │  │ /api/*     │  │ Components │  │ (mutations)     │    │   │
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
   │  Claude API │   (context: user profile,
   │             │    retrieved chunks)
   └─────────────┘
```

### Technology Stack

| Layer | Technology | Version/Details | Rationale |
|-------|------------|-----------------|-----------|
| **Framework** | Next.js | 16.x (App Router) | Best-in-class React framework; edge-native |
| **React** | React | 19.x | Latest stable; Server Components, Actions |
| **Language** | TypeScript | 5.x (strict mode) | Type safety across stack |
| **Styling** | Tailwind CSS | 4.x | Utility-first; excellent mobile support |
| **UI Components** | shadcn/ui | Latest | Accessible, customizable primitives |
| **Hosting** | Vercel | Pro plan | Native Next.js support; edge network |
| **Authentication** | Clerk | Latest | Magic link support; Next.js SDK |
| **User Database** | Supabase | Postgres 15 | Managed Postgres; Row Level Security |
| **Vector Database** | Pinecone | Serverless | Managed vectors; metadata filtering |
| **Embeddings** | OpenAI | text-embedding-3-large | Quality/cost balance |
| **LLM** | Anthropic | Claude 3.5 Sonnet | Citation following; grounded responses |
| **PDF Rendering** | react-pdf | 7.x + pdfjs-dist | Client-side PDF with page control |
| **PDF Storage** | Vercel Blob | — | CDN-backed; signed URLs if needed |
| **Analytics** | PostHog | Cloud | Privacy-friendly; feature flags |
| **Error Tracking** | Sentry | Latest | Error monitoring; performance |

### Project Structure

```
shoptalk-web/
├── app/
│   ├── layout.tsx                 # Root layout (providers, analytics)
│   ├── page.tsx                   # Landing/marketing page
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx           # Magic link request
│   │   ├── sign-up/
│   │   │   └── page.tsx           # New user registration
│   │   └── callback/
│   │       └── route.ts           # Magic link callback handler
│   ├── (authenticated)/
│   │   ├── layout.tsx             # Auth-required layout wrapper
│   │   ├── onboarding/
│   │   │   └── page.tsx           # Profile setup flow
│   │   ├── query/
│   │   │   ├── page.tsx           # Main query interface
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Specific query result (shareable)
│   │   ├── history/
│   │   │   └── page.tsx           # Query history list
│   │   ├── document/
│   │   │   └── [docId]/
│   │   │       └── page.tsx       # PDF viewer with page param
│   │   └── settings/
│   │       └── page.tsx           # Profile management
│   ├── api/
│   │   ├── query/
│   │   │   └── route.ts           # Query processing endpoint
│   │   ├── health/
│   │   │   └── route.ts           # Health check for monitoring
│   │   └── webhook/
│   │       └── clerk/
│   │           └── route.ts       # Clerk webhook handler
│   └── manifest.ts                # Web App Manifest (dynamic)
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── query/
│   │   ├── QueryInput.tsx
│   │   ├── QueryResponse.tsx
│   │   ├── Citation.tsx
│   │   └── LoadingState.tsx
│   ├── pdf/
│   │   ├── PDFViewer.tsx
│   │   └── PageNavigation.tsx
│   ├── onboarding/
│   │   ├── LocalSelector.tsx
│   │   └── ClassificationSelector.tsx
│   └── pwa/
│       └── InstallPrompt.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts              # Supabase client
│   │   ├── queries.ts             # Database queries
│   │   └── types.ts               # Generated types from schema
│   ├── retrieval/
│   │   ├── embeddings.ts          # OpenAI embedding generation
│   │   ├── pinecone.ts            # Vector search client
│   │   ├── hybrid.ts              # Hybrid retrieval logic
│   │   └── rerank.ts              # RRF fusion
│   ├── llm/
│   │   ├── client.ts              # Anthropic client
│   │   ├── prompts.ts             # System prompts
│   │   └── citations.ts           # Citation parsing
│   ├── documents/
│   │   ├── mapping.ts             # Local-to-supplement mapping
│   │   └── metadata.ts            # Document metadata
│   └── utils/
│       ├── validation.ts          # Input validation (zod)
│       └── errors.ts              # Error types and handling
├── hooks/
│   ├── useQuery.ts                # Query submission hook
│   ├── usePDF.ts                  # PDF loading state
│   └── useInstallPrompt.ts        # PWA install prompt
├── public/
│   ├── icons/                     # PWA icons (192, 512, maskable)
│   ├── fonts/                     # Self-hosted fonts if needed
│   └── offline.html               # Offline fallback page
├── middleware.ts                  # Edge middleware (auth, rate limit)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

### Retrieval Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                        Query Processing                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Input Processing                                        │
│                                                                 │
│ • Receive natural language query from user                      │
│ • Validate input (length, content policy)                       │
│ • Retrieve user profile (Local, classification)                 │
│ • Determine applicable document set from profile                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Query Expansion (Optional Enhancement)                  │
│                                                                 │
│ • Identify contract-specific terminology                        │
│ • Expand abbreviations (RPCD → Regular Package Car Driver)      │
│ • Note: Can be deferred; raw query often sufficient             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Parallel Retrieval                                      │
│                                                                 │
│  ┌─────────────────────┐       ┌─────────────────────┐         │
│  │   Vector Search     │       │   BM25 Keyword      │         │
│  │                     │       │   Search            │         │
│  │ • Generate query    │       │                     │         │
│  │   embedding         │       │ • Keyword matching  │         │
│  │ • Search Pinecone   │       │ • Article numbers   │         │
│  │ • Filter by doc set │       │ • Section refs      │         │
│  │ • Return top 20     │       │ • Return top 20     │         │
│  └─────────────────────┘       └─────────────────────┘         │
│            │                            │                       │
│            └──────────┬─────────────────┘                       │
│                       ▼                                         │
│            ┌─────────────────────┐                              │
│            │  Reciprocal Rank    │                              │
│            │  Fusion (RRF)       │                              │
│            │                     │                              │
│            │  • Combine rankings │                              │
│            │  • Output top 6-8   │                              │
│            └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Response Generation                                     │
│                                                                 │
│ • Construct prompt with retrieved chunks                        │
│ • Include citation instruction format                           │
│ • Call Claude 3.5 Sonnet                                        │
│ • Stream response to client                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Citation Processing                                     │
│                                                                 │
│ • Parse inline citations from response                          │
│ • Validate citations against retrieved chunks                   │
│ • Format citation objects with tap targets                      │
│ • Include document ID, article, section, page number            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: Response Delivery                                       │
│                                                                 │
│ • Stream formatted response to client                           │
│ • Persist query and response to database                        │
│ • Log analytics event                                           │
└─────────────────────────────────────────────────────────────────┘
```

### LLM Prompt Structure

```typescript
const SYSTEM_PROMPT = `You are a contract reference assistant for UPS Teamster workers. 
Your role is to help workers find and understand language in their union contract.

CRITICAL INSTRUCTIONS:
1. ONLY use information from the provided contract excerpts to answer questions
2. ALWAYS cite your sources using the format [Doc: X, Art: Y, Sec: Z, Page: N]
3. If the provided excerpts do not contain information to answer the question, say so clearly
4. Never make up contract language or cite sections that aren't in the provided context
5. Use clear, accessible language - avoid unnecessary legal jargon
6. Be concise but complete

The user belongs to Local {LOCAL_NUMBER} and works as a {CLASSIFICATION}.
Their applicable documents are: {DOCUMENT_LIST}

Respond to their question using ONLY the following contract excerpts:

{RETRIEVED_CHUNKS}

Remember: Every factual claim must have a citation. If you cannot cite it, do not state it.`;
```

### Data Models

#### User Profile

```typescript
interface UserProfile {
  id: string;                          // UUID, primary key
  clerkId: string;                     // Clerk user ID, unique
  email: string | null;                // Email if provided
  phone: string | null;                // Phone if provided
  localNumber: number;                 // e.g., 396
  localName: string;                   // e.g., "Local 396 - Los Angeles"
  classification: Classification;       // Job classification enum
  classificationOther: string | null;  // Freeform if classification = 'other'
  supplementChain: string[];           // Derived, e.g., ["master", "western", "sw-package"]
  
  // Future fields (nullable, not collected in MVP)
  hubId: string | null;
  shift: string | null;
  seniorityDate: Date | null;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  onboardingCompletedAt: Date | null;
}

type Classification = 
  | 'rpcd'           // Package Car Driver
  | 'feeder'         // Feeder Driver  
  | 'pt-hub'         // Part-Time Hub/Sort
  | '22.3'           // 22.3 Combination
  | '22.4'           // 22.4 Driver
  | 'air'            // Air Driver
  | 'automotive'     // Automotive/Mechanic
  | 'clerical'       // Clerical
  | 'other';         // Other (freeform)
```

#### Query and Response

```typescript
interface Query {
  id: string;                          // UUID, primary key
  userId: string;                      // FK to UserProfile
  queryText: string;                   // Original user question
  documentScope: string[];             // Documents searched
  
  // Response data
  responseText: string;                // Generated response (Markdown)
  citations: Citation[];               // Parsed citations
  retrievedChunkIds: string[];         // For debugging/improvement
  
  // Metadata
  createdAt: Date;
  latencyMs: number;                   // Total response time
  llmTokensUsed: number;               // For cost tracking
}

interface Citation {
  id: string;                          // Unique within response
  documentId: string;                  // e.g., "western-supplement"
  documentTitle: string;               // e.g., "Western Region Supplement"
  article: string | null;              // e.g., "12"
  section: string | null;              // e.g., "3"
  subsection: string | null;           // e.g., "a"
  pageNumber: number;                  // Page in source PDF
  displayText: string;                 // e.g., "Art. 12, Sec. 3(a), p. 47"
}
```

#### Document Metadata

```typescript
interface Document {
  id: string;                          // e.g., "western-supplement"
  title: string;                       // e.g., "Western Region of Teamsters Supplement"
  shortTitle: string;                  // e.g., "Western Region"
  type: 'master' | 'supplement' | 'rider' | 'local' | 'mou';
  effectiveDate: Date;
  expirationDate: Date;
  pdfUrl: string;                      // Vercel Blob URL
  totalPages: number;
  applicableLocals: number[];          // Local numbers this applies to
}

interface DocumentChunk {
  id: string;                          // UUID
  documentId: string;                  // FK to Document
  content: string;                     // Chunk text
  article: string | null;
  section: string | null;
  subsection: string | null;
  pageStart: number;
  pageEnd: number;
  tokenCount: number;
  embedding: number[];                 // Stored in Pinecone, not Postgres
}
```

### API Endpoints

#### POST `/api/query`

Process a natural language contract query.

**Request:**
```typescript
{
  query: string;          // Max 500 characters
}
```

**Response (streamed):**
```typescript
{
  id: string;
  responseText: string;   // Markdown formatted
  citations: Citation[];
  disclaimer: string;
}
```

**Error Responses:**
- `400` - Invalid query (empty, too long)
- `401` - Not authenticated
- `403` - Onboarding not completed
- `429` - Rate limited
- `500` - Internal error

#### GET `/api/query/[id]`

Retrieve a specific query and response.

**Response:**
```typescript
{
  id: string;
  queryText: string;
  responseText: string;
  citations: Citation[];
  createdAt: string;
}
```

#### GET `/api/query/history`

Retrieve user's query history.

**Query Parameters:**
- `limit` (default: 20, max: 100)
- `cursor` (pagination)

**Response:**
```typescript
{
  queries: Array<{
    id: string;
    queryText: string;
    responsePreview: string;  // First 100 chars
    createdAt: string;
  }>;
  nextCursor: string | null;
}
```

#### GET `/api/document/[id]`

Get document metadata and signed PDF URL.

**Response:**
```typescript
{
  id: string;
  title: string;
  pdfUrl: string;         // Signed URL, expires in 1 hour
  totalPages: number;
}
```

---

## Non-Functional Requirements

### NFR-1: Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Byte (TTFB) | <200ms | Vercel Analytics |
| First Contentful Paint (FCP) | <1.5s on 4G | Lighthouse |
| Largest Contentful Paint (LCP) | <2.5s on 4G | Lighthouse |
| Query response time (P50) | <2.5s | Backend metrics |
| Query response time (P95) | <4s | Backend metrics |
| PDF page load | <2s per page | Client metrics |

### NFR-2: Availability

| Metric | Target | Mechanism |
|--------|--------|-----------|
| Uptime | 99.5% | Vercel SLA + managed services |
| Planned maintenance | Zero-downtime deploys | Vercel deployment model |
| Error rate | <1% of requests | Sentry monitoring |

### NFR-3: Scalability

| Metric | Target | Approach |
|--------|--------|----------|
| Concurrent users (launch) | 1,000 | Vercel auto-scaling |
| Concurrent users (growth) | 10,000+ | Architecture supports without redesign |
| Queries per day | 50,000+ | Edge caching, connection pooling |

### NFR-4: Security

| Requirement | Implementation |
|-------------|----------------|
| Transport | TLS 1.3 (Vercel default) |
| Authentication | Clerk with secure session cookies |
| API authentication | Clerk middleware validation |
| Rate limiting | 30 queries/hour per user (configurable) |
| Input validation | Zod schemas on all inputs |
| SQL injection | Parameterized queries via Supabase client |
| XSS | React's default escaping; CSP headers |
| CSRF | SameSite cookies; Clerk handles |

### NFR-5: Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Safari (iOS) | 15.0+ | Primary target; PWA support |
| Chrome (Android) | 100+ | Primary target |
| Chrome (Desktop) | 100+ | Secondary |
| Firefox | 100+ | Secondary |
| Samsung Internet | 18+ | Significant Android share |

### NFR-6: Accessibility

| Requirement | Standard |
|-------------|----------|
| WCAG compliance | 2.1 AA minimum |
| Keyboard navigation | Full support |
| Screen reader | Tested with VoiceOver, TalkBack |
| Color contrast | 4.5:1 minimum for text |
| Touch targets | 44x44px minimum |
| Reduced motion | Respect `prefers-reduced-motion` |

### NFR-7: Privacy

| Requirement | Implementation |
|-------------|----------------|
| Data minimization | Collect only required profile fields |
| Query logging | Stored for history feature; user can delete |
| Analytics | PostHog with privacy mode (no PII) |
| No third-party trackers | No Google Analytics, Facebook pixels |
| Cookie consent | Not required (no marketing cookies) |

---

## User Experience Flows

### First Visit Flow

```
┌─────────────────┐
│   Landing Page  │
│                 │
│ "Find contract  │
│  language fast" │
│                 │
│ [Get Started]   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Sign Up       │
│                 │
│ Enter phone or  │
│ email address   │
│                 │
│ [Send Magic     │
│  Link]          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Email/   │
│  SMS            │
│                 │
│ "Click the link │
│  we sent"       │
└────────┬────────┘
         │
         │ (User clicks link)
         ▼
┌─────────────────┐
│   Onboarding    │
│                 │
│ Step 1: Local # │
│ [Search/Select] │
│                 │
│ Step 2: Job     │
│ [Select]        │
│                 │
│ Step 3: Confirm │
│ "Your docs:     │
│  - Master       │
│  - Western      │
│  - SW Package"  │
│                 │
│ [Start Using]   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Query Interface│
│                 │
│ "Ask a question │
│  about your     │
│  contract"      │
│                 │
│ [____________]  │
│                 │
│ [Submit]        │
└─────────────────┘
```

### Query Flow

```
┌─────────────────┐
│  Query Input    │
│                 │
│ "What are the   │
│  penalties for  │
│  supervisors    │
│  working?"      │
│                 │
│ [Submit]        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Loading State  │
│                 │
│ [Searching      │
│  contract...]   │
│                 │
│ (< 3 seconds)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Response       │
│                 │
│ "According to   │
│  Article 3,     │
│  Section 7..."  │
│                 │
│ [Art. 3.7 p.12] │◄── Tap target
│ [Master Art 1]  │◄── Tap target
│                 │
│ ─────────────── │
│ Disclaimer text │
│                 │
│ [New Question]  │
└────────┬────────┘
         │
         │ (User taps citation)
         ▼
┌─────────────────┐
│  PDF Viewer     │
│                 │
│ ┌─────────────┐ │
│ │ Page 12     │ │
│ │             │ │
│ │ [Relevant   │ │
│ │  section    │ │
│ │  visible]   │ │
│ │             │ │
│ └─────────────┘ │
│                 │
│ [◄] [Page 12] [►]│
│                 │
│ [← Back]        │
└─────────────────┘
```

### Returning User Flow

```
┌─────────────────┐
│  App Load       │
│                 │
│ (Session valid) │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Query Interface│
│                 │
│ Ready to search │
│                 │
│ Recent queries: │
│ • "overtime     │
│    pay rates"   │
│ • "9.5 list"    │
│                 │
└─────────────────┘
```

---

## Mobile-First Design Specifications

### Viewport Targets

| Device Class | Width | Priority |
|--------------|-------|----------|
| Small phone | 320px | Must support |
| Standard phone | 375px | Primary target |
| Large phone | 428px | Primary target |
| Tablet | 768px+ | Functional but not optimized |
| Desktop | 1024px+ | Functional but not optimized |

### Touch Interaction Guidelines

- **Minimum touch target:** 44x44px
- **Spacing between targets:** 8px minimum
- **Thumb zone consideration:** Primary actions in bottom 60% of screen
- **Swipe gestures:** None required in MVP (avoid discoverability issues)
- **Pull to refresh:** Supported on query history

### Typography Scale

```css
/* Mobile-first type scale */
--font-size-xs: 0.75rem;    /* 12px - metadata, timestamps */
--font-size-sm: 0.875rem;   /* 14px - secondary text */
--font-size-base: 1rem;     /* 16px - body text (minimum for mobile) */
--font-size-lg: 1.125rem;   /* 18px - emphasized body */
--font-size-xl: 1.25rem;    /* 20px - section headers */
--font-size-2xl: 1.5rem;    /* 24px - page titles */

/* Line heights optimized for mobile reading */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Color System

```css
/* Accessible color palette */
--color-primary: #1e40af;      /* Blue 800 - links, primary actions */
--color-primary-dark: #1e3a8a; /* Blue 900 - hover states */
--color-secondary: #4b5563;    /* Gray 600 - secondary text */
--color-background: #ffffff;   /* White - main background */
--color-surface: #f9fafb;      /* Gray 50 - cards, input backgrounds */
--color-border: #e5e7eb;       /* Gray 200 - borders */
--color-text: #111827;         /* Gray 900 - primary text */
--color-text-muted: #6b7280;   /* Gray 500 - muted text */
--color-error: #dc2626;        /* Red 600 - error states */
--color-success: #16a34a;      /* Green 600 - success states */

/* Union-appropriate accent (optional brand touch) */
--color-accent: #b45309;       /* Amber 700 - subtle Teamster nod */
```

### Component Specifications

#### Query Input

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Ask about your contract...                            │  │
│  │                                                       │  │
│  │ What are the rules for 9.5?                          │  │
│  │                                                       │  │
│  │                                                       │  │
│  │                                         [Submit ▶]   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Min height: 100px                                          │
│  Max height: 200px (expandable)                             │
│  Submit button: inside input, right-aligned                 │
│  Keyboard: "Search" return key type                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Response Card

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Your question                                         ▾    │
│  "What are the penalties for supervisors working?"          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Response text with markdown formatting...                  │
│                                                             │
│  Article 3, Section 7 of the National Master Agreement      │
│  establishes that supervisors performing bargaining unit    │
│  work results in pay to the affected employee. [1]          │
│                                                             │
│  The Western Region Supplement adds additional remedies     │
│  for repeated violations. [2]                               │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Sources                                               │  │
│  │                                                       │  │
│  │ [1] Master Agreement, Art. 3.7, p.12        [View →] │  │
│  │ [2] Western Supplement, Art. 1.2, p.5       [View →] │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  ⚠️ This is contract reference information, not legal      │
│  advice. Consult your steward for specific situations.      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### PDF Viewer

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to response          Western Supplement             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                                                       │  │
│  │                    PDF Page                           │  │
│  │                    Rendered                           │  │
│  │                                                       │  │
│  │                                                       │  │
│  │                                                       │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Pinch to zoom supported                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│     [◄ Prev]      Page 12 of 156      [Next ►]             │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### Launch Criteria (Go/No-Go)

- [ ] Authentication success rate >99% on test cohort
- [ ] Query returns relevant, cited response >95% of test cases
- [ ] LCP <2.5s on throttled 4G connection
- [ ] Zero critical accessibility violations (axe-core)
- [ ] Steward validation panel confirms accuracy on 20 test queries
- [ ] PWA installable on iOS Safari and Android Chrome
- [ ] PDF viewer functional on all supported browsers

### Post-Launch Success Metrics

| Metric | Target (30 days) | Target (90 days) | Measurement |
|--------|------------------|------------------|-------------|
| Weekly Active Users | 500 | 2,000 | PostHog |
| Queries per day | 500 | 2,000 | Database |
| Query success rate | >95% | >97% | Backend logs |
| P95 response latency | <4s | <3s | Vercel Analytics |
| User retention (D7) | >40% | >50% | PostHog cohorts |
| PWA installs | 100 | 500 | Analytics event |
| NPS score | >30 | >40 | In-app survey |

### Comparison Metrics (vs. Incumbent)

| Dimension | Incumbent | Our Target |
|-----------|-----------|------------|
| App Store rating | 2.1/5 | N/A (web) |
| Authentication failures | Common (per reviews) | <1% |
| Update breakage | Frequent | Zero (web deploy model) |
| Search relevance | Poor (per reviews) | >95% relevant |
| Time to answer | Unknown | <4s P95 |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LLM generates inaccurate contract interpretation | Medium | High | Mandatory citation grounding; steward validation; clear disclaimers; closed corpus |
| Low PWA installation rate | Medium | Low | Focus on web experience; installation is nice-to-have, not required |
| iOS Safari PWA limitations | Medium | Medium | Test thoroughly; provide fallback experiences; track iOS version distribution |
| Slow PDF rendering on mobile | Medium | Medium | Lazy loading; page-at-a-time rendering; fallback to native PDF |
| Low initial adoption | Medium | Medium | Targeted distribution via union networks; steward endorsement; shareable query links |
| Supplement coverage gaps frustrate users | High | Medium | Clear communication of covered Locals; request tracking for prioritization |
| Query latency exceeds threshold | Low | Medium | Response streaming; edge caching for common queries; optimize retrieval |
| Vercel cost at scale | Low | Medium | Monitor usage; implement query caching; rate limiting |
| Clerk authentication edge cases | Low | Medium | Comprehensive testing; fallback flows; clear error messaging |

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

**Goals:** Project scaffolding, authentication, basic UI shell

**Deliverables:**
- [ ] Next.js 16 project with TypeScript, Tailwind, App Router
- [ ] Clerk integration with magic link flow
- [ ] Supabase database schema and client setup
- [ ] Basic page structure (landing, auth, main app shell)
- [ ] CI/CD pipeline (GitHub Actions → Vercel)
- [ ] Development, staging, production environments

**Technical Tasks:**
```bash
# Project initialization
npx create-next-app@latest shoptalk-web --typescript --tailwind --app

# Key dependencies
npm install @clerk/nextjs @supabase/supabase-js
npm install -D @types/node typescript
```

**Exit Criteria:**
- User can complete magic link sign-up flow
- User record created in Supabase on first auth
- App deployed to Vercel staging environment

### Phase 2: Onboarding & Profile (Week 2-3)

**Goals:** User profile capture, Local-to-supplement mapping

**Deliverables:**
- [ ] Local union selector (search/autocomplete from ~200 Locals)
- [ ] Job classification selector
- [ ] Supplement chain determination logic
- [ ] Profile confirmation screen
- [ ] Settings page for profile editing
- [ ] Local-to-supplement mapping data file

**Technical Tasks:**
- Implement Local search with Supabase full-text or client-side filter
- Build mapping table (JSON or database table)
- Profile completion gate middleware

**Exit Criteria:**
- User completes onboarding and sees correct supplement chain
- User can edit profile from settings
- Incomplete profiles redirect to onboarding

### Phase 3: Document Pipeline (Weeks 3-4)

**Goals:** Ingest MVP document corpus, vector database setup

**Deliverables:**
- [ ] PDF text extraction pipeline (pdf-parse or similar)
- [ ] Chunking logic with metadata extraction
- [ ] Pinecone index creation and configuration
- [ ] Document ingestion scripts
- [ ] MVP corpus processed (8-9 documents)
- [ ] PDF files uploaded to Vercel Blob

**Technical Tasks:**
```typescript
// Chunking configuration
const CHUNK_CONFIG = {
  targetTokens: 400,
  maxTokens: 500,
  overlap: 50,
  preserveArticleBoundaries: true,
};
```

**Exit Criteria:**
- All MVP documents chunked and embedded
- Pinecone queries return relevant chunks
- PDFs accessible via Vercel Blob URLs

### Phase 4: Retrieval & Generation (Weeks 4-6)

**Goals:** Query processing pipeline, LLM integration, response display

**Deliverables:**
- [ ] Embedding generation endpoint (OpenAI)
- [ ] Hybrid retrieval (vector + BM25 via Pinecone sparse)
- [ ] RRF fusion implementation
- [ ] LLM response generation (Claude)
- [ ] Citation parsing and validation
- [ ] Response streaming to client
- [ ] Query input component
- [ ] Response display component with citations

**Technical Tasks:**
```typescript
// API route structure
// app/api/query/route.ts
export async function POST(request: Request) {
  // 1. Validate and authenticate
  // 2. Get user profile and document scope
  // 3. Generate query embedding
  // 4. Execute hybrid retrieval
  // 5. Apply RRF fusion
  // 6. Construct LLM prompt
  // 7. Stream response
  // 8. Parse citations
  // 9. Persist to database
}
```

**Exit Criteria:**
- End-to-end query flow functional
- Responses include accurate citations
- Response time <4s P95

### Phase 5: PDF Viewer & Polish (Weeks 6-7)

**Goals:** Source document viewing, UX refinement, PWA configuration

**Deliverables:**
- [ ] PDF viewer component (react-pdf)
- [ ] Page navigation and deep linking
- [ ] Citation tap → PDF page flow
- [ ] Query history page
- [ ] PWA manifest and service worker
- [ ] Install prompt component
- [ ] Loading states and error handling
- [ ] Empty states and edge cases

**Technical Tasks:**
- Configure next-pwa or manual service worker
- Implement offline fallback page
- Add web app manifest with icons

**Exit Criteria:**
- Tap citation → view source PDF at correct page
- PWA installable on iOS and Android
- Graceful handling of all error states

### Phase 6: Validation & Launch (Weeks 7-8)

**Goals:** Quality assurance, steward validation, production deployment

**Deliverables:**
- [ ] Steward validation testing (20 queries minimum)
- [ ] Accessibility audit and fixes
- [ ] Performance audit and optimization
- [ ] Security review
- [ ] Analytics integration (PostHog)
- [ ] Error tracking (Sentry)
- [ ] Production environment configuration
- [ ] Documentation (README, runbook)

**Testing Protocol:**
```markdown
## Steward Validation Protocol

1. Recruit 3-5 stewards from different Locals/classifications
2. Provide 20 test queries covering:
   - Common workplace issues (attendance, overtime, seniority)
   - Classification-specific questions
   - Regional supplement questions
   - Edge cases and ambiguous situations
3. Stewards rate each response:
   - Accuracy (1-5)
   - Completeness (1-5)
   - Citation correctness (verified/not verified)
4. Target: 4.0+ average accuracy, 100% citation verification
```

**Exit Criteria:**
- All validation criteria pass
- Production deployment successful
- Monitoring and alerting configured
- Launch communication prepared

---

## Deployment & Operations

### Environment Configuration

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | *.vercel.app | PR preview deployments |
| Staging | staging.shoptalk.app | Pre-production testing |
| Production | shoptalk.app | Live application |

### Environment Variables

```bash
# .env.local (development)
# .env.production (production)

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/query
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=shoptalk-contracts

# OpenAI (embeddings)
OPENAI_API_KEY=sk-...

# Anthropic (LLM)
ANTHROPIC_API_KEY=sk-ant-...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=...
```

### Monitoring & Alerting

| Monitor | Tool | Alert Threshold |
|---------|------|-----------------|
| Uptime | Vercel + Better Uptime | <99.5% over 1 hour |
| Error rate | Sentry | >1% over 15 minutes |
| Response latency P95 | Vercel Analytics | >5s over 15 minutes |
| LLM API errors | Sentry + logs | Any 5xx from Anthropic |
| Database connection | Supabase dashboard | Pool exhaustion |

### Cost Estimates (Monthly)

| Service | Estimated Usage | Estimated Cost |
|---------|-----------------|----------------|
| Vercel Pro | Base + bandwidth | $20-50 |
| Clerk | 1,000 MAU | Free tier |
| Supabase | Pro plan | $25 |
| Pinecone | Serverless | $0-50 (usage-based) |
| OpenAI Embeddings | 50k queries × 500 tokens | ~$5 |
| Anthropic Claude | 50k queries × 2k tokens | ~$150-300 |
| Vercel Blob | 10GB storage | ~$2 |
| PostHog | Cloud free tier | $0 |
| Sentry | Team plan | $26 |
| **Total** | | **$230-480/month** |

*Note: LLM costs dominate. Response caching for common queries can significantly reduce this.*

---

## Open Questions for Resolution

1. **Steward Validation Panel:** Do we have identified stewards willing to test accuracy pre-launch? Target 3-5 across different Locals.

2. **Distribution Strategy:** What union communication channels are available for launch promotion? (Facebook groups, Local newsletters, shop floor networks)

3. **Document Acquisition:** Do we have clean PDF sources for all MVP-scope documents? Need to verify text extraction quality.

4. **Cost Ceiling:** What's the acceptable monthly LLM cost ceiling before implementing caching/rate limiting? 

5. **Domain Name:** Is shoptalk.app available? Alternatives: shoptalkcontract.com, myshoptalk.app

6. **Legal Review:** Do we need disclaimer review by attorney given the nature of contract interpretation?

7. **Branding:** Any constraints on visual identity given union context? Teamster logo usage?

8. **Fallback LLM:** If Anthropic has outages, should we implement GPT-4 fallback or show maintenance message?

---

## Appendix A: Local-to-Supplement Mapping (Partial)

```typescript
// lib/documents/mapping.ts

export const LOCAL_SUPPLEMENT_MAP: Record<number, SupplementChain> = {
  // Western Region
  396: { region: 'western', supplements: ['western'], riders: ['southwest-package'] },
  63: { region: 'western', supplements: ['western'], riders: ['northern-california'] },
  542: { region: 'western', supplements: ['western'], riders: [] },
  104: { region: 'western', supplements: ['western'], riders: [] },
  
  // Central Region
  480: { region: 'central', supplements: ['central'], riders: [] },
  710: { region: 'central', supplements: ['local-710'], riders: [] }, // Standalone
  705: { region: 'central', supplements: ['local-705'], riders: [] }, // Standalone
  
  // Eastern Region
  804: { region: 'eastern', supplements: ['local-804'], riders: [] }, // Standalone
  25: { region: 'eastern', supplements: ['eastern'], riders: ['new-england'] },
  
  // Atlantic Area
  177: { region: 'atlantic', supplements: ['atlantic'], riders: [] },
  355: { region: 'atlantic', supplements: ['atlantic'], riders: [] },
  
  // Southern Region
  767: { region: 'southern', supplements: ['southern'], riders: ['texas'] },
  988: { region: 'southern', supplements: ['southern'], riders: [] },
  
  // ... full mapping to be completed in Phase 1
};

export interface SupplementChain {
  region: 'western' | 'central' | 'eastern' | 'atlantic' | 'southern';
  supplements: string[];
  riders: string[];
}

export function getDocumentScope(localNumber: number): string[] {
  const chain = LOCAL_SUPPLEMENT_MAP[localNumber];
  if (!chain) {
    // Default to Master only if Local not mapped
    return ['master'];
  }
  return ['master', ...chain.supplements, ...chain.riders];
}
```

---

## Appendix B: Sample LLM Prompts

### System Prompt

```
You are a contract reference assistant for UPS Teamster workers. Your purpose is to help workers quickly find and understand language in their collective bargaining agreement.

CRITICAL RULES:
1. ONLY answer based on the provided contract excerpts - never use outside knowledge about UPS or Teamster contracts
2. ALWAYS cite every factual claim with the format [Doc: document_id, Art: article, Sec: section, Page: page]
3. If the excerpts don't contain relevant information, clearly state: "I couldn't find specific contract language addressing this in your applicable documents."
4. Never guess or extrapolate contract language
5. Write clearly and concisely - workers need fast answers
6. If multiple sections apply, cite all of them

FORMAT:
- Lead with the direct answer when possible
- Follow with supporting details and citations
- Use plain language, not legal jargon
- Break complex answers into clear points
```

### Query Prompt Template

```
The worker asking this question belongs to Local {local_number} and works as a {classification}.

Their applicable documents are:
- National Master Agreement (master)
{supplement_list}

Here are the relevant excerpts from their contract documents:

---
{chunk_1}
[Source: {doc_id_1}, Article {article_1}, Section {section_1}, Page {page_1}]
---
{chunk_2}
[Source: {doc_id_2}, Article {article_2}, Section {section_2}, Page {page_2}]
---
... (additional chunks)
---

WORKER'S QUESTION: {query}

Provide a clear, cited answer using ONLY the information in the excerpts above.
```

---

## Appendix C: Accessibility Checklist

### WCAG 2.1 AA Compliance

- [ ] **1.1.1 Non-text Content:** All images have alt text
- [ ] **1.3.1 Info and Relationships:** Proper heading hierarchy
- [ ] **1.3.2 Meaningful Sequence:** Logical reading order
- [ ] **1.4.1 Use of Color:** Color not sole means of conveying info
- [ ] **1.4.3 Contrast (Minimum):** 4.5:1 for normal text, 3:1 for large text
- [ ] **1.4.4 Resize Text:** Functional at 200% zoom
- [ ] **2.1.1 Keyboard:** All functionality keyboard accessible
- [ ] **2.1.2 No Keyboard Trap:** Focus can move freely
- [ ] **2.4.1 Bypass Blocks:** Skip link to main content
- [ ] **2.4.2 Page Titled:** Descriptive page titles
- [ ] **2.4.3 Focus Order:** Logical tab order
- [ ] **2.4.4 Link Purpose:** Links make sense in context
- [ ] **2.4.6 Headings and Labels:** Descriptive headings
- [ ] **2.4.7 Focus Visible:** Clear focus indicators
- [ ] **3.1.1 Language of Page:** html lang attribute set
- [ ] **3.2.1 On Focus:** No unexpected changes on focus
- [ ] **3.2.2 On Input:** No unexpected changes on input
- [ ] **3.3.1 Error Identification:** Errors clearly described
- [ ] **3.3.2 Labels or Instructions:** Form inputs labeled
- [ ] **4.1.1 Parsing:** Valid HTML
- [ ] **4.1.2 Name, Role, Value:** ARIA used correctly

### Mobile-Specific Accessibility

- [ ] Touch targets minimum 44x44px
- [ ] Sufficient spacing between interactive elements
- [ ] Orientation not locked
- [ ] Content readable without horizontal scroll
- [ ] Form inputs don't zoom on focus (font-size ≥16px)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | TBD | — | Initial web-first MVP specification |

---

**Document Status:** Ready for technical review  
**Next Steps:** Architecture decision records for technology choices
