---
{id: TSK-2879CE30E0F5,name: Add contract typecheck and audit tooling,type: task,status: completed,priority: medium,created_at: 2026-11-02T05:14:40.252Z,updated_at: 2026-11-02T05:15:52.916Z,order: 14336,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:14:47.186Z},{from: in-progress,to: completed,at: 2026-11-02T05:15:52.916Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2879CE30E0F5/1793596487188-start,started_at: 2026-11-02T05:14:47.269Z,end_ref: refs/tracking/TSK-2879CE30E0F5/1793596552918-end,ended_at: 2026-11-02T05:15:52.916Z,summary: {files: 5,insertions: 149,deletions: 12}}]}}}
---

# Add contract typecheck and audit tooling

## Goal

Give the dryv/ project a fast, repeatable way to validate every contract before any code is generated, so errors are caught at the contract layer and generation only runs on contracts that already pass.

## Context

The reference backend at /home/alidante/Projects/personal/alidantech-org/systems/backend has dryv/tools scripts (contract archive boundary check, storage audit, generated cutover check) and package scripts typecheck, contracts:doctor, contracts:compile and check. Mzizi already has typecheck, doctor and compile scripts in dryv/package.json, linked to the local Dryv checkout because the published packages are out of date. This task adds Mzizi-specific audits: every entity extends EvidencedEntity, no country names appear in contracts, relations have no duplicate targets inside one entity, unbounded text has no max length, and every read operation has failure mappings. It also adds a generated-output check that confirms nothing outside the managed folders changed. Read dryv/README.md and .docs/decisions/dryv-pack-source.md first.

## Acceptance checklist

- [x] Add dryv/tools/audit-contracts.ts implementing the Mzizi contract rules above and failing with a clear list of violations.
- [x] Add dryv/tools/check-generated.ts that verifies generated folders match the lockfile state and that project-owned scaffolds are not modified by generation.
- [x] Wire bun run check in dryv/ to typecheck, audit, doctor and compile, and document it in dryv/README.md.
- [x] Run the checks against the geography and reference contracts and fix any findings.
- [x] Update .gitignore files so Dryv state, logs, staging and node_modules are ignored, and confirm git status is clean after a generation.

## Progress

Added dryv/tools/audit-contracts.ts (IR-based rules), dryv/tools/check-generated.ts (plan-based staleness check), bun run check and bun run generated:check, and a prepare script that links the local Dryv checkout. Ignore rules for .dryv, staging, node_modules and the auto-created root package.json are in .gitignore; git status is clean after generation. The audit was verified to fail on an over-long string maximum.
