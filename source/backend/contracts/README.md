# Layer exchange contracts

JSON Schema generated from the Dryv group `dryv/contracts/domains/exchange`. These are the documents the layers exchange (AGENTS.md section 10): `FileArtifactRef`, `ExtractionResult` (with `ExtractionSegment` and `ExtractionDiagnostic`), `CandidateRecord`, `IntelligenceEvaluation` and `PromotionDecision`. The group has no storage, entities or endpoints.

- Source of truth: the Dryv contract. Do not edit `exchange.schema.json`.
- Regenerate: `cd dryv && bun run schema:export`; `bun run schema:check` (part of `bun run check`) fails when the file is stale.
- `examples/` holds one valid document per contract; `python -I validate_examples.py` validates them (needs `jsonschema`).
- TypeScript consumers use the Dryv-generated types; Python consumers generate Pydantic models, for example `datamodel-codegen --input exchange.schema.json --input-file-type jsonschema --output-model-type pydantic_v2.BaseModel` (works on Python 3.14).
- Free-form parts (a candidate `payload`, a segment `locator` and `content`) are serialised JSON text, validated by the database engine against the contract of the candidate's `target`.
