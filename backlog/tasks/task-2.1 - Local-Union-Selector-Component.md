---
id: task-2.1
title: Local Union Selector Component
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
Build a searchable selector for choosing from ~200 Teamsters Local unions.

## Implementation Steps
1. Create Local union data source (JSON or database table)
2. Build searchable combobox component
3. Implement search by:
   - Local number (e.g., "804")
   - Local name (e.g., "New York")
   - City/state
4. Display Local name after selection
5. Add city/state search as fallback for users unsure of their Local number

## Data Structure
```typescript
interface LocalUnion {
  id: string;
  number: number;
  name: string;
  city: string;
  state: string;
  region: string; // For supplement mapping
}
```

## UX Considerations
- Most users know their Local number
- Some may need to search by location
- Display both number and name in dropdown
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Searchable dropdown displays all ~200 Locals
- [ ] #2 Search works by Local number
- [ ] #3 Search works by city or state name
- [ ] #4 Selected Local shows number and name
- [ ] #5 Selection persists to user profile
<!-- AC:END -->
