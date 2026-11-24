---
{id: TSK-CD047849B2E7,name: Author Mongo contracts and generate typed Python models for Mongo and Postgres,type: task,status: archived,priority: medium,created_at: 2026-11-15T16:32:04.645Z,updated_at: 2026-11-24T19:24:24.743Z,order: 5120,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:24.743Z}]},archived_at: 2026-11-24T19:25:24.571Z}
---

# Author Mongo contracts and generate typed Python models for Mongo and Postgres

## Goal

Define the staging document types in `dryv/contracts/schemas/mongo/` and produce typed Python models for both the Mongo documents and the Postgres schemas, so the engine never handles free-form dictionaries past the parsing boundary. The API needs only the Postgres schemas for TypeORM.

## Context

Dryv has no document-store driver (stores accept only `postgresql`) and the project has no Python pack. The Dryv repository has an example `fastapi-backend` pack that generates Pydantic models; its output is untried here, and the Python SDK pack reportedly collides file names across groups. Options: a models-only variant of that pack, or JSON Schema export (`bun run schema:export`) plus a model generator. Start with candidates, raw extractions and reviews, using the retired staging contract in git history as the design input. Documents carry a schema version field and soft references to Main records.

## Acceptance checklist

- [ ] Contracts for candidates, raw extractions and reviews exist in the mongo folder and compile.
- [ ] A reproducible command generates Pydantic models for the Mongo contracts and for the Postgres schemas, and generated files are never hand-edited.
- [ ] A test loads sample documents through the models and rejects invalid ones.
- [ ] The chosen approach, its file-name collision handling and its limits are documented in this task and the Dryv gaps register.
