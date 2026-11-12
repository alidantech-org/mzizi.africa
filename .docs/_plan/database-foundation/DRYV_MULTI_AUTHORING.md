---
id: PLAN-DRYV-MULTI-AUTHORING
name: Dryv enhancement, multiple authoring sources per project
type: plan
tags: [dryv, generation, database]
---

# Dryv enhancement: multiple authoring sources per project

**Status: proposal.** Required by the Rust database foundation; not implemented in Dryv or consumed here yet.

## Problem

Mzizi needs two coordinated generation flows from one repository: the existing NestJS API generation and the new Rust database generation (models and SQL releases), each from its own contract entrypoint, while sharing the same schema source files. Dryv's project usage document (`DryvUsage`, `source/engine/python/engine/src/dryv/contracts/generation/usage/document.py` in the Dryv repository) today allows:

- `sources.authoring`: a dict — several named authoring sources can already be declared;
- `authoring`: a single `AuthoringActivation` — only one source is ever compiled;
- `PackActivation`: no authoring selector — every pack reads the one active IR.

The CLI also treats `dryv.yaml` as the only project file, so a second project document is not a workaround.

## Proposed change (in the Dryv repository)

1. Add an optional `authoring: AuthoringSourceRef` to `PackActivation`. A pack activation that names one consumes that source's compiled IR; one that does not keeps today's behavior and uses the project-level activation.
2. Allow `destinations.ir` to hold one named IR destination per authoring source, and extend `AuthoringActivation` (or add `authorings: dict[str, AuthoringActivation]`) so each declared source compiles to its own IR artifact in one build.
3. Validation: every pack-level authoring ref must name a declared source; sources that no pack consumes are compiled only if activated at project level; the build plan compiles each referenced source once and caches per source.
4. Determinism: the lockfile records one digest per compiled authoring source.

## Mzizi usage once it lands

```yaml
sources:
  authoring:
    model:    { type: typescript, path: dryv/contracts, entrypoint: index.ts }
    database: { type: typescript, path: dryv/contracts, entrypoint: apps/database/index.ts }
packs:
  rust-models: { source: {...}, authoring: { $ref: "#/sources/authoring/database" }, ... }
  rust-sql:    { source: {...}, authoring: { $ref: "#/sources/authoring/database" }, ... }
```

Until then, `dryv.yaml` pre-declares the `database` authoring source and IR destination (harmless under current validation) and the Rust pack activations stay commented out; Rust skeleton work proceeds without generated artifacts.
