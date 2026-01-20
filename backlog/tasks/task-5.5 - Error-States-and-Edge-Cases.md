---
id: task-5.5
title: Error States and Edge Cases
status: Done
assignee: []
created_date: '2026-01-19 19:44'
updated_date: '2026-01-20 15:09'
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
- [x] #1 Empty query shows validation message
- [x] #2 Network errors show retry option
- [x] #3 No results shows helpful message
- [x] #4 Long queries show character warning
- [x] #5 Rate limit shows reset time
- [x] #6 Session expiry redirects to sign-in
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Notes (Completed 2026-01-20)

### Error Display Component
- `src/components/ui/error-display.tsx` - Unified error UI
- `src/lib/errors/index.ts` - Error types and factory functions

### Error Types Handled
- `network` - Connection failures with retry button
- `rate-limit` - Shows reset time countdown
- `no-results` - Helpful suggestions to rephrase
- `validation` - Input validation errors
- `generic` - Fallback for unknown errors

### Input Validation
- `src/components/chat/character-counter.tsx` - Live character count
- `QUERY_MAX_LENGTH = 500` constant
- Visual warning when approaching limit
- Submit disabled when over limit

### Chat Error Integration
- `ChatClient` uses `createAppError()` to wrap errors
- Retry handler preserves last question
- Error clears on successful response

### Session Handling
- Clerk handles auth state
- 401 responses redirect via middleware
- No manual session expiry UI needed
<!-- SECTION:NOTES:END -->
