---
id: task-3.1
title: PDF Text Extraction
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 00:50'
labels:
  - P0
  - documents
  - extraction
  - phase-3
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build PDF text extraction pipeline that preserves document structure.

## Implementation Steps
1. Install pdf-parse or pdf.js library
2. Create extraction function that:
   - Extracts all text from PDF
   - Preserves page numbers
   - Identifies article/section headers
   - Handles multi-column layouts
3. Build extraction script for batch processing
4. Test on all 8-9 MVP documents
5. Output structured text files with metadata

## Technical Considerations
- Contract PDFs may have complex formatting
- Need to preserve Article and Section numbering
- Some documents may be scanned (OCR fallback needed?)
- Page numbers must be tracked for citations

## Libraries to Consider
- pdf-parse (simple, Node.js native)
- pdf.js (Mozilla, more control)
- pdf2json (structured output)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 PDF extraction library installed and configured
- [ ] #2 Text extracted from all 8-9 MVP documents
- [ ] #3 Page numbers preserved in extraction
- [ ] #4 Article/Section headers identifiable in output
- [ ] #5 Extraction script runs in batch mode
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Subtasks

### 3.1.1 Install pdf-parse dependency
- `pnpm add pdf-parse`
- `pnpm add -D @types/pdf-parse`

### 3.1.2 Create document type definitions
- File: `src/lib/documents/types.ts`
- Interfaces: RawDocument, ExtractedPage, ExtractedDocument

### 3.1.3 Build PDF extraction utility
- File: `src/lib/documents/extract.ts`
- Function to extract text with page boundaries
- Regex patterns to identify Article/Section headers

### 3.1.4 Create extraction CLI script
- File: `scripts/extract-pdf.ts`
- Accept single PDF or batch mode
- Output: `data/extracted/<doc-id>.json`

### 3.1.5 Test extraction on all 33 documents
- Run extraction script on full corpus
- Verify article headers detected
- Check page number accuracy
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented in src/lib/documents/extract.ts using pdf-parse
<!-- SECTION:NOTES:END -->
