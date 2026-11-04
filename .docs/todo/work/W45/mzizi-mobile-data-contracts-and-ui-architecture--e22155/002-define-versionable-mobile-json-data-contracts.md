---
{id: TSK-BC6196701099,name: Define versionable mobile JSON data contracts,type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:45.648Z,updated_at: 2026-11-04T15:55:45.648Z,order: 2048}
---

# Goal

Design clear and consistent JSON payloads for MZIZI mobile views based on the verified entity inventory. These contracts must describe what the frontend needs, not simply expose raw database records or legacy service internals. Include representative detail records, paginated lists, search/filter results, time-series observations, category distributions, related-entity references, and geographic features where they are supported or explicitly planned.

## Context

The mobile app should be able to render country, county, election, institution, public figure, historical, and financial information without guessing units or meanings. Use contract-level types and explicit naming for identifiers, localized names, time scope, geometry, money, units, source references, and confidence or dispute flags. Separate authoritative observations from presentation aggregates, and avoid fabricating metrics for a visually attractive sample. NestJS is the target API and contracts should be versionable independently of backend persistence.

## Acceptance checklist

- [ ] Define a shared JSON envelope for identity, provenance, time validity, links, errors, pagination, and missing data semantics.
- [ ] Specify schema-backed detail and collection response examples for the prioritized entities with correct null and optional handling.
- [ ] Define time-series and categorical dataset shapes with units, timestamps, definitions, and source attribution.
- [ ] Define geographic contracts using suitable GeoJSON feature and hierarchy structures, including boundary-version handling.
- [ ] Distinguish canonical fields, computed fields, mock-only values, and planned endpoints in every contract example.
- [ ] Document validation rules, versioning strategy, compatibility assumptions, and open backend decisions for review.

## Deliverables

A versionable contract catalog with JSON examples and validation specifications, including a traceability link from each contract to its originating schemas. No backend endpoint implementation is required here.
