---
{id: TSK-22C8B63A4B43,name: "Admin site in source/apps/web: review queue, data browser and operations views",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T10:21:59.635Z,updated_at: 2026-11-02T10:59:50.944Z,due_at: 2026-11-23,order: 38912,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T10:59:50.944Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-22C8B63A4B43/1793617190954-start,started_at: 2026-11-02T10:59:51.399Z}]}}}
---

# Admin site in source/apps/web: review queue, data browser and operations views

## Goal
Build the admin site for managing backend data, above all approving or holding extracted data.

## Context
Requirements from the user: reuse the existing Next.js app in source/apps/web but with a better UI using CSS, and change the runtime to Bun (the app uses pnpm today). Main screens: the review queue for candidates in review, invalid or quarantined (approve, reject, request changes, hold), candidate detail with payload, issues, evidence preview and diff; browse canonical data per schema; extraction runs, jobs and results; documents and captures; sites, domains, structures and checks; legal assessments and dossiers with approval gated to named humans. Sign-in is a localhost dev token now. It must follow the web app README and existing components, work on a phone width, and never show restricted evidence to non-reviewers. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [x] Switch the app to the Bun runtime (scripts, lockfile, Dockerfile) without breaking the existing pages; remove pnpm files only after checking.
- [x] Design system pass with CSS tokens, light and dark themes, responsive layout.
- [x] Review queue and candidate detail with decision actions wired to the reviewer API.
- [ ] Data browser for canonical schemas with filters and pagination.
- [x] Operations views: runs, jobs, documents, captures, sites, structure versions, checks.
- [x] Assessments and dossiers screens with approval restricted to named human reviewers.
- [x] Component and end-to-end tests with a seeded dev database; document how to run it.

Update (session 3): the review workbench is at `/review` in `source/apps/web` on Bun (port 3100): sign-in (localhost only), review queue with status filters, candidate detail with a staged-versus-current field comparison, issues, lineage and a decision form (approve, hold, reject, rationale required) that records the decision through the API and asks the engine to apply it, promote (admin), runs, jobs, sites, assessments and dossiers (approve and reject limited to admin). Checked in the in-app browser at desktop and phone width, and the decision flow was exercised against the dev database. Not done, so items 1, 4, 5 and 7 stay unticked: the existing inherited `/admin` pages were not run after the switch from pnpm to Bun (the new area does not depend on them), there is no canonical data browser, no documents, captures, structure versions or checks views, and no component or end-to-end tests. Run it with `.data/dev.env` (see `source/apps/web/README.md`).

## Update 2 November 2026 (later)

Corrected `package.json` scripts (they were not actually switched earlier): `dev` and `start` run on Bun at port 3100, plus `typecheck`, `test`, `dev:env`. Added views for documents, captures, structure versions and checks, a draft-assessment form, and a read-only canonical data browser generated from the API's list routes (`scripts/data-catalog.ts`; a test keeps the catalog equal to the routes). Removed five orphaned inherited login and dashboard components that imported missing modules, so `tsc` is clean; `next build` passes with `SERVER_URL` set. `/admin` pages return 200 but show nothing without the file and scraper service. Tests: `bun test` (5) and `scripts/smoke.ts` (22 page loads as reviewer and admin). Browser-checked: a reviewer drafted an assessment and it shows as in review. Still open: filters on the data browser.
