---
id: task-4.5
title: Query Interface Components
status: Done
assignee: []
created_date: '2026-01-19 19:43'
updated_date: '2026-01-20 04:37'
labels:
  - P0
  - retrieval
  - ui
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies: []
parent_task_id: task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the UI components for the contract query interface.

## Implementation Steps
1. Adapt/build query input component:
   - Text input for question
   - Submit button
   - Enter key submission
   - Character count
2. Build response display component:
   - Streaming text display
   - Inline citation rendering
   - Tappable citation links
3. Build loading states:
   - Skeleton/spinner during retrieval
   - Streaming indicator during generation
4. Build error states:
   - Rate limit message
   - Network error recovery
   - Empty input handling
5. Add disclaimer footer:
   - Persistent disclaimer text
   - Link to full terms

## Component Structure
```
<QueryPage>
  <QueryInput />
  <QueryResponse>
    <ResponseText citations={citations} />
    <CitationList />
  </QueryResponse>
  <Disclaimer />
</QueryPage>
```

## Mobile-First Design
- Full-width input on mobile
- Large touch targets (44px min)
- Thumb-reachable submit button
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Query input accepts text and submits on Enter
- [ ] #2 Loading indicator shown during processing
- [ ] #3 Response displays with streaming text
- [ ] #4 Citations render as tappable links
- [ ] #5 Error states display appropriate messages
- [ ] #6 Disclaimer visible with every response
<!-- AC:END -->
