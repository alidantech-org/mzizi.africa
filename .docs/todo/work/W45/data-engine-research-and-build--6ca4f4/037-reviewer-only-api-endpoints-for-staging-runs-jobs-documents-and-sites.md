---
{id: TSK-6EF29D43B416,name: "Reviewer-only API endpoints for staging, runs, jobs, documents and sites",type: task,status: planned,priority: medium,created_at: 2026-11-02T10:21:59.477Z,updated_at: 2026-11-02T10:21:59.477Z,due_at: 2026-11-09,order: 37888}
---

# Reviewer-only API endpoints for staging, runs, jobs, documents and sites

## Goal
Give the admin site a safe way to read and act on pipeline data through the NestJS API.

## Context
The user decided (2026-11-02) on reviewer and admin only endpoints authored in Dryv, not a separate admin backend. Needed reads: staging candidates with payload, issues, lineage to extraction result, capture, document and site, and a diff against the current canonical record; staging runs; engine jobs; source documents and captures; the website registry (sites, domains, structure versions, checks, assessments, dossiers). Needed actions: record a review decision (the audit write path already accepts target staging.candidates), an admin-only promote action that calls the database engine promotion, and assessment drafts and approvals by named human accounts. The API read role currently sees only candidate ids in staging, so grants or SQL views need care, and assessments stay internal. Dev token login for a seeded reviewer must be refused outside localhost. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Dryv contracts and generated endpoints for the reads above, restricted by role policy to reviewer or admin, with tests.
- [ ] Candidate detail returns payload, issues, lineage and a diff to the current canonical record.
- [ ] Promote action (admin) delegating to the database engine, with deferral reasons returned.
- [ ] Assessment and dossier endpoints: draft by any reviewer, approval only by an account with a reviewer or admin grant, never by an agent.
- [ ] Localhost-only dev token minting for a seeded reviewer account; real OIDC later through the same verifier.
- [ ] Update access rules, run bun run check and generated:check, API tests green.
