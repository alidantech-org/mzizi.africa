# Mzizi Data Engine

**Status:** architecture scaffold; implementation follows legacy inventory and shared-contract definition.

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
