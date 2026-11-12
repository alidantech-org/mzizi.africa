---
{id: DOC-FB1C0E0D5A8E,name: DATA_LIFECYCLE,type: documentation}
---

# DATA LIFECYCLE — From Evidence to Canonical Knowledge

## Schema organization — 12 November 2026

The [schema redesign catalogue](../../_plan/schema-redesign/README.md) records the latest documentation-only scope decision: 7 Operational schemas in a separate Operations database, 12 Phase 01 civic accountability schemas in Main, and 14 retained Phase 02 schema proposals. Every schema not assigned to Phase 01 or Operational belongs in Phase 02 now; it is deferred and unapproved, and relocation does not start its planning.

Phase 01 is Reference, Geography, Legal, Official, Governance, Politics, Finance, Procurement, Civic, Accountability, Source and Filesystem. Official combines person and organization identities without granting authority; Politics combines political and electoral responsibilities in distinct tables; Accountability combines oversight and participation in distinct record types. Geography and PostGIS queries are included, and countrywide institutions reference the whole-country unit. Finance/Procurement and Source/Filesystem remain separate. Domain legal relationships go through Reference; Reference alone links to Legal. This supersedes earlier target text describing direct domain legal links or separate Person/Organization, Political/Electoral and Participation schemas. Historical implementation inventories below are not rewritten as if this target existed.

Operations contains Auth, Acquisition, Engine, Staging, Analytics, Audit and Management. Operational audit is not public accountability evidence. Candidates become accepted civic versions only through validated publication with durable source/file provenance and reconciled acknowledgements. Management stays in Operations; the exact civic-side idempotency contract remains open. No SQL, seeds, application code or database data changes are authorized by this reorganization. Detailed table and column approval remains separate from schema scope.

## Purpose

Mzizi's most important system behavior is not a page or endpoint. It is the controlled process that turns fragmented source material into structured, evidence-backed, versioned knowledge.

The platform must always be able to distinguish:

```text
what the source contained
what extraction produced
what AI/tools inferred or cleaned
what reviewers accepted
what the canonical database currently says
```

Those are different states and must not be collapsed.

---

# Lifecycle overview

```text
1. Source discovery
       ↓
2. Source registration
       ↓
3. Raw artifact capture
       ↓
4. Extraction
       ↓
5. Primitive normalization
       ↓
6. AI/tool-assisted intelligence
       ↓
7. Candidate records
       ↓
8. Validation + comparison
       ↓
9. Human/policy review where required
       ↓
10. Canonical promotion
       ↓
11. Versioned publication
       ↓
12. Re-evaluation when new evidence appears
```

Every major step should produce its own identity, timestamps, method/version metadata and lineage.

## Current database ownership transition — 2026-11-11

Schema migrations and named audit, authorization, pipeline, engine job/event/outbox, and filesystem folder-creation, upload-reservation, cleanup-metadata, and exact-version lineage writes are applied through the Bun TypeScript database owner. Folder/file details and download-key authorization also use named service operations. Upload cleanup keeps object deletion in the filesystem capability while the database owner selects and marks eligible sessions; metadata is trimmed only after cleanup is recorded, so failed S3 operations remain retryable. The NestJS API uses a read-only database role. Other Python filesystem metadata changes and seed synchronization still contain direct PostgreSQL paths; those are migration gaps, so the transition is not complete. Temporal and immutable pipeline-release records are in place, while workflow cutover, candidate evidence review, canonical promotion, and retry-safe artifact finalization remain outstanding. The disposable target is `mzizi_new`; existing object-store artifacts remain preserved.

## Geography boundary publication

Administrative boundary geometry is a derived representation tied to a stable
`GeoUnits.id`. Keep each boundary version with its source reference, license,
retrieval time, reference year, validity dates, verification state and optional
backend-provided label point. A new boundary version does not replace the raw
source artifact or change the geography entity ID. Historical names and
rename/split/merge links are separate temporal records and require source
references. Public map endpoints expose only records marked verified and
current; missing geometry stays unavailable instead of being inferred.

---

# 1. Source discovery

## Goal

Find potentially useful evidence without yet asserting that the material is correct or authoritative.

Sources may include:

- government websites;
- national archives;
- libraries;
- museums;
- universities;
- research papers;
- books;
- constitutions and laws;
- election authorities;
- finance/procurement portals;
- census/statistics agencies;
- historical maps;
- scanned colonial records;
- public datasets;
- reputable journalism;
- international institutions;
- oral-history or heritage collections.

## Output

A discovery result should capture at least:

- source URL/location;
- discovered time;
- discovery method;
- possible publisher/source organization;
- guessed content type;
- crawl/import context;
- status: new/known/ignored/captured.

Discovery is not evidence preservation yet.

---

# 2. Source registration

## Goal

Create a durable identity for the source context.

A source is not only a URL. It may represent:

- a publisher;
- an archive;
- a collection;
- a document edition;
- a government agency;
- an academic work;
- a dataset release.

Registration allows different artifacts/versions to be connected to the same source lineage.

Important metadata:

- title;
- publisher/author where known;
- publication date/edition where known;
- source type;
- license/access notes;
- canonical URL/reference;
- collection/catalog identifiers;
- geographic/temporal scope where known.

---

## Sites, structures and approval in discovery and registration

Discovery and registration now have a registry: a discovered institution website becomes a `website.sites` row (status `expected`, `discovered` or `profiled`) with dated domains and links to the geography unit, institution or body it is about; families and domain patterns propose more sites. Registration of a source for collection additionally requires a **current legal and source assessment** (`website.assessments`, human reviewer named) and the jurisdiction's dossier at pilot or production. A structure version (files in `filesystem`) describes how to read the site; publishing one never starts collection. Every capture records the site, the hostname actually used, the structure version, the inherited family version and the assessment that governed it.

# 3. Raw artifact capture

## Goal

Preserve the exact evidence material used by Mzizi.

Examples:

- downloaded PDF;
- HTML snapshot;
- image/scan;
- spreadsheet;
- JSON/CSV export;
- map file;
- document bundle.

## Required properties

Each artifact should have:

- stable artifact ID;
- content hash;
- original filename/name;
- media/MIME type;
- byte size;
- capture/retrieval time;
- source reference;
- original URL/location;
- storage reference;
- capture method;
- artifact status;
- parent/derived artifact relationship where relevant.

## Immutability rule

Raw artifacts should be immutable after capture.

If the upstream document changes, capture a new artifact version.

Do not overwrite yesterday's government PDF with today's revision and pretend they are the same evidence.

---

# 4. Extraction

## Goal

Convert an artifact into machine-usable representations without changing the meaning intentionally.

Extraction operations include:

- PDF text extraction;
- OCR;
- table extraction;
- HTML cleaning;
- metadata parsing;
- image/map extraction;
- spreadsheet parsing;
- section/page segmentation;
- coordinate/geospatial parsing.

## Extraction versioning

Every run should record:

- extractor name;
- extractor version;
- configuration;
- input artifact version;
- run time;
- output references;
- warnings/errors;
- quality diagnostics.

Rerunning OCR with a better engine creates a new extraction result. It does not erase the old one.

## Example

```text
Artifact A: scanned 1963 document
├── Extraction E1: OCR engine v1
│   └── noisy text
└── Extraction E2: OCR engine v2
    └── improved text
```

Both remain traceable to the same artifact.

---

# 5. Primitive normalization

## Goal

Apply low-risk, explainable transformations before semantic reasoning.

Examples:

- Unicode normalization;
- whitespace cleanup;
- date-format parsing;
- numeric formatting;
- consistent coordinate representation;
- page/section ordering;
- column normalization;
- obvious encoding repair.

## Rule

Normalization must preserve the original extracted value when transformation could affect interpretation.

Example:

```text
raw_value: "12/3/63"
normalized_candidate: "1963-03-12"
normalization_confidence: 0.70
reason: ambiguous source date format
```

Do not convert uncertainty into fake precision.

---

# 6. Intelligence operations

## Goal

Use AI and other intelligent tools to turn extracted material into useful candidate knowledge while preserving attribution.

The intelligence layer exposes explicit operations.

## A. Classification

Examples:

- this document is a constitution;
- this section describes finance;
- this table contains election results;
- this record concerns colonial administration;
- this source is relevant to a specific geographic region or period.

## B. Entity extraction

Identify proposed:

- people;
- places;
- polities;
- institutions;
- offices;
- laws;
- languages;
- events;
- parties;
- contracts;
- financial entities.

## C. Entity resolution

Determine whether names likely refer to the same entity or related versions.

Examples:

- historical place name vs current place name;
- transliteration variants;
- title variants;
- renamed institutions;
- colonial vs post-independence administrative units.

The system should be able to return **uncertain match** rather than forcing a merge.

## D. Cleaning

AI may propose corrections for:

- OCR mistakes;
- broken table rows;
- formatting noise;
- malformed names;
- obvious segmentation errors.

The corrected value is a derivative candidate and must remain linked to the original extraction.

## E. Relationship proposals

Examples:

- person held office;
- law created institution;
- polity controlled/overlapped a place;
- language documented in region;
- manifesto pledge concerned sector;
- tender implemented budgeted project.

Relationship proposals require evidence references and confidence.

## F. Contradiction detection

The intelligence layer should identify claims such as:

```text
Source A: event occurred in 1878
Source B: event occurred in 1881
```

It should not choose one silently.

## G. Evaluation

Evaluate:

- extraction quality;
- classification confidence;
- entity-match confidence;
- source completeness;
- contradiction risk;
- missing required fields;
- possible unsupported inference;
- candidate readiness for review/promotion.

## Required intelligence metadata

Every run/result should preserve:

- operation type;
- input IDs/references;
- tool/model/provider;
- model/tool version when available;
- prompt/template/policy version where applicable;
- configuration;
- output;
- confidence/score;
- warnings;
- run timestamp;
- evaluation result;
- lineage to source/extraction.

## Rule

**AI output is always data with provenance, not invisible application behavior.**

---

# 7. Candidate records

## Goal

Represent proposed domain knowledge before it becomes canonical.

A candidate record might represent:

- a historical polity;
- a person;
- a boundary relationship;
- a constitutional article;
- an election result;
- a language-place relationship;
- a migration event;
- a budget line;
- a procurement award.

## Candidate fields conceptually include

```text
candidate_id
candidate_type/domain
proposed_payload
historical_validity
geographic_context
source_evidence[]
extraction_lineage[]
intelligence_lineage[]
confidence
warnings/disputes[]
validation_status
review_status
created_at
```

Candidate records are allowed to be incomplete.

They exist specifically so incomplete/uncertain data does not contaminate canonical storage.

---

# 8. Validation and comparison

## Goal

Test candidates against system rules and existing knowledge.

Validation layers:

### Structural validation

- required fields;
- allowed enum/taxonomy values;
- date/number formats;
- geometry validity;
- relationship contract validity.

### Historical/temporal validation

- impossible date ranges;
- overlapping office tenures where prohibited;
- relationship validity outside entity existence;
- boundary versions with inconsistent periods.

### Identity validation

- duplicate entities;
- alias collisions;
- incompatible merges;
- conflicting stable identifiers.

### Evidence validation

- candidate has source support;
- citation points to preserved evidence;
- extraction exists;
- claim strength matches source quality;
- AI inference is labeled as inference.

### Comparison validation

- compare with canonical records;
- detect changed values;
- detect contradictions;
- decide update/new-version/new-entity behavior.

Validation results should themselves be stored and inspectable.

---

# 9. Review

Not every record requires identical human review, but promotion must follow explicit policy.

Possible policy levels:

## Auto-promotable

Low-risk deterministic/reference data from authoritative structured sources with strong validation.

## Review required

Most historical entity resolution, uncertain geography, AI-cleaned material, political claims and cross-source synthesis.

## Specialist review

Highly contested historical claims, sensitive conflict data, disputed ethnic/language classifications, uncertain boundaries or complex legal interpretation.

## Review record

Store:

- reviewer identity/role where applicable;
- decision;
- notes;
- timestamp;
- candidate version reviewed;
- requested corrections;
- promotion/rejection reason.

---

# 10. Canonical promotion

## Goal

Create or update the currently accepted structured representation.

Promotion must be controlled by the database management engine or a clearly owned canonical-data service workflow.

Promotion may:

- create new entity;
- create new version of entity;
- add evidence;
- add/correct relationship;
- supersede an older claim;
- mark a claim disputed;
- merge aliases while preserving lineage.

## Canonical record requirements

A canonical record should be able to expose:

- stable identity;
- current accepted version;
- historical versions;
- evidence links;
- temporal validity;
- geographic context;
- confidence/dispute status;
- creation/promotion history.

---

# 11. Versioning

Mzizi needs multiple forms of versioning.

## A. Source version

The upstream artifact changed.

## B. Extraction version

A new extractor/config produced a different representation.

## C. Intelligence-result version

A new model/tool/prompt/policy produced a different classification or evaluation.

## D. Candidate version

Research/review changed the proposed structured data.

## E. Canonical record version

The accepted knowledge changed because of correction, new evidence or historical update.

These are related but must not be conflated.

## Example lineage

```text
Source S1
  └── Artifact A1
       ├── Extraction E1
       │    └── Intelligence I1
       │         └── Candidate C1 (rejected)
       └── Extraction E2
            └── Intelligence I2
                 └── Candidate C2 (approved)
                      └── Canonical Person P / Version 3
```

That graph should be reconstructable.

---

# 12. Publication

Canonical data becomes available through the NestJS API and product applications according to publication policy.

Public views should expose appropriate evidence and uncertainty rather than hiding them.

Example public claim card:

```text
Claim: Polity X controlled this port during period Y.
Confidence: Moderate
Period: approximately 1720–1760
Evidence: 3 sources
Disagreement: boundary extent disputed
Last reviewed: ...
```

The internal dashboard can expose much deeper lineage.

---

# 13. Re-evaluation

Knowledge is not finished after publication.

New sources, corrections, improved OCR or better research may trigger:

- re-extraction;
- reclassification;
- new entity resolution;
- contradiction detection;
- candidate update;
- canonical version update.

The system should support reprocessing without corrupting prior history.

---

# 14. Data states

Recommended conceptual states:

```text
DISCOVERED
CAPTURED
EXTRACTED
NORMALIZED
CLASSIFIED
CANDIDATE
VALIDATION_FAILED
NEEDS_REVIEW
APPROVED
CANONICAL
DISPUTED
SUPERSEDED
REJECTED
ARCHIVED
```

Not every domain must implement these as one shared enum. They describe the lifecycle and should influence contract design.

---

# 15. Confidence and disagreement

Confidence should not be treated as a decorative percentage.

Confidence may reflect different dimensions:

- source authority;
- extraction quality;
- identity-match quality;
- temporal precision;
- geographic precision;
- cross-source agreement;
- reviewer confidence.

A claim can have a reliable source but uncertain geographic interpretation.

A claim can be confidently extracted but historically disputed.

Those dimensions should remain separable where useful.

---

# 16. Data ownership summary

```text
Source discovery/registering     -> Data Engine / research workflow
Raw artifact custody             -> File Service
Extraction                       -> Data Engine
AI classification/cleaning       -> Intelligence Layer
Candidate data                   -> Staging domain
Validation/promotion/versioning   -> DB Engine
Canonical query/mutation contract -> NestJS API
Public exploration               -> source/apps/www
Research/review                   -> source/apps/web
```

## Final rule

No step may make it impossible to answer:

> **Where did this data come from, what happened to it, who/what changed it, and why does the current canonical record say what it says?**

If the architecture cannot answer that question, the data lifecycle is incomplete.

---

# Where the product API sits in the lifecycle

The NestJS API (`source/backend/api`) is downstream of canonical promotion. It reads reviewed canonical records through a SELECT-only database role and serves them with their provenance, valid time, record time and verification state. By default lists return current records only; superseded versions stay reachable by id and with `includeHistory`, so the version chain is never hidden.

The API takes no part in discovery, capture, extraction, normalisation, classification or promotion. Its only writes are append-only audit records (comments, evidence references, review decisions) through a separate INSERT-only role. A review decision proposes a verification state; applying it to a canonical record is a controlled promotion step owned by the database management engine, so the API never mutates canonical data.

## 2026-11-11 — Spatial and domain-native measurements

The expanded proposal adds geospatial and environmental products to the same evidence lifecycle. Keep original spatial artifacts immutable in the existing filesystem/S3 integration; store curated canonical geometry in PostGIS; register derived rasters, vectors, tiles and aggregations with exact input versions and methods; publish only supported map layers with coverage, dates, resolution, license, uncertainty and provenance. A statistical geographic aggregate also pins the boundary edition or crosswalk and allocation method.

Preserve the originating domain for measurements: Environment holds raw sensor readings, Agriculture holds actual harvest quantities, Economy holds individual market price observations, Electoral holds election results, and Finance holds transactions. Statistical holds published comparable series and reproducible derivations, not a duplicate copy of every number. The [system-expansion proposal](../../_plan/schema-redesign/README.md) records candidate formats and unresolved design work.

## 2026-11-11 — Database and pipeline ownership migration

The target write owner is the TypeScript database service. Its current CLI applies the ordered SQL inputs to local `mzizi_new` through TypeORM with advisory locking and checksums; named HTTP operations now own API audit writes and provide auth identity, platform permission, and scoped filesystem authorization checks. Separate local API-reader and database-runtime roles are provisioned, and `db verify` checks the API has no table mutation privileges or auth-mutation function execution while the runtime cannot change schema or migration history. A deterministic Dryv entity catalog and `db plan` migration coverage report are available, but the report finds substantial model/SQL divergence and no replacement DDL is generated yet. PostgreSQL-specific definitions, full seed migration, candidate review/promotion, and Python metadata-writer replacement remain incomplete. Filesystem metadata repositories, engine job persistence, and seed synchronization still connect from Python during migration; Python auth no longer has a direct-DB fallback. Do not report an extraction or review run as fully on the target architecture until result/evidence persistence and retry recovery are connected through the database service.
