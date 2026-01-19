---
id: task-4.2
title: LLM Response Generation with Claude
status: To Do
assignee: []
created_date: '2026-01-19 19:43'
labels:
  - P0
  - retrieval
  - llm
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies: []
parent_task_id: task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Integrate Claude AI for generating accurate, cited responses from retrieved context.

## Implementation Steps
1. Install Anthropic SDK
2. Design system prompt that:
   - Instructs Claude to answer contract questions
   - Requires inline citations for all claims
   - Specifies citation format: [Doc: X, Art: Y, Sec: Z, Page: N]
   - Includes disclaimer requirement
3. Build context assembly:
   - Format retrieved chunks
   - Include metadata for citations
   - Manage context window (100k tokens)
4. Implement streaming response
5. Handle rate limits and errors

## System Prompt Structure
```
You are a contract assistant for UPS Teamsters.
Answer questions based ONLY on the provided context.
ALWAYS cite your sources using [Doc: X, Art: Y, Sec: Z, Page: N].
If the answer is not in the context, say so.

Context:
[Retrieved chunks with metadata]

Question: {user_question}
```

## Streaming
Use Mastra's streaming capabilities for real-time response display.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Anthropic SDK configured with API key
- [ ] #2 System prompt produces cited responses
- [ ] #3 Context assembly handles retrieved chunks
- [ ] #4 Streaming response displays in real-time
- [ ] #5 Error handling for API failures
- [ ] #6 Total generation time under 3 seconds
<!-- AC:END -->
