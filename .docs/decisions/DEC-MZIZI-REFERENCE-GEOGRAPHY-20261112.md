---
id: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112
name: Approve Main Reference and Geography schema designs
type: decision
tags: [database, schema, reference, geography, approval]
extra: {status: accepted, approved_on: 2026-11-12, implementation: dryv_contract_authoring, migrations: not_authorized, deployment: not_authorized}
---

# Accept Main Reference and Geography table inventories

## Decision

On 12 November 2026, the user accepted the Main `reference` and `geography` foundations and authorized coordinated contract development. This acceptance covers the existing Reference inventory and the nine Geography table names and responsibilities. It does **not** approve every detailed Reference field, new Reference tables, the geographic classification catalogue, or every Geography field contract. Those remain proposals until separately reviewed. The current authored contracts and owning design records are:

- Reference: `dryv/contracts/schemas/mzizi/reference.ts` and `.docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md`.
- Geography: `dryv/contracts/schemas/mzizi/geography.ts` and `.docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md`.

Reference preserves its nine-table starting inventory: `countries`, `schemes`, `values`, `units`, `topics`, `patterns`, `pattern_versions`, `pattern_bindings` and `pattern_dependencies`. Geography's accepted inventory is `features`, `units`, `places`, `names`, `identifiers`, `geometries`, `relationships`, `changes` and `datasets`. `geography.features` is the sole canonical geographic identity registry; `units` and `places` specialize features. Reference owns modern-country identities, and Geography owns their territories and spatial representations. No fictional `world` country or mandatory country association is introduced.

## Boundaries and open implementation requirements

Reference mediates domain relationships to Legal. No executable Reference Legal-basis interface currently exists, so Geography must not add a Legal association table or direct Legal foreign key. Countrywide scope must resolve to the country's Geography unit when required; a missing unit does not mean national scope. Historical and cross-border features may remain without country association.

This decision authorizes design and contract development only. `reference.value_relations` and the detailed classification catalogue are proposals, not an approved tenth Reference table or seed dataset. Geography's PostGIS geometry and spatial-index semantics are not represented by the current Dryv path, and the Reference Legal bridge and Geography Source/Filesystem targets remain unresolved. Proposed contract changes must stay out of database composition until reviewed. TypeScript compilation is not evidence of database enforcement.

## Not authorized

This decision does not authorize generating or applying migrations, changing a live database, provisioning infrastructure, deploying, or treating proposed mobile API endpoints as implemented. Other Main Phase 01 schemas remain subject to separate review.
