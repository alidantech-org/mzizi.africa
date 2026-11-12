---
{id: DOC-GEOGRAPHY-NEUTRAL-MODEL,name: geography-model,type: documentation,tags: [geography,dryv,contracts]}
---

# Geography model — superseded draft

> **Status — 12 November 2026:** This model describes a former `GeoUnit`/GeoJSON design and paths that are not the current contract proposal. The accepted foundation is Geography's nine table names and responsibilities in [Geography — Phase 01](../../_plan/schema-redesign/mzizi-db/phase-01/geography.md); detailed fields in [`geography.ts`](../../../dryv/contracts/schemas/mzizi/geography.ts) remain under review. Use those files for current ownership, proposed country links and generation limits.

The accepted architecture uses one canonical identity table (`geography.features`), one-to-one feature specializations (`geography.units` and `geography.places`), and feature-linked names, external identifiers, geometry versions, typed dated relationships, transformation edges and dataset metadata. `reference.countries` owns modern-country identities. Geography does not own a country or legal-basis identity table. Historical and cross-border features may have no country association.

This older design's country-scope assumptions, legacy implementation statistics, loaders, generated APIs and example endpoints are historical evidence only. They do not describe the current runtime. Geography's proposed Dryv contract is not generation-ready: PostGIS geometry and spatial index mappings are not supported/verified in the current Dryv path.
