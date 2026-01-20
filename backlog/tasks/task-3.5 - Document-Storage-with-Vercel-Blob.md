---
id: task-3.5
title: Document Storage with Vercel Blob
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 00:51'
labels:
  - P0
  - documents
  - storage
  - phase-3
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Configure Vercel Blob for storing original PDF files with secure access.

## Implementation Steps
1. Enable Vercel Blob in project
2. Upload all MVP PDF documents
3. Create document metadata table (Supabase):
   - Document ID
   - Title
   - Blob URL
   - Page count
   - Document type (master, supplement, rider)
4. Configure signed URLs for secure access
5. Build document retrieval API

## Document Metadata Schema
```typescript
interface Document {
  id: string;
  title: string;
  blobUrl: string;
  pageCount: number;
  type: 'master' | 'supplement' | 'rider';
  region?: string; // For supplements
  localId?: string; // For riders
}
```

## Access Pattern
- PDF URLs should be signed (time-limited)
- Only return URLs for documents in user's scope
- Support deep linking to specific pages
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Vercel Blob configured for project
- [ ] #2 All MVP PDFs uploaded to Blob storage
- [ ] #3 Document metadata table created in Supabase
- [ ] #4 Signed URLs generated for secure access
- [ ] #5 Document retrieval API returns correct URLs
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Subtasks

### 3.5.1 Install Vercel Blob SDK
- `pnpm add @vercel/blob`

### 3.5.2 Create documents table migration
- File: `supabase/migrations/xxx_create_documents_table.sql`
- Columns: id, title, short_title, type, blob_url, page_count, etc.

### 3.5.3 Build blob storage utility
- File: `src/lib/documents/storage.ts`
- Upload PDF to Vercel Blob
- Generate signed URLs for secure access

### 3.5.4 Create document metadata CRUD
- File: `src/lib/db/documents.ts`
- Insert/update document records
- Query documents by ID or type

### 3.5.5 Create PDF upload CLI script
- File: `scripts/upload-pdfs.ts`
- Upload all PDFs from `data/contracts/`
- Insert metadata into Supabase

### 3.5.6 Build document retrieval API
- Return signed URL for PDF
- Filter by user's document scope
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Skipped Vercel Blob - PDFs stored locally in data/contracts/ for now. Can add Blob storage later if needed.
<!-- SECTION:NOTES:END -->
