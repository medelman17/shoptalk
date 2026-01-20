---
id: task-4
title: Implement contract query retrieval and LLM response generation
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 04:37'
labels:
  - P0
  - retrieval
  - llm
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies:
  - task-2
  - task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Phase 4 parent task for building the core query-answer system. This phase combines hybrid retrieval (vector + keyword search) with Claude LLM for generating accurate, cited responses to contract questions.

## Context
This is the heart of ShopTalk - users ask questions in plain English and receive answers with citations to specific contract provisions. The system must be accurate, fast (< 4 seconds), and always cite sources.

## Key Deliverables
- Hybrid retrieval pipeline (vector + BM25)
- Claude LLM integration with citation prompts
- Citation parsing and validation
- Query API endpoint with rate limiting
- Query interface components

## Dependencies
- Requires Phase 2 (user profiles for document scope)
- Requires Phase 3 (document embeddings for retrieval)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User types question in plain English
- [ ] #2 Query submits with single tap or Enter key
- [ ] #3 Loading indicator during processing
- [ ] #4 Response returns within 3-4 seconds
- [ ] #5 Every claim includes inline citation
- [ ] #6 Citations tappable with document reference
- [ ] #7 Disclaimer displayed with every response
- [ ] #8 Search limited to user's applicable documents
<!-- AC:END -->
