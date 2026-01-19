---
id: task-5.4
title: PWA Configuration
status: To Do
assignee: []
created_date: '2026-01-19 19:44'
labels:
  - P0
  - polish
  - pwa
  - phase-5
milestone: 'Phase 5: Polish (Weeks 6-7)'
dependencies: []
parent_task_id: task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Configure the app as a Progressive Web App for installability and offline support.

## Implementation Steps
1. Create Web App Manifest (manifest.json):
   - App name and short name
   - Icons (192px, 512px, maskable)
   - Theme and background colors
   - Display mode: standalone
   - Start URL
2. Build service worker:
   - App shell caching (HTML, CSS, JS)
   - API caching strategy (stale-while-revalidate)
   - Offline fallback page
3. Create offline page:
   - Friendly message explaining offline state
   - Option to retry when online
4. Implement install prompt:
   - Detect beforeinstallprompt event
   - Show custom install banner after 3rd query
   - Handle installation flow
5. Add iOS-specific meta tags:
   - apple-mobile-web-app-capable
   - apple-mobile-web-app-status-bar-style
   - apple-touch-icon

## Manifest Example
```json
{
  "name": "ShopTalk Contract Assistant",
  "short_name": "ShopTalk",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Web App Manifest created with all required fields
- [ ] #2 Service worker caches app shell
- [ ] #3 Offline fallback page displays when disconnected
- [ ] #4 Install prompt appears after 3rd query
- [ ] #5 iOS-specific meta tags configured
- [ ] #6 App installable on Chrome Android and Safari iOS
<!-- AC:END -->
