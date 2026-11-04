---
id: DOC-MOBILE-DATA-AVAILABILITY
name: Mobile data availability matrix
type: documentation
tags: [mobile, availability,gaps]
---

# Mobile data availability and implementation gaps

**Interpretation:** Contract-defined means a Dryv semantic shape exists; it does **not** prove production data is populated, reviewed or accessible. API route existence does not establish that live records are present. A claim of real availability requires endpoint read tests and dataset inventory.

| Experience | Contract / documentation basis | Data readiness | Needed before production UI |
| --- | --- | --- | --- |
| Geographic entity search/detail | `foundation/geography/index.ts`; geography API contract | Contract-defined; Kenya county vertical slice documented | Confirm API DTOs, current verified geography coverage, historical version selection |
| Geographic boundary map | geography.boundaries, PostGIS shape derivation | Contract and ingest path documented | Verify shapes, attribution, cache, license, no-data areas |
| Geography→governance | `governance` read operations and geography link | Join/composition may need endpoint reconciliation | Validate public geography/governance composition, office jurisdiction vs place |
| Public people profiles | `person` read operations | Contract-defined; coverage unknown | Audit public exposure, portraits, profile coverage, biography provenance |
| Office holder histories | `governance.holders` + `person.individuals` | Contract-defined; join requires aggregation | Dated join projection, verification of current holders, gaps in tenure |
| Election candidate rankings | `electoral.candidates/results` | Contract-defined; coverage unknown | Verified result scope, duplicates, declarations, invalidation handling |
| Registered voters/turnout | `electoral.electorates` | Contract-defined; aggregation required | Alignment by election, seat, geography and result level; denominator validation |
| Referendum questions/results | electoral referendum contracts | Contract-defined; coverage unknown | Validate option/result join, latest verified declaration |
| Indicators and table values | statistical.indicators/datasets/observations | Contract-defined; coverage unknown | Dataset licensing, value units, time/dimension compatibility |
| Statistical breakdowns and vintages | dimensions, dimension_members, observation_dimensions, vintages, derivations | Current Dryv contract verified | Resolve members, latest vs historical releases; avoid duplicated totals |
| Budgets vs expenditures | finance domain | Contract-defined; coverage unknown | Fiscal year/currency/revision alignment and aggregation |
| Debt and procurement | debt/procurement domain | Contract-defined; coverage unknown | Data coverage, tender/contract IDs and public-source permissions |
| Sources and verification | `source.attributions/verifications` | Contract-defined; projection required | Public source reads, suppress restricted artifacts and unsafe URLs |
| Public facility/contact discovery | place/contact/civic | Contract-defined; coverage unknown | Public visibility, occupancy validity, location accuracy |
| Historical heritage/language/migration stories | Target domain roadmap | Not established as implemented public data | Canonical entities/contracts, sources, rights and geographic/historical context |

## Data-status categories for implementation

- **contract-defined**: semantic schema exists; no live-data guarantee.
- **route-confirmed**: generated route and DTO checked against NestJS; may still be empty.
- **seeded**: seed records present in source control; not equivalent to production import.
- **data-verified**: tested live read, date/version and source evidence.
- **derived**: requires controlled aggregation or join; document formula and input alignment.
- **external-required**: official/third-party data missing from canonical imports.
- **restricted**: not safe for anonymous mobile clients.
- **unknown**: not yet inspected. Never translate unknown to available.

## Critical acceptance gates

1. Compare `DATABASE_DESIGN.md` table list against current Dryv contract additions (statistical dimensions/vintages and electoral electorates/referendums).
2. Distinguish retired `organization.locations` from current `place` and `contact` models.
3. Inspect migrations, generated entities and implemented use cases; mark each route confirmed or missing.
4. Audit Kenya/South Africa/Nigeria/Tanzania seeds and source coverage separately from conceptual schema.
5. Define provenance/public-read guards for people, political claims, and evidence documents.
6. Assert that every displayed aggregate has a reproducible computation, compatible date scope and missing-data handling.
7. Mark each UI screen as fixture-backed, API-backed, data-verified or unavailable before release.

## Priority

Start a complete **geography profile** vertical slice; then person→office holder, election contest, statistical series, and fiscal comparisons. This sequence provides fast mobile feedback while avoiding claims of fully covered government/election datasets.
