---
{id: DOC-CDB76CA825B0,name: Mobile database data display plan,type: documentation}
---

# Plan: use Mzizi database data in the mobile app

**Status:** Product and implementation plan  
**Reviewed:** 2026-11-03  
**Related:** [Mobile alignment audit](MOBILE_APP_ALIGNMENT.md), [geography API contract](geography-api-contract.md), [data lifecycle](DATA_LIFECYCLE.md)

## Goal

Make the Flutter app a useful public view of Mzizi's approved canonical knowledge. A person should be able to start from a place, see its geography and present-day institutions, move through sourced events over time, inspect public finance and procurement records, and open the evidence behind each statement. The app reads through the NestJS product API. It never connects to PostgreSQL directly and never creates canonical facts locally.

## What data can anchor the experience

The latest available repository handoff records a useful Kenya-first dataset: geography units and boundaries; people, party memberships and parties; the Constitution; institutions; NG-CDF finance units, allocations and disbursements; supplier organizations; sites and portrait documents. This inventory is a dated handoff, not a live query result. Direct database access was unavailable during planning, so the first delivery step must recheck the actual `mzizi` database and the production-safe API response shapes.

The API already defines read routes for geography, governance, people, political parties, events, legal records, finance, debt, procurement, statistics and sources. Existing routes are a starting point, not a guarantee that every record has a useful public detail view or a source link joined for mobile. Confirm database rows, review/public status, data joins, licensing, query filters, pagination and field exposure before wiring each slice.

## User journey and screen plan

| Screen | Data to use | Proposed display |
|---|---|---|
| **Home** | Geography search and verified boundary context, plus a small API-backed set of current featured places or published stories when a stable query is available. | Keep search and map prominent. Add a “Continue exploring” place card and a few sourced items from the selected/current place. Hide unavailable sections instead of filling them with invented sample data. |
| **Explore** | `GET /v1/geography/search`, verified `/boundaries`, entity, hierarchy, history and map-context operations, child boundaries, and linked governance. | Keep the globe/map. On selection, show place name, level, parent breadcrumb, validity/current state and boundary attribution. A place detail sheet links to History, Governance, Public money and Sources using the same geography ID. Display only verified geometry; offer a list/profile path when geometry is absent. |
| **History** | Geography history and public events/events links, with source attribution and document detail. | Replace the local static event list with a chronological timeline for the selected place. Each card shows the event date as supplied, date precision/approximation, a short summary and source/status badges. Tapping opens the event detail, its connected place/person/institution and source evidence. Do not conflate event date with source retrieval date. |
| **Money** (consider label **Public money**) | Finance fiscal years, units, budgets, transfers, expenditures, revenue; procurement tenders/contracts/milestones; NG-CDF records after their exact canonical/API mapping is verified. | Start with county/constituency context and fiscal-year filter. Use summary tiles and period comparisons only when backed by server queries or complete datasets. Detail rows show amount plus currency, period, geographic/unit context, recipient or procuring entity, status and evidence. Link a contract to its tender and source record. Do not total one page of a paginated result and label it a total. |
| **Saved** | Canonical record IDs and type; optionally cached display snapshot with version/update time. | Persist saved references across app restarts. Reopen the canonical detail route, allow filters based on actual types, and say when a cached copy is offline or stale. Do not treat a saved card's copied text as the authoritative record. |
| **Evidence detail** (open from any screen; not necessarily a bottom tab) | Source publishers, documents, captures, methods, attributions and verification records. | Show source title/publisher, citation or artifact link, retrieved/captured time, method when available, applicable license, record verification state and relationship to the displayed claim. Include the record's valid time separately. Unknown metadata stays “not recorded.” |

The tab bar can remain Home, Explore, Money, History and Saved for the first integration. Add Heritage/Stories or a dedicated Sources destination only when their public contracts and reviewed data support a complete journey. Reuse place selection across tabs instead of making every tab start from a Kenya default.

## Data-to-API map and prerequisites

| Data slice | Current API support in repository | Prerequisites before mobile use |
|---|---|---|
| Geography | Search, boundaries, entity, hierarchy, history, map-context, children and governance routes. Flutter already has `GeographyApiClient` and geometry/provenance validation. | Confirm currently available data by level; preserve geometry verification/license checks; show history only from sourced history records. |
| Governance and people | Institution, office, office-holder, selection and person read groups; geography governance route. Handoff records institution and people data. | Verify office holder validity dates and source links; only show public-office attributes; filter to current and historical records without exposing restricted personal/contact fields. |
| Events and history | Event and event-link routes, plus geography history. | Confirm location/entity link query filters and evidence joins. Add/confirm a place-timeline query shape so the client does not download all events to filter locally. |
| Legal | Legal read routes and Constitution data. | Link a legal detail or provision to its source document and effective period; do not treat an extracted text snippet as the complete instrument. |
| Finance and NG-CDF | Finance routes for fiscal years, units, budgets, expenditures, ledger entries, revenue and transfers. Handoff lists NG-CDF allocations and dated disbursements. | Map each NG-CDF record to a finance contract and geography/unit ID; validate totals, currency and reporting period. Add server-side aggregates for summary charts if needed. |
| Procurement and organizations | Tender, bid, contract, milestone, variation and neutral legal-entity routes. Handoff says a large supplier organization set exists and warns a promotion pass may have been in progress. | Verify final promotion/readiness, join procuring entities to geography and tender/contract, and review public field allowlists. Keep restricted identifiers and contact information out of mobile. |
| Sources and evidence | Publisher, document, capture, method, attribution and verification routes. | Ensure canonical entity/detail responses can efficiently include or resolve the evidence links for their claims. Prefer a stable evidence summary in read DTOs or a bounded batch lookup over N+1 calls from Flutter. |
| Statistics | Indicator, period, table and observation routes. | Confirm population/statistical data actually promoted and sourced. Preserve period, unit, geography, source and any revisions. Don't imply demographic categories beyond the documented dataset. |
| Heritage and culture | Product priority, but no contracted domain in the domain catalog yet. | Wait for a sourced domain contract and reviewed data before shipping a dedicated mobile collection. Use established source/history/geography links as foundations. |

## Shared presentation rules

1. **Place:** Carry the canonical geography ID through navigation and API calls. Show jurisdiction, administrative level and parent context from the API. Never infer a place by matching display names.
2. **Time:** Display historical validity (`valid_from` / `valid_to`) separately from record creation/update and source retrieval/capture times. Preserve exact/month/year/decade/century/approximate precision; do not invent day/month values.
3. **Evidence:** Every factual detail view needs an easy “Evidence” action. Show publisher, source/document, citation/reference, retrieval time, method and license where present. Use the attribution endpoint or a purpose-built response contract; do not use a hand-written citation string as a substitute for a linked source record.
4. **Review and uncertainty:** Show verified, disputed, approximate, superseded or unavailable states when the API supplies them. Keep AI-assisted/inferred claims attributable and clearly labeled. Do not show staging or review-only candidates as canonical public content.
5. **Money:** Always display currency, fiscal period, geography/budget unit and what the amount represents. Separate allocation, commitment, disbursement, expenditure and contract value; do not sum unlike measures.
6. **Privacy and licensing:** Respect API field restrictions. Never expose hidden identifiers or contact data. Only display portraits/files whose public access and license are confirmed by the file/evidence services.
7. **Unavailable data:** Use a factual empty state such as “No sourced records are published for this place yet.” Distinguish no results from network error, missing optional record and unverified geometry. Do not fall back to bundled claims.
8. **Offline:** Cache stable record IDs and limited read responses only after a freshness policy is defined. Show last refresh time and mark cached material clearly; do not silently present it as current.

## Technical flow

```text
PostgreSQL canonical schemas
          ↓ read-only connection
NestJS API + versioned Dryv contracts
          ↓ stable DTOs, filters, pagination, evidence links
Flutter domain clients and typed models
          ↓
Place / timeline / public money / evidence cards
          ↓
Saved canonical IDs and clearly dated local cache
```

The Flutter app should use a shared transport layer for base URL, timeout, headers, JSON/error handling and retry behavior, with domain clients such as geography, events, sources and finance layered above it. `GeographyApiClient` is the reference for strict response validation, but its map-specific models should not grow into a generic model for unrelated domains. Use explicit DTOs and a shared evidence/time presentation component. Keep read access public as the API contract allows; never embed database credentials or writer tokens in the app.

## Delivery sequence

### Phase 0 — Verify data and queries

- With the database service available, query read-only counts and a small representative sample from `mzizi` for geography, governance/people, events, legal, finance/NG-CDF, procurement, sources and statistics.
- Confirm approved/canonical status, sources, dates, currencies, licenses and geography links for each sample.
- Exercise the corresponding NestJS read endpoints with the documented read-only role; record pagination, response fields and gaps.
- Decide the first slice from real populated, public-ready records—not from route names or the handoff count alone.

### Phase 1 — Build the shared read experience

- Add a shared API transport and typed clients for the first selected domains.
- Add reusable `EvidenceSummary`, `TimeContext`, `VerificationBadge`, `PlaceContext` and robust loading/empty/retry states.
- Preserve `GeographyApiClient` validation and use it to navigate to a place detail.

### Phase 2 — Place profile and civic context

- Use geography IDs to show verified map context, place hierarchy, sourced governance records and related public people/positions.
- Add a place detail screen or sheet with links to its timeline and available records.
- Display historical names/boundary history only when sourced records and query semantics exist; retain current-only map behavior until historical geometry API support is explicit.

### Phase 3 — Source-backed History

- Replace all bundled timeline claims with public event/history API responses.
- Add detail and evidence views, valid-time display, date precision and links to related entities/places.
- Keep a clear empty state when no canonical sourced events are available.

### Phase 4 — Public money and procurement

- Map and validate NG-CDF allocations/disbursements, then add budgets/transfers/expenditure and tenders/contracts as supported by actual data.
- Use server-side filter/aggregate contracts for large datasets and summary charts.
- Review all returned fields for public exposure; show evidence and reconciliation context for computed totals.

### Phase 5 — Saved records, expansion and quality

- Persist canonical IDs and restore routes after relaunch; establish cache freshness and offline copy behavior.
- Add statistics, elections, legal and eventually heritage journeys as each data slice passes the readiness check.
- Check accessibility, screen sizes, slow/offline networks, small devices, map performance and source-link navigation on Android/iOS/web.

## Definition of ready for each data slice

A slice is ready to appear in the public app only when: (1) canonical rows exist in the intended database; (2) the API returns them through a read-only, public-safe contract; (3) IDs and relationships resolve; (4) provenance and time fields are available or explicitly unknown; (5) currency, units and licenses are correct where applicable; (6) screen empty/error states are designed; and (7) a sample record can be traced from mobile detail back to the source artifact or citation.

## Open decisions to settle during Phase 0

- Whether Home should feature a hand-curated set of sourced stories or dynamically show recent/representative records.
- Whether evidence summaries are nested in each domain DTO or fetched through a bounded batch endpoint.
- Whether saved records remain device-local or later sync to an authenticated account.
- Which public finance aggregates are approved for display and how to label provisional or incomplete reporting periods.
- Whether History and Money keep their current names or become “Timeline” and “Public money” after user review.
