---
id: task-1.2.5
title: Implement profile creation API
status: To Do
assignee: []
created_date: '2026-01-14 08:03'
labels: []
dependencies: []
parent_task_id: task-1.2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
POST /api/user/profile endpoint to create user profile during onboarding
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Validates local number exists
- [ ] #2 Validates classification is valid enum
- [ ] #3 Creates user record linked to Clerk ID
- [ ] #4 Returns created profile
- [ ] #5 409 if profile already exists
<!-- AC:END -->
