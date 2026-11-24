---
{id: TSK-E4D1683BC425,name: "Dryv work: slug registry, typed sections and generation manifest",type: task,status: archived,priority: medium,created_at: 2026-11-18T20:41:26.844Z,updated_at: 2026-11-24T19:14:28.467Z,order: 5120,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T12:29:29.967Z},{from: in-progress,to: archived,at: 2026-11-24T19:14:28.467Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E4D1683BC425/1795091369970-start,started_at: 2026-11-19T12:29:31.855Z,end_ref: refs/tracking/TSK-E4D1683BC425/1795547668477-end,ended_at: 2026-11-24T19:14:28.468Z,summary: {files: 1756,insertions: 47706,deletions: 16771}}]}},archived_at: 2026-11-24T19:23:21.131Z}
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

## Consolidated ownership and readiness

Moved into GRP-F1658FA99444 as the single owner of shared slug, typed-section and generation-evidence foundations for the combined MUST-FIX and geographic explorer effort. This task remains planned, authorized for implementation and does not authorize commits, pushes or seed additions. The 2026-11-19 pasted delivery report and MUST-FIX.md report substantial typed-section and slug progress already delivered. Treat those statements as a historical baseline to recheck against current contracts, generated clients and runtime evidence, not instructions to regenerate or reseed completed work. Reconcile the earlier checklist truthfully through Task before implementation starts. Preserve owner changes in the separate Dryv repository.

## Integrated acceptance checklist

- [ ] Reconcile existing slug and typed-section delivery against active code; preserve verified work and correct stale checklist items without inferring completion from the pasted report alone.
- [ ] Resolve remaining geometry, keyed counts and previously empty response sections through owning named contracts and generator capabilities, without handwritten casts or duplicate API shapes.
- [ ] Prove generated TypeScript, Dart and API shapes stay consistent and document unsupported generator capabilities explicitly.
- [ ] Supply traceability and regeneration checks for the integrated delivery, and obtain approval before any new seed file or small seed set is introduced.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T12:39:56.576Z · PETER IRUNGU

Implementation authorized by owner. Regenerated database snapshot now includes closed-enum checks, compatible template-product attributes, numbered/live seat uniqueness and office-position-institution composite FK. Applied full snapshot to isolated mzizi_web_proof without resetting existing databases. Transactional 50_integrity.sql passes its rejection/distinct-seat checks. Remaining integrity gaps, release-stream synchronization and fixture/API/browser work are not complete.

### 2026-11-19T13:19:15.754Z · PETER IRUNGU

Synthetic development fixtures now load idempotently into mzizi_ui and pass scripts/dev/web_proof/verify.sql: five Kenya selection methods, ten numbered seats, separate approval/appointment powers, distinct ZA council and explicit routing roots. Generated snapshot constraints pass the transactional integrity proof in isolated mzizi_web_proof. Existing mzizi_ui has NOT received the new constraint migration; immutable release stream and snapshot checksum are not reconciled. No root seed files or engine operations added. Office identity declarations were split into governance-office-integrity.ts to keep the owning schema below the line limit.
