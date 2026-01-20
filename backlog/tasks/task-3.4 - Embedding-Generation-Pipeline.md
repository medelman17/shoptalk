---
id: task-3.4
title: Embedding Generation Pipeline
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 00:51'
labels:
  - P0
  - documents
  - embeddings
  - phase-3
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build pipeline to generate embeddings using OpenAI's text-embedding-3-large model.

## Implementation Steps
1. Install OpenAI SDK
2. Create embedding function:
   - Batch processing for efficiency
   - Rate limiting handling
   - Error retry logic
3. Build ingestion script that:
   - Reads chunks from JSON
   - Generates embeddings
   - Upserts to Pinecone
4. Create query embedding function for search
5. Test embedding quality on sample queries

## Technical Details
- Model: text-embedding-3-large (3072 dimensions)
- Max tokens per request: 8191
- Batch size: Up to 2048 embeddings per request
- Cost: ~$0.13 per 1M tokens

## Code Pattern
```typescript
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-large",
  input: chunk.content,
});
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 OpenAI SDK configured with API key
- [ ] #2 Batch embedding function handles rate limits
- [ ] #3 All document chunks embedded successfully
- [ ] #4 Query embedding function works for search
- [ ] #5 Embeddings stored in Pinecone with metadata
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Subtasks

### 3.4.1 Install OpenAI SDK
- `pnpm add openai`

### 3.4.2 Create embeddings client
- File: `src/lib/embeddings/client.ts`
- Configure with API key
- Model: text-embedding-3-large

### 3.4.3 Build batch embedding function
- File: `src/lib/embeddings/generate.ts`
- Handle rate limits with exponential backoff
- Batch up to 2048 embeddings per request
- Progress tracking

### 3.4.4 Create ingestion CLI script
- File: `scripts/embed-and-ingest.ts`
- Read chunks from `data/chunks/`
- Generate embeddings
- Upsert to Pinecone with metadata

### 3.4.5 Build query embedding function
- Single text → embedding for search queries
- Used at query time in the API
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Using Vercel AI Gateway with gateway.embeddingModel('openai/text-embedding-3-large') instead of direct OpenAI SDK.
<!-- SECTION:NOTES:END -->
