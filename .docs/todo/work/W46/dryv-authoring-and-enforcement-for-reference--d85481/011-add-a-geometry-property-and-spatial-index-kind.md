---
{id: TSK-24A6716A43C4,name: Add a geometry property and spatial index kind,type: task,status: planned,priority: medium,created_at: 2026-11-13T08:20:21.046Z,updated_at: 2026-11-13T08:20:21.046Z,order: 11264}
---

# Add a geometry property and spatial index kind

## Goal

Geography stores spatial representations, but Dryv has no geometry property. The geometry field is an unsupported placeholder and the geography contract lists PostGIS geometry and indexes as open items. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: the open items in the geography header and the geometry subtype note on the geometry role field.
- Proposed: a geometry property with subtype and SRID, and a spatial index kind in the storage facet, for example spatialIndex("geometry").
- The rust-sql pack would map the property to geometry(Subtype, srid) and the index to a GiST index; the rust-models pack needs a decision on the Rust type or an explicit unsupported report.
- PostGIS is already used by the local database container; the extension must be created by generated SQL.

## Acceptance checklist

- [ ] Add the geometry property to the author, Python IR, validation and generator context.
- [ ] Add the spatial index kind to the storage facet and lower it in the rust-sql pack.
- [ ] Decide and implement the rust-models mapping or an explicit unsupported report.
- [ ] Use it in geography.ts and delete the placeholder comments.
- [ ] Run formatting and typechecks only, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.
