---
id: DOC-DESIGN-ARCHITECTURE-20261112
name: Architecture design guides
type: documentation
---

# Architecture design guides

System architecture details. These documents are supporting detail; the eight root documents explain overall system intent.

- [DATA_LIFECYCLE](DATA_LIFECYCLE.md)
- [MIGRATION](MIGRATION.md)
- [ENGINE_RUNTIME_AND_PACKAGES](ENGINE_RUNTIME_AND_PACKAGES.md) — proposal: one engine runtime class, capabilities in `features/` packages, Dryv persistence
- [ENGINE_MODULE_INVENTORY](ENGINE_MODULE_INVENTORY.md) — proposal: every engine module mapped to its target package, with findings and move order
- [ENGINE_JOB_MODEL](ENGINE_JOB_MODEL.md) — superseded stub (see ENGINE_RUNTIME_AND_PACKAGES)
- [PATTERN_MATCHING](PATTERN_MATCHING.md) — proposal: manifest-driven rules, safe string matcher, semantic vector index
- [DATABASE_ACCESS_AND_LIFECYCLE](DATABASE_ACCESS_AND_LIFECYCLE.md) — superseded stub (see DATABASE_ARCHITECTURE)
- [WORKERS_AND_RUNS](WORKERS_AND_RUNS.md) — approved design, not built: job specs, subprocess workers, run store, sealed run bundles and the release step
