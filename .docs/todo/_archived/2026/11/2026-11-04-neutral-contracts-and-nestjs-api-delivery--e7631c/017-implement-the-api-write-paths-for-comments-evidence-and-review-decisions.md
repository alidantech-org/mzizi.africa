---
{id: TSK-448E55263881,name: "Implement the API write paths for comments, evidence and review decisions",type: task,status: completed,priority: medium,created_at: 2026-11-02T05:14:40.596Z,updated_at: 2026-11-02T05:41:48.439Z,order: 17408,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:36:52.313Z},{from: in-progress,to: completed,at: 2026-11-02T05:41:48.439Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-448E55263881/1793597812315-start,started_at: 2026-11-02T05:36:52.540Z,end_ref: refs/tracking/TSK-448E55263881/1793598108441-end,ended_at: 2026-11-02T05:41:48.439Z,summary: {files: 23,insertions: 766,deletions: 170}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Implement the API write paths for comments, evidence and review decisions

## Goal

Implement the only writes the API permits, using the write-path contracts: comments, evidence references and role-gated review decisions, without letting the API silently change canonical records.

## Context

Contracts for these writes are authored in the write-path contracts task, and code is generated in the generate-and-validate task. This task completes the scaffolded use cases, adds the JWT and role guards decided in DEC-API-AUTH-RBAC, adds a second restricted-writer data source, and records actor, time and rationale on every write. Evidence uploads go through the files service by reference only (DEC-EVIDENCE-VIA-FILES). The database management engine owns the tables and the writer role's grants, so tests create their own scratch schema.

## Acceptance checklist

- [x] Add a restricted-writer data source and configuration separate from the read-only one.
- [x] Implement bearer token validation and role guards for contributor, reviewer and admin.
- [x] Complete the comment, evidence reference and review decision use cases with actor, time and rationale recorded.
- [x] Test that the writer role can insert only into the permitted tables and cannot modify canonical tables.
- [x] Document the write boundary in ARCHITECTURE.md.

## Progress

Write paths implemented and tested end to end. Because the NestJS pack does not wire contract policies into guards, dryv/tools/export-access.ts exports each operation's policy and the valid target kinds from the compiled IR to src/auth/access-rules.generated.ts (checked by bun run check). Project-owned src/auth adds roles, token verification with jose (issuer, optional audience, JWKS or PEM key, uuid subject, highest of the roles claim; fails closed), a global AuthGuard (401 without a valid token, 403 for a role below the policy) and an ActorInterceptor that carries the verified actor to the use case; a first attempt using enterWith in the guard did not reach the handler and was caught by the HTTP test. The three create use cases stamp actorId or reviewerId from the token, validate targetKind against the exported list (so it is safe as a table name) and require the target to exist, and write through src/database/write-database.ts, a lazily created connection that knows only the audit entities. 14 unit tests cover roles, the verifier and the guard; an HTTP integration test on PostgreSQL uses separate reader and writer roles and proves 401, 403, actor from token not body, unknown or missing target, reply threading, malformed evidence, public listing, that the writer role is refused UPDATE and DELETE on audit tables and any write to canonical tables, and that a jurisdiction is untouched after all writes. Full suite: 492 files, 14023 tests. ARCHITECTURE.md section 7 and the API README document the boundary.
