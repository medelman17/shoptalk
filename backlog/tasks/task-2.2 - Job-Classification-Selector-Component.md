---
id: task-2.2
title: Job Classification Selector Component
status: To Do
assignee: []
created_date: '2026-01-19 19:41'
labels:
  - P0
  - onboarding
  - component
  - phase-2
milestone: 'Phase 2: Onboarding (Weeks 2-3)'
dependencies: []
parent_task_id: task-2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a selector for UPS job classifications that determine applicable contract language.

## Implementation Steps
1. Create classification data source
2. Build selector component (radio buttons or dropdown)
3. Include "Other" option with freeform input
4. Store classification in user profile

## Classifications (from PRD)
- RPCD (Regular Package Car Driver)
- Feeder (Feeder Driver)
- PT-Hub (Part-Time Hub Worker)
- PT-Air (Part-Time Air Driver)
- 22.4 (Combo Driver)
- FT-Inside (Full-Time Inside Worker)
- Other (with freeform input)

## UX Considerations
- Use full names, not abbreviations
- Brief description of each classification
- "Other" captures edge cases
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All standard classifications displayed
- [ ] #2 Other option allows freeform input
- [ ] #3 Selected classification persists to profile
- [ ] #4 Classification names are user-friendly (not abbreviations only)
<!-- AC:END -->
