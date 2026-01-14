---
id: task-3.1.8
title: Add query endpoint rate limiting
status: To Do
assignee: []
created_date: '2026-01-14 08:05'
labels: []
dependencies: []
parent_task_id: task-3.1
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement rate limiting to prevent abuse and control costs
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Per-user rate limit (e.g., 20/hour)
- [ ] #2 Global rate limit for cost control
- [ ] #3 429 response with retry-after header
- [ ] #4 Rate limit headers in response
<!-- AC:END -->
