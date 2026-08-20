# ARCHITECTURE — Target Mzizi System

## Status

This document describes the **target architecture**, not the current directory layout.

The repository has been consolidated, but several responsibilities still live inside legacy code. The next stage is to separate those responsibilities into durable system boundaries.

## Architecture goal

Mzizi should be able to ingest large amounts of historical and public material without turning the application API into a scraper, migration runner, file server and AI worker at the same time.

The architecture therefore separates:

1. user experiences;
2. source/file custody;
3. extraction and ingestion;
4. AI-assisted intelligence;
5. database lifecycle management;
6. canonical storage;
7. application APIs.

## Target repository shape

```text
mzizi.africa/
├── apps/
│   ├── www/                    # Public atlas / heritage / exploration product
│   └── dashboard/              # Research, review, stewardship and operations
│
├── services/
│   ├── data-engine/            # Discovery, ingestion, extraction, parsing
│   ├── intelligence/           # AI/tool-assisted classification and evaluation
│   ├── db-engine/              # Schema, migrations, seeds, imports, promotion
│   ├── files/                  # Source artifact and file lifecycle service
│   └── api/                    # Target NestJS product API
│
├── packages/                   # Future shared contracts/taxonomies when justified
│   ├── contracts/
│   └── domain/
│
├── .docs/
└── AGENTS.md
```

The exact package tooling can evolve. The ownership boundaries should not be collapsed casually.

---

# 1. Public application — `apps/www`

## Purpose

The public Mzizi experience.

It should eventually provide:

- interactive historical maps;
- timeline exploration;
- heritage museum experiences;
- polity/kingdom/place profiles;
- language and migration exploration;
- stories and curated narratives;
- source/evidence views;
- country and governance profiles;
- historical/current comparisons;
- public transparency views.

## Does not own

- scraping;
- canonical data validation;
- database migrations;
- AI truth decisions;
- file custody;
- domain schema definitions.

The app consumes stable API contracts.

---

# 2. Research/dashboard application — `apps/dashboard`

## Purpose

The operational and scholarly workbench where evidence is reviewed and curated.

Likely workflows include:

- source registration;
- extraction job monitoring;
- extracted text/table review;
- entity matching;
- geographic review;
- AI classification review;
- contradiction resolution;
- data-quality queues;
- canonical record approval;
- version comparison;
- source/evidence inspection;
- correction and publishing workflows.

## Key distinction

This is not merely an admin CRUD panel.

The dashboard exists to support the process by which uncertain raw material becomes trustworthy, versioned knowledge.

---

# 3. File management service — `services/files`

## Purpose

Own the lifecycle and identity of evidence artifacts.

Examples:

- PDFs;
- scanned books/documents;
- images;
- maps;
- spreadsheets;
- CSV/JSON datasets;
- web snapshots;
- downloaded reports;
- audio/video evidence where later justified;
- derived OCR/text representations.

## Responsibilities

- create stable artifact identity;
- calculate/check content hashes;
- preserve original/raw files;
- record MIME type, size and metadata;
- storage location abstraction;
- immutable/raw version handling;
- derived-file relationships;
- signed/authorized retrieval where required;
- deduplication by content hash where safe;
- retention/archive policy;
- artifact provenance.

## Storage model

Binary/file content should normally live in object storage or an equivalent file store. PostgreSQL stores metadata, relationships and references rather than becoming a blob dump.

## Important rule

A cleaned extraction never replaces the raw source.

```text
source artifact
├── original file
├── OCR derivative
├── extracted text derivative
├── table/image derivatives
└── metadata/provenance
```

---

# 4. Data engine — `services/data-engine`

## Purpose

Own data discovery, acquisition, extraction and deterministic/algorithmic parsing.

Python is the preferred starting environment for this layer because Mzizi needs strong document, OCR, tabular, NLP-adjacent, geospatial and research tooling.

## Responsibilities

### Source acquisition

- approved web fetching;
- public dataset import;
- document download;
- archive ingestion;
- sitemap/source discovery;
- scheduled source refresh where appropriate.

### Document extraction

- PDF text extraction;
- OCR preparation/execution;
- table extraction;
- metadata extraction;
- spreadsheet parsing;
- HTML -> clean document representation;
- geospatial file parsing;
- document segmentation.

### Normalization

- basic date parsing;
- encoding cleanup;
- whitespace/text cleanup;
- consistent primitive formats;
- extraction diagnostics.

## Output

The data engine emits **extraction results**, not canonical domain records.

Example conceptual contract:

```text
ExtractionResult
- extraction_id
- source_artifact
- extractor/version
- extracted_at
- segments[]
- tables[]
- metadata
- warnings[]
- quality_metrics
```

It should be possible to rerun extraction with a newer extractor while preserving the previous result.

## Does not own

- final entity classification;
- canonical record approval;
- public API routes;
- database migration execution for the whole platform;
- silent AI enrichment.

---

# 5. Intelligence layer — `services/intelligence`

## Purpose

Provide explicit AI/tool-assisted operations over evidence and extracted material.

The intelligence layer should expose tools/jobs rather than behaving like an invisible global chatbot.

## Core capabilities

### Classification

Determine likely document/record type, domain, geography, period, institution or subject.

### Entity extraction

Propose people, places, organizations, polities, offices, laws, events, languages and other entities found in source material.

### Entity resolution

Suggest whether `Mombasa`, historical aliases, transliterations or alternate spellings refer to the same or related entities in context.

### Cleaning

Suggest corrections to noisy OCR or malformed extracted material without destroying the original extraction.

### Relationship inference

Propose typed relationships supported by evidence.

### Contradiction detection

Compare claims across sources and surface disagreements for review.

### Evaluation

Score extraction quality, source coverage, candidate-record completeness and confidence.

### Enrichment

Suggest additional structured attributes or links that can be validated before promotion.

### Research assistance

Summarize evidence for reviewers, identify missing source coverage and propose follow-up research queries.

## Tool contract

Every intelligent operation should be invokable as an explicit tool/job with:

- named operation;
- input references;
- model/tool/provider identity where applicable;
- prompt/policy/config version where applicable;
- started/completed time;
- structured output;
- confidence/evaluation metadata;
- errors/warnings;
- lineage back to source/extraction;
- immutable result version.

## Critical rule

```text
AI result != canonical truth
```

AI output enters a candidate/evaluation workflow. Promotion rules decide what becomes canonical.

---

# 6. Database management engine — `services/db-engine`

## Purpose

Own database lifecycle and controlled transformation into canonical storage.

This is separate because migrations, seeds and data promotion are operational/data responsibilities, not HTTP API responsibilities.

## Responsibilities

- schema definition ownership;
- migrations;
- migration status and validation;
- reference/taxonomy seeds;
- geographic and historical seed pipelines;
- import/export tooling;
- integrity checks;
- repair jobs;
- backfills;
- re-index/recompute jobs;
- staging -> canonical promotion;
- canonical version creation;
- rollback/recovery support;
- development/test database initialization.

## Seed types should be distinguished

### Reference seeds

Stable system taxonomies such as relation types, evidence statuses or known geographic level types.

### Research seeds

Curated domain data imported from evidence-backed datasets.

### Development/test fixtures

Synthetic/minimal data for tests and local development.

These must not be mixed into one undifferentiated seed mechanism.

## Canonical store

PostgreSQL remains a strong primary choice, with PostGIS for geospatial requirements.

The canonical model should support:

- temporal validity;
- stable entity identity;
- aliases/names;
- typed relationships;
- provenance/evidence links;
- confidence/dispute states;
- record versions;
- review/audit information.

---

# 7. Product API — `services/api`

## Target implementation

**NestJS** is the target application API technology.

The existing Python FastAPI code currently in `services/api` is legacy/consolidated source material and should be decomposed. It should not determine the long-term service boundary.

## Purpose

Expose stable application and integration contracts over canonical/reviewed data.

## Responsibilities

- authentication/authorization where required;
- public/query endpoints;
- dashboard application endpoints;
- domain DTOs;
- search/filter interfaces;
- timelines;
- geographic queries;
- relationship traversal;
- evidence/citation views;
- version history;
- controlled mutations/workflow commands;
- API validation and access policy.

## Does not own

- web scraping;
- OCR;
- raw file storage;
- general AI execution;
- platform migration execution;
- unreviewed source ingestion.

---

# 8. Canonical database and staging model

A single logical database may contain multiple schemas at first, but data states should remain conceptually separate.

Suggested logical zones:

```text
source       # source identities / publishers / provenance
files        # artifact metadata
extraction   # extraction run metadata and references
staging      # candidate structured records awaiting promotion
intelligence # AI/tool results and evaluations
canonical    # accepted versioned domain data
system       # taxonomies, jobs, audit/operational metadata
```

Physical separation can be introduced later if scale/security requires it.

## Canonical does not mean immutable forever

Canonical means the currently accepted representation.

Corrections create new versions rather than erasing important lineage.

---

# 9. Shared contracts

As services are implemented, introduce shared contracts deliberately.

Candidate contracts:

### `SourceRef`

Identifies the publisher/source and retrieval context.

### `FileArtifactRef`

Stable reference to preserved evidence.

### `ExtractionResultRef`

Identifies a versioned extraction run/result.

### `EvidenceClaim`

A claim tied to evidence, time/place context and confidence.

### `CandidateRecord`

A normalized proposed domain record awaiting validation/promotion.

### `IntelligenceResult`

A versioned tool/AI operation output.

### `CanonicalRecordVersion`

An accepted version plus lineage and provenance.

Contracts should be versionable and transport-friendly. Do not share ORM entities directly across service boundaries.

---

# 10. Job and event model

Extraction and intelligence workloads are asynchronous by nature.

The architecture should support durable jobs such as:

```text
source.discover
file.capture
extract.document
extract.table
intelligence.classify
intelligence.resolve-entities
intelligence.evaluate
candidate.validate
canonical.promote
```

A queue/event system can be selected when implementation needs it. Do not prematurely couple core domain design to a specific broker.

Every job should be observable and idempotent where practical.

---

# 11. Observability and auditability

The platform should distinguish:

- operational logs;
- research/audit history;
- data lineage.

A server log saying "classification completed" is not sufficient provenance for a historical claim.

Important actions should expose structured state:

- job status;
- source/artifact IDs;
- extraction version;
- intelligence operation version;
- reviewer decision;
- promotion event;
- canonical record version.

---

# 12. Security and permissions

Public historical exploration and internal research workflows have different trust boundaries.

At minimum, plan for:

- public read access to publishable data;
- authenticated dashboard users;
- role/permission distinctions for researchers/reviewers/publishers;
- controlled canonical mutations;
- protected source material where licensing requires it;
- audit trails for high-impact changes.

---

# 13. Architecture flow

```text
                         SOURCE WORLD
     archives • government • books • PDFs • maps • web • datasets
                              │
                              ▼
                    ┌──────────────────┐
                    │   FILE SERVICE   │
                    │ preserve evidence│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   DATA ENGINE    │
                    │ extract / parse  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  INTELLIGENCE    │
                    │classify/evaluate │
                    └────────┬─────────┘
                             │
                             ▼
              candidate + evidence + confidence
                             │
                             ▼
                    ┌──────────────────┐
                    │    DB ENGINE     │
                    │validate/promote  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ CANONICAL STORE  │
                    │versioned knowledge│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   NESTJS API     │
                    └──────┬─────┬─────┘
                           │     │
                       ┌───▼─┐ ┌─▼─────────┐
                       │ WWW │ │ DASHBOARD │
                       └─────┘ └───────────┘
```

## Architecture test

When deciding where code belongs, ask:

- Is it preserving a source artifact? -> file service.
- Is it extracting/parsing raw material? -> data engine.
- Is it reasoning/classifying/evaluating? -> intelligence layer.
- Is it changing database schema/seeds/canonical state? -> DB engine.
- Is it exposing stable product data/actions? -> NestJS API.
- Is it presenting public knowledge? -> `apps/www`.
- Is it supporting research/review/stewardship? -> `apps/dashboard`.

If one feature seems to belong everywhere, define a contract and split the responsibilities rather than creating a new monolith.
