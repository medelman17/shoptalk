---
id: task-3.5
title: Document Storage with Vercel Blob
status: To Do
assignee: []
created_date: '2026-01-19 19:42'
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
