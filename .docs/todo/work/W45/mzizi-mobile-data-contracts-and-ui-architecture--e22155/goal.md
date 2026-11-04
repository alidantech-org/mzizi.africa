---
{id: GOAL-GRP-B03916E22155,name: MZIZI Mobile — Data Contracts and UI Architecture goal,type: documentation,extra: {created_at: 2026-11-04T15:55:45.217Z,group: GRP-B03916E22155}}
---

# Goal

Create an evidence-aware, schema-driven design foundation for the MZIZI Africa mobile application. The group turns the current canonical and legacy database structures into an auditable inventory, proposed mobile JSON contracts, reusable presentation patterns, screen-level requirements, a practical data availability matrix, and a consistent library of mock JSON responses. Its purpose is to let frontend implementation proceed against clearly described data without confusing sample values with verified historical facts or forcing frontend contracts to copy database tables one-to-one.

## Success criteria

All six tasks are documented and reviewed in dependency order. Outputs clearly separate existing implemented schema, proposed API contract, derived presentation data, and unavailable external data. The work must respect provenance, temporal validity, changing geographic boundaries, entity identity, uncertainty, and the existing migration toward NestJS. It must not migrate databases, invent sources, or silently change canonical data. The frontend team should be able to implement representative country, county, election, institution, and public figure screens using verified contracts and labeled fixtures.
