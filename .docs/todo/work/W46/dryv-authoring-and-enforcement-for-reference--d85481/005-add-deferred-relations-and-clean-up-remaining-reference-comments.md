---
{id: TSK-282487876132,name: Add deferred relations and clean up remaining Reference comments,type: task,status: planned,priority: medium,created_at: 2026-11-13T07:26:45.129Z,updated_at: 2026-11-13T07:26:45.129Z,order: 5120}
---

# Add deferred relations and clean up remaining Reference comments

## Goal

Reference points at Geography, Filesystem and Legal targets that are not authored yet. This task makes those gaps explicit and reportable, and removes the last apologetic comments. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- provision_id, file_version_id, unit_id and the Legal basis link reference targets that live in other contracts or other database compositions, so they are typed ids without foreign keys.
- Comments currently describe this in prose and nothing fails when a target later appears.
- The Reference-owned Legal bridge is a design decision as well as a tooling gap, and needs the owner.

## Acceptance checklist

- [ ] Add a deferredRelation declaration that records target and reason and is never counted as enforced.
- [ ] Report deferred relations from the compiler and fail generation when a deferred target already exists in the composed app.
- [ ] Apply it to the open Reference relations and shorten their comments to the reason only.
- [ ] Write the Legal bridge decision as a short note in .docs/decisions for the owner to resolve.
- [ ] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.
