---
{id: DOC-32E1E997FDD0,name: ARCHITECTURE,type: documentation}
---

# ARCHITECTURE — Mzizi system boundaries

Mzizi preserves source evidence, turns it into reviewed knowledge, and serves that knowledge through public and research applications. The architecture keeps those responsibilities explicit so extraction, AI assistance, storage and publication remain attributable and testable.

## Active repository

- `source/apps/www`, `source/apps/web` and `source/apps/mobile` provide public, research and mobile experiences.
- `source/backend/api` is the NestJS product API.
- `source/backend/engine` is the Python orchestration and capability API.
- `source/packages/` contains reusable Python capabilities.
- `source/backend/pipelines` coordinates durable workflows.
- `source/backend/database` owns TypeScript database operations.
- `dryv/` owns authored API/database contracts; `source/schema/` holds input schemas and SQL.
- Root `seed/` contains prepared inputs and manifests. `scripts/` is the root command runner.

Earlier implementations are historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`; they are not active services.

## Responsibility boundaries

Raw bytes and immutable versions belong in object storage and are represented by Filesystem metadata. Source records describe publishers, captures, citations and provenance. The Python engine acquires and extracts permitted material into representations and candidates. Intelligence tools may classify or suggest links, but their outputs remain attributable and reviewable. Staging holds candidates and review state. The database owner validates releases and coordinates publication. Accepted, versioned civic knowledge is served by NestJS.

Operations data is separate from accepted civic knowledge. Operational audit records security and workflow events; it does not establish public facts or replace source evidence. User interfaces consume stable contracts and do not define canonical domain rules.

## Data stores and schema scope

The current schema direction and assignments are maintained in the [schema design catalogue](../_plan/schema-redesign/README.md): Operational, Phase 01 civic accountability and deferred Phase 02. It remains design guidance; a proposal is not proof of implementation. Reference mediates domain relationships to Legal. Geography and PostGIS support place and historical-area queries.

## Detailed guidance

- [Data lifecycle](../design/architecture/DATA_LIFECYCLE.md)
- [Migration boundaries](../design/architecture/MIGRATION.md)
- [Data and evidence designs](../design/data/README.md)
- [Source acquisition design](../design/acquisition/README.md)
- [Operational guidance](../design/operations/README.md)
