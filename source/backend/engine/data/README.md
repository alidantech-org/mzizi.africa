# Mzizi Data Engine

**Status:** v1 running (Python 3.12+): site structure validator and samples, Postgres job queue, local-directory files interface, GeoJSON extractor, and the ingest/extract pipeline producing schema-valid `ExtractionResult` files. The structure runner, compliance controls and further extractors are tracked tasks.

## Run it

```bash
cd source/backend/engine/data
python3 -m venv .venv && .venv/bin/pip install -e '.[dev]' datamodel-code-generator
.venv/bin/mzizi-data validate samples/html-publications          # validate a structure bundle
TEST_DATABASE_URL=postgres://postgres@localhost:5432/postgres .venv/bin/python -m pytest -q   # needs bun for the database engine migrations
scripts/generate_models.sh                                         # Pydantic models from ../../contracts/exchange.schema.json
```

Modules: `structure/` (schemas, validator, selectors, transforms, family overlay), `files.py` (put-by-hash, get-by-version, local store; writes `filesystem`), `register.py` (publishers, documents, captures, methods in `source`), `jobs.py` (`engine.jobs` queue: idempotent on kind, input hash and generation; SKIP LOCKED claims; bounded retries with backoff), `extractors/` (registry; `geojson`), `pipeline.py` (ingest, enqueue, handler). The data engine never writes canonical domain tables or attributions; promotion belongs to the database engine.

## Purpose

The data engine is the dedicated Python research/ingestion layer for discovering sources and extracting machine-usable representations from preserved evidence.

## Owns

- approved source discovery/fetching;
- web -> clean document conversion;
- PDF extraction;
- OCR;
- table extraction;
- spreadsheet/dataset parsing;
- metadata extraction;
- geospatial parsing where required;
- low-risk primitive normalization;
- extraction diagnostics;
- versioned extraction results.

## Does not own

- canonical database truth;
- final AI classification decisions;
- database migrations/seeds;
- public product endpoints;
- raw source-file custody.

## Input/output model

```text
FileArtifactRef
      ↓
 extraction job
      ↓
ExtractionResult
- extractor + version
- segments/tables/metadata
- diagnostics
- warnings
- source/artifact lineage
```

Every rerun produces a new traceable extraction result instead of overwriting prior results.

## Why Python

Mzizi requires a broad ecosystem for document processing, OCR, tabular extraction, NLP-adjacent tooling and geospatial research. Python is therefore the preferred starting implementation environment for this service.

## Migration source

Relevant code currently inside `../api` should be inventoried and moved/reimplemented here rather than expanded as part of FastAPI.

See `../../.docs/ARCHITECTURE.md`, `../../.docs/DATA_LIFECYCLE.md` and `../../.docs/MIGRATION.md`.
