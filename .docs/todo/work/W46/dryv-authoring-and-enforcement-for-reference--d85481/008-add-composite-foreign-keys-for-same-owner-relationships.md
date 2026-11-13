---
{id: TSK-96E83006EDC3,name: Add composite foreign keys for same-owner relationships,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T08:20:20.284Z,updated_at: 2026-11-13T08:21:26.983Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T08:21:26.983Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-96E83006EDC3/1794558086984-start,started_at: 2026-11-13T08:21:27.557Z}]}}}
---

# Add composite foreign keys for same-owner relationships

## Goal

Several contracts need a relation that points at two fields at once, for example a file's current version must belong to the same file, a provision version must belong to the same instrument as its provision, and a capture, document and file must agree on ownership. Today a relation targets one field, so these rules cannot be expressed and the comments call them persistence blockers. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: the persistence-blocker blocks in filesystem.ts and legal.ts and the required-gates block in source.ts.
- Dryv has a same-as storage constraint for self-references only, lowered to a unique key plus a composite foreign key. This task generalises it to a different target schema.
- Proposed authoring: a storage constraint such as references(["fileId", "ownerId"], Files, ["id", "ownerId"]), kept in the storage facet so schema and storage stay separate. It must be pack-neutral in the IR.
- The target needs a matching unique key; the pack should add it or report it missing clearly.

## Acceptance checklist

- [x] Add the constraint kind to the author, the compiler mapping, the Python IR and its validation.
- [x] Project it to generator context and lower it in the rust-sql pack to a composite foreign key and the required unique key.
- [x] Apply it to file/current-version, provision/version/instrument and capture/document/file in the contracts.
- [x] Delete the matching blocker comments.
- [x] Run formatting and typechecks only, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.

## Comments

### 2026-11-13T08:29:02.582Z · PETER IRUNGU

Added storage constraint kind references (author .references(name,{fields,target,targetFields}) with lazy target; compiler mapping; Python IR+validation+context; rust-sql composite FK plus the unique key on the target). Applied: Files.currentVersionId belongs to file; Captures.documentId belongs to capture source; ProvisionVersions provision and instrument version share an instrument (added instrumentId column); Provisions parent in same instrument (sameAs). Verified on a throwaway postgres: 11/11 valid and invalid rows behaved. Not covered: capture/file ownership (documents carry no file link), derivative cycles through file_relations (still open comment).
