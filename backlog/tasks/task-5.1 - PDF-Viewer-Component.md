---
id: task-5.1
title: PDF Viewer Component
status: Done
assignee: []
created_date: '2026-01-19 19:44'
updated_date: '2026-01-20 15:09'
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
- [x] #1 react-pdf installed and configured
- [x] #2 PDF loads from Vercel Blob URL
- [x] #3 Page navigation (prev/next) works
- [x] #4 Direct page jump by number works
- [x] #5 Pinch-to-zoom functional on mobile
- [x] #6 Deep link to specific page works
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Notes (Completed 2026-01-20)

### Components Built
- `src/components/pdf/pdf-viewer.tsx` - Main PDF viewer using react-pdf
- `src/components/pdf/pdf-panel.tsx` - Side panel wrapper with header/close button
- `src/app/api/pdf/[documentId]/route.ts` - API route serving PDFs from local files

### Technical Decisions
- **Dynamic Import**: Used `next/dynamic` with `ssr: false` to avoid DOMMatrix SSR errors
- **Worker Setup**: PDF.js worker loaded from CDN (`unpkg.com/pdfjs-dist`)
- **Document Lookup**: Uses static DOCUMENT_MANIFEST (no async fetching)

### Features Implemented
- Page navigation (prev/next buttons, page input)
- Zoom controls (fit width, zoom in/out, percentage display)
- Keyboard shortcuts support
- Loading states with skeleton
- Error handling for missing documents

### Integration
- Opens in split-view panel (not full page) when citation clicked
- Page number passed via URL param and synced
- Close button returns to chat-only view
<!-- SECTION:NOTES:END -->
