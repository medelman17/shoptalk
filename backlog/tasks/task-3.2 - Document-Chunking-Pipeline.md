---
id: task-3.2
title: Document Chunking Pipeline
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 00:51'
labels:
  - P0
  - documents
  - chunking
  - phase-3
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build chunking pipeline that splits documents into semantically meaningful sections.

## Implementation Steps
1. Design chunking strategy:
   - Section-level chunks (300-500 tokens)
   - Preserve article boundaries
   - Include overlap between chunks
2. Extract metadata for each chunk:
   - Document ID
   - Article number
   - Section number
   - Page number(s)
3. Build chunking script
4. Test chunk quality on sample queries
5. Output chunks as JSON with metadata

## Chunk Structure
```typescript
interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    article: string;
    section: string;
    pageStart: number;
    pageEnd: number;
    tokenCount: number;
  }
}
```

## Chunking Rules
- Prefer breaking at section boundaries
- Never break mid-sentence
- Include 50-token overlap for context
- Max chunk size: 500 tokens
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Chunks are 300-500 tokens with overlap
- [ ] #2 Article boundaries respected
- [ ] #3 Each chunk has complete metadata
- [ ] #4 Chunking script processes all documents
- [ ] #5 Output format compatible with embedding pipeline
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Subtasks

### 3.2.1 Design chunking configuration
- Target: 300-500 tokens per chunk
- Overlap: 50 tokens
- Preserve article/section boundaries

### 3.2.2 Build tokenizer utility
- Use tiktoken or simple word-based estimation
- Function to count tokens in text

### 3.2.3 Build chunking logic
- File: `src/lib/documents/chunk.ts`
- Split on section boundaries when possible
- Never break mid-sentence
- Extract metadata (article, section, page range)

### 3.2.4 Create chunking CLI script
- File: `scripts/chunk-documents.ts`
- Read from `data/extracted/`
- Output: `data/chunks/<doc-id>.json`

### 3.2.5 Validate chunk quality
- Check token counts are in range
- Verify metadata completeness
- Spot-check content coherence
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented using Mastra MDocument.chunk() with recursive strategy. 4,002 chunks generated with avg 270 tokens.
<!-- SECTION:NOTES:END -->
