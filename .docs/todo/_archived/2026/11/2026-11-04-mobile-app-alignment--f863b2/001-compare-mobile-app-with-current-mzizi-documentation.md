---
{id: TSK-C0572F7D40A8,name: Compare mobile app with current Mzizi documentation,type: task,status: completed,priority: high,created_at: 2026-11-02T20:53:37.462Z,updated_at: 2026-11-02T20:54:13.339Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T20:53:41.275Z},{from: in-progress,to: completed,at: 2026-11-02T20:54:13.339Z}]},archived_at: 2026-11-04T21:31:36.267Z}
---

# Compare mobile app with current Mzizi documentation

## Goal

Document the changes and direction expressed in the current Mzizi documentation, compare them with the Flutter mobile app as it exists, and produce an actionable, prioritized list of mobile improvements. This task is an alignment audit and documentation deliverable; implementation should be planned as follow-up work so that evidence and API contracts are settled before adding more client behavior.

## Context

The product direction is evidence-first, cross-domain and time-aware. The public mobile app is an application consumer: it should display canonical API data and make source, valid time, retrieval time, uncertainty and relationships understandable. The current geography slice has a versioned API contract and substantial client validation. Other mobile tabs may still show prototypes. Review `.docs/docs/WHY.md`, `STORY.md`, `ARCHITECTURE.md`, `DATA_LIFECYCLE.md`, `DOMAINS.md`, `MIGRATION.md`, `.docs/docs/geography-api-contract.md`, the mobile README, and the Flutter screens/models. Record findings in `.docs/docs/MOBILE_APP_ALIGNMENT.md` and link it from the repository map and implementation roadmap.

## Acceptance checklist

- [x] Summarize relevant documentation and recent direction changes, separating target architecture from implemented capability.
- [x] Compare each mobile screen and data model with product scope, API ownership, provenance, temporal context, uncertainty, persistence and accessibility needs.
- [x] Prioritize concrete mobile changes and identify API/contract prerequisites without assigning backend responsibilities to Flutter.
- [x] Link the audit from the repository map and mobile roadmap.
- [x] Validate Task workspace documents and inspect the final diff.
