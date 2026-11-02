# Mzizi File Management Service

**Status:** architecture scaffold; implementation follows source/artifact contract definition.

## Purpose

The file service owns evidence-artifact custody so every structured claim can remain traceable to the exact source material Mzizi used.

## Owns

- source artifact registration;
- content hashing/verification;
- raw artifact preservation;
- metadata capture;
- storage-location abstraction;
- artifact versioning;
- derived-artifact relationships;
- retrieval/authorization policy where required;
- deduplication by content hash where safe;
- archival/retention lifecycle.

## Artifact examples

- PDFs;
- scanned documents/books;
- images;
- historical maps;
- CSV/JSON datasets;
- spreadsheets;
- web snapshots;
- OCR derivatives;
- extracted text files;
- table/image derivatives.

## Core rule

Raw evidence is immutable after capture.

```text
Source
  └── Raw Artifact v1
       ├── OCR derivative
       ├── text derivative
       └── extracted-table derivative

Upstream source changes
  └── Raw Artifact v2
```

Do not overwrite the earlier artifact with the new version.

## Storage direction

Binary content should live in object/file storage. PostgreSQL stores artifact metadata, lineage and references rather than serving as a general blob store.

## Does not own

- semantic extraction;
- AI classification/cleaning;
- canonical domain records;
- schema migrations for the platform;
- public application endpoints beyond controlled file access contracts.

Relevant file-related behavior currently inside `../api` should be inventoried and migrated here where appropriate.

See `../../.docs/ARCHITECTURE.md` and `../../.docs/DATA_LIFECYCLE.md`.
