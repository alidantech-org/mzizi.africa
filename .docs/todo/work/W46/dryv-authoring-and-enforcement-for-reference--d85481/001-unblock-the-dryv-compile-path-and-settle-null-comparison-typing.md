---
{id: TSK-C87A94F0C856,name: Unblock the Dryv compile path and settle null comparison typing,type: task,status: completed,priority: medium,created_at: 2026-11-13T07:26:44.056Z,updated_at: 2026-11-13T07:28:02.700Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T07:27:12.185Z},{from: in-progress,to: completed,at: 2026-11-13T07:28:02.700Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C87A94F0C856/1794554832195-start,started_at: 2026-11-13T07:27:12.962Z,end_ref: refs/tracking/TSK-C87A94F0C856/1794554882702-end,ended_at: 2026-11-13T07:28:02.701Z,summary: {files: 5,insertions: 21,deletions: 16}}]}}}
---

# Unblock the Dryv compile path and settle null comparison typing

## Goal

The Reference contracts now use base entities, the rule builder and self relations, but none of it has been through the real Dryv compile. This task makes that check reachable and answers one open question, so every later step can be verified. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- Unrelated breakage blocks the check today: archived imports in dryv/contracts/apps/main, referenceLegalSchemas imports in finance.ts and governance.ts, and a missing source/backend/database/src/cli.ts used by the catalog stability step.
- reference.ts uses an equality comparison against a null literal for isNull. An older comment claimed the engine cannot type that, while the SQL pack renders it as IS NULL. One of them is stale.
- Types come from the local Dryv source through dryv/tsconfig.json, but generation runs from the built dist, so the two can disagree.
- Related: .docs/_plan and the Dryv engine expression validation.

## Acceptance checklist

- [x] Remove or repoint the stale imports so the Reference contracts compile as part of the database app, touching only dryv/contracts files.
- [x] Run the Dryv engine compile on a schema using isNull and record whether the null literal comparison is accepted; fix or document the stale comment.
- [x] Decide and write down how generation picks up the local Dryv author (build dist, or resolve source), in the dryv README.
- [x] Run formatting and the dryv typecheck only; report remaining failures that are not in Reference.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.

## Comments

### 2026-11-13T07:28:02.468Z · PETER IRUNGU

Fixed Reference-related imports in database app, finance and governance. dryv-ts compile and doctor pass for contracts/apps/database. Engine already accepts null-literal comparison (common/expressions.py), so isNull is supported. contracts/apps/main still imports the deleted _archive and needs an owner decision (repair or retire the legacy NestJS app).
