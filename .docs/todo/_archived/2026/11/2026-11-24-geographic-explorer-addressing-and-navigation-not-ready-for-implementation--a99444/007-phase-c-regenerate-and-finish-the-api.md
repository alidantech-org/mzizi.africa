---
{id: TSK-76DD5D22DDB8,name: "Phase C: regenerate and finish the API",type: task,status: archived,priority: medium,created_at: 2026-11-18T22:29:03.905Z,updated_at: 2026-11-24T19:15:25.867Z,order: 7168,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:08.087Z},{from: in-progress,to: archived,at: 2026-11-24T19:15:25.867Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-76DD5D22DDB8/1795094168089-start,started_at: 2026-11-19T13:16:09.627Z,end_ref: refs/tracking/TSK-76DD5D22DDB8/1795547725880-end,ended_at: 2026-11-24T19:15:25.867Z,summary: {files: 1871,insertions: 40177,deletions: 21479}}]}},archived_at: 2026-11-24T19:23:21.131Z}
---

# Phase C: regenerate and finish the API

## Current owner-approved integration slice

The November 20 direction supersedes earlier web generation and planning-only prose below. Keep this same delivery programme: no second backlog. The web UI, theme, pages and navigation are handwritten. Dryv owns backend contracts, generated validation/controllers/service signatures, and the shared typed Next API Bridge client. Typed project-owned backend readers are allowed. App/dev generation and engine operations are outside this slice.

Implement anonymous setup in the welcome-page dialog, using registered country roots and canonical place slugs, country-scoped search and child-place reads, coordinate candidates requiring confirmation, independent device preferences, and a real place overview with honest recorded coverage. Preserve the permanent `/demo`; no prototype import or fallback dataset enters the real application. Do not add root seed inputs or reset a database. The remaining subject migrations in the broader programme remain open.

### Integration slice acceptance

- [x] Generate one shared route registry, grouped typed request helpers, compatibility re-exports and a client-safe routes/types barrel.
- [x] Generate and implement explicit-country bootstrap, context, search, children, coordinate and overview endpoints with validated named responses.
- [x] Connect the handwritten welcome dialog and canonical country/place pages through server-rendered generated-client reads.
- [x] Verify API scoping, identity errors, pagination, language/cookies, SSR and the complete setup flow; preserve `/demo` and record quality limitations.


## Goal

Regenerate the API, engine models and SDKs, migrate the hand-written reads, and prove every operation against the seeded database. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and is now governed by the consolidated group readiness gate; no runtime work, commit or push is authorized yet.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Notes

This task is part of the consolidated, not-ready delivery plan. Its output must be reproducible from the contracts by regeneration alone, every deviation from the plan is recorded in the handoff with the reason, and any step that cannot be verified on this machine is reported as unverified instead of being claimed. The previous phase must be green before this one starts, except where the plan says otherwise.

## Acceptance checklist

- [ ] Regenerate with post-generation actions on apply and no hand edits in managed files.
- [ ] Migrate or replace every hand-written read that queries a removed schema and delete stale generated files.
- [ ] API typecheck and tests pass and every operation is exercised against mzizi_ux.
- [ ] Export the generation manifest and run dryv:verify for every app.

## Consolidated ownership and readiness

This task owns regeneration and API verification supporting the integrated frontend delivery. It remains planned and authorized for implementation. Preserve its API, engine-model and SDK consistency responsibilities even though it now sits in the geographic explorer group. The group does not reopen verified interactions or role-based indicator changes. Earlier runtime checks and the pasted report are evidence pointers, not proof that current contracts and code are synchronized. Do not start a new reseed, deployment, commit or push from historical autonomous wording. Any missing database inputs require the existing seed approval process.

## Integrated acceptance checklist

- [ ] Generate all affected clients, named response documents and persistence/API artifacts from the owning contracts without hand-editing managed output.
- [ ] Prove contextual composed operations, legal relevance, filtering, pagination, language fallback and country isolation through meaningful operation checks.
- [ ] Preserve indicator-role resolution and engagement permissions, device privacy and deduplication behaviour during regeneration.
- [ ] Exercise nearest-facility and download/export capabilities when their contracts are ready; record content gaps honestly rather than asserting every screen has data.
- [ ] Verify generation traceability and required API checks, and supply typed server SDK outputs to the web task before its feature slices are considered complete.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T13:20:44.626Z · PETER IRUNGU

Final selected API/web SDK and app generation reports output already matches the workspace (dryv result ok). Database regeneration also matches. Root check: all TypeScript projects pass; API tests552 files12861 tests pass, with expected skips/todos. Remaining root failures are Python formatting/lint/mypy, manifest8 failures692 passed35 skipped, baseline insights contract size, and database stream snapshot checksum. The new governance size regression was fixed by a separate integrity declaration module. The web scoped suite passes13 tests. This does not establish the still-missing composed APIs or SSR conversion across the whole app.

### 2026-11-19T22:36:34.586Z · PETER IRUNGU

Owner approved backend/client integration plan: shared generated next-api-bridge client with one routes.ts and feature-grouped request helpers; handwritten UI and permanent demo; anonymous welcome-dialog setup with cookie preferences; typed custom backend handlers are allowed. Implement bootstrap/context/search/children/coordinate resolution and initial overview, preserve active consumers with generated compatibility exports, and stop web frontend generation. No root seed additions or database resets are authorised by this work.

### 2026-11-20T07:34:07.205Z · PETER IRUNGU

Owner deleted api-ts and explicitly replaced the compatibility plan: regenerate one actions.ts and one routes.ts, with no action/router folders or legacy compatibility outputs. Emit group-prefixed action names to avoid collisions; retain only bridge runtime/helpers and a flat directory of named schema types. Existing frontend imports are intentionally left for later migration; no web files may be edited.

### 2026-11-20T07:56:33.049Z · PETER IRUNGU

Owner corrected the target to the exact DefyTickets server structure mapped onto src: actions/<resource>.actions.ts plus actions/index.ts; one routes.ts; helpers/{api,helpers,enum,index}; types/<resource>/{dto,enums,index} with barrels; client-safe src/index.ts. No v1.ts, version folders, per-operation action directories or compatibility shims. This supersedes the flat-file experiment. Web remains untouched; backend/client checkpoint commit is still authorised.

### 2026-11-20T08:02:16.808Z · PETER IRUNGU

Implemented the agreed DefyTickets layout with server mapped to src: 11 resource action modules and an actions barrel; one routes.ts covering 72 operations; helpers/{api,helpers,enum,index}; resource DTO/enum folders and barrels; client-safe src/index.ts. No version files, per-operation action folders, router folders or compatibility aliases remain. Dryv regenerated the client and --check reports identical output. SDK typecheck and three SDK ownership/layout tests pass. Root check --only sdk-ts passes the SDK checks but remains nonzero solely for pre-existing size failures in scripts/dev/dev_seed/extra.py and dryv/contracts/apps/api/insights.ts. Web files have not changed.
