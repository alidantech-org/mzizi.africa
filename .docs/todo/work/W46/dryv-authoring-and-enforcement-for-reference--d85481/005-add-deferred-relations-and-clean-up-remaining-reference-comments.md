---
{id: TSK-282487876132,name: Add deferred relations and clean up remaining Reference comments,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T07:26:45.129Z,updated_at: 2026-11-13T07:33:07.152Z,order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T07:33:07.152Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-282487876132/1794555187154-start,started_at: 2026-11-13T07:33:07.612Z}]}}}
---

# Add deferred relations and clean up remaining Reference comments

## Goal

Reference points at Geography, Filesystem and Legal targets that are not authored yet. This task makes those gaps explicit and reportable, and removes the last apologetic comments. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- provision_id, file_version_id, unit_id and the Legal basis link reference targets that live in other contracts or other database compositions, so they are typed ids without foreign keys.
- Comments currently describe this in prose and nothing fails when a target later appears.
- The Reference-owned Legal bridge is a design decision as well as a tooling gap, and needs the owner.

## Acceptance checklist

- [x] Add a deferredRelation declaration that records target and reason and is never counted as enforced.
- [x] Report deferred relations from the compiler and fail generation when a deferred target already exists in the composed app.
- [x] Apply it to the open Reference relations and shorten their comments to the reason only.
- [x] Write the Legal bridge decision as a short note in .docs/decisions for the owner to resolve.
- [x] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.

## Comments

### 2026-11-13T07:36:13.877Z · PETER IRUNGU

Added field.deferredRelation({to, reason}) with engine validation that fails when the target already exists. The geography.units, filesystem.file_versions targets already exist in the database app, so unit_id and file_version_id are now real relations instead of deferred ones; no Reference field currently needs deferral. Compiler does not print a report of deferred relations (not built). Legal bridge written up as open decision DEC-REFERENCE-BINDING-LEGAL-BRIDGE-20261113; provision_id left a plain id.

### 2026-11-13T08:17:28.262Z · PETER IRUNGU

Owner order 2026-11-13: PatternVersion/PatternBinding/PatternDependency and LegalBasisLink + bridges removed from Reference (DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113). Parts of this task that targeted them (PatternBinding no-overlap, binding/legal relations) no longer apply in Reference; the Dryv features stay.
