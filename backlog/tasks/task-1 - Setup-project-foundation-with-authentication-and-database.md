---
id: task-1
title: Setup project foundation with authentication and database
status: To Do
assignee: []
created_date: '2026-01-19 19:40'
labels:
  - P0
  - infrastructure
  - phase-1
milestone: 'Phase 1: Foundation (Weeks 1-2)'
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Phase 1 parent task establishing core infrastructure for ShopTalk MVP. This phase includes Clerk authentication setup, Supabase database configuration, and CI/CD pipeline establishment. All subsequent phases depend on this foundation.

## Context
This is the first phase of the 6-phase, 6-8 week MVP development roadmap. The foundation must be solid to support the contract query retrieval system.

## Key Deliverables
- Clerk authentication with magic link flow
- Supabase database with user schema and RLS
- GitHub Actions CI/CD with Vercel deployment
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User can sign up with phone number or email
- [ ] #2 Magic link authenticates and redirects to app
- [ ] #3 Session persists via HTTP-only secure cookies
- [ ] #4 User record created in database on first auth
- [ ] #5 App deployed to Vercel staging environment
<!-- AC:END -->
