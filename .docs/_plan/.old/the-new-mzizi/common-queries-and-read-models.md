---
id: PLAN-NEW-MZIZI-COMMON-QUERIES
name: Common cross-schema queries and read models
type: planning-proposal
tags: [queries, performance, api, materialized-views, read-models]
extra: {status: discussion_only, approval: not_approved, observed_on: 2026-11-23}
---

# Common queries: how should Mzizi answer user questions?

## The owner's problem

Frequently requested information spans Geography, Reference, Source, Statistics, Governance, Civic and Finance. Repeated reconstruction may become expensive, especially as data and countries grow. **No SQL plan or live latency measurement has yet proved the bottleneck.**

## Examples of common questions

| User question | Canonical tables likely involved | Output shape worth reviewing |
| --- | --- | --- |
| "Open Nairobi" | Geography feature/name/relationships, Source slugs, Reference names and kinds | Place identity, canonical path, ancestors and immediate children |
| "Show Nairobi's boundaries" | Geography geometries and features, Reference roles, Statistics for optional shading | Simplified polygons or tiles, map bounds, legend and data gaps |
| "How many people live there?" | Statistics indicators/observations, Geography scope and hierarchy, Source citations | One measured value, period, coverage, unit and evidence |
| "Who governs this place?" | Governance institutions/offices/holders, Official names, Geography jurisdiction, Reference classifications | Current and historical office-holder view with legal/source evidence |
| "What projects or money were spent here?" | Civic and Finance with Geography scope, Source provenance, Reference categories | Paginated projects or spending summary, period and gaps |
| "Where did this claim come from?" | Source relationships/citations/products/artifacts, Filesystem versions | Evidence trail and original file locator |

A public page can combine several answers, but those assembled responses must **not** become new canonical identities or facts.

## Inspected expensive-looking patterns

1. `country()` gets a full country catalogue, including per-country media lookups, then selects a country in JavaScript.
2. `placeCte` rebuilds recursive slug trees and localized names; `context` may invoke that expensive CTE for a place, then again for its ancestors.
3. `searchUncached` and `childrenUncached` run a results query and separate count query that each include the same recursive place CTE.
4. `registry()` caches the country-language result in one process for ten minutes. Cross-process coherence, size limits and write invalidation are not established by the code inspected.
5. `navigation()` performs one availability query for each subject, plus additional place-scoped recursive checks where applicable.
6. `latestBaseline` is a correlated scalar subquery and may be repeated in geometry and metrics views.
7. `loadPlaceCatalogue` and `place-home` make multiple typed API requests for place setup, navigation, place context, boundaries and statistics. Different caching durations and keys are in use.

Some of these are already partially cached; they should be **timed before altering the architecture**.

## Distinguish the three layers

### Canonical writes

Maintain normalized domain ownership, foreign keys, time semantics, provenance and reviewed promotion. A change to a projection never changes accepted truth by itself.

### Query composition

One typed use case answers a user question. It is allowed to join across domain schemas, but should avoid multiplying independent walks of the same hierarchy. The NestJS API owns this projection behavior; Dryv defines the typed request/response.

### Optional read projections

Where benchmarks justify them, evaluate prejoined or materialized place context, resolved path/ancestor maps, metric summaries, current-holder views and display-ready map data. They are **derived** from canonical data and need a clear rebuild/invalidation policy, metadata for data freshness and explicit historical parameters.

## Questions we must settle before approving projections

- Which read is slow: first render, search, map load, count, cross-schema joins, or full UI hydration?
- Is the read a current snapshot or an `as of` history query? A current-only cache must not masquerade as a historical answer.
- Who refreshes projections after seed import, accepted source update, changed name, changed boundary or corrected evidence?
- Can a projection expose confidence, missing data and the underlying evidence rather than hiding disagreements?
- Would one narrower SQL query solve the problem before introducing materialized views or another service?
- Where are pagination, filtering and authorization enforced, and can they be pushed down to SQL?

## Recommendation for discussion, not implementation

Begin with four read use cases: `resolve place`, `list children`, `get map`, and `place overview`. For each, write its input, actual SQL/query call graph, response fields, database plan and observed cost. Then compare **targeted SQL**, **reusable query helper**, **cached read projection**, and **materialized view/tiles** against the same representative dataset.

Do not split the database or add a cache service solely because a query crosses schemas.

## Relevant code

- [Explorer composed readers](../../../../source/backend/api/src/modules/explorer/features/explorer/reads/explorer.ts)
- [Explorer SQL CTEs](../../../../source/backend/api/src/modules/explorer/features/explorer/reads/queries.ts)
- [Insights shared reads](../../../../source/backend/api/src/modules/insights/features/insights/reads/shared.ts)
- [Web place catalogue](../../../../source/apps/web/src/lib/server/places.ts)
- [Web place overview reads](../../../../source/apps/web/src/lib/server/views/place-home.ts)
