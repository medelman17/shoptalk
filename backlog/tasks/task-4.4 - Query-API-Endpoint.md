---
id: task-4.4
title: Query API Endpoint
status: To Do
assignee: []
created_date: '2026-01-19 19:43'
labels:
  - P0
  - retrieval
  - api
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies: []
parent_task_id: task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build POST /api/query endpoint with validation, rate limiting, and persistence.

## Implementation Steps
1. Create API route at /api/query
2. Input validation with Zod:
   - question: string (required, max 500 chars)
   - userId: string (from auth)
3. Implement rate limiting:
   - 30 queries per hour per user
   - Return 429 on limit exceeded
4. Orchestrate query flow:
   - Get user profile (document scope)
   - Run hybrid retrieval
   - Generate LLM response
   - Parse citations
   - Return structured response
5. Persist query to database:
   - Question, answer, citations
   - Timestamp, user ID

## Request/Response Schema
```typescript
// Request
{ question: string }

// Response
{
  answer: string;
  citations: Citation[];
  queryId: string;
}
```

## Error Responses
- 400: Invalid input
- 401: Unauthorized
- 429: Rate limit exceeded
- 500: Server error
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 POST /api/query endpoint created
- [ ] #2 Zod validation rejects invalid input
- [ ] #3 Rate limiting enforced (30/hour)
- [ ] #4 Query flow orchestrated correctly
- [ ] #5 Response includes answer and citations
- [ ] #6 Query persisted to database
<!-- AC:END -->
