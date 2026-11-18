---
id: DOC-INSIGHTS-20261118
name: INSIGHTS
type: documentation
tags: [api,statistics,elections,activities,civic,media,search,leaderboards,dev-data]
---

# Insights: statistics, elections, legislative activity, civic money, media and search

**Status: implemented 18 November 2026** in the Dryv contracts (`statistics.ts`, `activities.ts`, additions to `civic.ts`, `finance.ts`, `filesystem.ts`, `apps/api/insights.ts`), the NestJS reads in `source/backend/api/src/modules/insights`, the web app (`source/apps/web`) and the Flutter app (`source/apps/app/lib/presentation/insights`). The development database is rebuilt from `.dev/` by `bun run dev:data`.

## New and changed tables

| Table | Purpose |
|---|---|
| `statistics.indicators` | One measured quantity with a reference topic, unit and measure kind and whether higher is better (ranking direction). |
| `statistics.observations` | One figure of one indicator for one place and period, with optional breakdowns by sex, age group, residence, community and language. Places are any `geography.features` row, so towns and villages count as much as counties. |
| `activities.sittings`, `motions`, `votes`, `contributions` | What public bodies decided and who voted how (yes, no, abstain, absent). A body is any `governance.institutions` row (legislature, county assembly, cabinet, court); a motion may cite a law provision, a budget version or a fiscal year. |
| `civic.projects.location` | A PostGIS point for the works, beside the area (`scope_unit_feature_id`). |
| `civic.procurements` | Gained `title`, `reference`, `status`, `closes_on`, `awarded_on` so tenders can be open, closed, awarded or complete. |
| `finance.flows` | Gained `project_id`, `institution_id`, `scope_unit_feature_id` and `expenditure_class` (salaries, running costs, committee, bursary, emergency, capacity building, infrastructure classes). `finance.funds` gained `scope_unit_feature_id`. |
| `filesystem.media` | `file_version_id` is optional; `external_url`, `platform` and `thumbnail_url` hold remote media (YouTube, TikTok, Facebook, Instagram, X, Vimeo, Pexels, DiceBear) as raw URLs. One of bytes or URL is required. |

Labels and topics come from `reference.values`, `value_labels`, `topics` and `units`; the dev seed adds the new schemes with Swahili labels.

## Operations (all under `/v1`, in `apps/api/insights.ts`)

Global search with typed hits (`search`), hierarchy browsing (`browse`), place statistics with history, breakdowns and rank (`statistics/places/{id}`), indicator series and heat-map (`statistics/indicators/{code}/series|map`), leaderboards over statistics, finance, civic delivery, elections and activity (`leaderboards`), elections (`elections`, `elections/{id}`, `elections/places/{id}`), parties (`parties`), motions with the round-table data (`motions/{code}`), leaders (`leaders/{holderId}`), civic delivery (`civic/places/{id}`, `projects/{code}`) and tenders (`tenders`). Every response lists what is missing in `gaps`; screens offer "ask for this data" and "check the official sources".

## Where the data comes from

Real, read from `.dev/`: geoBoundaries outlines; the county table (area, 2009 and 2019 census, registered voters 2022); KNBS national population 2017–2021; the 2026/27 Political Parties Fund allocation by party (48 parties); IEBC presidential totals for 2013, 2017 and 2022 (the county split of them is modelled so it adds up); the NG-CDF project proposals for Kasarani, Langata, Makadara, Starehe and Westlands, parsed from 12 PDFs into 384 allocation lines with their project names, amounts and status; tenders collected from the public tenders portal through the engine (`api.collect`), mapped by `.dev/sources/ke-tenders/civic.mapping.yml`; contact addresses of three NG-CDF offices and the National Assembly; YouTube embeds and Facebook pages found on the scraped sites; images dumped from the scraped sites into `.dev/media`, served by the engine at `/media`.

Invented (tagged `dev`, never in `seed/`): everything below the county in statistics, every breakdown, survey indicators, the other 285 constituencies' fund allocations, governor and MP contests, parliament divisions, project locations (random points inside the unit), leaders' contacts and the Pexels and DiceBear avatars.

## Facts, the leaders tree and the mobile journey

- `facts.facts` and `facts.fact_places` record "Did you know?" statements for the country, optionally tagged to one or more places (`GET /v1/facts?featureId=`). A fact tagged to a place is shown for that place and the places below it; an untagged fact is national.
- `GET /v1/leaders/tree?featureId=` returns levels (national, county, constituency, ward) with leaders grouped by how the seat is held: elected, appointed, nominated.
- The Flutter app opens on onboarding (welcome, what it does, device location or a place search), stores "my place" on the device only, then shows Home (the place's figures compared with every county or constituency), a Rankings tab with one top tab per metric and "yours is N% above/below the average and the top", place switching, a compare screen and the leaders tree. Theme (light, dark, system) is chosen in the app bar.
- Verified on a real Android phone (USB, Android 15): onboarding state, Home with ranks against 290 constituencies, Rankings, light/dark switch, Swahili labels and the leaders tree, using `scripts/dev/android.sh`. A place that is not a constituency or county (a city, a ward) is ranked as part of the constituency or county that holds it. Not verified: the onboarding location prompt itself, and the Flutter web build on the tunnel hostnames (DNS for `mz-api.alidantech.org` did not resolve from this machine).

## Limits

Ward-level election results, the Senate, county assemblies other than Nairobi, awards from the tenders portal (it publishes none through a public service) and per-user accounts are not recorded. Media bytes are served from a development folder; in production `s3_key` resolves in the object store.

- KNBS tables: the table-draft capability (`POST /v1/research/table-draft`) targets `statistics.observations` (a test drafts a county population table); it has not been run against a real KNBS PDF, and the indicator, period and source columns are flagged as required rather than invented.
- Social embeds: only profile links are recorded; a post embed is shown only when a post URL is recorded, and none is.
