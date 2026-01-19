---
id: task-5.3
title: Query History Page
status: To Do
assignee: []
created_date: '2026-01-19 19:44'
labels:
  - P0
  - polish
  - history
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies: []
parent_task_id: task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a page for viewing and revisiting past queries.

## Implementation Steps
1. Create /history route
2. Build query list component:
   - Show recent queries (last 30 days)
   - Display question preview (truncated)
   - Show timestamp
   - Pagination or infinite scroll
3. Build query detail view:
   - Full question and answer
   - Citations with tap targets
   - Share/copy functionality
4. Generate shareable URLs:
   - /query/[queryId]
   - Public access to specific query
   - OG meta tags for sharing

## Data Requirements
- Queries already stored in database (Phase 4)
- Need query list endpoint: GET /api/queries
- Need query detail endpoint: GET /api/queries/[id]

## List Item Structure
```
[Timestamp]
"How many sick days do I get..."
→ Tap to see full answer
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 History page lists recent queries
- [ ] #2 Query preview shows truncated question
- [ ] #3 Tapping query shows full answer with citations
- [ ] #4 Shareable URL works for specific queries
- [ ] #5 Empty state shown when no history
<!-- AC:END -->
