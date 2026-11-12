---
id: DOC-MZIZI-TWO-DATABASE-RULES-20261111
name: Two database ownership and publication rules
type: architecture-proposal
tags: [database, main, operations, publication, evidence]
extra: {status: proposed, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Two database architecture: knowledge and operations

> **Planning proposal, awaiting user review.** Schema assignments follow the 12 November handoff; detailed tables, columns and relationships still require user review in [schema-redesign](../schema-redesign/README.md). No runtime, SQL or deployment change is authorized by this document.

## Decision direction

Use two logical PostgreSQL databases:

- **Main** owns accepted, well-structured Mzizi knowledge across all domains, accepted sources, exact evidence links, published file metadata, verified extracted content and approved analytical products.
- **Operations** owns authentication and access administration, acquisition/crawl state, pipelines, runs, retries, candidate staging, analytical work, operational audit and disposable intermediate references.
- **S3** stores original and derived file bytes, including official PDFs and large scientific data. Main owns the published file identity, immutable versions, checksums, provenance, rights/access metadata and searchable/structured extracted information as appropriate.
- **Python-native vector indexes** serve scraping, NLP, retrieval and field-mapping capabilities. They are disposable and are not canonical data stores.
- **Rust database manager** is the sole application boundary for reads, writes, seeds and migrations in Main and Operations.
- **Dryv** is the authored contract for both targets and typed operations. NestJS and Python call Rust-generated clients; neither holds database credentials.

Two databases are logical ownership boundaries. Initial deployments may colocate them, but production capacity, backup and failover policies must budget them separately. Main stores cross-domain subject schemas together to support real local foreign keys and connected queries.

## Main admission rule

Main accepts structured records only after a declared admission path: manually reviewed evidence, an approved deterministic release process, or an expressly approved source-specific gate. “Clean” means typed, attributable, validated, versioned and honest about uncertainty. It does not mean every record is undisputed or perfectly certain. Official origin alone does not prove a claim.

A published factual record must preserve the appropriate:

- Exact supporting source and immutable artifact version.
- Publisher and attribution/access basis.
- Retrieval time separately from the historical or observation time.
- Method/model and input versions for derived/extracted content.
- Review/approval and correction history.
- Confidence, disagreement, missingness and uncertainty when relevant.

Preserve original evidence even when an extraction is accepted. Never replace the source artifact with cleaned text.

## Publication lifecycle

```text
source discovery (Operations)
  → original bytes captured and hash-verified in S3
  → source artifact descriptor/capture (Operations)
  → extraction and cleaning (Python capability)
  → versioned candidate and findings (Operations)
  → reviewer or approved deterministic acceptance
  → Rust publication command
      ├─ Main transaction: domain record versions + durable evidence/provenance
      └─ Operations reconciliation: durable acknowledgment
  → NestJS serves typed Main reads
```

Before publishing, Rust validates the contract version, actor authorization, evidence references, expected entity version, idempotency key and required S3 object existence/hash. It commits related Main record versions and evidence in one Main transaction. Operations Management tracks the request and reconciles the acknowledgement with authoritative civic state. A retry with the same request key and content must return the same accepted outcome; a changed request under that key conflicts. The exact civic-side durable idempotency representation remains a contract review question. The earlier Main Management receipt placement is superseded; Management stays in Operations.

Do not attempt one ACID transaction across Main, Operations, S3 and vector indexes. Use durable workflow steps, idempotent operations and reconciliation. Never hold database locks while downloading, OCR, embedding or running ML.

Operations auth identities do not have foreign keys in Main. Publication stores the minimum durable actor snapshot and approval reference needed to explain the decision after operational account records are archived. Accepted civic records retain sufficient durable publication/provenance context to reconcile outcomes; operational logs are not evidence. No Main Management schema is authorized.

## File and dataset policy

Official source documents and accepted formatted files are published in S3 and registered in Main filesystem/source records. PostgreSQL retains IDs, versions, hashes, byte size, content type, access, rights, citations, searchable text or query-critical extracted structures. Large immutable PDFs, raster imagery, scientific arrays, recordings and bulk export files remain objects.

Use content-addressed or immutable keys where supported; verify checksum and length before publication. Record a manifest with dataset version, schema, geographic/time coverage, units, chunk layout, CRS, source, transformation and access class. Support selective range/chunk retrieval. A mutable external URL alone cannot reproduce a published result; retain the exact needed inputs or document a durable licensed access route plus retrieval checksum and limitations.

## Query and consistency behavior

A Mombasa exploration query resolves Main geography identities and the exact boundary release, then queries the Phase 01 civic/governance, official, politics, finance, procurement, accountability and evidence records within Main. Economy, Statistical, Environment, Linguistics, History and all other Phase 02 proposals remain deferred and unapproved. Local foreign keys and joins preserve identity. Rust exposes bounded typed operations; NestJS assembles product DTOs. Python does not query Main directly.

For expensive multi-year cross-domain work, Operations records the request and pinned inputs. Workers process selected S3/Main releases, then publish accepted outputs through Rust into the owning Main domain. A projection is marked with input release IDs, build time and freshness. Main and replica reads disclose stale/unavailable coverage where relevant.

## Review and readiness boundary

The schema index is the approval register. The 7 Operational and 12 Phase 01 schema assignments are agreed. Detailed tables, columns, cross-schema FKs, partitions and evidence paths stay open until reviewed; all Phase 02 schemas are deferred and unapproved. Material edits reopen that approval and any dependent relationship. Documentation completion is not implementation approval.

The old database naming rule bans cross-schema FKs. This proposal supersedes that assumption for Main only; Operations may use local FKs. The rule file itself remains untouched in this documentation pass and must be reconciled before implementation.

Fresh Main and Operations targets will be designed from approved Dryv contracts. Existing database state and S3 artifacts remain intact until a separately authorized selective import and cutover plan is approved.

## Phase and legal boundaries — 12 November 2026

Main is the civic knowledge database; Phase 01 includes geography and geospatial queries. All Operational schemas, including Management, stay in the separate Operations database. A staging candidate is not an accepted civic record. Public oversight findings and participation belong in Accountability; Audit records only operational/security events and cannot substitute for Source evidence. Domain schemas link to Reference, and Reference is the only schema linking to Legal. Official separates identity from Governance authority; Politics keeps political relationships and election results in distinct tables. Finance and Procurement, and Source and Filesystem, remain separate. See the [relocation inventory](../schema-redesign/README.md#relocation-inventory).
