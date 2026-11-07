---
id: DOC-9A8E56DB1C13
name: Source evidence and derived artifact lifecycle with S3 and provenance
type: documentation
tags: [improvements, source-redesign, artifacts, filesystem, s3, lineage]
extra: {status: planning_only, implementation_approved: false, storage_service: existing}
---

# 12 — Building, storing, versioning and replaying artifacts

**Planning only.** Mzizi already has an external S3-compatible storage service and a filesystem domain. Existing source.captures records observed captures. This document describes *logical* artifact classes; **do not create one new SQL table per class**, provision another S3 instance, assign bucket names or migrate files without human schema/operational review.

## Four distinctions to protect

1. **Physical object** — exact bytes in existing S3, potentially content-addressed/deduplicated.
2. **Logical file/artifact version** — named, versioned, tagged, access-controlled filesystem reference to bytes plus derivation metadata.
3. **Source observation/capture** — evidence that a URL was probed or fetched at a time, with redirects, status, headers, policy and (if bytes exist) a capture-to-file reference. A 304 or failed visit is an observation without a new body.
4. **Derived product** — reproducible DOM representation, cleaned Markdown, table, OCR, classification, extracted candidate, trained model or embedding that depends on earlier artifacts and pinned processing versions.

A URL is not a publication, a publication is not an S3 object, and an observation is not the same as source content. A single PDF byte object may have several URL sightings and retrieval times.

## Artifact classes and preferred logical placement

| Artifact | Why it exists | Storage/identity proposal | Important rule |
|---|---|---|---|
| Raw HTML/PDF/CSV/JSON/image bytes | Preserve direct evidence | Immutable S3 object, linked via filesystem file/version and source capture | Original bytes never overwritten by cleaned text |
| Request/response status, redirects, headers, ETag, Last-Modified, failure/304 | Provenance and refresh memory | Compact source/engine observation metadata | 304 does not create fictitious new raw bytes |
| Optional rendered DOM/screenshot | Reproduce JS/layout-dependent content | Versioned filesystem/S3 derivative | Pin browser settings and parent capture |
| Optional WARC/WACZ | High-fidelity replay for selected websites | S3 archival artifact | Evaluate size, scope, retention and Browsertrix licensing |
| URL/link graph, anchor and DOM section context | Site discovery and coverage memory | Relational source/website model (physical boundary OPEN) | Links in repeated navigation matter even when excluded from text |
| Cleaned Markdown/text, DOM block maps | Search and focused extraction | S3 derivatives with capture/DOM locators | Regenerable; main-text hash differs from raw hash |
| PDF text, OCR, tables | Preserve document field evidence | Versioned S3 derivative, PDF-page/table/span location | OCR inference never replaces original scanned evidence |
| Classification and field-proposal JSON | Record interpretation and uncertainty | Existing intelligence/engine/staging/audit or file artifact by volume | Pin model/version/input and preserve review outcome |
| Dense/sparse embeddings | Retrieval acceleration | Optional replaceable vector index with relational IDs | Rebuild from approved stored derivatives |
| YAML/selector/site-family strategy and manifest | Reusable extraction definition | Existing structure/version/filesystem storage | Candidate rules inactive until checked/approved |
| Model weights, frozen test cases, gold labels, run reports | Research reproducibility | Versioned permissioned filesystem/S3 artifacts | Generated labels are not human gold data |

Prefer compact relational pointers plus reusable immutable files instead of copying large bodies into Postgres. Never put source identity *only* inside a vector point.

## End-to-end artifact chain

~~~text
verified site + approved fetch scope
  -> page link occurrence -> requested URL
  -> observation (time/status/redirects/validators)
  -> raw capture ID -> filesystem file version -> S3 object SHA-256
  -> PDF parser vX -> extracted table artifact (page 12, table 2)
  -> lexical/vector search index (rebuildable)
  -> field candidate with page/span locator
  -> validation + review decision
  -> canonical finance record version with evidence
~~~

If another page links to exactly the same PDF bytes, retain both sightings and their evidence chains while deduplicating the physical bytes. A PDF for a different fiscal year remains distinct even if its template and embedding look similar.

## Suggested artifact manifest (illustrative only; not approved DDL)

~~~json
{
  "artifact_id": "example-id",
  "artifact_type": "derived/pdf-table",
  "parent_artifact_ids": ["example-capture-id"],
  "source_capture_id": "example-capture-id",
  "filesystem_version_id": "example-file-version",
  "sha256": "example-content-hash",
  "media_type": "application/json",
  "producer": {"name": "pdf-parser", "version": "pinned"},
  "configuration_hash": "example-config-hash",
  "schema_version": "candidate-v1",
  "evidence_locators": [{"pdf_page": 12, "table": 2}],
  "created_at": "2026-11-07T09:00:00Z",
  "access_scope": "policy-controlled",
  "collection_decision_id": "example-decision",
  "retention_class": "to-be-reviewed"
}
~~~

Depending on actual existing source/filesystem columns, these values may live in relational records, an immutable sidecar or both; do not reflexively duplicate them. Pin processor, model, prompt, structure bundle, ontology and normalization versions **only when used**, and distinguish valid/effective time from capture time.

## Proposed build and store sequence

1. Obtain admission from existing source assessment/legal gate, then record exact request URL, scope, time and settings.
2. Fetch within policy; validate MIME/size/security, redirects, status and headers. Compute SHA-256 from actual bytes.
3. Persist immutable payload through the **existing filesystem service and S3 backend**; verify checksum; register/reuse object and logical file/version. Record a separate source capture tied to URL/time/policy.
4. Extract links and DOM context into site memory **before** main-text cleaning removes navigation.
5. Generate versioned derived files (Markdown, structured DOM regions, PDF tables/OCR) from a **specific capture**, with producer versions and original evidence locators.
6. Build candidate index points from meaningful blocks using stable IDs, hashes, jurisdiction/language/access metadata and embedding model versions; never rely on vector-store copies as sole text.
7. Save field proposals and uncertainty in staging/intelligence; run source/geo/temporal/schema validation, with attributable reviewer decision before canonical promotion.
8. Reprocess unchanged raw captures after parser/model improvements without refetching. Use validators/raw/content/block/result hashes to distinguish changes; propagate invalidation only to dependent derivatives.
9. Audit broken parents, orphaned files, stale search points, object integrity, backup/restore and access. Introduce retention/deletion/hold rules **only after approval**, preserving objects still referenced by other captures.

### Identity and cache keys to distinguish

- Raw blob: exact bytes SHA-256 (with media/encoding context as needed).
- Request: meaningful URL, method, body, selected headers and normalization version.
- Page: logical page equivalence is inferred/verified, not automatically equal to a normalized URL.
- Main content: normalized meaningful-text hash; not a substitute for original evidence.
- Derivative: parent version IDs + parser/tool/version + configuration + output schema/version.
- Embedding: text/representation hash + embedding/preprocessing model version.
- Source fact: evidence plus time, jurisdiction and review; never conflated with embedding similarity.

### Access and replay

S3 keys remain opaque; URLs and private access links are issued under the **existing storage service's** capabilities. Public official records can be public when legally permitted; research-only/private materials require correct scopes. Consider signatures/expiry, encryption, integrity checks, access audits, backup, retention and licensing. For selected high-fidelity sources, evaluate [WARC](https://www.iso.org/standard/68004.html), [Browsertrix](https://docs.browsertrix.com/user-guide/concepts/) and [W3C PROV](https://www.w3.org/TR/prov-o/) without implementing a new archive format or entire ontology.

**Reproducibility test:** with network disabled and vector index empty, retrieve a retained capture from existing S3, regenerate its content and candidate with pinned processor versions, reconstruct the provenance chain, and rebuild search points. If this fails, the artifact contract is not finished.

See [existing file-manager plan](../file-management-and-s3.md), [07 storage options](07-storage-and-vector-options.md), [11 adapters](11-tool-integration-and-contracts.md) and [data lifecycle](../../docs/DATA_LIFECYCLE.md). **All physical table/retention decisions remain open.**

## Person-media artifact lineage

For a CSS-backed portrait, the evidence chain should be:

```
source page capture
  -> DOM member-card block / linked stylesheet capture
  -> CSS rule or image attribute occurrence
  -> resolved image URL and policy decision
  -> original image bytes + SHA-256 in existing S3
  -> filesystem file/version
  -> candidate person-to-portrait association
  -> reviewed filesystem.attachments portrait relationship
  -> selected display portrait with valid/observed dates
```

Retain original and resolved URL, stylesheet/page capture IDs, CSS selector or DOM locator, discovery method, exact byte hash, MIME type, dimensions, rights/licence evidence, retrieval time and file-version reference. Multiple sources may point to the same exact bytes; keep all source sightings while reusing the object. Different photographs of the same person remain separate files. Perceptual hashes are optional duplicate-image hints, never person identity.

Do not persist face embeddings as ordinary image derivatives or general vector payloads. Biometric artifacts, if ever lawfully approved, require a separate documented purpose, access, retention, security and deletion design. See [person identity/media refinement](../person-identity-media-and-community-refinement.md).
