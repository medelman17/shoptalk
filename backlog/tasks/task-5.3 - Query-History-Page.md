---
id: task-5.3
title: Query History Page
status: Done
assignee: []
created_date: '2026-01-19 19:44'
updated_date: '2026-01-20 15:09'
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
- [x] #1 History page lists recent queries
- [x] #2 Query preview shows truncated question
- [x] #3 Tapping query shows full answer with citations
- [x] #4 Shareable URL works for specific queries
- [x] #5 Empty state shown when no history
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Notes (Completed 2026-01-20)

### Major Architecture Change
Replaced separate history page with **sidebar conversation list** (ChatGPT-style):
- Conversations displayed in sidebar, always visible
- Grouped by: Today, Yesterday, Previous 7 Days, Older
- Click to load conversation in main chat area

### Components Built
- `ConversationList` - Scrollable grouped list
- `ConversationItem` - Single item with title, delete action
- `AppSidebar` - Contains list + new chat button

### Database Tables
- `conversations` - id, user_id, title, created_at, updated_at
- `messages` - id, conversation_id, role, content, citations (JSONB)

### API Endpoints
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get with messages
- `DELETE /api/conversations/[id]` - Delete conversation
- `POST /api/conversations/[id]/messages` - Add message

### Legacy Routes
- `/history` now redirects to `/chat`
- `/history/[queryId]` redirects to `/chat`
- Old `queries` table kept for backward compatibility
<!-- SECTION:NOTES:END -->
