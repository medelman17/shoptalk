---
id: task-5.2
title: Citation-to-PDF Flow
status: Done
assignee: []
created_date: '2026-01-19 19:44'
updated_date: '2026-01-20 15:09'
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
- [x] #1 Tapping citation navigates to PDF viewer
- [x] #2 PDF opens at the cited page number
- [x] #3 Back button returns to query result
- [x] #4 Query state preserved after viewing PDF
- [x] #5 Download fallback available when needed
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Notes (Completed 2026-01-20)

### Flow Changed to Split-View
Instead of navigating away from chat, citations now open PDF in adjacent panel:
```
Chat Response (left panel)
  → Click Citation
    → PDF Panel opens (right panel)
      → Both visible simultaneously
        → Close button or resize to dismiss
```

### Components Involved
- `MessageWithCitations` - Parses citation format, renders clickable badges
- `ContractCitation` - Badge with hover card showing document info
- `usePdfPanel` hook - Opens PDF via context
- `SplitViewContainer` - Manages resizable layout

### URL State
- Format: `/chat/[conversationId]?doc=master&page=42`
- Shareable - URL contains full state
- `router.push` for open, `router.replace` for page changes (no history spam)

### Mobile Behavior
- PDF opens as bottom sheet (85vh height)
- Swipe or X button to dismiss
- Chat remains scrollable underneath
<!-- SECTION:NOTES:END -->
