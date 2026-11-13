---
{id: TSK-3873D2A8B028,name: Add Reference scheme membership for relations to Value,type: task,status: planned,priority: medium,created_at: 2026-11-13T08:20:20.794Z,updated_at: 2026-11-13T08:20:20.794Z,order: 10240}
---

# Add Reference scheme membership for relations to Value

## Goal

Many fields point at Reference Value but should only accept values of one scheme, for example a geographic feature type must belong to the geography.feature_type scheme. A plain relation accepts any value, so the comments say scheme-specific integrity is not enforceable. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: the expected-scheme notes in geography.ts, the typed Reference scheme membership blocker in filesystem.ts, and the scheme-aware value membership gate in source.ts.
- Proposed authoring: a relation option such as belongsTo(Value, { scheme: "geography.feature_type" }), kept explicit in the compiled contract.
- Lowering options in PostgreSQL are a trigger, or a check using a function that looks up the value's scheme code. Choose the simplest that keeps schema codes stable.
- Scheme codes are data, not schema, so the pack must fail clearly when a scheme code is unknown at generation time or document when it is only checked at runtime.

## Acceptance checklist

- [ ] Design the relation option and add it to the author, compiler mapping and Python IR.
- [ ] Lower it in the rust-sql pack and report unsupported targets clearly.
- [ ] Apply it to geography, filesystem and source fields that name an expected scheme.
- [ ] Delete the matching comments.
- [ ] Run formatting and typechecks only, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.
