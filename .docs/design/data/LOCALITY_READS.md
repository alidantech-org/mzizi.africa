---
id: DOC-LOCALITY-READS-20261118
name: LOCALITY_READS
type: documentation
tags: [api,locality,geography,evidence,languages,dev-data]
---

# Locality reads and the development data

**Status: implemented 18 November 2026** in `dryv/contracts/apps/api/locality.ts` and `source/backend/api/src/modules/locality`. No table was added or changed.

## What the operations are

The product API answers screens, not tables. The `locality` group returns one composed document per question, built by hand-written use cases over existing tables:

| Operation | Route | Answers |
|---|---|---|
| `ResolveLocality` | `GET /v1/locality/at?latitude&longitude&languageCode&onDate` | the smallest current outline containing a position, the chain of units above it, the officials of those units, procurement there and the evidence for each claim |
| `GetLocality` | `GET /v1/locality/{featureId}` | the same document for a place chosen by name |
| `SearchLocalities` | `GET /v1/locality/search?query` | places whose name in any language matches |
| `ListLanguages` | `GET /v1/languages` | languages with a two-letter code, with their own-language name |
| `BrowseSources` | `GET /v1/sources?query` | published products (datasets, legal texts) with artifact and citation counts |
| `GetEvidence` | `GET /v1/evidence/{citationId}` | one citation with its product, edition, locator and files |

Rules the use cases follow:

- **Position, not codes.** A point is matched with `ST_Contains` against current `outline` geometries (`to_year is null`); the smallest area wins. The chain follows `part-of` relationships (electoral first, then administrative), never code prefixes.
- **Dates.** Office holders are chosen by `took_office_on` and `left_office_on` against `onDate` (today when absent).
- **Language.** `languageCode` is an ISO 639-1 code known to `reference.languages`; names and labels fall back to English and then to any name. The response says which language it served. Place names come from `geography.names`, kind and office labels from `reference.value_labels`, people from `official.names`. Words of the interface itself live in each frontend.
- **Evidence.** A record's evidence is the citations that point at it. The seed loader records each CSV row as a `source.relationships` row (`prepared-from`) and a citation pointing at it, so `source.citations` reaches a record through `source.relationships`. Provenance is never a column on the record.
- **Gaps.** The document lists what is missing (`gaps`) so a screen never implies completeness. Media is empty until files are registered for a place.
- **No location is stored.** A position is a request value only.

## Development data

The dev database `mzizi_ux` proves the API and the three frontends against real PostgreSQL. `bun run dev:data` builds it from:

- the real seed (`seed/`): countries, languages, Kenya's 47 counties, 290 constituencies and 1,450 wards, the Constitution;
- **real outlines** from `.dev/datasets/geoboundaries` (ADM2 constituencies, ADM3 wards) and the ADM1 counties in `.dev/archives`, matched to seeded features by name inside the parent that contains them: 46 of 47 counties, 289 of 290 constituencies and 1,353 of 1,450 wards have a geometry;
- **invented data** written to `.dev/seed-dev/` by `scripts/dev/build_dev_seed.py`: a governor per county, an MP per constituency, an MCA per ward (names and party membership made up), about 1,100 projects with procurement, bids and contracts, three office kinds, two reference schemes (`gov.appointment.kind`, `civ.project.status`) and Swahili labels for them. Codes carry `dev` (`ke.person.dev-00321`) and each file's catalogue product is titled "Dev sample data", so evidence for these rows says so.

The invented data is never copied into `seed/` and is not verified. The loader is the engine's own (`mzizi-engine seed --root .dev/seed-dev/merged`): the merged tree is `seed/` symlinked plus the dev files, with the artifact catalogue extended for them. Running it again changes nothing.

Two loader rules were relaxed for this work: a link column that no row fills no longer counts when ordering tables or detecting cycles (`table_cycle` and `load_order` take the filled columns), which let `official.entities` be seeded beside the `source` tables whose publisher can be an entity.

## What to replace with real data

Officials, party membership, procurement and contract awards are the invented parts. Real rows go through the normal path (source assessment, extraction, review, then `seed/` with owner approval); the API reads them unchanged.

## Maps, saved places and likes in the frontends

- **Maps.** The site (Leaflet) and the Flutter app (`flutter_map`) draw a place from `GET /v1/geography/features/{id}/geometries`: the place's outline in clay, the unit above it dashed, a pulsing marker at the visitor's position, fitted to the bounds. Tiles are OpenStreetMap's own (attribution shown), darkened in dark mode. CARTO's free basemaps were dropped after they began returning an "API key required" watermark.
- **Saved places, GPS spots and likes.** A visitor can save a place, save the GPS spot they looked up from, follow a leader (heart) and like a project. They are stored on the device (`localStorage` on the site, `shared_preferences` in the app), need no account, are never sent anywhere and are therefore personal, not public counts. A shared, account-backed version needs sign-in first (the `auth` group exists) and a table for it; that is not built.
- **Motion.** Entrances, heart pops, the pulsing marker and skeleton shimmer respect `prefers-reduced-motion` on the site.
