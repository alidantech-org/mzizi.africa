---
{id: DEC-PROVENANCE-IN-SOURCE,name: Decision - provenance lives in the source schema,type: decision,tags: [source,provenance,database]}
---

# Decision: provenance lives in the source schema

Date: 2026-11-02.

## Decision

Data tables carry no provenance columns. Valid time, record time and version stay on the row. Where a record came from (publisher, document, capture, method, locator, confidence) is held in `source.attributions`, which points at the row by `schema.table` and id, and the record's verification state is an append-only ledger in `source.verifications`. No foreign key crosses between `source` and any other schema.

## Why

Ten evidence columns were repeated in 69 tables, a record could have only one source, and every schema depended on the meaning of evidence. A separate schema lets many sources support or contradict one record, lets a source list everything it produced, keeps the data tables small, and keeps each schema movable to its own database. AGENTS.md section 4 is still met: every claim can answer where it came from, but the answer is looked up, not stored on the row.

## Consequences

- Reads that show provenance (for example boundary source and licence for the map) join `source` in hand-written SQL; these are the only intended cross-schema reads.
- Importers and promotion must write attributions and verifications with every record they create; the database engine owns that rule.
- Fixture loading writes a "Test fixture" document, an attribution and an `unverified` verification per row, so fixtures can never pass for canonical data.
- `audit.evidence` points at a file in `filesystem`; it is a contributor submission, not a source.
