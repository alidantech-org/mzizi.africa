---
id: DOC-DESIGN-DATA-20261112
name: Data design guides
type: documentation
---

# Data design guides

Canonical data, evidence, identity, file metadata and place design. These documents are supporting detail; the eight root documents explain overall system intent.

- [DATABASE_DESIGN](DATABASE_DESIGN.md)
- [DATABASE_FOUNDATION](DATABASE_FOUNDATION.md)
- [FILESYSTEM_SCHEMA](FILESYSTEM_SCHEMA.md)
- [SOURCING_DESIGN](SOURCING_DESIGN.md)
- [SOURCE_FILESYSTEM_GEOGRAPHY](SOURCE_FILESYSTEM_GEOGRAPHY.md) — owner-approved target responsibilities and tables; implemented in the Dryv contracts and generated SQL on 17 November 2026 (Source 13 tables, Filesystem 7, Geography 8) with media mentions, central sourcing and GIS asset associations
- [SUBJECT_REFERENCES](SUBJECT_REFERENCES.md) — mandatory shared enum/base and subject keys across generic associations
- [PERIODS](PERIODS.md) — plain year periods with one precision and table-named exact dates; no validity windows
- [LEGAL_SCHEMA](LEGAL_SCHEMA.md) — owner-approved nine-table Legal target, implemented in the Dryv contracts and generated SQL on 17 November 2026, with multilingual names and separate translations, exact wording, legal relationships/effects and migration requirements; implemented 17 November 2026
- [PEOPLE_DESIGN](PEOPLE_DESIGN.md)
- [ENTITY_RESOLUTION](ENTITY_RESOLUTION.md) — proposal: scored matching of extracted data to candidates, review loop, biometric limits
- [PLACES_AND_PRESENCE_ASSESSMENT](PLACES_AND_PRESENCE_ASSESSMENT.md)
- [DATABASE_ARCHITECTURE](DATABASE_ARCHITECTURE.md) — one PostgreSQL database, Mongo staging, direct engine and API access, Bun CLI, planned ledger and job progress
- [DRYV_GAPS](DRYV_GAPS.md) — what Dryv does not yet do for this design, with evidence
- [PUBLIC_BODIES_CLASSIFICATION](PUBLIC_BODIES_CLASSIFICATION.md) — proposal: classification of public bodies by legal basis, function and control levers, with comparison rules
- [ENGINE_PERSISTENCE](ENGINE_PERSISTENCE.md) — the engine's PostgreSQL, MongoDB and vector persistence: one folder per store, ports for packages, vector as a skeleton

Implementation authorization and delivery requirements: [schema ownership implementation handoff](../../handoffs/HANDOFF-IMPLEMENT-SCHEMA-OWNERSHIP.md).
