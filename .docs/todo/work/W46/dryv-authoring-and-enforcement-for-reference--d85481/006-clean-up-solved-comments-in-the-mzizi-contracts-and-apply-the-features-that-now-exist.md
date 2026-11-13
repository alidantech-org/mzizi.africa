---
{id: TSK-FFC7A61F3275,name: Clean up solved comments in the Mzizi contracts and apply the features that now exist,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T08:20:19.782Z,updated_at: 2026-11-13T08:21:25.512Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T08:21:25.512Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-FFC7A61F3275/1794558085514-start,started_at: 2026-11-13T08:21:26.015Z}]}}}
---

# Clean up solved comments in the Mzizi contracts and apply the features that now exist

## Goal

Several comments in dryv/contracts/schemas/mzizi warn about things Dryv could not do when they were written. Some of those features now exist, and some comments are simply stale. This task applies the existing features where the comments ask for them and removes the comments, so the contracts no longer complain about gaps that are closed. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Dryv now supports ordered and non-overlapping windows (rule.ordered, storage.noOverlap, ValidityEntity and EffectiveEntity), exactly-one rules, partial unique indexes (.unique(...).where(...)), and acyclic self-references.
- Comments in legal.ts, source.ts and official.ts still say interval ordering, partial uniqueness and one-of checks are unsupported, and filesystem.ts still asks for folder cycle rejection.
- Several file headers say generation is excluded or that a draft is not selected by the database application, but apps/database/index.ts composes these groups. source.ts calls Official identity an unresolved target although Official schemas exist. reference.ts says its field contract needs reconciliation.
- Do not touch comments about composite foreign keys, immutability, scheme membership, geometry, runtime behaviour or views; later tasks own those.

## Acceptance checklist

- [x] Apply no-overlap windows and ordered rules where legal and source comments ask for non-overlapping intervals.
- [x] Apply partial unique indexes for preferred name or identifier uniqueness in official.ts.
- [x] Apply acyclic constraints for self-referencing hierarchies such as folder parents and provision parents.
- [x] Delete or correct the stale generation-excluded, unresolved-target and reconciliation comments.
- [x] Run formatting and typechecks only, and report which comments remain and why.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.

## Comments

### 2026-11-13T08:22:25.656Z · PETER IRUNGU

Applied: folder/provision/instrument-version/provision-version acyclic constraints; provision wording ordered window plus no-overlap per provision; manifest release and binding ordered windows plus no-overlap; partial unique preferred names in official. Removed stale generation-excluded, unresolved-target and reconciliation comments. Left open on purpose: identifier uniqueness over nullable issuer/namespace columns needs NULLS NOT DISTINCT, which Dryv does not have yet. Typecheck and compile only; SQL unverified (task 2).
