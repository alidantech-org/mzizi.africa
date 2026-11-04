---
id: DOC-MOBILE-JSON-CONTRACTS
name: Mobile JSON presentation contracts
type: documentation
tags: [mobile, json,api]
---

# JSON presentation contracts

## Architectural decision

A PostgreSQL row, a Dryv-generated API DTO and a mobile presentation document are **three different shapes**. The JSON in `fixtures/mobile/data/` demonstrates proposed *composed view models* that an adapter may produce, not a commitment to an already deployed endpoint. Do not route the Flutter app directly to invented URLs. Existing read surfaces should be used until a read composition is approved.

## Shared envelope

For each fixture: `fixture: true`, `schemaVersion: "1.0.0"`, `kind`, `data`, and `meta` indicating the synthetic source. For future live adapters remove fixture-specific top-level fields deliberately and version the public presentation contract separately from the canonical record version.

All public entities use canonical UUID `id` strings, never display names as identity. `ref` objects point to canonical `schema.table` kinds plus UUID IDs, and join resolution happens in the API. A value absent from the verified public API is `null` or omitted and shown as unavailable, never fabricated.

## Document types and ownership

| Presentation document | Source records | Nested collections | Map / chart interpretation |
| --- | --- | --- | --- |
| `geography.detail` | geography.units, names, relationships, boundaries | parent, children, alternate names, evidence | Boundary loaded separately; valid-at date required for historical geometry |
| `person.profile` | person.individuals, names, profiles; governance.holders | publicly visible names, biography, tenure rows, attachments | Portrait through filesystem; no private fields |
| `election.contest` | electoral.elections, seats, candidates, results, electorates | candidates, vote breakdown, electorate | Bar chart only at identical seat/result level/geo/version |
| `statistics.series` | statistical.indicators, observations, periods, dimensions, vintages | points, dimension selections, methodology | Line for comparable ordered time periods; use error bars/footnotes for uncertainty |
| `finance.summary` | finance.years, units, budgets, expenditures, revenues | fiscal series, measures, categories | Compare like-for-like fiscal years and currencies; no silent FX conversion |
| `geography.boundary` | geography.boundaries and derived geometry | GeoJSON geometry | Valid GeoJSON Feature or FeatureCollection; provenance separately fetched |

## Lists, details and pagination

List projection: `{items: [], page: {number, size, hasNext}, filters: {...}}`. The page object is a **proposal**; generated read DTOs have their own pagination shape. Compose details by canonical ID, and load expensive evidence and geometry on demand. No response should expose `identity.accounts` or unapproved sensitive information.

## Provenance and historical integrity

Provenance comes from `source.attributions` and `source.verifications` and is composed into an optional `evidence` presentation projection. Each document must identify the backing `targetKind`, `targetId`, attribution relation (`supports`/`contradicts`), published/retrieved dates when known, and a separate verification state if available. No `source` column may be added to canonical domain records.

Historical validity (`validFrom`, `validTo` and precisions) is distinct from ingestion time. A current office holder and an earlier office holder are separate dated claims. A map boundary at one time must not be combined with current electoral counts without labeling the date difference.

## Statistics

An observation is not merely a `{year,value}` pair. It has `indicatorId`, `periodId`, `geoUnitId`, `numericValue` or `textValue`, `confidenceLevel`, `measureType`, `estimateKind`, `vintageId`, optional `marginOfError`/`standardError`, and zero or more `observation_dimensions`. Dataset information and methodology remain accessible. UI projection must retain or explicitly label dimensions and vintage; missing values remain null and visually discontinuous.

## Elections

`electoral.electorates` stores `registeredVoters`, `votesCast`, `validVotes`, `rejectedVotes`, `spoiltVotes`, and a `resultLevelId`; `electoral.results` stores candidate votes, rank and winner flag. A chart can compare candidate counts only when result level, seat, geography, declaration version and verification policy agree. Turnout (`votesCast / registeredVoters`) is a **derived** measure only when both values are present, denominator > 0 and definitions align. Votes cast and valid votes must never be conflated.

## Finance

Every amount uses currency and scale. Fiscal years are not calendar years by assumption, and annual totals must not mix original/revised budgets or different reporting bases. Derived spending rates must include numerator, denominator, unit and period, with transparent missing-data treatment.

## JSON Schema files

`fixtures/mobile/contracts/envelope.schema.json` validates shared fixture structure; `fixtures/mobile/contracts/series.schema.json` and `contest.schema.json` enforce key chart/contest fields. These validate **synthetic presentation fixtures**, not Dryv-generated API DTOs. Each has an explicit `$id`; version changes to the JSON schemas should be reviewed as consumer-facing changes.
