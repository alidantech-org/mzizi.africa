---
id: DOC-DB-SCHEMA-REVIEW-20261111
name: Schema redesign phased catalogue
type: documentation
tags: [improvements, planning, schemas, review, approval]
extra: {status: operational_approved_main_phase_01_review_pending, operational_implementation_authorized: true, main_phase_01_approval_required: true, phase_02_deferred: true, migrations_authorized: false, deployment_authorized: false}
---

# Schema redesign catalogue

The 12 November 2026 handoff organizes the design documents into Operational, Phase 01 and Phase 02. The seven Operational schemas and their 45-table/column inventory are approved under [DEC-OPERATIONAL-DATABASE-20261112](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md). The Main Phase 01 `reference` and `geography` designs are also approved and have authored Dryv contracts; their current design records are [Reference](mzizi-db/phase-01/reference.md) and [Geography](mzizi-db/phase-01/geography.md). Other Main Phase 01 schemas remain under individual review. Phase 02 remains deferred. Contract approval does not authorize migrations, data changes or deployment; Geography generation remains blocked on faithful PostGIS support.

> **Every schema not assigned to Phase 01 or Operational belongs in Phase 02 now.**

Phase 02 is a holding area for deferred proposals. Moving a schema there does not approve it or mean planning has started.

## Organization

| Folder | Purpose | Schema documents |
|---|---|---|
| [Operational](mzizi-operational-db/README.md) | System/workflow records in a separate Operations database | 7 |
| [Phase 01](mzizi-db/phase-01/README.md) | Agreed civic accountability pilot in Main, including geography and geospatial queries | 12 |
| [Phase 02](mzizi-db/phase-02/README.md) | All other schemas; deferred and unapproved | 14 |

Main is the civic knowledge database; Operations is separate. S3/object storage holds bytes, while Filesystem records accepted identities and versions and Source records evidence. The broader [two-database rules](../knowledge-platform/two-database-rules.md), [database management proposal](../knowledge-platform/rust-dryv-management.md) and [capacity guidance](../knowledge-platform/capacity-partitioning-storage.md) remain background design inputs; this handoff controls schema scope and placement. No runtime technology migration is performed here.

## Agreed ownership

Reference mediates legal relationships: domain schemas link to Reference, and **Reference is the only schema that links to Legal**. Legal remains separate. Official consolidates Person and Organization, preserving distinct identity types without implying authority. Governance owns mandates, offices, officeholders, appointments and tenure. Politics consolidates Political and Electoral, preserving separate political relationship and result tables. Accountability consolidates oversight and Participation, preserving distinct record types. Finance and Procurement are separate schemas; Source and Filesystem are separate schemas. All seven operational schemas, including Management, belong only in Operations.

Countrywide institutions must link to the geographic unit representing the whole country. Geography includes dated units, relationships, places, boundary versions, spatial representations and geographic history, with PostGIS queries for known areas, coordinate-to-area lookup, nearby searches and intersections.

## Relocation inventory

All **35 original schema documents** map below to **33 destination schema documents**. Person/Organization and Political/Electoral each consolidate two inputs; Participation expands into Accountability. All other inputs have one destination. No old schema document remains at the root. Each destination retains the useful table proposals, column dictionaries, relationships, examples, capacity assumptions and historical review notes. Old measured inventories and collapsed historical proposals keep their original terminology; they do not override the current scope.

| Original root file | Destination | Treatment |
|---|---|---|
| `acquisition.md` | [operational/acquisition.md](mzizi-operational-db/acquisition.md) | Retained with agreed ownership updates |
| `activity.md` | [phase-02/activity.md](mzizi-db/phase-02/activity.md) | Deferred and unapproved; proposal content retained without redesign |
| `agriculture.md` | [phase-02/agriculture.md](mzizi-db/phase-02/agriculture.md) | Deferred and unapproved; proposal content retained without redesign |
| `analytics.md` | [operational/analytics.md](mzizi-operational-db/analytics.md) | Retained with agreed ownership updates |
| `audit.md` | [operational/audit.md](mzizi-operational-db/audit.md) | Retained with agreed ownership updates |
| `auth.md` | [operational/auth.md](mzizi-operational-db/auth.md) | Retained with agreed ownership updates |
| `biology.md` | [phase-02/biology.md](mzizi-db/phase-02/biology.md) | Deferred and unapproved; proposal content retained without redesign |
| `chemistry.md` | [phase-02/chemistry.md](mzizi-db/phase-02/chemistry.md) | Deferred and unapproved; proposal content retained without redesign |
| `civic.md` | [phase-01/civic.md](mzizi-db/phase-01/civic.md) | Retained with agreed ownership updates |
| `economy.md` | [phase-02/economy.md](mzizi-db/phase-02/economy.md) | Deferred and unapproved; proposal content retained without redesign |
| `education.md` | [phase-02/education.md](mzizi-db/phase-02/education.md) | Deferred and unapproved; proposal content retained without redesign |
| `electoral.md` | [phase-01/politics.md](mzizi-db/phase-01/politics.md) | Merged political/election inputs; distinct tables |
| `engine.md` | [operational/engine.md](mzizi-operational-db/engine.md) | Retained with agreed ownership updates |
| `environment.md` | [phase-02/environment.md](mzizi-db/phase-02/environment.md) | Deferred and unapproved; proposal content retained without redesign |
| `filesystem.md` | [phase-01/filesystem.md](mzizi-db/phase-01/filesystem.md) | Retained with agreed ownership updates |
| `finance.md` | [phase-01/finance.md](mzizi-db/phase-01/finance.md) | Retained with agreed ownership updates |
| `geography.md` | [phase-01/geography.md](mzizi-db/phase-01/geography.md) | Retained with agreed ownership updates |
| `governance.md` | [phase-01/governance.md](mzizi-db/phase-01/governance.md) | Retained with agreed ownership updates |
| `health.md` | [phase-02/health.md](mzizi-db/phase-02/health.md) | Deferred and unapproved; proposal content retained without redesign |
| `heritage.md` | [phase-02/heritage.md](mzizi-db/phase-02/heritage.md) | Deferred and unapproved; proposal content retained without redesign |
| `history.md` | [phase-02/history.md](mzizi-db/phase-02/history.md) | Deferred and unapproved; proposal content retained without redesign |
| `legal.md` | [phase-01/legal.md](mzizi-db/phase-01/legal.md) | Retained with agreed ownership updates |
| `linguistics.md` | [phase-02/linguistics.md](mzizi-db/phase-02/linguistics.md) | Deferred and unapproved; proposal content retained without redesign |
| `management.md` | [operational/management.md](mzizi-operational-db/management.md) | Retained with agreed ownership updates |
| `organization.md` | [phase-01/official.md](mzizi-db/phase-01/official.md) | Merged identity inputs; distinct record types |
| `participation.md` | [phase-01/accountability.md](mzizi-db/phase-01/accountability.md) | Participation retained within broader Accountability |
| `person.md` | [phase-01/official.md](mzizi-db/phase-01/official.md) | Merged identity inputs; distinct record types |
| `political.md` | [phase-01/politics.md](mzizi-db/phase-01/politics.md) | Merged political/election inputs; distinct tables |
| `procurement.md` | [phase-01/procurement.md](mzizi-db/phase-01/procurement.md) | Retained with agreed ownership updates |
| `reference.md` | [phase-01/reference.md](mzizi-db/phase-01/reference.md) | Retained with agreed ownership updates |
| `research.md` | [phase-02/research.md](mzizi-db/phase-02/research.md) | Deferred and unapproved; proposal content retained without redesign |
| `society.md` | [phase-02/society.md](mzizi-db/phase-02/society.md) | Deferred and unapproved; proposal content retained without redesign |
| `source.md` | [phase-01/source.md](mzizi-db/phase-01/source.md) | Retained with agreed ownership updates |
| `staging.md` | [operational/staging.md](mzizi-operational-db/staging.md) | Retained with agreed ownership updates |
| `statistical.md` | [phase-02/statistical.md](mzizi-db/phase-02/statistical.md) | Deferred and unapproved; proposal content retained without redesign |

## Preservation and review rules

The [contract-authoring plan](contract-authoring.md) and [schema-authoring rules](../../rules/schema-contract-authoring.md) govern implementation. Operational contracts are approved. Main Phase 01 Reference and Geography are approved and authored; the remaining Main schemas are still unapproved. Existing drafts and scaffolding alone do not imply approval.

Historical table dictionaries remain planning evidence only. Operational approval is limited to the 45-table inventory in its formal decision and owning documents. The approved Main Reference and Geography inventories are recorded in their owning Phase 01 documents and contracts; other Main Phase 01 dictionaries remain proposals. Geography has no Legal association table; any domain Legal relationship must use an approved Reference interface. Phase 02 remains deferred.

For each retained table, review purpose, actual inventory, fields, keys, typed relationships, exact evidence path, acquisition method, temporal meaning, uncertainty, privacy, workload, growth, storage and partition assumptions. Record KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD (or justified MERGE / SPLIT) per field. Do not impose generic validity/precision/currentness/deletion columns without meaning. Use domain-specific dates and distinguish historical validity, retrieval, observation, workflow and publication time. Source verification/freshness is not simply a successful download. Recoverable draft deletion differs from canonical correction, real-world retirement and privacy erasure.

Operational table names and column inventories are approved; physical types, nullability, keys, indexes, and exact supported Dryv expressions are resolved in the authored contracts subject to documented gaps. Main Reference and Geography table/column contracts are approved; the Reference–Legal bridge and Geography PostGIS generation semantics remain open. Other Main design choices and civic-side durable publication idempotency remain under review. Detailed Phase 02 redesign is deferred. Existing databases and S3 artifacts remain protected. Publication boundaries are explained in [Operational](mzizi-operational-db/README.md#candidate-to-accepted-record).
