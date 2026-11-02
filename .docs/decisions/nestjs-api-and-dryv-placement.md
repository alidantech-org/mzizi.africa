---
{id: DEC-NESTJS-DRYV-PLACEMENT,name: Decision - NestJS API and dryv placement,type: decision,tags: [api,nestjs,dryv,migration]}
---

# Decision: NestJS API and dryv placement

Date: 2026-11-02. Decided by the user after the `source/` restructure.

## Decision

- The NestJS product API lives in `source/backend/api`. The Python FastAPI code currently there stays as migration source material and is removed only after its responsibilities are accounted for in the data engine, file service, database management engine, intelligence layer and NestJS API (see `.docs/docs/MIGRATION.md`).
- The `dryv/` folder, which holds contracts for models and system behaviour used to generate code, lives at the repository root as `dryv/`, outside `source/`.

## Consequences

- The NestJS scaffold must not be created until the Python code has been inventoried (task TSK-4B83AC17019D) and a layout for coexistence or replacement is agreed.
- Generated code is output into the NestJS app; only service implementations are hand-written.
- Cleaning, ingestion and migrations stay out of the API, per the hard boundaries in `AGENTS.md`.
