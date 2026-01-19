---
id: task-5.2
title: Citation-to-PDF Flow
status: To Do
assignee: []
created_date: '2026-01-19 19:44'
labels:
  - P0
  - polish
  - navigation
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies: []
parent_task_id: task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the flow from tapping a citation to viewing the source in the PDF viewer.

## Implementation Steps
1. Build citation tap handler:
   - Extract document ID and page from citation
   - Navigate to PDF viewer route
   - Pass page number as URL param
2. Create PDF viewer route:
   - /pdf/[documentId]?page=N
   - Load correct document
   - Jump to cited page
3. Build return path:
   - Back button returns to query
   - Preserve query state
   - Browser back navigation works
4. Add fallback for poor PDF support:
   - Detect WebView limitations
   - Offer download link as alternative
   - Open in native PDF viewer

## Navigation Flow
```
Query Response
  → Tap Citation
    → /pdf/master-agreement?page=42
      → PDF Viewer at page 42
        → Back button
          → Query Response (preserved)
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Tapping citation navigates to PDF viewer
- [ ] #2 PDF opens at the cited page number
- [ ] #3 Back button returns to query result
- [ ] #4 Query state preserved after viewing PDF
- [ ] #5 Download fallback available when needed
<!-- AC:END -->
