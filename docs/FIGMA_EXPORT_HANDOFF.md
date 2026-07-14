# Figma Export Handoff

## Purpose

This project has a Figma/Make generated React + Vite + Tailwind reference export.

The export is not the frontend implementation. It is only a visual and component reference.

## Reference locations

```text
design/figma/export/Wordix Language Learning Platform.zip
design/figma/react-reference
design/figma/screenshots/light
design/figma/screenshots/dark


Rules for Codex
Read AGENTS.md first.
Read this file before UI implementation.
Read DESIGN_SYSTEM.md and UI_SCREEN_INVENTORY.md.
Inspect design/figma/react-reference/src/index.css for theme tokens.
Inspect design/figma/react-reference/src/pages for visual page structure.
Inspect design/figma/react-reference/src/components for reusable UI references.
Do not copy React components into Angular.
Rebuild the UI in Angular + Tailwind + NgRx.
Do not create fake API behavior.
Do not send keycloakUserId, userId or userProfileId from frontend.
One login screen only.
Role redirect after login:
admin -> /admin/dashboard
basic_user -> /dashboard
Support light and dark mode.
No dead buttons.
If a visual action has no backend endpoint

Allowed behavior:

disabled button with clear reason
Coming Soon badge
local-only preview modal
route placeholder page

Forbidden behavior:

fake successful API calls
hardcoded user ownership
sending userId/keycloakUserId from frontend
```
