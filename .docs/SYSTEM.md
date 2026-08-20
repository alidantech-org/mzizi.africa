# SYSTEM — Mzizi Responsibilities and Invariants

This document is the operational summary of how the Mzizi platform should behave as a system.

## System mission

Transform fragmented African historical and public evidence into structured, versioned, explainable knowledge that can support both public exploration and serious research.

## System components

### Public application

**Path:** `apps/www`

**Role:** public atlas, heritage museum, historical explorer and evidence-backed knowledge experience.

**Primary outputs:** maps, timelines, profiles, stories, comparisons, source views.

### Research/dashboard application

**Path:** `apps/dashboard`

**Role:** research and data-stewardship workspace.

**Primary workflows:** source review, extraction review, entity resolution, AI review, quality control, canonical publishing, correction/version review.

### File management service

**Target path:** `services/files`

**Role:** custody of source artifacts and derived files.

**Owns:** hashes, metadata, raw versions, storage references, derived-artifact lineage.

### Data engine

**Target path:** `services/data-engine`

**Role:** source acquisition, extraction, OCR, parsing and low-risk normalization.

**Owns:** extraction jobs/results and reproducibility metadata.

### Intelligence layer

**Target path:** `services/intelligence`

**Role:** explicit AI/tool-assisted classification, cleaning, entity resolution, contradiction detection and evaluation.

**Owns:** intelligence job/result lineage and model/tool metadata.

### Database management engine

**Target path:** `services/db-engine`

**Role:** schema, migrations, seeds, backfills, integrity validation and controlled promotion into canonical storage.

**Owns:** database lifecycle, not HTTP application behavior.

### Product API

**Target path:** `services/api`

**Target technology:** NestJS.

**Role:** stable contracts over canonical data for `apps/www`, `apps/dashboard` and integrations.

**Important:** the current Python FastAPI code is migration source material, not the final API implementation.

## Core stores

Mzizi should conceptually separate the following data even if they initially share PostgreSQL schemas:

- source metadata;
- file/artifact metadata;
- extraction metadata/results;
- AI/intelligence results;
- staging/candidate records;
- canonical domain data;
- record versions;
- audit/review history;
- system taxonomies/reference data.

Large binary artifacts should live in a file/object store rather than in normal relational rows.

## System invariants

### Invariant 1 — Every important claim can reach evidence

A published historical/political claim must be able to link back toward preserved source evidence.

### Invariant 2 — Raw evidence is never replaced by cleaned data

Corrections and derivatives are new representations.

### Invariant 3 — AI output is attributable

The system records the tool/model/method that created an intelligent result.

### Invariant 4 — AI does not silently publish canonical truth

AI output becomes a candidate/evaluation and follows promotion rules.

### Invariant 5 — Historical validity differs from ingestion time

`valid_from`/`valid_to` or equivalent historical context must not be confused with `created_at`, `retrieved_at` or processing timestamps.

### Invariant 6 — Modern borders are not universal containers for history

Historical entities and uncertain/overlapping geographies must be independently representable.

### Invariant 7 — Canonical changes preserve lineage

Corrections create new versions or explicit supersession rather than deleting the meaningful history of a record.

### Invariant 8 — Service boundaries own responsibilities

The API does not become the scraper, migration runner, file store and AI worker.

### Invariant 9 — Domain data is reusable

The public website and research dashboard consume shared canonical knowledge rather than maintaining incompatible copies.

### Invariant 10 — Uncertainty is data

Approximate dates, disputed relationships, contradictory sources and uncertain entity matches must have explicit representation.

## Standard system flow

```text
SOURCE
  ↓
SOURCE REGISTRATION
  ↓
FILE ARTIFACT
  ↓
EXTRACTION RESULT
  ↓
INTELLIGENCE RESULT
  ↓
CANDIDATE RECORD
  ↓
VALIDATION / REVIEW
  ↓
CANONICAL RECORD VERSION
  ↓
NESTJS API
  ↓
PUBLIC / DASHBOARD EXPERIENCE
```

## Common entity dimensions

Domain entities should reuse shared ideas rather than reinventing them:

- stable identity;
- names/aliases;
- time validity;
- geographic scope;
- typed relationships;
- evidence;
- confidence/dispute state;
- version;
- review status;
- method/lineage.

## Tool interfaces for the intelligence layer

The intelligence layer should eventually expose structured operations such as:

```text
classify_document
classify_segment
extract_entities
resolve_entity
suggest_relationships
clean_ocr
compare_sources
detect_contradictions
evaluate_extraction
evaluate_candidate
summarize_evidence
identify_research_gaps
```

Each operation returns structured data, not merely prose.

## Database-engine command families

The DB engine should eventually expose controlled commands such as:

```text
schema status
migrate plan
migrate apply
seed reference
seed research
fixture load
validate integrity
candidate validate
candidate promote
backfill run
export canonical
repair check
```

The exact CLI/API surface will be designed during implementation.

## File-service operations

The file service should support concepts such as:

```text
capture artifact
hash/verify artifact
retrieve artifact
register derivative
list lineage
archive artifact
inspect metadata
```

## Data-engine operations

The data engine should support concepts such as:

```text
discover sources
capture source
extract document
extract table
extract metadata
extract geography
normalize primitives
rerun extractor
report quality
```

## Product/API read patterns

The future NestJS API should make it natural to ask:

- what was true at time T?
- what entities existed in place P at time T?
- how did this entity change?
- what evidence supports this claim?
- what relationships connect entity A to entity B?
- what is disputed or uncertain?
- what is the current canonical version?
- which historical version applied previously?

## Product/API mutation patterns

Most public users should not mutate canonical knowledge directly.

Mutations should generally represent workflows:

- propose correction;
- register source;
- create candidate;
- review candidate;
- approve/reject;
- publish/supersede.

The system should prefer explicit commands over generic unrestricted CRUD for high-value knowledge.

## Definition of done for a new domain

A domain is not system-ready merely because tables exist.

A complete domain should define:

1. why the domain belongs in Mzizi;
2. its canonical entities and relationships;
3. temporal/geographic behavior;
4. source/evidence expectations;
5. candidate/validation behavior;
6. versioning rules;
7. API contracts;
8. dashboard stewardship workflow;
9. public experience where applicable;
10. test/seed strategy.
