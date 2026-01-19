---
id: task-4.3
title: Citation Parsing and Validation
status: To Do
assignee: []
created_date: '2026-01-19 19:43'
labels:
  - P0
  - retrieval
  - citations
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies: []
parent_task_id: task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parse LLM-generated citations and validate against retrieved context.

## Implementation Steps
1. Create citation regex parser:
   - Pattern: `\[Doc: (.+?), Art: (.+?), Sec: (.+?), Page: (\d+)\]`
   - Extract all citations from response
2. Build citation object structure:
   - Document ID
   - Article
   - Section
   - Page number
   - Citation text
3. Validate citations:
   - Check that cited document is in retrieved context
   - Verify page number exists
4. Transform to tappable links:
   - Generate PDF deep link
   - Include display text

## Citation Object
```typescript
interface Citation {
  id: string;
  documentId: string;
  article: string;
  section: string;
  page: number;
  displayText: string;
  pdfUrl: string;
}
```

## Validation Rules
- Citation must reference a document in retrieved context
- Page number must be within document's page count
- Invalid citations flagged but not removed
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Regex extracts all citations from response
- [ ] #2 Citation objects created with all metadata
- [ ] #3 Validation checks document and page existence
- [ ] #4 Invalid citations logged for monitoring
- [ ] #5 Citations transformed to tappable links
<!-- AC:END -->
