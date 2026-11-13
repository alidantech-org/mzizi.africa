---
{id: TSK-C87A94F0C856,name: Unblock the Dryv compile path and settle null comparison typing,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T07:26:44.056Z,updated_at: 2026-11-13T07:27:12.185Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T07:27:12.185Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C87A94F0C856/1794554832195-start,started_at: 2026-11-13T07:27:12.962Z}]}}}
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

- [ ] Remove or repoint the stale imports so the Reference contracts compile as part of the database app, touching only dryv/contracts files.
- [ ] Run the Dryv engine compile on a schema using isNull and record whether the null literal comparison is accepted; fix or document the stale comment.
- [ ] Decide and write down how generation picks up the local Dryv author (build dist, or resolve source), in the dryv README.
- [ ] Run formatting and the dryv typecheck only; report remaining failures that are not in Reference.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.
