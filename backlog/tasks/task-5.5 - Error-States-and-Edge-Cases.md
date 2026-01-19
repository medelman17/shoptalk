---
id: task-5.5
title: Error States and Edge Cases
status: To Do
assignee: []
created_date: '2026-01-19 19:44'
labels:
  - P0
  - polish
  - error-handling
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies: []
parent_task_id: task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Handle all error states and edge cases throughout the application.

## Implementation Steps
1. Empty query handling:
   - Disable submit when empty
   - Show validation message if submitted empty
2. Network error recovery:
   - Detect network failures
   - Show retry option
   - Preserve query text for retry
3. "No results" messaging:
   - When retrieval returns no relevant chunks
   - Suggest rephrasing or contact support
4. Long query handling:
   - Character limit (500)
   - Show character count
   - Truncation warning
5. Rate limit UI:
   - Clear message when limit hit
   - Show reset time
   - Suggest trying later
6. Session expiry:
   - Detect 401 responses
   - Redirect to sign-in
   - Preserve destination for redirect

## Error Component
```typescript
interface ErrorDisplayProps {
  type: 'network' | 'rate-limit' | 'no-results' | 'generic';
  onRetry?: () => void;
  resetTime?: Date;
}
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Empty query shows validation message
- [ ] #2 Network errors show retry option
- [ ] #3 No results shows helpful message
- [ ] #4 Long queries show character warning
- [ ] #5 Rate limit shows reset time
- [ ] #6 Session expiry redirects to sign-in
<!-- AC:END -->
