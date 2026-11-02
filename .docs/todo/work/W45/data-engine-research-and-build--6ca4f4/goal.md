---
{id: GOAL-GRP-B087576CA4F4,name: Data engine research and build goal,type: documentation,extra: {created_at: 2026-11-02T06:08:54.874Z,group: GRP-B087576CA4F4}}
---

# Goal

Make a working data engine: preserved evidence goes in, reviewed canonical records come out, and the existing NestJS API serves them. The group delivers a research and decision phase, a detailed task plan, and then a thin vertical slice that touches every layer once (file artifact, extraction, candidate records, validation, review, promotion, API read).

## Why it matters

The API and its contracts exist but only two test fixtures populate the database. Without the data engine and the database engine nothing real can be loaded, the legacy Python service cannot be retired, and the evidence-first promise of the platform is untested. Success means a documented layout and toolchain decision, versioned contracts between layers, a database package that owns schema and seeds, a data package that produces traceable candidates, and one dataset flowing end to end with provenance intact.
