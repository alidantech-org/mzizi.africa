---
{id: TSK-E4D1683BC425,name: "Dryv work: slug registry, typed sections and generation manifest",type: task,status: planned,priority: medium,created_at: 2026-11-18T20:41:26.844Z,updated_at: 2026-11-18T20:41:26.844Z,order: 1024}
---

# Dryv work: slug registry, typed sections and generation manifest

## Goal

Build the first three foundations for contract-first frontends in Dryv and the Mzizi contracts: the slug registry that gives every routable thing a clean address with history, typed sections that replace the 82 dynamic fields so clients stop hand-parsing, and a committed generation manifest plus gates so every generated file is traceable to its contract and hand edits are caught.

## Context

Read the plan note dryv-typed-sections-manifest-and-slugs, the capability plan and the address map sections 13 to 15. Findings so far: Dryv already supports nested schemas and discriminated unions, so typed sections are mostly authoring in Mzizi contracts; Dryv already records per-file evidence in its state directory, so the manifest is an export plus a gate; the database verify gate passes today. The Dryv repository has uncommitted owner changes in five engine files that must not be touched or committed.

## Slug registry

- [ ] Author source.slugs and source.slug_relations in the source schema contract (done, compiles).
- [ ] Owner approves the two seed schemes src.slug.namespace and src.slug.relation and their first values.
- [ ] Generate the SQL, migration, API module, engine models and SDKs and review the diff.
- [ ] Sync the SubjectTable list and codes.json with tables:sync and pass subjects:check.
- [ ] Define the routable-table subset and the reserved-word list as data.

## Typed sections

- [ ] Replace the dynamic fields of IndicatorSeries, IndicatorMap and PlaceStatistics with typed schemas copied from the hand-written client types.
- [ ] Prove the packs emit correct nested and union types for the NestJS DTOs, TypeScript SDK and Dart SDK.
- [ ] Convert the remaining dynamic fields and delete the hand parsers.

## Manifest and gates

- [ ] Export a compact manifest from Dryv last-applied evidence into the repository.
- [ ] Run dryv verify for every app in bun run check.
- [ ] Add a check that fails when a managed file differs from its recorded digest.

## Acceptance checklist

- [ ] The slug registry is generated, synchronised with the subject table list and passes the Dryv checks and the verify gate.
- [ ] The dynamic fields of the first statistics documents are typed and the clients no longer parse them by hand.
- [ ] A manifest of generated files is committed and a gate fails on hand edits to managed files.
- [ ] Findings, owner questions and diffs are recorded in the plan note and the task progress.
