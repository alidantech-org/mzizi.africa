---
id: DOC-HANDOFF-MAIN-OPS-CONTRACTS-20261112
name: Main and Operations contract implementation handoff
type: handoff
tags: [database, contracts, source, filesystem, legal, operations]
extra: {status: implementation_in_progress, recorded_on: 2026-11-12, task: TSK-D47EF2FA7531}
---

# Main and Operations contract implementation handoff

## Scope and current state

The 12 November implementation authorization covers Main Source, Filesystem and Legal contract development, necessary Reference integration, and review of all seven approved Operational schemas. Main owns accepted canonical knowledge and evidence; Operations owns discovery, execution, staging and publication coordination; SeaweedFS owns bytes. Cross-database references are opaque typed IDs validated by the application. They are never PostgreSQL foreign keys.

Contracts have been authored in `dryv/contracts/schemas/mzizi/{filesystem,source,legal}.ts`. Filesystem defines folders, files, extensions, immutable versions, derivative relations, tags and taggings. Source defines publishers, source identities, websites, APIs, documents, manifests/releases/bindings, captures, evidence, citations, verifications, attributions and publication receipts. Legal defines instruments, instrument versions, provisions, provision versions and amendments. Operations adds normalized staging revision source references and pinned external manifest release metadata to Engine. Reference taxonomy relations remain proposal-only.

## Important limits

The Rust SQL pack remains a skeleton and drops key persistence semantics; no migrations or generated artifacts are authorized. Scheme-aware value checks, compound owner keys, immutable release enforcement, cross-field temporal checks, cycle prevention, S3 object verification, and atomic idempotent Main publication are not proven. The separate `contracts/apps/main-evidence-review.ts` entrypoint now passes TypeScript, Dryv doctor and compile with the Main Reference, Geography, Filesystem, Source, Legal and Reference-Legal groups composed. The active database app remains unchanged because generation activation was not authorized. These contracts are authored proposals, not generation-ready deployed schema.

Reference now includes typed Legal mediation contracts for exact provision versions, citations, Geography changes and Official entities in `reference.ts`. They compile in the review entrypoint but remain excluded from active database composition. Governance and other domain-specific Legal associations still need exact target review. Publication receipts specify same-key/same-hash replay and conflict semantics, but runtime transaction behavior is unimplemented.

## Flow and boundary

```text
Acquisition -> Engine -> temporary artifacts -> Filesystem verified versions
     -> Source captures/evidence/citations -> Staging revision and reviews
     -> Management publication request -> Main atomic records + receipt
     -> Management delivery receipt / retry reconciliation
```

Operations stores Main identifiers as `*_ref_id`; Main stores Operations publication identity as `*_ref_id`. The application validates each external reference and hash. No distributed transaction spans PostgreSQL databases or S3.

### Authored relationship graph

The Main review compile contains 100 typed relation fields: Filesystem→Filesystem/Reference; Geography→Geography/Reference; Legal→Legal/Geography/Reference/Filesystem/Source/Official; Official→Reference; Reference→Reference; Reference-Legal→Reference/Reference-Legal/Legal/Source/Geography/Official; Source→Source/Reference/Filesystem/Official. The individual Dryv field definitions are the authoritative complete table-and-column edge list. These are compile-validated relations only; the Rust SQL pack has not been shown to preserve them. Operations relations are authored within the seven approved namespaces; the added Acquisition and Staging artifact references target `engine.artifacts` with restrictive relations.

Cross-database external identifiers currently include Operations `acquisition.targets.publisher_ref_id` → Main Source publisher, `engine.pipeline_releases.manifest_release_ref_id` → Main Source manifest release, `staging.revision_sources.{source_evidence_ref_id,source_citation_ref_id,file_version_ref_id,manifest_release_ref_id}` → Main evidence/citation/file-version/manifest-release, and Auth scope `country_ref_id`, `geographic_unit_ref_id`, and `dataset_ref_id` → Main Reference/Geography/domain identities. Main `source.publication_receipts.publication_ref_id` points back to the Operations publication. These IDs are not cross-database FKs and require application-side existence and ownership validation.

## Follow-up

Resolve faithful SQL emission and persistence constraint support before adding these groups to the active database app. Then run valid/invalid insert scenarios, including scheme mismatch, mismatched file ownership, duplicate publication key with altered hash, access-prefix violations, and invalid legal scope, before marking generation ready.
