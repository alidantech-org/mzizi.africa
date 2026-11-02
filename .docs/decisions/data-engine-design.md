---
{id: DEC-DATA-ENGINE-DESIGN,name: Decision - data engine toolchain contracts jobs staging and promotion,type: decision,tags: [data-engine,staging,promotion]}
---

# Decision: data engine toolchain, contracts, jobs, staging and promotion

Date: 2026-11-02. Status: proposed; each item names the experiment that confirms or reverses it.

## Decisions

1. **Languages.** Data package in Python (documents, tables, geospatial). Database package in TypeScript on Bun, so it shares the Dryv-generated TypeORM entities with the API. Experiment: Python 3.14 is installed; confirm the geospatial and table libraries install on it, otherwise pin 3.12.
2. **Schema truth.** The Dryv contracts generate the entities; migrations are generated from those entities by the database package and committed; a drift check (generate, expect an empty diff) runs in CI and in `db:check`. `scripts/dev-db.ts` is replaced by the same migrations. Hand-written SQL is limited to PostGIS columns, indexes, partitions, roles and `staging`, which the generator does not own.
3. **Cross-language contracts.** Author `FileArtifactRef`, `ExtractionResult`, `CandidateRecord`, `IntelligenceEvaluation` and `PromotionDecision` in Dryv, export JSON Schema, and generate Python models from it. The `fastapi-backend` pack exists in `dryv/packs`; experiment: generate a Pydantic model for `ExtractionResult` from it, and fall back to JSON Schema plus datamodel-codegen if the pack is API-shaped.
4. **Job model.** A Postgres job table owned by the data package (id, kind, input hash, status, attempts, result ref, error); workers claim rows with `FOR UPDATE SKIP LOCKED`. No queue until volume demands it. A job is idempotent on (kind, input hash); a rerun creates a new result.
5. **Staging.** A `staging` schema (runs, candidates, issues) in the same PostgreSQL, generic JSON payloads validated against contract schemas. Rationale in `DATA_INTAKE_PLAN.md`.
6. **Promotion rules.** A candidate promotes only when: validation has no errors, an approving `audit.decisions` row exists from an account with the reviewer role, `source.documents` has a licence, a capture exists, and no current `disputed` verification exists on the target. Promotion is one transaction owned by the database package; it writes the record version, attributions and the verification row, and closes the previous version's validity. The audit tables are never edited.
7. **Files boundary.** First slice uses a local directory store behind the files service interface: put by hash, get by version id, register derived variant. The interface is a contract so an S3 store can replace it.
8. **Legacy extractors.** Audit of `api-legacy` found `web_search_scraper/anti_detection.py` and stealth browser options in `core_async.py`: drop, they conflict with the rule not to bypass access controls. `pdf_extractor` (pdfplumber, PyMuPDF, camelot, tabula, pytesseract) is rewrite-from-parts: reuse the library choices and the quality scorer idea, not the modules, after a run on a real Kenyan PDF in the Tier B wave. Tier A needs none of it.

## Consequences

Contract and migration work come before any extractor. Decision items 1, 3 and 8 stay "proposed" until their experiments are recorded in task TSK-BD46EDE97821.

## Experiment results

- **Shared contracts (2026-11-02).** The five layer contracts are authored in Dryv as value schemas in `dryv/contracts/domains/exchange`, exported by `dryv/tools/export-json-schema.ts` to `source/backend/contracts/exchange.schema.json`, and turned into Pydantic v2 models with `datamodel-code-generator` on Python 3.14. The `fastapi-backend` pack was not needed. Findings: the output is usable but enum classes get anonymous names (`Status`, `Status1`), and free-form documents travel as JSON text because Dryv has no open object type. Both are acceptable for v1.
- The contracts live in `source/backend/contracts`, not under `engine/`, because they are shared by the engines, files and intelligence and `engine/` holds no shared code.

## Outcome after the build (2026-11-02)

Items 1 to 7 were implemented as decided and are verified by tests: Python for the data package (3.14 works with the geospatial and table libraries used so far), TypeScript on Bun for the database package with migrations generated from the Dryv entities and a drift check, contracts authored in Dryv and exported as JSON Schema with Pydantic models generated for Python, a Postgres job table with SKIP LOCKED claims, a generic `staging` schema with JSON payloads validated against entity metadata, promotion rules as written (plus a legal-status check on the source), and a local directory store behind a put, get and ref interface. Changes from the proposal: candidates refer to other records by natural key (`$ref`, resolved at validation and promotion); the review decision targets `staging.candidates` through the audit write path; a changed record is only promoted for versioned tables. Item 8 (legacy extractors) is not complete: the stealth scraper was dropped by reading, but pdf_extractor was never run on a real sample; that experiment moves to the Tier B extractors task.
