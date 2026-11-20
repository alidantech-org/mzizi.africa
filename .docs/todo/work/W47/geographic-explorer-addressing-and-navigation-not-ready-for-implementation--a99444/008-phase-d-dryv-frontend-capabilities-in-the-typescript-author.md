---
{id: TSK-522F24223BB1,name: "Phase D: Dryv frontend capabilities in the TypeScript author",type: task,status: in-progress,priority: medium,created_at: 2026-11-18T22:29:04.334Z,updated_at: 2026-11-19T13:04:37.571Z,order: 8192,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:04:37.571Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-522F24223BB1/1795093477573-start,started_at: 2026-11-19T13:04:38.815Z}]}}}
---

# Phase D: Dryv frontend capabilities in the TypeScript author

## Current owner-approved integration slice

The November 20 direction supersedes earlier web generation and planning-only prose below. Keep this same delivery programme: no second backlog. The web UI, theme, pages and navigation are handwritten. Dryv owns backend contracts, generated validation/controllers/service signatures, and the shared typed Next API Bridge client. Typed project-owned backend readers are allowed. App/dev generation and engine operations are outside this slice.

Implement anonymous setup in the welcome-page dialog, using registered country roots and canonical place slugs, country-scoped search and child-place reads, coordinate candidates requiring confirmation, independent device preferences, and a real place overview with honest recorded coverage. Preserve the permanent `/demo`; no prototype import or fallback dataset enters the real application. Do not add root seed inputs or reset a database. The remaining subject migrations in the broader programme remain open.

### Integration slice acceptance

- [x] Generate one shared route registry, grouped typed request helpers, compatibility re-exports and a client-safe routes/types barrel.
- [x] Generate and implement explicit-country bootstrap, context, search, children, coordinate and overview endpoints with validated named responses.
- [x] Connect the handwritten welcome dialog and canonical country/place pages through server-rendered generated-client reads.
- [x] Verify API scoping, identity errors, pagination, language/cookies, SSR and the complete setup flow; preserve `/demo` and record quality limitations.


## Goal

Add to Dryv the declarations the web needs: component catalog with typed props, shell binding, address grammar and place scope, navigation, context, intents, state, copy keys, page states, render mode, and a generated component gallery. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and is now governed by the consolidated group readiness gate; no runtime work, commit or push is authorized yet.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Implement the declarations in the TypeScript author, compiler and IR with validation rules and tests.
- [ ] Document that the Python author was not changed.
- [ ] Write the app-next templates: server pages, link builder, breadcrumbs, place switcher binding, sitemap, canonical and hreflang, gallery.
- [ ] Contracts compile and a sample app builds.

## Consolidated ownership and readiness

This task is the sole owner of Dryv frontend capabilities needed by both MUST-FIX.md and the new explorer. It remains planned and authorized for implementation. The target is one single-site, country-prefixed address model with grouped URL state and optional explicit language. Do not implement a temporary handwritten router, sidebar or data-loading layer and later replace it with generation. Existing typed sections must be reused, and actual generator gaps must be identified before any changes to the separate Dryv checkout. Preserve unrelated owner work. No autonomous commit or push is authorized by this merged plan.

## Integrated acceptance checklist

- [ ] Support contract-owned component catalogue, shell slots, address grammar, typed URL state, intents, navigation and context for the approved country-prefix-only scheme.
- [ ] Generate server-rendered product read wiring through generated server SDKs and named types, with interactive visual leaves receiving data and navigating for changed datasets.
- [ ] Generate copy bindings, loading/empty/error states, breadcrumbs, contextual sidebar, share/language behaviour and component gallery without hard-coded country, level, topic or indicator knowledge.
- [ ] Enforce runtime SDK server boundaries and catch browser-initiated product read patterns, including effect-driven server-action calls; approved mutations and device-local state remain distinct.
- [ ] Generate route-aware canonical metadata, sitemap/link helpers and regeneration evidence in coordination with the owning address and language tasks.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T22:36:35.785Z · PETER IRUNGU

Owner approved backend/client integration plan: shared generated next-api-bridge client with one routes.ts and feature-grouped request helpers; handwritten UI and permanent demo; anonymous welcome-dialog setup with cookie preferences; typed custom backend handlers are allowed. Implement bootstrap/context/search/children/coordinate resolution and initial overview, preserve active consumers with generated compatibility exports, and stop web frontend generation. No root seed additions or database resets are authorised by this work.
