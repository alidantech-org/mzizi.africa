---
{id: TSK-CD047849B2E7,name: Author Mongo document contracts and generate Python models,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:32:04.645Z,updated_at: 2026-11-15T16:32:04.645Z,order: 5120}
---

# Author Mongo document contracts and generate Python models

## Goal

Define the staging document types in `dryv/contracts/schemas/mongo/` and produce typed Python models from them so the engine never handles free-form dictionaries past the parsing boundary. Start with candidates, raw extractions and reviews.

## Context

No Dryv pack exists for Mongo or Python in this repository. Options are a small project pack, or exporting JSON Schema with the existing `schema:export` tool and generating Pydantic models with a standard generator. This task is a time-boxed spike, and the chosen approach is recorded here. Documents carry a schema version field and soft references to Main records. The engine owns all I/O, and packages stay pure.

## Acceptance checklist

- [ ] Contracts for candidates, raw extractions and reviews exist in the mongo folder and compile.
- [ ] A reproducible command generates Python models, and the generated files are not hand-edited.
- [ ] A test loads sample documents through the models and rejects invalid ones.
- [ ] The chosen generation approach and its limits are documented in this task.
