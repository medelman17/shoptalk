---
id: task-2.3
title: Supplement Chain Logic
status: Done
assignee: []
created_date: '2026-01-19 19:41'
updated_date: '2026-01-19 23:50'
labels:
  - P0
  - onboarding
  - logic
  - phase-2
milestone: 'Phase 2: Onboarding (Weeks 2-3)'
dependencies: []
parent_task_id: task-2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement logic to determine which contract documents apply to each user based on their Local union.

## Implementation Steps
1. Create Local-to-supplement mapping table
2. Build function to resolve document scope from Local
3. Display applicable documents on profile confirmation
4. Store resolved supplement IDs in user profile

## Document Hierarchy
1. National Master Agreement (applies to ALL)
2. Regional Supplement (based on Local's region)
3. Local Rider (specific to Local union)

## Mapping Structure
```typescript
interface SupplementMapping {
  localId: string;
  supplements: {
    regional: string; // e.g., "western-supplement"
    rider: string;    // e.g., "local-804-rider"
  }
}
```

## MVP Documents (8-9 total)
- National Master Agreement
- 4-5 Regional Supplements
- 2-3 Local Riders
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Local-to-supplement mapping covers all MVP Locals
- [x] #2 Function returns correct supplements for any Local
- [x] #3 Confirmation screen shows all applicable documents
- [x] #4 Supplement IDs stored in user profile for query filtering
<!-- AC:END -->
