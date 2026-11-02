---
{id: TSK-6EF29D43B416,name: "Reviewer-only API endpoints for staging, runs, jobs, documents and sites",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T10:21:59.477Z,updated_at: 2026-11-02T10:26:17.780Z,due_at: 2026-11-09,order: 37888,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T10:26:17.780Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6EF29D43B416/1793615177781-start,started_at: 2026-11-02T10:26:18.174Z}]}}}
---

# Reviewer-only API endpoints for staging, runs, jobs, documents and sites

## Goal
Give the admin site a safe way to read and act on pipeline data through the NestJS API.

## Context
The user decided (2026-11-02) on reviewer and admin only endpoints authored in Dryv, not a separate admin backend. Needed reads: staging candidates with payload, issues, lineage to extraction result, capture, document and site, and a diff against the current canonical record; staging runs; engine jobs; source documents and captures; the website registry (sites, domains, structure versions, checks, assessments, dossiers). Needed actions: record a review decision (the audit write path already accepts target staging.candidates), an admin-only promote action that calls the database engine promotion, and assessment drafts and approvals by named human accounts. The API read role currently sees only candidate ids in staging, so grants or SQL views need care, and assessments stay internal. Dev token login for a seeded reviewer must be refused outside localhost. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Dryv contracts and generated endpoints for the reads above, restricted by role policy to reviewer or admin, with tests.
- [x] Candidate detail returns payload, issues, lineage and a diff to the current canonical record.
- [x] Promote action (admin) delegating to the database engine, with deferral reasons returned.
- [ ] Assessment and dossier endpoints: draft by any reviewer, approval only by an account with a reviewer or admin grant, never by an agent.
- [x] Localhost-only dev token minting for a seeded reviewer account; real OIDC later through the same verifier.
- [x] Update access rules, run bun run check and generated:check, API tests green.

## Progress 2026-11-02 (session 3)

Done and committed: the `access` catalogue (roles, permissions, role permissions, `account_permissions` view) with a migration, permission-based policy checks in the API (`PipelineReadAccess`, `AssessmentApproveAccess`, `CandidatePromoteAccess`, `AccessManageAccess`; direct `permissions` token claim for fine-grained grants), a read-only reviewer role (`bun src/cli.ts grants-reviewer <role>`, connection `DATABASE_REVIEWER_URL`), and the `pipeline` Dryv group with reads for candidates (list and detail with payload, issues, capture lineage and the current canonical record), runs, jobs and sites, plus `POST /v1/pipeline/candidates/{id}/promote` that runs the engine's `promote-one` under `DATABASE_PROMOTE_URL` (`ENGINE_DATABASE_DIR` optional).

Still open, so items 1 to 5 stay unticked: documents, captures, structure versions, checks, assessments and dossiers endpoints; a field-level diff (only the current record is returned); document and site lineage (null for now); a promote test against a real approved candidate; assessment draft and approve endpoints; the localhost dev-token minting. Decisions: promotion via an internal command runner, approvals as separate permissions held by admin only for now.

Update (session 3, later): added `ApplyReviewDecisions`, `FindAssessments`, `FindDossiers`, `ApproveAssessment`, `RejectAssessment` to the pipeline group. Assessment decisions run in the database engine (`decide-assessment`): append-only (a decision is a new row superseding the current one), only an active human account holding `assessment.approve` (agent, service and bot issuers are always refused), approval needs a scope and a rationale. Promotion collisions on a natural key now defer with a reason instead of failing. Dev sign-in lives in the admin site's server side (it signs tokens for the seeded dev accounts with a key in `.data/dev-auth`; the API verifies with `AUTH_PUBLIC_KEY`). Still open, so items 1 and 4 stay unticked: endpoints for documents, captures, structure versions and checks, and assessment drafting by a reviewer through the API (drafts currently come from the data engine).
