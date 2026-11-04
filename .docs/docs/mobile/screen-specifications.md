---
id: DOC-MOBILE-SCREEN-SPECS
name: Mobile screen specifications and navigation
type: documentation
tags: [mobile, screens,navigation]
---

# Mobile screen specifications

**Scope:** Public, read-only research experience. Screen IDs and navigation are proposed Flutter implementation names, not promised API routes. The app should support deep links through canonical entity IDs and show access/data status explicitly.

## Navigation model

Bottom navigation: **Explore**, **Topics**, **Compare**, **Saved**; global search available in app bar. Inside a topic: browse → record detail → context sections (history, geography, people, data, evidence). Save locally only non-sensitive identifiers/preferences. Support back/deep-link restoration, no forced authentication for public reads.

| Screen ID | Purpose | Above fold | Detail views | Required states |
| --- | --- | --- | --- | --- |
| `explore.home` | Discover material | Search, jurisdiction, featured domains | Place/history entry points | Empty recommendations, offline |
| `explore.map` | Explore geography | Date selector, legend, boundaries | Feature selection, child regions | Geometry unavailable, historical uncertainty |
| `geography.detail` | County/country/polity profile | Title, kind, period, mini map | Parent/child, names, governance, indicators, evidence | Superseded boundary, unresolved source |
| `topics.index` | Domain browse | Statistics, people, elections, governance, finance, legal | Filtered collections | Empty, no public access |
| `person.list` | People discovery | Query, role/time filters | Person detail | Alias match, loading |
| `person.detail` | Public profile | Name, portrait fallback, dated summary | Names, offices, party relationships, sources | Private contacts excluded, unknown tenure |
| `governance.institution` | Public body detail | Name, jurisdiction, type | Offices, appointments, legal basis, location/contact | Institution vs physical site distinguished |
| `elections.list` | Election catalogue | Jurisdiction, election type, year, status | Seat/results drill-down | Historical/provisional state |
| `election.detail` | Election context | Title, held date, authority, status | Seats, electorate, sources | No aggregated national result unless validated |
| `election.contest` | Candidate competition | Seat, geography, votes, declared level | Ranked bars, electorate metrics, source details | Conflicting declarations, missing turnout |
| `statistics.catalogue` | Indicators | Subject/category, search | Indicator detail | No observations |
| `statistics.detail` | Observation discovery | Indicator, selected geography, unit, method | Period chart, breakdowns, table, vintages | Suppressed/discontinuous/incompatible series |
| `finance.detail` | Fiscal activity | Jurisdiction, fiscal year, currency | Budget and expenditures, audit trail | Missing categories, unlike accounting basis |
| `legal.detail` | Legal context | Instrument name, status, validity | Provisions, amendments, citations | Repealed/superseded flag |
| `evidence.detail` | Trust and traceability | Claim target, verification | Supporting/contradicting sources, publisher, capture | Unknown/conflicting sources |
| `compare.workspace` | Compare compatible records | Selected indicator/period/regions | Chart + accessible table | Incompatible units/time/vintages |
| `saved.index` | Reopen bookmarks | Local-only saved public refs | Restore detail | Removed/retired record |

## Geography detail interaction

1. Start at search or map; select canonical geography ID.
2. Load entity metadata and parent hierarchy. Never key navigation by geometry or translated name.
3. Load boundary separately (existing `geography-api-contract.md`), choosing a valid period and displaying source/verification where returned.
4. Open statistics with geography ID as context; do not assume the identical date/administrative boundary for another dataset.
5. View relevant governance offices and holders through linked queries, not a hardcoded Kenyan office structure.

## Person and governance interaction

Open a person from a candidate, party or office holder. Show public description and dated roles; each role links to the owning institution and territory. The same person can serve multiple roles at different times. Honor public exposure for every contact and handle; do not fetch private identity accounts.

## Elections interaction

Election → seat → candidate results by declared result level. Resolve party/person labels through separate canonical refs. Show totals and turnout only if a compatible `electoral.electorates` record exists. Clearly distinguish missing, pending, contested and verified results; permit viewing source forms through approved file links.

## Statistics interaction

Select indicator → geography → period range → dimension membership → vintage. Graph only comparable numeric points; provide a table fallback for irregular periods or mixed estimates, and a visible methodology/uncertainty summary. A selected dimension member must not be inferred from nearby rows.

## Accessibility and performance

Minimum touch areas around 44–48 logical pixels, scalable text, labeled chart series, spoken text equivalent, high-contrast map legend, keyboard focus order, locale-aware numbers/dates, stable skeleton dimensions, cancellable search, server pagination and geometry caching with temporal-version keys. Deep links should remain valid after names change.

## Explicit non-scope

These specs do not implement Flutter widgets, navigate a working app, publish endpoints, or add a new API. Implementers should first confirm current mobile app structure and generated operation availability.
