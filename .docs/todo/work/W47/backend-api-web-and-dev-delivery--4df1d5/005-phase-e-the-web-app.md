---
{id: TSK-0CE2BE62D0CC,name: "Phase E: the web app",type: task,status: planned,priority: medium,created_at: 2026-11-18T22:29:04.846Z,updated_at: 2026-11-18T22:29:04.846Z,order: 5120}
---

# Phase E: the web app

## Goal

Rebuild the web app from contracts with every agreed feature, the new design and behaviours, full contextualisation and no hard-coding, verified in a browser against the seeded database. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Author every feature and view and regenerate the pages.
- [ ] Build the catalogue components and the hand-written shell in source/sdk/ui and delete lib/site, the client pages and the hard-coded strings, names, colours and navigation.
- [ ] Typecheck, lint patterns, production build and run against the API on mzizi_ux.
- [ ] Every page loaded and checked in the browser, with the five status layers recorded per feature.
