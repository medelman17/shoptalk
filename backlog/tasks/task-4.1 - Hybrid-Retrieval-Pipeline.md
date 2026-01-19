---
id: task-4.1
title: Hybrid Retrieval Pipeline
status: To Do
assignee: []
created_date: '2026-01-19 19:43'
labels:
  - P0
  - retrieval
  - search
  - phase-4
milestone: 'Phase 4: Retrieval (Weeks 4-6)'
dependencies: []
parent_task_id: task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build hybrid search combining vector similarity and keyword matching for optimal retrieval.

## Implementation Steps
1. Implement vector search via Pinecone:
   - Embed user query
   - Query with document scope filter
   - Return top-k results with scores
2. Implement BM25 keyword search:
   - Index document chunks
   - Query with same scope filter
   - Return top-k results with scores
3. Combine using Reciprocal Rank Fusion (RRF):
   - Merge results from both methods
   - Re-rank by combined score
   - Return top-k final results
4. Add document scope filtering from user profile

## RRF Formula
```
RRF_score = Σ 1 / (k + rank_i)
```
Where k is a constant (typically 60) and rank_i is the rank in each result set.

## Retrieval Parameters
- Vector search: top 20
- BM25 search: top 20
- Final results: top 10 after RRF
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Vector search returns relevant chunks from Pinecone
- [ ] #2 BM25 search indexes all document chunks
- [ ] #3 RRF combines and re-ranks results correctly
- [ ] #4 Document scope filter restricts to user's documents
- [ ] #5 Retrieval latency under 1 second
<!-- AC:END -->
