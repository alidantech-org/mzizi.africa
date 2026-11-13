---
{id: TSK-83373A0C30E4,name: "Add an immutable storage constraint for versions, wording and captures",type: task,status: planned,priority: medium,created_at: 2026-11-13T08:20:20.533Z,updated_at: 2026-11-13T08:20:20.533Z,order: 9216}
---

# Add an immutable storage constraint for versions, wording and captures

## Goal

Filesystem versions, Legal wording versions, Source captures and assessments must never change after they are written, because they carry evidence and hashes. Dryv has no way to say that, so the contracts only describe it in comments. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: immutable versions in filesystem.ts, immutable wording and hashes in legal.ts, immutable releases, captures and assessments in source.ts.
- Proposed authoring: a storage constraint such as immutable({ except: ["deletedAt"] }) that rejects updates and deletes of existing rows apart from the listed fields.
- The relational pack should lower it to a trigger; other packs can lower it to repository checks or report it unsupported.
- Soft deletion and administrative correction need an explicit, documented way out; decide with the owner whether deletedAt may change.

## Acceptance checklist

- [ ] Add the constraint kind to the author, compiler mapping, Python IR, validation and generator context.
- [ ] Lower it to a trigger in the rust-sql pack.
- [ ] Apply it to the affected schemas and delete the matching comments.
- [ ] Document the allowed exceptions in the IR reference.
- [ ] Run formatting and typechecks only, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.
