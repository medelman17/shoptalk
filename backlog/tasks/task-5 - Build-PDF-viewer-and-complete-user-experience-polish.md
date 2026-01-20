---
id: task-5
title: Build PDF viewer and complete user experience polish
status: Done
assignee: []
created_date: '2026-01-19 19:43'
updated_date: '2026-01-20 15:09'
labels:
  - P0
  - polish
  - pwa
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies:
  - task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Phase 5 parent task for building the PDF viewer, query history, PWA configuration, and polishing error states.

## Context
This phase completes the core user experience by enabling users to view cited contract sections directly, revisit past queries, install the app, and handle edge cases gracefully.

## Key Deliverables
- PDF viewer with page navigation and zoom
- Citation-to-PDF deep linking
- Query history page
- PWA configuration for installability
- Comprehensive error state handling

## Dependencies
- Requires Phase 4 (query system) to be complete
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Citation tap opens PDF at cited page
- [x] #2 User can navigate pages in PDF
- [x] #3 Return to answer via back button
- [x] #4 Recent queries accessible
- [x] #5 Tap past query to see full answer
- [x] #6 Offline message displayed when disconnected
- [x] #7 PWA installable on iOS and Android
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary (Completed 2026-01-20)

The Phase 5 implementation evolved significantly from the original plan, adopting a ChatGPT-style sidebar + split-view architecture instead of simple page navigation.

### Architecture Changes
- **Sidebar Navigation**: Added shadcn/ui sidebar with conversation history grouped by date
- **Split-View Layout**: Resizable panels - chat on left, PDF viewer on right (both visible)
- **Conversation Persistence**: Full multi-turn conversations stored in database (replaced single queries)
- **URL State Sync**: PDF panel state synced to URL params (`?doc=X&page=Y`)

### Database Schema
New tables added:
- `conversations` - Stores conversation metadata (user_id, title, timestamps)
- `messages` - Stores individual messages with role, content, and citations (JSONB)

### Key Components Built
- `AppSidebar` - Main sidebar with logo, new chat button, conversation list, user menu
- `ConversationList` - Date-grouped conversation history
- `SplitViewContainer` - Resizable panels with mobile sheet fallback
- `PdfPanelProvider` - Context for PDF state synced to URL
- `ChatClient` - Refactored chat component with conversation persistence

### Mobile Behavior
- Sidebar opens as sheet from left
- PDF opens as bottom sheet (85vh)
- Touch-friendly targets throughout

### Files Created/Modified
- `src/components/sidebar/` - All sidebar components
- `src/components/layout/` - AppShell, SplitViewContainer, AppHeader
- `src/contexts/pdf-panel-context.tsx` - PDF state management
- `src/app/(authenticated)/(app)/chat/` - New conversation routes
- `src/app/api/conversations/` - Conversation CRUD API
- `src/lib/db/conversations.ts`, `messages.ts` - Data access layer
- `supabase/migrations/` - Conversations/messages tables
<!-- SECTION:NOTES:END -->
