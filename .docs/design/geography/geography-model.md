---
{id: DOC-GEOGRAPHY-NEUTRAL-MODEL,name: geography-model,type: documentation,tags: [geography,dryv,contracts]}
---

# Geography model — superseded draft

> **Status — 12 November 2026:** This model describes a former `GeoUnit`/jurisdiction/GeoJSON design and paths that are not the current authored contract. The approved data model is [Geography — Phase 01](../../_plan/schema-redesign/mzizi-db/phase-01/geography.md), implemented in [`geography.ts`](../../../dryv/contracts/schemas/mzizi/geography.ts). Use those files for current table ownership, fields, country linkage and generation limits.

The approved model has one canonical identity table (`geography.features`), one-to-one feature specializations (`geography.units` and `geography.places`), and feature-linked names, external identifiers, geometry versions, typed dated relationships, transformation edges and dataset metadata. `reference.countries` owns modern-country identities. Geography does not own a country or legal-basis identity table. Historical and cross-border features may have no country association.

This older design's jurisdiction scope, legacy implementation statistics, loaders, generated APIs and example endpoints are historical evidence only. They do not describe the current runtime. Geography's authored Dryv contract is not generation-ready: PostGIS geometry and spatial index mappings are not supported/verified in the current Dryv path.
