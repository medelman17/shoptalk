---
id: task-3.4
title: Embedding Generation Pipeline
status: To Do
assignee: []
created_date: '2026-01-19 19:42'
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
