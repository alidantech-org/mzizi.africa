---
{id: TSK-B9F499223E0F,name: Download files and assign purposes and extraction profiles,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:18.062Z,updated_at: 2026-11-13T10:12:18.062Z,order: 4096}
---

# Download files and assign purposes and extraction profiles

## Goal

Download files discovered by a crawl (PDFs, spreadsheets, GeoJSON and similar), keep the raw bytes, assign each a probable purpose with confidence and evidence, select an extraction profile and extract into the staging store.

## Context

Raw bytes are never modified; one document per content hash with a sighting per URL; real type is sniffed, not trusted from the extension. Purpose comes from the rule matcher first and the semantic matcher second, using file name, link text and extracted first-page text. Extraction uses the `extraction` package (PDF text and tables, OCR for scans, CSV, JSON, GeoJSON) and writes staged documents with diagnostics. Unexpected personal data is quarantined by policy. Depends on the object-store adapter, staging store and classification tasks.

## Acceptance checklist

- [ ] Downloads enforce size, count and type caps, record hash and sightings, and store raw bytes unchanged in the object store.
- [ ] Purpose assignment records layer, rule, score and evidence, and leaves low-confidence files unclassified for review.
- [ ] A manifest-driven mapping from purpose and type to extraction profile runs extraction and stages documents without loading large files into memory.
- [ ] Personal-data quarantine and diagnostics are tested end to end on fixture PDFs and CSVs.
