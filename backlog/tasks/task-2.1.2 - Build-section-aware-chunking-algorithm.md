---
id: task-2.1.2
title: Build section-aware chunking algorithm
status: To Do
assignee: []
created_date: '2026-01-14 08:04'
labels: []
dependencies: []
parent_task_id: task-2.1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Split extracted text into chunks respecting article/section boundaries
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Target chunk size 300-500 tokens
- [ ] #2 Chunks break at section boundaries when possible
- [ ] #3 50 token overlap between chunks
- [ ] #4 Article/section headers detected via regex
- [ ] #5 Tiktoken used for accurate token counting
<!-- AC:END -->
