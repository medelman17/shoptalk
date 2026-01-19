---
id: task-2.4
title: Settings Page
status: Done
assignee: []
created_date: '2026-01-19 19:41'
updated_date: '2026-01-19 23:50'
labels:
  - P0
  - onboarding
  - page
  - phase-2
milestone: 'Phase 2: Onboarding (Weeks 2-3)'
dependencies: []
parent_task_id: task-2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build settings page for viewing and editing user profile information.

## Implementation Steps
1. Create /settings route
2. Display current profile:
   - Local number and name
   - Job classification
   - Applicable documents
3. Enable editing of:
   - Local number
   - Job classification
4. Re-derive supplements on profile change
5. Add profile completeness check to redirect incomplete users

## Routes
- /settings - Main settings page
- Middleware to redirect incomplete profiles to /onboarding

## UX Considerations
- Editing should not require re-authentication
- Show confirmation when profile changes affect document scope
- Clear indication of which documents user has access to
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Settings page displays current Local and classification
- [x] #2 Settings page lists applicable documents
- [x] #3 User can edit Local without re-auth
- [x] #4 User can edit classification without re-auth
- [x] #5 Profile changes update supplement scope
- [x] #6 Incomplete profiles redirect to onboarding
<!-- AC:END -->
