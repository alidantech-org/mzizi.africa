---
{id: TSK-0826E5C938A4,name: Add a constraint construct for overlapping windows and nullable-scope uniqueness,type: task,status: planned,priority: medium,created_at: 2026-11-13T07:26:44.572Z,updated_at: 2026-11-13T07:26:44.572Z,order: 3072}
---

# Add a constraint construct for overlapping windows and nullable-scope uniqueness

## Goal

PatternBinding needs effective windows that cannot overlap for the same scope, and uniqueness over scope columns that may be null. This task adds a generic constraint declaration on schemas. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- PatternBinding has effective_from and effective_until (open when null) and optional unit_id, country_id and provision_id. Two null values are never equal in SQL, so a plain unique index does not protect nullable scopes.
- The comments at the file head and in PatternBinding say the pack must preserve interval ordering and nullable scope uniqueness.
- PostgreSQL offers exclusion constraints and NULLS NOT DISTINCT for this; Dryv has no authoring or IR form for either.
- The construct must be pack-neutral: authors state the rule; each pack picks the mechanism.

## Acceptance checklist

- [ ] Add schema.constraint(name, spec) to the author with an excludeOverlap and a nullable-aware scope option.
- [ ] Add the matching IR contract and validation in the Python engine.
- [ ] Lower it in the rust-sql pack to an exclusion constraint, reporting unsupported targets.
- [ ] Declare the PatternBinding window rule in reference.ts and delete the related comments.
- [ ] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.
