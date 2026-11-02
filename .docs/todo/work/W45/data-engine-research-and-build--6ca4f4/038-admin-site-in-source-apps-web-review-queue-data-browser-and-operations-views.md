---
{id: TSK-22C8B63A4B43,name: "Admin site in source/apps/web: review queue, data browser and operations views",type: task,status: planned,priority: medium,created_at: 2026-11-02T10:21:59.635Z,updated_at: 2026-11-02T10:21:59.635Z,due_at: 2026-11-23,order: 38912}
---

# Admin site in source/apps/web: review queue, data browser and operations views

## Goal
Build the admin site for managing backend data, above all approving or holding extracted data.

## Context
Requirements from the user: reuse the existing Next.js app in source/apps/web but with a better UI using CSS, and change the runtime to Bun (the app uses pnpm today). Main screens: the review queue for candidates in review, invalid or quarantined (approve, reject, request changes, hold), candidate detail with payload, issues, evidence preview and diff; browse canonical data per schema; extraction runs, jobs and results; documents and captures; sites, domains, structures and checks; legal assessments and dossiers with approval gated to named humans. Sign-in is a localhost dev token now. It must follow the web app README and existing components, work on a phone width, and never show restricted evidence to non-reviewers. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Switch the app to the Bun runtime (scripts, lockfile, Dockerfile) without breaking the existing pages; remove pnpm files only after checking.
- [ ] Design system pass with CSS tokens, light and dark themes, responsive layout.
- [ ] Review queue and candidate detail with decision actions wired to the reviewer API.
- [ ] Data browser for canonical schemas with filters and pagination.
- [ ] Operations views: runs, jobs, documents, captures, sites, structure versions, checks.
- [ ] Assessments and dossiers screens with approval restricted to named human reviewers.
- [ ] Component and end-to-end tests with a seeded dev database; document how to run it.
