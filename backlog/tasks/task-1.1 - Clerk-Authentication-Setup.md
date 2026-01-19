---
id: task-1.1
title: Clerk Authentication Setup
status: Done
assignee: []
created_date: '2026-01-19 19:41'
updated_date: '2026-01-19 20:51'
labels:
  - P0
  - auth
  - phase-1
milestone: 'Phase 1: Foundation (Weeks 1-2)'
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up Clerk authentication with magic link flow for phone and email authentication.

## Implementation Steps
1. Install @clerk/nextjs package
2. Configure Clerk application in dashboard
3. Build /sign-in and /sign-up pages
4. Implement magic link flow (phone + email options)
5. Create auth callback handler
6. Add middleware for protected routes
7. Configure session settings (HTTP-only cookies)

## Technical Notes
- Use Clerk's Next.js App Router integration
- Magic link preferred over passwords for UX simplicity
- Phone verification for union workers who may not check email frequently
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 @clerk/nextjs installed and configured
- [x] #2 Sign-in page accepts phone or email
- [x] #3 Sign-up page captures phone or email
- [ ] #4 Magic link sent via SMS or email
- [x] #5 Callback handler redirects authenticated users
- [x] #6 Protected routes redirect unauthenticated users to sign-in
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed 2026-01-19: Installed @clerk/nextjs, created middleware.ts with route protection, wrapped app in ClerkProvider, created sign-in/sign-up pages, created auth utilities. Webhook configured in Clerk dashboard with CLERK_WEBHOOK_SECRET added to Vercel.
<!-- SECTION:NOTES:END -->
