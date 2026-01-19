---
id: task-5
title: Build PDF viewer and complete user experience polish
status: To Do
assignee: []
created_date: '2026-01-19 19:43'
labels:
  - P0
  - polish
  - pwa
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies:
  - task-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Phase 5 parent task for building the PDF viewer, query history, PWA configuration, and polishing error states.

## Context
This phase completes the core user experience by enabling users to view cited contract sections directly, revisit past queries, install the app, and handle edge cases gracefully.

## Key Deliverables
- PDF viewer with page navigation and zoom
- Citation-to-PDF deep linking
- Query history page
- PWA configuration for installability
- Comprehensive error state handling

## Dependencies
- Requires Phase 4 (query system) to be complete
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Citation tap opens PDF at cited page
- [ ] #2 User can navigate pages in PDF
- [ ] #3 Return to answer via back button
- [ ] #4 Recent queries accessible
- [ ] #5 Tap past query to see full answer
- [ ] #6 Offline message displayed when disconnected
- [ ] #7 PWA installable on iOS and Android
<!-- AC:END -->
