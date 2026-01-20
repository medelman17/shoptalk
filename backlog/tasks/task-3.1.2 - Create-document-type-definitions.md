---
id: task-3.1.2
title: Create document type definitions
status: Done
assignee: []
created_date: '2026-01-20 00:08'
updated_date: '2026-01-20 00:50'
labels:
  - phase-3
  - types
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create TypeScript interfaces for document processing.

**File:** `src/lib/documents/types.ts`

**Interfaces:**
- `RawDocument` - PDF file metadata
- `ExtractedPage` - Single page with text and page number
- `ExtractedDocument` - Full extracted document with pages
- `DocumentChunk` - Chunk with content and metadata
- `ChunkMetadata` - Article, section, page range info
<!-- SECTION:DESCRIPTION:END -->
