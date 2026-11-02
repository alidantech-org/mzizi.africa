---
{id: TSK-9D555B563153,name: Source schema and removal of embedded provenance,type: task,status: planned,priority: medium,created_at: 2026-11-02T06:41:22.356Z,updated_at: 2026-11-02T06:41:22.356Z,due_at: 2026-11-02,order: 2048}
---

# Source schema and removal of embedded provenance

## Goal

Create the source schema (publishers, documents, captures, methods, attributions, verifications) and remove the ten embedded evidence columns from every data entity, so that sources know the records they produced and data tables know nothing about sources.

## Context

.docs/docs/SOURCING_DESIGN.md has the model. Data entities currently extend the shared EvidencedEntity (source name, reference, url, artifact id and checksum, retrieved at, licence, method, tool, confidence, verification state). They will extend the historical base only (valid time, record time, version). Attributions link by schema.table and id; verifications are an append-only ledger. The geography reads that show boundary source, licence and "verified only" must join the source tables. Fixtures and every test that builds evidence fields change: the fixture loader will create a source document and an attribution per loaded row. The contract audit changes from requiring evidence columns to requiring valid time, and the exported target-kind list continues to validate attributions and audit records.

## Acceptance checklist

- [ ] Author the source contracts with read endpoints for documents, captures, methods, attributions and verifications.
- [ ] Remove provenance fields from the shared base and all domain entities.
- [ ] Update the audit tool and the target-kind export for the new base.
- [ ] Rewrite the geography boundary provenance and verified-only queries to use source.
- [ ] Update the fixture loader to create document, capture and attribution rows.
- [ ] Update every test that seeded evidence fields.
