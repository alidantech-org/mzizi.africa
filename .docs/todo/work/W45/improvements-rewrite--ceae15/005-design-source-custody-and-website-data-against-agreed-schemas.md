---
{id: TSK-0B9CCF587F64,name: Design source custody and website data against agreed schemas,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:28.867Z,updated_at: 2026-11-08T06:46:28.867Z,depends_on: [TSK-D6949284672E],order: 5120}
---

# 05 — Design source custody and website data against agreed schemas

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed destination schemas from task 04. Only now finalize detailed source and website design, using known destination records and filesystem contracts. Distinguish publisher, publication, site/URL, retrieval capture, stored version, extraction and attributed claim. Compare keeping or consolidating website/source tables without assuming a merge. Preserve raw evidence, licenses, locators, collection assessments and versioned Markdown derivatives. Define deduplication and meaningful-change semantics without treating a changed hash as proof of a changed real-world fact. Carry the agreed schema naming and hard-FK policy into this design.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/source.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md)
- [source-redesign/01-current-inventory-and-boundaries.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/01-current-inventory-and-boundaries.md)
- [source-redesign/02-source-schema-and-human-review.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/02-source-schema-and-human-review.md)
- [source-redesign/03-discovery-links-and-site-memory.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/03-discovery-links-and-site-memory.md)
- [source-redesign/04-structures-templates-and-extraction.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/04-structures-templates-and-extraction.md)
- [source-redesign/06-incremental-change-dedup.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/06-incremental-change-dedup.md)
- [source-redesign/11-tool-integration-and-contracts.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/11-tool-integration-and-contracts.md)
- [source-redesign/12-artifact-lifecycle-and-lineage.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/12-artifact-lifecycle-and-lineage.md)
- [site-structure-and-markdown-extraction.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/site-structure-and-markdown-extraction.md)

## Acceptance checklist

- [ ] Audit source/website tables and actual use, then explicitly decide keep/merge/rename/split with complete column specifications.
- [ ] Specify captures, publications, files, extraction outputs and typed claim evidence relationships against agreed domains.
- [ ] Define discovery boundaries, source assessment, preservation, content hashes and incremental change contracts.
- [ ] Map concrete source artifacts and fields to exact domain destinations, documenting abstention and disagreement behavior.
- [ ] Prepare compatibility/migration plan and user-reviewed contracts for the final pipeline design.
