---
id: DOC-MZIZI-DATA-PLATFORM-20261111
name: Mzizi data platform storage and product integration strategy
type: architecture-proposal
tags: [storage, pipelines, s3, postgis, products, engineering, documentation]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-11
---

# Mzizi Africa — Data Platform, Storage and Product Integration Strategy

> STATUS: TECHNICAL PLANNING PROPOSAL. Storage quantities are capacity-planning estimates, not measured consumption or approved infrastructure purchases.

## 1. Purpose

This document explains how Mzizi should acquire, store, process, preserve, analyze and expose the large variety of knowledge it is intended to support.

The architecture must accommodate:

- Relational records.
- Geographic geometry.
- Large vector and raster datasets.
- Satellite imagery.
- Environmental sensor readings.
- Scientific observations.
- Historical documents.
- Photographs and recordings.
- Statistical publications.
- AI-derived and analytical outputs.
- Multiple applications consuming shared knowledge.

The design must scale without placing every dataset inside PostgreSQL or downloading every available global dataset.

## 2. Storage architecture

### 2.1 PostgreSQL and PostGIS

Use PostgreSQL for:

- Canonical domain entities.
- Foreign keys and relational integrity.
- Classifications and reference values.
- Temporal relationships.
- Source and provenance metadata.
- Statistical definitions and observations.
- Curated spatial geometry.
- Geographic relationships.
- Spatial indexes and spatial queries.
- Domain API transactions.

Use PostGIS for curated vector geometry, spatial joins, overlays, containment, proximity and other relational spatial operations.

Do not store entire satellite archives, large video files or large raster grids as ordinary relational records.

### 2.2 S3-compatible object storage

Continue using the existing SeaweedFS S3-compatible storage.

- Existing bucket: `mzizi`.
- Region: `us-east-1`.
- Only `public/` is anonymously readable.
- All other prefixes are private by default.
- Credentials remain in environment/configuration, not database rows or frontend code.

Proposed logical prefix families:

| Prefix | Purpose |
|---|---|
| `public/` | Approved public artifacts and published products. |
| `restricted/` | Restricted research, personal or licensed materials. |
| `internal/` | Pipeline artifacts, operational records and private derived files. |
| `private/` | Private user or application material where needed. |

The actual bucket access policy must remain the source of truth. Prefix naming alone must not replace access-control enforcement.

Store:

- Original documents.
- Historical map scans.
- Satellite imagery subsets.
- Raster datasets.
- Scientific publications.
- Audio and video.
- Extracted Markdown.
- Dataset packages.
- Derived analytical products.
- Previews and approved media derivatives.

PostgreSQL should hold file identities, version references, checksums, classifications, lineage and access metadata.

### 2.3 Spatial files and datasets

Evaluate these formats:

| Format | Appropriate use |
|---|---|
| GeoJSON | Small vector exchange and web display. |
| GeoPackage | Portable spatial databases and curated offline datasets. |
| GeoParquet | Large analytical vector datasets. |
| FlatGeobuf | Efficient distribution of large vector features. |
| Cloud Optimized GeoTIFF | Raster imagery and derived spatial products. |
| NetCDF | Climate and multidimensional scientific datasets. |
| Zarr | Chunked multidimensional scientific arrays. |
| Parquet | Analytical tabular datasets. |
| PMTiles/vector tiles | Efficient map distribution. |

PostGIS and files are complementary, not competing storage solutions.

## 3. Dataset federation and selective acquisition

Mzizi should not copy every public dataset into its own storage.

For large external datasets, preserve a source and dataset description that identifies:

- Publisher.
- Dataset identity.
- Version.
- License.
- Access URL or API.
- Geographic coverage.
- Temporal coverage.
- Resolution.
- Coordinate reference system where applicable.
- Available formats.
- Retrieval date.
- Checksums where possible.
- Processing history.

Download only what is necessary for:

1. Local research.
2. Reproducible analytical outputs.
3. Reliable API availability.
4. Required historical preservation.
5. Offline operation where necessary.

Prefer interoperable access services and source archives where they provide dependable access.

### Examples

- Obtain only the Sentinel imagery needed for selected research areas and periods.
- Generate NDVI products and preserve their input/method lineage.
- Use global climate archives as source data rather than reproducing their entire storage estate.
- Retain relevant historical maps and official publications.
- Publish selected vector layers and raster products for frontend consumption.

An external dataset reference is not a substitute for preserving evidence where long-term reproducibility or licensing requires an actual retained copy.

## 4. Storage capacity estimates

The following estimates describe different stages of Mzizi's growth.

They assume selective acquisition, deduplication, source federation and retention of useful derived products.

### 4.1 Estimated active data

| Development stage | Estimated active data |
|---|---:|
| Kenya civic pilot | 25–120 GB |
| Comprehensive Kenya knowledge platform | 1.1–4.3 TB |
| Curated Africa-wide knowledge platform | 10–41 TB |
| Extensive original scientific archive | 100 TB to PB+ |

These are broad planning ranges. They are not a forecast derived from a measured ingestion workload.

### 4.2 Database size

| Stage | Expected PostgreSQL footprint | Suggested database capacity |
|---|---:|---:|
| Kenya civic pilot | 5–20 GB | 500 GB–1 TB SSD |
| Comprehensive Kenya | 50–150 GB | 1–2 TB SSD |
| Africa-wide curated | 200–800 GB | 2–4 TB SSD |
| Large analytical workloads | 1 TB+ possible | Workload-specific SSD capacity |

The difference between expected database size and provisioned capacity is intentional.

Allow for:

- Indexes.
- WAL.
- Temporary queries.
- Staging imports.
- Reindexing.
- Database maintenance.
- Materialized views.
- Growth headroom.

### 4.3 Object-storage estimates

| Category | Kenya mature | Africa-wide |
|---|---:|---:|
| Original documents and research | 200–800 GB | 2–8 TB |
| Vector geographic datasets | 20–100 GB | 200 GB–1 TB |
| Satellite imagery and derived rasters | 500 GB–2 TB | 5–20 TB |
| Climate and environmental datasets | 100–400 GB | 500 GB–3 TB |
| Historical images, audio and media | 100–300 GB | 1–4 TB |
| Derived datasets and map products | 100–500 GB | 1–4 TB |

These estimates must be refined using actual resolutions, periods, image selection, file formats, compression, version retention and acquisition policies.

Avoid counting a single canonical file once as a source object, again as a geographic file and again as an analytical duplicate unless a genuine independent derivative exists.

### 4.4 Provisioning estimates

| Stage | Active data target | Total provision target |
|---|---:|---:|
| Civic pilot | 25–120 GB | 0.5–1 TB |
| Comprehensive Kenya | 1–4.5 TB | 4–10 TB |
| Africa-wide curated | 10–40 TB | 30–100 TB |

Provisioning includes additional space for backup, replication and operational growth.

Raw capacity and usable capacity must be reported separately.

### 4.5 Recommended initial hardware target

A reasonable early storage target to evaluate:

| Component | Target | Purpose |
|---|---:|---|
| Database SSD | 1 TB | PostgreSQL, PostGIS, indexes and WAL. |
| Primary object storage | 4 TB | SeaweedFS-backed original and derived artifacts. |
| Independent backup | 8 TB | Separate recovery copy. |

This is a target, not an instruction to purchase or reconfigure infrastructure immediately.

For larger deployments, evaluate multiple storage nodes, independent backup destinations and a dedicated analytical workspace.

### 4.6 Backup and redundancy

Replication is not backup.

A replicated object deleted accidentally may be deleted across replicas.

Plan:

- Database full and incremental backups.
- WAL archiving and point-in-time recovery where appropriate.
- Independent object-storage backup.
- Version retention.
- Immutable recovery copies.
- Regular restoration tests.
- Separate disaster-recovery credentials.
- Capacity alerts.

Keep normal utilization below operational limits and retain enough free space for bulk imports and maintenance.

## 5. Data lifecycle

The general data lifecycle should be:

```text
Authoritative/researched source
    |
    v
Source registration
    |
    v
Original artifact acquisition
    |
    v
Filesystem immutable version
    |
    v
Extraction and normalization
    |
    v
Candidate/staging records
    |
    v
Classification and entity resolution
    |
    v
Evidence and quality evaluation
    |
    v
Human/system policy review
    |
    v
Canonical domain records
    |
    v
Derived analytical products
    |
    v
Approved APIs and discovery
    |
    v
Frontend and product consumption
```

The pipeline must distinguish original evidence from extracted text, normalized candidates, approved canonical records and derived outputs.

AI-generated information must remain reviewable and attributable.

AI must not silently overwrite canonical information.

## 6. Four data acquisition classes

Every domain must document which acquisition classes its tables can support.

| Class | Meaning | Example |
|---|---|---|
| 1A — Seeded/static | Manually curated baseline records. | Established country identities and researched historical periods. |
| 1B — Seeded/pattern | Generated expected structures from approved patterns. | Expected public offices under an approved government structure. |
| 2A — Collected | Automatically acquired source information. | Official election publications, rainfall readings and scientific datasets. |
| 2B — Derived | Reproducible output from existing data. | NDVI summaries, crop suitability and population comparisons. |

Table eligibility does not determine every row's origin.

Each record must retain its actual acquisition lineage.

A pattern may establish an expected office, but cannot establish that a person actually holds it.

A statistical model may estimate population, but cannot turn an estimate into a census count.

## 7. Processing and analytical architecture

### Reusable packages

The existing package-first direction should be retained.

Candidate capabilities include:

- Database access and migrations.
- Source acquisition.
- Scraping and website discovery.
- OCR and document extraction.
- Markdown conversion.
- File and S3 operations.
- Spatial processing.
- Statistical processing.
- Scientific extractors.
- Entity resolution.
- Classification.
- AI-assisted research.
- Quality evaluation.
- Dataset publication.

These are reusable packages and processing capabilities, not automatic reasons for new PostgreSQL schemas.

### Execution

Engine should coordinate:

- Pipeline identity and version.
- Run identity.
- Jobs and dependencies.
- Input/output versions.
- Retries and idempotency.
- Resource constraints.
- Candidate promotion.
- Review gates.
- Processing lineage.

Keep staging separate if its lifecycle and access requirements justify it.

Do not merge jobs, source captures, candidates, claims, audit decisions and canonical facts into one generic record.

### Analytical processing

PostgreSQL is not required to execute every large analytical calculation.

Evaluate:

- PostGIS for relational spatial analysis.
- Parquet for columnar analytical storage.
- DuckDB for suitable local analytical processing.
- Distributed processing only when measured workloads require it.
- Materialized views and cached aggregates for frequently requested results.

The canonical data remains governed by the domain database.

## 8. Product integration strategy

Mzizi should expose shared knowledge through stable domain APIs and data contracts.

Products should not directly read another product's private database tables.

### FarmAI

Potential shared Mzizi knowledge:

- Species and crop identities.
- Pests and pathogens.
- Disease classifications.
- Climate and soil information.
- Rainfall and weather histories.
- Geographic boundaries.
- Agricultural market prices.
- Historical production.
- Crop suitability evidence.

FarmAI should own:

- Private farm accounts.
- Farm-user relationships.
- User-specific field records where private.
- Individual farm operations.
- Recommendations.
- User interactions.
- Farm-specific workflows.
- Consent and product-specific data permissions.

A FarmAI observation should only enter shared Mzizi knowledge through an explicit contribution and verification process.

### FaidiBiz

Potential shared Mzizi knowledge:

- Geographic locations.
- Administrative boundaries.
- Canonical organization identities.
- Business classifications.
- Public amenities.
- Infrastructure.
- Local economic and statistical context.

FaidiBiz should own:

- Its operational business listings.
- Business-owner onboarding.
- Live availability.
- Product-specific service discovery state.
- Customer enquiries.
- Commercial interactions.
- Platform-specific moderation.

A local business identity and a commercial listing are related but not necessarily the same record.

### HouseHunt

Potential shared Mzizi knowledge:

- Places and neighborhoods.
- Transport and road networks.
- Water and electricity infrastructure.
- Schools and healthcare facilities.
- Flooding and environmental context.
- Population and density.
- Historical development.
- Rental and economic indicators where legitimately available.

HouseHunt should own:

- Property listings.
- Availability.
- Landlord and agent workflows.
- Customer enquiries.
- Property transactions.
- Viewing schedules.
- Product-specific property verification and moderation.

A physical building may have a Geography identity without being a HouseHunt listing.

### Product data contribution

Every cross-product contribution requires:

- A declared owner.
- Permission and legal basis.
- Provenance.
- Data classification.
- Privacy review.
- Quality assessment.
- Version history.
- A documented public/restricted/internal policy.

Shared knowledge does not mean unrestricted data sharing.

## 9. API and frontend strategy

Applications should interact with domain capabilities rather than browse database tables arbitrarily.

A shared exploration context should provide:

- Place.
- Time.
- Topic.

The frontend should support:

- Geographic maps.
- Layer selection.
- Historical timelines.
- Statistical comparisons.
- Scientific charts.
- Environmental visualizations.
- Entity profiles.
- Relationship exploration.
- Research accounts.
- Original evidence.
- Uncertainty and verification indicators.

### Example: Exploring a county

A user selecting a county should be able to access:

- Administrative identity and boundaries.
- Rivers and physical features.
- Rainfall and climate.
- Vegetation and species.
- Agricultural activity.
- Roads and public infrastructure.
- Schools and hospitals.
- Population and demographics.
- Government institutions.
- Elections.
- Markets and prices.
- Historical development.
- Source evidence.

The frontend should expose available, verified capabilities and clearly identify missing coverage.

## 10. Storage and data quality rules

1. PostgreSQL stores canonical relational information.
2. PostGIS stores and queries curated spatial geometry.
3. S3 stores original and derived file artifacts.
4. Filesystem owns logical file identities and versions.
5. Source owns source-document and capture identity.
6. Domain schemas own their canonical scientific and civic entities.
7. Statistical owns measurement definitions and comparable observations.
8. Derived products retain input and method lineage.
9. SHA-256 or an appropriate content hash supports deduplication.
10. An ETag must not automatically be treated as SHA-256.
11. Signed URLs must remain temporary.
12. Private credentials must never reach frontends.
13. Public/restricted access must be explicitly enforced.
14. Retention must be based on artifact and legal requirements.
15. Replication must not replace independent backup.

## 11. Growth and capacity monitoring

Measure:

- Database relation and index sizes.
- WAL growth.
- S3 bytes and object counts.
- Version retention.
- Duplicate-content rates.
- Average source-document size.
- Raster bytes per geographic area and time interval.
- Derived-product retention.
- Backup completion and restoration.
- Monthly ingestion by domain.
- Pipeline processing costs.
- Storage cost per published dataset.

Capacity forecasts should use actual measured ingestion rates after the pilot.

The current estimates are planning envelopes and should be recalibrated after each development stage.

## 12. Pilot strategy

The full knowledge architecture should be designed before the first broad implementation.

The first practical pilot should concentrate on Kenyan civic data because it can test:

- Reference classifications.
- Legal foundations.
- Geographic resolution.
- Cross-schema FKs.
- Governance and institutional structures.
- Person identity.
- Political affiliations.
- Elections.
- Statistical observations.
- Source preservation.
- Pattern generation.
- Evidence review.
- UI navigation.

The pilot must validate shared contracts without making Civic the owner of scientific, economic, historical or demographic knowledge.

After that, add scientific and other domain ingestion progressively.

A complete architecture does not require populating every domain before the first proof of concept.

## 13. Documentation authoring and architecture governance

The improvements library must have clear ownership and no competing descriptions of the same decision.

### Documentation hierarchy

| Document type | Responsibility |
|---|---|
| Advancement master | Long-term vision and cross-domain direction. |
| Knowledge architecture | Schema boundaries, canonical ownership and relationship contracts. |
| Scientific architecture | Scientific identities, observations, disease, ecological and human-science relationships. |
| Data-platform architecture | Storage, pipelines, products, APIs and scaling. |
| Domain design | Exact table-level domain responsibilities and candidate structures. |
| Master improvement register | Decision history, rejected alternatives and unresolved research. |
| Schema redesign index | Navigation and design status. |
| Task specification | Bounded, testable future work. |
| Decision record | Explicit user-approved architecture decisions. |
| Handoff | Instructions for the next contributor, including constraints and acceptance criteria. |

### Required structure for every domain design

Every schema document should contain:

1. Status and authority.
2. Purpose.
3. Canonical ownership.
4. Explicit exclusions.
5. Current repository inventory.
6. Candidate tables.
7. Table-by-table purpose.
8. Primary and foreign keys.
9. Cross-domain relationships.
10. Geographic responsibilities.
11. Temporal responsibilities.
12. Evidence and provenance.
13. Acquisition classes.
14. Derived-data behavior.
15. Example real-world queries.
16. Integrity constraints.
17. Indexing and performance considerations.
18. UI and API contracts.
19. External standards.
20. Open decisions and alternatives.
21. Human review and approval status.

### Required table review

Every existing and proposed table must have a review disposition:

- KEEP.
- REMOVE.
- DERIVE.
- MOVE.
- RENAME.
- MERGE.
- SPLIT.
- ADD.

A proposed table must explain why it exists and what existing responsibility cannot adequately own it.

### Naming rules

- Prefer one-word table names.
- Use two words only when clarity requires them.
- Avoid near-duplicate names.
- Avoid generic `records`, `items`, `data` and `links` without precise semantics.
- Avoid unbounded polymorphic FK patterns.
- Use clear domain-specific column names.
- Add meaningful schema, table and column comments.
- Preserve meaningful external identifiers.

### Temporal rules

Do not copy `valid_from`, `valid_to`, `is_current`, `deleted_at` and precision fields across every table.

Each date must represent a real fact:

- Appointment date.
- Occurrence date.
- Observation date.
- Publication date.
- Acquisition date.
- Reporting period.
- Legal commencement date.
- Historical validity.

Preserve uncertainty where the evidence requires it.

### Evidence rules

Every meaningful claim should be traceable to its original source, artifact version, acquisition method and review history.

An AI suggestion is not an approved canonical fact.

### Documentation change rules

- Preserve historical research.
- Do not erase previous user decisions.
- Do not silently replace a specific accepted design with a broad proposal.
- Use a single canonical location for each detailed design.
- Cross-link rather than copy complete sections.
- Label existing implementation separately from proposals.
- Record why an older recommendation was superseded.
- Keep unresolved issues visible.
- Do not update SQL or runtime claims merely because documentation proposes them.

## 14. Final architecture objective

Mzizi should become an African knowledge infrastructure capable of supporting multiple independent applications and research systems.

Its value will come from:

- Reliable source acquisition.
- Strong canonical entities.
- Deep geographic and temporal relationships.
- Scientific and civic interoperability.
- Historical evidence.
- Reproducible statistics and models.
- Reliable APIs.
- Scalable storage.
- Independent product ownership.

The objective is not to store every file or create a table for every subject.

The objective is to create a coherent, expandable system that understands how African places, people, nature, societies, institutions and economies relate across time.

All implementation, infrastructure purchases and database changes require their own explicit approval.

## 2026-11-11 — Two database direction

Main holds accepted knowledge, verified sources/evidence and published file metadata; Operations holds authentication, pipelines, staging, analytical work and operational data. Official documents and large scientific products are S3 bytes registered by version/checksum in Main. Python-native vectors are disposable. Rust exclusively accesses relational stores; Dryv is authoritative. Earlier database counts are superseded. Per-table capacity/partition choices remain unapproved; see the [schema catalogue](../schema-redesign/README.md).