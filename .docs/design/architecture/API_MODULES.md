---
id: DOC-API-MODULES-20261125
name: API_MODULES
type: documentation
tags: [api, nestjs, dryv, modules, cache, redis, frontend]
---

# API modules: layout, actions, caching and the frontend module

**Status: implemented in the rebuild run (25 November 2026, task TSK-70669AC571AA).** The contracts are in `dryv/contracts/apps/api/`; the generated API is in `source/backend/api/src/modules/`. Rule: [api-modules](../../rules/api-modules.md).

## Modules

One module per schema it reads (`reference`, `vocabulary`, `identity`, `product`, `geography`, `statistics`, `governance`, `legislature`, `politics`, `election`, `civic`, `finance`, `legal`, `event`, `history`, `media`, `source`, `community`, `auth`) and one composition module, **`frontend`**. Schema modules return raw rows with **all** names of every named thing; `frontend` chooses the text to show and returns `LocalizedText`.

Each module file has features (submodules) named for a clear group of tables (`geography`: `Places`, `Maps`; `governance`: `Bodies`, `Seats`). Each feature declares:

1. **Inputs** as named schemas (`FeatureKey`, `ChildWindow`); lists extend `PageWindow`.
2. **Queries** (`dryv.readQuery`): the only place SQL shape is decided. Engine rules learned in this run: every ordering ends with the full primary key (including partition keys); filter parameters use the column's own property; a zero-or-one read filters on an unconditional unique key.
3. **Rows** derived from the queries (`dryv.schema.fromQuery`) and collection envelopes.
4. **Operations** with role, description, cache rule and HTTP route.

## Actions and URLs

| Action | Role | URL |
|---|---|---|
| `List<Things>` | list | `GET /v1/<module>/<things>?…` |
| `Get<Thing>` | detail | `GET /v1/<module>/<things>/{code}` (by row code, never by id) |
| `Search…`, `Find…`, `Resolve…` | search | `GET /v1/<module>/<verb-or-noun>?…` |
| `Get<Screen>Screen` | detail | `GET /v1/frontend/<screen>?lang=…` |
| writes (`RecordView`) | create | `POST /v1/<module>/<things>` |

## Limits and payloads

Every list is paged: default 50, `MAX_PAGE` 200, with larger bounded ceilings only where a screen needs a whole set (figures 1 000–5 000, terms 1 000, provisions 2 000). Maps read prepared `geography.outlines` per zoom band, never full-detail geometries.

## Caching

Each read declares `.cache(CACHE.<class>)` from `_shared.ts`: `reference` 6 h, `structure` 1 h, `figures` 30 min, `live` 1 min. The generated runtime keys entries by store, operation, generation, every input (so country and `lang`) and principal; writes bump the operation generation after commit. Redis is used when `REDIS_URL` is set (`src/database/database.module.ts`).

## Generation

`dryv.yaml` binds: `types` and `dtos` (official packs), **`persistence`** (the vendored `dryv/packs/nestjs-persistence`: one managed use case per query-bound operation, executed through the typed runtime in `src/database/persistence/`) and `server` (official NestJS pack, route constants). The TypeORM entities, type-files and old use-cases packs are no longer bound. An operation without a query (the `frontend` screens, `FindPlacesAtPoint`, `RecordView`) re-exports a hand-written class from `src/implementations/<operation>.ts`: Dryv assembles, people build.

## The frontend module

`frontend` owns no tables. Its implementations call the schema modules' generated repository functions, apply the language chain in `src/implementations/shared/localize.ts` (requested language → the country's locales → `mul` → `en` → any) and return one document per screen: `GetHomeScreen`, `GetPlaceScreen` (the one-call place page: breadcrumb, divisions, headline figures, leaders, projects, events, articles), `SearchScreen`, `GetInstitutionScreen`, `GetRankingScreen`, `GetCopyBundle`.

## Errors and gaps

Failures map through `apiHttp` (400, 401, 403, 404, 422, 500). Missing translations are not errors: `LocalizedText.isFallback` marks them and `GetCopyBundle` falls back per key. Operations behind a policy fail closed until sign-in is wired (no principal is resolved yet).

## Inventory of the old API (all removed or replaced)

| Old module | Routes | Disposition |
|---|---|---|
| `explorer` (9 reads, 2 writes, ~1 400 lines of hand SQL) | boundaries, children, context, copy, location, navigation, overview, search, setup, resolve, addresses | Replaced by `geography` (`ListChildren`, `GetOutline`, `ListChildOutlines`, `FindPlacesAtPoint`), `identity` (`ResolveAddress`, `SearchNames`) and `frontend` screens |
| `insights` (36 reads, ~1 930 lines of contract plus hand SQL) | browse, statistics, leaderboards, elections, parties, law, motions, leaders, civic, institutions, governance tree, content, compare | Split by owner into `statistics`, `election`, `politics`, `legal`, `legislature`, `governance`, `civic`, `media`; screens into `frontend` (`GetRankingScreen`, `GetInstitutionScreen`) |
| `locality` | locality at/search, sources, evidence, languages | `geography`, `identity`, `source` (`ListEvidence`, `ListSources`), `reference` (`ListLanguages`), `frontend.GetPlaceScreen` |
| `experience` | context, copy, calendar, facilities, facts | `frontend.GetCopyBundle`, `event.ListOccurrences`, `civic.ListFacilities` |
| `structure` | structure screen, country context | `reference` (`GetCountry`, `ListHierarchies`), `frontend.GetPlaceScreen` |
| `ledger` | budgets, funds, coverage, coalitions, manifestos | `finance`, `politics` |
| `interactions` | engagement, like, unlike, view | `community.RecordView`; reactions wait for sign-in (section 28) |
| `reference` | lookup, schemes, values | `vocabulary` (`GetScheme`, `ListTerms`), `reference` |
| `geography`, `governance`, `auth` | kept as schema modules, rewritten for the new tables | |

No API type, DTO or query shape remains only in hand-written code: the 37 hand-written `reads/` files were deleted with the old modules.
