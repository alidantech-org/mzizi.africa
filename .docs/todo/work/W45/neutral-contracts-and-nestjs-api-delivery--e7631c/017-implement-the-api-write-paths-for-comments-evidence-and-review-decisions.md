---
{id: TSK-448E55263881,name: "Implement the API write paths for comments, evidence and review decisions",type: task,status: planned,priority: medium,created_at: 2026-11-02T05:14:40.596Z,updated_at: 2026-11-02T05:14:46.987Z,order: 17408,due_at: 2026-11-02}
---

# Implement the API write paths for comments, evidence and review decisions

## Goal

Implement the only writes the API permits, using the write-path contracts: comments, evidence references and role-gated review decisions, without letting the API silently change canonical records.

## Context

Contracts for these writes are authored in the write-path contracts task, and code is generated in the generate-and-validate task. This task completes the scaffolded use cases, adds the JWT and role guards decided in DEC-API-AUTH-RBAC, adds a second restricted-writer data source, and records actor, time and rationale on every write. Evidence uploads go through the files service by reference only (DEC-EVIDENCE-VIA-FILES). The database management engine owns the tables and the writer role's grants, so tests create their own scratch schema.

## Acceptance checklist

- [ ] Add a restricted-writer data source and configuration separate from the read-only one.
- [ ] Implement bearer token validation and role guards for contributor, reviewer and admin.
- [ ] Complete the comment, evidence reference and review decision use cases with actor, time and rationale recorded.
- [ ] Test that the writer role can insert only into the permitted tables and cannot modify canonical tables.
- [ ] Document the write boundary in ARCHITECTURE.md.
