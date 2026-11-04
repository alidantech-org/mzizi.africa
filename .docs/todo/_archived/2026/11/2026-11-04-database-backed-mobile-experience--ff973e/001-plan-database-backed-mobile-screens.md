---
{id: TSK-6701EA978AA1,name: Plan database-backed mobile screens,type: task,status: completed,priority: high,created_at: 2026-11-02T21:01:51.695Z,updated_at: 2026-11-02T21:03:25.246Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:01:53.390Z},{from: in-progress,to: completed,at: 2026-11-02T21:03:25.246Z}]},archived_at: 2026-11-04T21:31:36.115Z}
---

# Plan database-backed mobile screens

## Goal

Plan how the Mzizi database's approved, canonical public data will reach and appear in the Flutter app. Define a screen-by-screen journey, data-to-contract mapping, evidence and time presentation, rollout order and validation criteria. The goal is a mobile product that makes real Mzizi knowledge understandable while keeping canonical data and source rules in the backend.

## Context

The earlier mobile audit found that Explore uses the geography client, while History and Money contain local presentation samples and Saved state is in memory. The NestJS API already has read routes for geography, governance, people, elections, events, finance, debt, procurement, statistics and source records. The app must consume these contracts through the API; it must never connect directly to PostgreSQL or duplicate canonical facts. Contracts and routes do not prove every dataset is populated or public-ready. The most recent database summary is in `.docs/handoffs/data-engine-handoff-3.md`, but live database access was unavailable in the prior session, so data availability must be confirmed read-only before each integration slice. Record the product plan in `.docs/docs/MOBILE_DATA_DISPLAY_PLAN.md` and link it from the mobile alignment audit and roadmap.

## Acceptance checklist

- [x] Define the user journey and purpose for every existing mobile tab, including what data each tab reads and how it is shown.
- [x] Map candidate datasets to existing API contracts and flag where contract/data readiness must be checked before implementation.
- [x] Specify shared evidence, time, geography, verification, privacy and empty/offline presentation rules.
- [x] Propose a phased rollout with a useful MVP and explicit dependencies.
- [x] Link the plan from relevant product documentation and validate Task workspace documents.
