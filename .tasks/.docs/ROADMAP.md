# ROADMAP — Building Mzizi from the Consolidated Repository

## Guiding rule

Build the evidence/data foundations before expanding product surfaces aggressively.

Mzizi's value comes from trustworthy structured knowledge. The applications should grow on top of that foundation rather than becoming disconnected prototypes with duplicated data logic.

---

# Phase 0 — Consolidated repository foundation

## Status

In progress.

## Goals

- establish one canonical repository;
- define project purpose;
- define target architecture;
- document migration from legacy services;
- stop future architectural drift.

## Deliverables

- [x] root `README.md`;
- [x] root `AGENTS.md`;
- [x] `.docs/README.md`;
- [x] `.docs/WHY.md`;
- [x] `.docs/STORY.md`;
- [x] `.docs/GOALS.md`;
- [x] `.docs/DOMAINS.md`;
- [x] `.docs/ARCHITECTURE.md`;
- [x] `.docs/SYSTEM.md`;
- [x] `.docs/DATA_LIFECYCLE.md`;
- [x] `.docs/MIGRATION.md`;
- [x] `.docs/ROADMAP.md`.

---

# Phase 1 — Legacy inventory and canonical contracts

## Goal

Understand what exists before replacing it.

## Work

- inventory all models in `services/api`;
- inventory Alembic migrations;
- inventory seed datasets/scripts;
- inventory scraper/extractor code;
- inventory file-management behavior;
- inventory live/useful API endpoints;
- inventory dashboard dependencies on current APIs;
- identify stale Katiba Book assumptions;
- document schema inconsistencies and duplicated identifiers.

## Outputs

Create:

```text
.docs/data/legacy-schema-inventory.md
.docs/data/identity-and-codes.md
.docs/architecture/contracts.md
```

Define first shared contracts:

- `SourceRef`;
- `FileArtifactRef`;
- `ExtractionResult`;
- `EvidenceRef`;
- `CandidateRecord`;
- `IntelligenceResult`;
- `CanonicalRecordVersion`.

## Exit condition

We can point every important legacy responsibility to a target owner and explain every domain table worth keeping.

---

# Phase 2 — File management foundation

## Goal

Create trustworthy source-artifact custody before scaling extraction.

## Build

`services/files`

Initial capabilities:

- register source artifact;
- hash artifact;
- store/retrieve artifact;
- detect duplicates;
- record metadata;
- create new artifact version;
- register derived artifact;
- show lineage;
- support local development storage;
- support object-storage adapter later.

## Data

Establish source/file metadata schema through the DB engine design.

## Dashboard

Add source/artifact inspection screens only after contracts stabilize.

## Exit condition

A researcher can register/capture evidence and Mzizi can prove which exact file/version was used later.

---

# Phase 3 — Data engine v1

## Goal

Separate extraction from the application API.

## Build

`services/data-engine` in Python.

Initial extractors:

1. web page -> clean document/Markdown;
2. PDF text extraction;
3. OCR fallback for scanned documents;
4. table extraction;
5. spreadsheet/CSV parsing;
6. metadata extraction;
7. extraction quality diagnostics.

## Rule

Every extractor produces the shared `ExtractionResult` contract and never writes directly into canonical domain tables.

## Exit condition

Given a preserved source artifact, the engine can produce a reproducible, versioned extraction result with diagnostics.

---

# Phase 4 — Intelligence layer v1

## Goal

Introduce AI where it creates leverage while preserving attribution and reviewability.

## Build

`services/intelligence`

First tools:

- document classification;
- segment/domain classification;
- entity extraction;
- entity-resolution suggestions;
- OCR-cleaning suggestions;
- relationship suggestions;
- contradiction detection;
- extraction-quality evaluation;
- candidate-record evaluation;
- evidence summarization for reviewers.

## Storage

Persist intelligence operations/results with:

- input references;
- tool/model/provider;
- configuration/prompt version;
- output;
- scores/confidence;
- timestamps;
- lineage.

## Exit condition

An AI-assisted transformation can be reproduced/audited and cannot silently overwrite canonical data.

---

# Phase 5 — Database management engine v1

## Goal

Extract schema/migration/seed responsibility from the Python API.

## Build

`services/db-engine`

Initial commands/capabilities:

- database status;
- migration status/plan/apply;
- reference seeds;
- research-data imports;
- development fixtures;
- integrity validation;
- candidate validation;
- controlled candidate promotion;
- export/backups hooks;
- basic repair/backfill framework.

## Decide

After legacy schema inventory, choose the canonical migration/schema tooling deliberately. Do not choose merely to match the old FastAPI implementation.

## Exit condition

No application API needs to own migrations or seed orchestration.

---

# Phase 6 — Canonical model v1

## Goal

Establish the common knowledge primitives before migrating every domain.

## Foundations

- source/evidence;
- stable entity identity;
- names and aliases;
- time validity;
- geography/historical geography;
- typed relationships;
- confidence/dispute status;
- record versioning;
- review/promotion metadata.

## First domain slice

Build one end-to-end research slice that proves the architecture.

Recommended first slice:

**historical geography + polity + source evidence**.

Why:

- central to Mzizi's identity;
- exercises temporal modeling;
- exercises maps/geometry;
- forces uncertainty support;
- links naturally to heritage/history;
- useful to the public application immediately.

## Exit condition

A sourced historical entity can travel from artifact -> extraction -> classification -> candidate -> review -> canonical version -> API-ready query model.

---

# Phase 7 — NestJS API v1

## Goal

Replace FastAPI as the product API boundary.

## Build

A new NestJS service at `services/api` after the old Python code has been moved/archived safely.

Initial modules should reflect canonical use cases, not legacy folder names blindly.

Suggested API capabilities:

- sources/evidence;
- entities;
- places/geography;
- historical timelines;
- relationships;
- record versions;
- search/filter;
- dashboard review workflows.

## Exit condition

`apps/www` can consume canonical historical/place data through NestJS without depending on Python FastAPI.

---

# Phase 8 — Public Mzizi v1

## Goal

Turn the existing landing prototype into a real evidence-backed exploration product.

## Priority experiences

### `/explore`

Interactive map + timeline.

### `/places/[slug]`

Historical/current place and polity profiles.

### `/stories`

Curated research narratives.

### `/sources`

Source/evidence catalogue and methodology.

### Heritage museum layer

Collections, objects/stories and cultural context linked to structured entities.

## Exit condition

Public users can explore a real evidence-backed historical dataset, not only static prototype content.

---

# Phase 9 — Research dashboard v1

## Goal

Transform the inherited dashboard into a Mzizi research/stewardship system.

## Priority workflows

- source registry;
- artifact browser;
- extraction review;
- intelligence-result review;
- candidate queue;
- entity matching;
- conflict/contradiction review;
- canonical publish/supersede;
- version history;
- research coverage gaps.

## Preserve selectively

Political finance/governance views remain valuable as later domain modules, but they no longer define the dashboard's whole identity.

## Exit condition

The research team can operate the evidence-to-canonical lifecycle without direct database manipulation.

---

# Phase 10 — Expand historical domains

Expand canonical data and public experiences into:

- heritage/culture;
- linguistics;
- migration;
- trade/resources;
- colonial administration;
- independence/post-colonial transitions;
- historical people/events.

Each domain must define source expectations, temporal/geographic behavior and review rules before bulk ingestion.

---

# Phase 11 — Expand modern governance domains

Migrate and improve useful legacy work for:

- constitutions/law;
- governance institutions;
- offices/office holders;
- political parties;
- elections;
- manifestos;
- public finance;
- debt;
- procurement;
- statistics;
- diplomacy/geopolitics.

The modern layer should link backward into historical transformations wherever justified.

---

# Phase 12 — Intelligence and research scale

Add capabilities as evidence volume grows:

- source monitoring;
- duplicate-source detection;
- multilingual extraction/classification;
- map/scan interpretation;
- automated citation anchoring;
- cross-source synthesis;
- research-gap discovery;
- change detection;
- quality dashboards;
- confidence calibration;
- partner ingestion pipelines.

## Rule

Scale automation only after lineage and review controls exist.

---

# Near-term implementation order

The next concrete engineering sequence should be:

```text
1. inventory legacy schemas/code
2. define shared evidence/extraction contracts
3. scaffold file service
4. scaffold data engine
5. scaffold intelligence service
6. scaffold DB engine
7. choose canonical schema/migration tooling
8. implement one historical-geography vertical slice
9. begin NestJS API
10. connect apps/www to real canonical data
```

Do not start by rewriting every old Python endpoint in NestJS. That would reproduce the wrong boundary in a new language.

# Roadmap decision rule

At each phase ask:

> Does this step make Mzizi better at turning African evidence into trustworthy structured knowledge?

If not, it should not displace the foundation work.
