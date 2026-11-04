---
id: DOC-MOBILE-MOCK-DATA-LIBRARY
name: Mobile mock data library and validation
type: documentation
tags: [mobile, fixtures,testing]
---

# Synthetic mobile mock-data library

Fixtures are under `fixtures/mobile/data/`, and validation JSON Schemas under `fixtures/mobile/contracts/`. They are **synthetic**, designed for component previews and offline development; not official election results, population statistics, county budgets or biographical claims.

## File index

| File | Kind | Preview coverage |
| --- | --- | --- |
| `geography-detail.json` | geography.detail | Canonical refs, parent, child units, historical period, unavailable geometry |
| `person-profile.json` | person.profile | Public profile, aliases and dated office role |
| `election-contest.json` | election.contest | Candidate bars, result-level scope, registered/votes-cast distinction |
| `statistics-series.json` | statistics.series | Multi-period numeric points, units, dimensions, vintage, uncertainty |
| `finance-summary.json` | finance.summary | Currency-bound fiscal measures and incomplete expenditure breakdown |

All IDs are stable-looking UUIDs but fictional. No personal phone, email, real political result, actual recorded source citation or real financial amount is asserted.

## Contract schema

`contracts/envelope.schema.json` is a JSON Schema Draft 2020-12 baseline; `contracts/contest.schema.json` and `series.schema.json` specialize two analytical fixtures. Every file must parse as JSON, carry a fixture marker, contain a supported `kind` and `schemaVersion`, and include an explicit synthetic `meta.source`. These schemas validate the proposed **presentation layer**, not backend persistence.

## Proposed Flutter development adapter

Read the fixture by `kind` from bundled assets in debug/development builds and deserialize into typed presentation models; keep the interface identical to the future API adapter. UI components must handle null `geometry`, absent evidence and unknown statuses. Disallow synthetic fixtures as a production network-data fallback. Do not silently merge fixtures with real API records.

## Manual preview checks

- Map shows an unavailable-boundary state rather than drawing a fake geographic polygon.
- Person screen shows only explicit public fields; an unknown historical date is labeled unknown.
- Election chart shows votes and result scope, not fictitious nationwide totals.
- Statistics chart includes the unit and a vintage label, and does not interpolate missing points.
- Finance screen displays currency with each amount and never invents unreported categories.
- Evidence sheet distinguishes synthetic placeholders from actual reviewed sources.

## Validation and ownership

The fixtures should be validated locally (e.g., with any Draft 2020-12 JSON Schema validator plus JSON parsing) and checked again when adapter models change. GitHub repository writes alone do not execute the local TypeScript/Flutter test suite. The database engine remains owner of canonical seed data; these fixtures must never be imported as official records.
