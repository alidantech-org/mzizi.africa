---
{id: TSK-9D555B563153,name: Source schema and removal of embedded provenance,type: task,status: completed,priority: medium,created_at: 2026-11-02T06:41:22.356Z,updated_at: 2026-11-02T06:59:00.053Z,due_at: 2026-11-02,order: 2048,extra: {status_history: [{from: planned,to: completed,at: 2026-11-02T06:59:00.053Z}]},archived_at: 2026-11-04T15:53:07.952Z}
---

# Source schema and removal of embedded provenance

## Goal

Create the source schema (publishers, documents, captures, methods, attributions, verifications) and remove the ten embedded evidence columns from every data entity, so that sources know the records they produced and data tables know nothing about sources.

## Context

.docs/docs/SOURCING_DESIGN.md has the model. Data entities currently extend the shared EvidencedEntity (source name, reference, url, artifact id and checksum, retrieved at, licence, method, tool, confidence, verification state). They will extend the historical base only (valid time, record time, version). Attributions link by schema.table and id; verifications are an append-only ledger. The geography reads that show boundary source, licence and "verified only" must join the source tables. Fixtures and every test that builds evidence fields change: the fixture loader will create a source document and an attribution per loaded row. The contract audit changes from requiring evidence columns to requiring valid time, and the exported target-kind list continues to validate attributions and audit records.

## Acceptance checklist

- [x] Author the source contracts with read endpoints for documents, captures, methods, attributions and verifications.
- [x] Remove provenance fields from the shared base and all domain entities.
- [x] Update the audit tool and the target-kind export for the new base.
- [x] Rewrite the geography boundary provenance and verified-only queries to use source.
- [x] Update the fixture loader to create document, capture and attribution rows.
- [x] Update every test that seeded evidence fields.

## Progress

New source schema: publishers, documents, captures, methods, attributions (target kind + id + relation + locator + method + confidence) and an append-only verifications ledger, with public read endpoints. The ten embedded evidence columns were removed from all data entities, which now extend HistoricalEntity (domain facts) or BaseEntity (system schemas); the audit rejects provenance columns outside source. Geography boundary source, licence, retrieval time and verified-only reads now join source in hand-written SQL (the only cross-schema reads). The fixture loader writes a Test fixture document, attribution and unverified verification per row. Decision record: .docs/decisions/provenance-in-source-schema.md.
