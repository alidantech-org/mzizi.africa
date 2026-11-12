---
id: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112
name: Approve Main Reference and Geography schema designs
type: decision
tags: [database, schema, reference, geography, approval]
extra: {status: accepted, approved_on: 2026-11-12, implementation: dryv_contract_authoring, migrations: not_authorized, deployment: not_authorized}
---

# Approve Main Reference and Geography schema designs

## Decision

On 12 November 2026, the user approved the Main `reference` and `geography` schema designs for Phase 01 and authorized implementation of their Dryv contracts. The current authored contracts and owning design records are:

- Reference: `dryv/contracts/schemas/mzizi/reference.ts` and `.docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md`.
- Geography: `dryv/contracts/schemas/mzizi/geography.ts` and `.docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md`.

Reference has the nine tables `countries`, `schemes`, `values`, `units`, `topics`, `patterns`, `pattern_versions`, `pattern_bindings` and `pattern_dependencies`. Geography has the nine tables `features`, `units`, `places`, `names`, `identifiers`, `geometries`, `relationships`, `changes` and `datasets`. `geography.features` is the sole canonical geographic identity registry; `units` and `places` specialize features. Reference owns modern-country identities, and Geography owns their territories and spatial representations. No fictional `world` country or mandatory country association is introduced.

## Boundaries and open implementation requirements

Reference mediates domain relationships to Legal. No executable Reference Legal-basis interface currently exists, so Geography must not add a Legal association table or direct Legal foreign key. Countrywide scope must resolve to the country's Geography unit when required; a missing unit does not mean national scope. Historical and cross-border features may remain without country association.

The approved design authorizes contract authoring only. Geography's PostGIS geometry and spatial-index semantics are not fully represented by the current Dryv path, and the Reference Legal bridge and Geography Source/Filesystem targets remain unresolved. The contracts must stay out of generation wherever these gaps would weaken the approved meaning. TypeScript compilation is not evidence of database enforcement.

## Not authorized

This decision does not authorize generating or applying migrations, changing a live database, provisioning infrastructure, deploying, or treating proposed mobile API endpoints as implemented. Other Main Phase 01 schemas remain subject to separate review.
