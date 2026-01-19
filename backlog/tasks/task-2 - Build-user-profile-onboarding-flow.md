---
id: task-2
title: Build user profile onboarding flow
status: To Do
assignee: []
created_date: '2026-01-19 19:41'
labels:
  - P0
  - onboarding
  - phase-2
milestone: 'Phase 2: Onboarding (Weeks 2-3)'
dependencies:
  - task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Phase 2 parent task for creating the onboarding experience that captures user profile information. This phase determines which contract documents apply to each user based on their Local union and job classification.

## Context
Union members need to be associated with their specific Local union and job classification to receive relevant contract information. The supplement chain logic automatically determines which documents (Master Agreement, Regional Supplements, Riders) apply to each user.

## Key Deliverables
- Local union selector (searchable, ~200 Locals)
- Job classification selector (RPCD, Feeder, PT-Hub, etc.)
- Supplement chain mapping logic
- Settings page for profile management

## Dependencies
- Requires Phase 1 (authentication and database) to be complete
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User selects Local from searchable list
- [ ] #2 Local name displayed after selection
- [ ] #3 User selects job classification
- [ ] #4 System shows which documents apply to user
- [ ] #5 User can modify profile without re-authentication
- [ ] #6 Incomplete profiles redirect to onboarding
<!-- AC:END -->
