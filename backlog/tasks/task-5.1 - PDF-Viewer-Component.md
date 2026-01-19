---
id: task-5.1
title: PDF Viewer Component
status: To Do
assignee: []
created_date: '2026-01-19 19:44'
labels:
  - P0
  - polish
  - pdf
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies: []
parent_task_id: task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a PDF viewer component for displaying contract documents.

## Implementation Steps
1. Install react-pdf and pdfjs-dist
2. Build PDF viewer component:
   - Document loading from Vercel Blob
   - Page-by-page rendering
   - Page navigation (prev/next, page input)
   - Pinch-to-zoom support
   - Current page indicator
3. Add deep linking support:
   - Accept page number via URL param
   - Scroll to specific page on load
4. Handle loading states:
   - Document loading indicator
   - Page rendering indicator
5. Mobile optimizations:
   - Touch-friendly controls
   - Responsive layout

## Component Props
```typescript
interface PdfViewerProps {
  documentUrl: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}
```

## Browser Support
- Chrome/Edge (full support)
- Safari iOS (pdf.js required)
- Firefox (native support)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 react-pdf installed and configured
- [ ] #2 PDF loads from Vercel Blob URL
- [ ] #3 Page navigation (prev/next) works
- [ ] #4 Direct page jump by number works
- [ ] #5 Pinch-to-zoom functional on mobile
- [ ] #6 Deep link to specific page works
<!-- AC:END -->
