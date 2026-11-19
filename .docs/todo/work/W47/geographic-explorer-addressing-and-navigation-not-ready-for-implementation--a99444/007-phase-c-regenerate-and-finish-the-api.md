---
{id: TSK-76DD5D22DDB8,name: "Phase C: regenerate and finish the API",type: task,status: in-progress,priority: medium,created_at: 2026-11-18T22:29:03.905Z,updated_at: 2026-11-19T13:16:08.087Z,order: 7168,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:08.087Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-76DD5D22DDB8/1795094168089-start,started_at: 2026-11-19T13:16:09.627Z}]}}}
---

# Phase C: regenerate and finish the API

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
