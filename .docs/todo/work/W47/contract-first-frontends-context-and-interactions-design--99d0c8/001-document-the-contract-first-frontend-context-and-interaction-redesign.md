---
{id: TSK-FC2577CDD853,name: "Document the contract-first frontend, context and interaction redesign",type: task,status: completed,priority: medium,created_at: 2026-11-18T17:51:45.707Z,updated_at: 2026-11-18T17:57:43.781Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-18T17:57:42.373Z},{from: in-progress,to: completed,at: 2026-11-18T17:57:43.781Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-FC2577CDD853/1795024662383-start,started_at: 2026-11-18T17:57:43.043Z,end_ref: refs/tracking/TSK-FC2577CDD853/1795024663783-end,ended_at: 2026-11-18T17:57:43.781Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Document the contract-first frontend, context and interaction redesign

## Goal

Write the design documents that decide how the Mzizi frontends, context resolution and user interactions will be built, so that later implementation groups only execute agreed designs. This answers the 2026-11-18 audits: hand-built pages, browser fetches, hard-coded country knowledge and screen logic assembled in the UI.

## Context

Read the two handoffs of 2026-11-18, the approved plan, DEC-FRONTEND-ASSEMBLY-20261117 (which this work supersedes), DRYV_GAPS, LEGALITY_SAFETY_AND_COMPLIANCE and the rules under .docs/rules. Owner decisions: every request goes through the generated SDK; Dryv is improved instead of worked around; multi-country now; country from the Cloudflare country header; interface copy stored in the database per language; composed reads authored in contracts; admin and old mobile removed.

## Acceptance checklist

- [x] UI information architecture document covers site map, address scheme, navigation, entry journey and page templates, with a table mapping every current web page and Flutter screen to its new address.
- [x] User interactions and trust document covers anonymous device identity, web likes and views with deduplication, mobile-only posting with GPS and fingerprint, content filtering, privacy law, abuse cases and open questions.
- [x] Context and localisation document covers country, language, region, currency, concept vocabulary, resolution order, Cloudflare trust and caching.
- [x] Contract authoring document covers features, views, intents, navigation, copy, composed reads and what packs generate versus what stays hand-written.
- [x] Dryv capability plan lists each gap with proposal, test and proving slice.
- [x] Blast radius and migration document records method, measured counts, order and estimates.
- [x] Decision records written, and the superseded decision marked as superseded.
- [x] Review workbench behaviour recorded, admin and old mobile removed, and every reference rewritten as deferred and removed.
- [x] task validate passes.

## Comments

### 2026-11-19T11:24:27.538Z · PETER IRUNGU

Follow-up routing assessment requested by owner, 2026-11-19: inspected active web catch-all, shell, place switcher and backend context/legal/statistics reads. Recommendation for discussion, not an approved implementation decision: explicit country-prefixed place-only paths with a typed view query parameter; fragments only for within-page anchors. Current shell scopes only Calendar and Infrastructure; other sidebar entries leave the place. Catch-all supports selected section suffixes, not all domains. Country resolution currently precedes path parsing and depends on preference/edge/default; explicit path country must win. Introduce a shared resolved place context and domain-specific backend applicability rules, keeping local statistics distinct from ancestor benchmarks and preserving evidence, review state and effective time. Routing ancestry is one canonical navigation hierarchy and cannot substitute for jurisdiction or electoral relationships. No application changes made.
