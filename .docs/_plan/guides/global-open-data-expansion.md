---
id: DOC-GLOBAL-OPEN-DATA-EXPANSION-20261120
name: Global open data expansion, long-term goal
type: planning-proposal
tags: [long-term-goal, geography, open-data, osm, wikidata, geoboundaries, who, worldbank, kenya, licences]
extra:
  status: planning_only
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-20
---

# Global open data expansion, the long-term goal

**Planning only. Nothing here approves SQL, migrations, seed files, ingestion code or infrastructure. Every size figure is an unmeasured estimate from memory and must be checked against a real download before capacity is planned. A recommendation is not a user decision.**

## Goal

Mzizi should be able to identify and work in any region of the world, so that anyone, anywhere, can see anything the system holds about any place, with gaps shown honestly. The purpose stays the one in `.docs/docs/WHY.md`: connect African historical and present-day knowledge while preserving evidence, provenance, time, place and uncertainty. A global place spine is the means. Africa-first depth is the priority and Kenya is the first deep region.

"Anything" means anything that has been loaded. Every place page must say what is known, to which year, from which source, and what is missing. A blank page is never the answer; "no data" and "data to year X" are.

## Principles

1. **Region is data, not code.** No Africa-only or Kenya-only logic in packages. Place coverage, source choice and depth live in manifests, seed inputs and database records, as AGENTS.md already requires.
2. **One spine.** Every dataset attaches to a place by identifier. The spine starts at country (ISO3, ADM0) and deepens to ADM1, ADM2 and below as data justifies it.
3. **Expand slowly.** Breadth at shallow depth first (all countries, ADM0 to ADM1), depth by region on demand (Kenya first). Storage is the main limit, so depth is earned.
4. **Evidence path stays intact.** Raw artifact, extracted representation, candidate, review, versioned accepted data. Raw files are kept unchanged on the filesystem store, never in domain rows.
5. **Time is two things.** Retrieval or reference year is separate from historical validity. Current-day sources never overwrite history.
6. **Honest coverage.** The system records and shows disputed borders, differing names, stale indicators and missing data instead of hiding them.
7. **Licence-aware.** Each dataset carries its licence and attribution in its manifest, so the product can show attribution and block unsuitable reuse.

## Source catalogue

### Stage 1: global spine and national indicators

| Source | Provides | Licence | Notes |
|---|---|---|---|
| geoBoundaries (`gbOpen`) | ADM0 to ADM5 polygons | CC BY 4.0 | Pin a release. IDs and names change between releases. Disputed areas need a recorded stance. |
| World Bank | Country-year indicators | CC BY 4.0 | Drop regional and income aggregates from country lists. Data lags one to three years. |
| WHO GHO | Country-year health indicators | CC BY-NC-SA 3.0 IGO | Non-commercial and share-alike. Settle this before any paid use. |

These are mostly national. A province page would show a map with national figures and must say so. Subnational numbers need other sources.

### Stage 2: identity, names and places

| Source | Provides | Licence |
|---|---|---|
| Wikidata | Entities, aliases, dates, coordinates, cross-IDs (GeoNames, VIAF, Pleiades, OSM) | CC0 |
| Wikipedia | Article text and cited sources | CC BY-SA |
| GeoNames | Gazetteer with alternate names | CC BY |
| OpenStreetMap | See below | ODbL |

Wikipedia is a pointer to sources, not evidence on its own. Wikidata is the identity hub for matching entities across sources, through `wikidata=Q…` tags on OSM features and cross-ID properties.

### OpenStreetMap themes

| Theme | Examples |
|---|---|
| Admin and places | `boundary=administrative` with `admin_level`, `place=*`, multilingual `name:*`, `old_name` |
| Transport | `highway=*`, `railway=*`, `aeroway=*`, ports, `public_transport=*` |
| Buildings and land | `building=*`, `landuse=*`, `natural=*` |
| Water | `waterway=*`, lakes, boreholes and wells |
| Health | `amenity=hospital/clinic/pharmacy`, `healthcare=*` |
| Education | `amenity=school/university` |
| Government and services | police, courts, post offices, banks, markets, `office=government` |
| Culture and history | `historic=*`, `tourism=*`, museums, `place_of_worship`, heritage tags |
| Protected areas | `boundary=protected_area`, national parks and reserves |

OSM is current-state only and tagging quality varies. It supplies today's places and facilities, not their history.

### Stage 3: humanitarian, statistical and historical

- **HDX and OCHA COD-AB:** subnational boundaries, population, health-facility lists, humanitarian datasets. Licences vary per dataset.
- **Kenya national sources:** KNBS, Kenya open data portal, county data, Master Health Facility List.
- **DHS:** subnational health indicators, registration required.
- **WorldPop and GHSL:** population rasters. Heavy. Keep outside PostgreSQL.
- **Overture Maps:** cleaner places and buildings alternative to raw OSM.
- **ACLED:** conflict events, with licence restrictions to check.
- **Historical sources:** Internet Archive, national archives, Wikisource, HathiTrust, university repositories. These feed the evidence pipeline and are not bulk datasets.

Seshat, Pleiades, the World Historical Gazetteer and Slave Voyages are neighbouring research projects. They are candidates for linking or comparison, not for bulk copying, and their terms need review first.

### Additional sources and ways to get OSM

- **OSM access routes:** Geofabrik country extracts (easiest), Overpass API for targeted small queries, BBBike or HOT Export for custom areas, the Planet file (about 80 GB or more, avoid), and `imposm` as an alternative loader to `osm2pgsql`.
- **Building footprints beyond OSM:** Google Open Buildings and Microsoft Building Footprints cover much of Africa. Check each licence before use. Overture Maps merges several of them.
- **Land cover, elevation, climate (rasters):** Copernicus and ESA WorldCover, SRTM or Copernicus DEM, Sentinel imagery. Heavy, keep outside PostgreSQL.
- **Indicator and statistics portals:** Our World in Data, UN Data, World Bank Data360, WHO Data, Afrobarometer.
- **African knowledge sources:** African Journals Online, Slave Voyages, Wikimedia African projects.
- **Archival and annotation tools:** Internet Archive, Zotero, Hypothes.is, JSTOR open content, HathiTrust, Wikisource.
- **Historical gazetteers:** Pleiades, World Historical Gazetteer, Pelagios, Seshat.

No existing platform combines place and time spine, evidence pipeline, per-claim uncertainty and current plus historical data on one map. Wikidata, OSM, OWID, HDX and Seshat each cover one part. This is a differentiator and also a risk, since the combination is ambitious. The comparison is from memory and has not been checked against current sources.

## Storage and PostgreSQL impact

All figures are unmeasured estimates.

| Scope | Raw files | PostGIS, simplified | PostGIS, full resolution |
|---|---|---|---|
| geoBoundaries ADM0 | tens of MB | under 100 MB | a few hundred MB |
| geoBoundaries ADM0 to ADM1 | about 100 to 300 MB | about 0.3 to 0.5 GB | about 1 to 2 GB |
| geoBoundaries ADM0 to ADM2 | about 0.5 to 1.5 GB | about 1 to 3 GB | about 3 to 6 GB |
| geoBoundaries ADM0 to ADM5 | several GB | about 3 to 6 GB | about 5 to 15 GB |
| OSM Kenya, loaded | a few hundred MB extract | about 1 to 3 GB, mostly buildings and roads | |

Indexes add roughly 10 to 30 percent. A Kenya-deep build with the stage 1 and stage 2 sources is roughly 2 to 4 GB of PostGIS data plus raw files on the filesystem store.

Effects on the existing database:

- PostGIS must be installed and enabled. Its presence on the current instance has not been checked.
- Existing tables are unaffected. Bulk loads and GiST index builds are briefly heavy and add cache pressure.
- Raw downloads stay on the `mzizi-filesystem` store. Only parsed geometries and rows enter PostgreSQL.
- Rasters such as WorldPop stay outside PostgreSQL.
- Try new loads in a scratch database first, never in the long-lived dev database.

## Owner decision: take all of the data, buildings included

The owner wants all OSM themes for Kenya, with **no skipping of buildings** (recorded 2026-11-20). Capacity is then the only limit. Buildings are the largest OSM theme, so the Kenya OSM load may be larger than the earlier 1 to 3 GB estimate. Unmeasured, treat 3 to 8 GB as the planning range until a real load is measured. Because the load goes to a staging schema, size can be measured without touching accepted data.

## How OSM would enter the database (design needed)

Current state, verified in the repo: PostgreSQL already uses PostGIS (`geometry(..., 4326)` columns, for example in `migrations/0001_init.sql`), so the extension is already in use. `osm2pgsql` is not installed on the dev machine, and the PostgreSQL role the engine would use for it is not yet decided. Docker is available.

Proposed path, not approved:

1. **Raw file.** The `.pbf` is stored unchanged through the filesystem package, with a recorded source, retrieval date and extract version.
2. **Staging load.** `osm2pgsql` writes into a dedicated schema in a scratch database first. These tables are disposable and rebuildable from the raw file. They are never edited by hand.
3. **Candidates.** An engine step reads the staging tables and proposes places, facilities, roads and buildings as candidates with provenance (`osm_type`, `osm_id`, tags, extract date).
4. **Review and acceptance.** Accepted rows follow the normal review path into the Geography tables. Matching to Wikidata and GeoNames goes through the entity-resolution design.
5. **Refresh.** A new extract replaces the staging layer. Differences against accepted data surface as change candidates.

Improvements likely needed for it to connect, to be designed and approved before any work:

- A stable external identifier for features (source, `osm_type`, `osm_id`) on Geography features and places, so rematching after refreshes is safe.
- A place for source tags (`jsonb` or a typed child table) so no tag is lost.
- A bulk path. Review per feature is not workable for millions of buildings, so buildings likely need a bulk-accept policy by rule and a sampled quality check, which is a policy decision for the owner.
- Spatial indexes (GiST) and partitioning by region or admin area for building-sized tables.
- A link from each loaded feature to its containing ADM unit, computed from geoBoundaries at load time.
- A manifest entry for OSM and each other source with licence, attribution and refresh cadence.
- Engine operations to download, load and compare, registered on the runtime like the other capabilities, with the collection policy gate applied.
- A capacity check (database size, free disk, backup size) before each deeper load.

## Loading OSM

`osm2pgsql` reads a `.pbf` extract (for example a Geofabrik country file) and writes it into PostGIS tables, driven by a style or Lua flex configuration that says which tags become which tables and columns. This is a design option, not an approved step. Its output tables would be a staging layer in their own schema. Accepted Mzizi places and facilities are derived from them through the normal candidate and review path, not copied in silently. Updates run from fresh extracts or diffs, and each load records the extract date as the retrieval time.

## Downloading the data

| Source | How | Where |
|---|---|---|
| OSM Kenya | Download `kenya-latest.osm.pbf` | `https://download.geofabrik.de/africa/kenya.html` |
| geoBoundaries | Per country and level via the API, or the global composite | `https://www.geoboundaries.org/api.html`, `https://www.geoboundaries.org/` |
| World Bank | Indicator API, JSON or CSV | `https://api.worldbank.org/v2/country/all/indicator/<CODE>?format=json` |
| WHO GHO | OData API | `https://ghoapi.azureedge.net/api/` |
| Wikidata | SPARQL endpoint for subsets, full dumps for bulk (very large) | `https://query.wikidata.org/`, `https://dumps.wikimedia.org/wikidatawiki/entities/` |
| GeoNames | Country file `KE.zip` | `https://download.geonames.org/export/dump/` |
| HDX | Dataset pages with direct file links | `https://data.humdata.org/` |
| Overpass | Targeted queries | `https://overpass-api.de/` |

URLs are from memory and must be confirmed when used. Every download is saved unchanged with its retrieval date, source URL and release or extract version, and counts as collection under the engine's collection policy.

## Licence handling

- **OSM, ODbL:** attribution is required and a derived database carries share-alike obligations. Keep OSM data in its own labelled layer and legal-review before publishing combined products.
- **Wikipedia, CC BY-SA:** share-alike applies to reused text.
- **WHO, CC BY-NC-SA:** non-commercial. Matters if any paid product ever uses the data.
- **Wikidata, GeoNames, World Bank, geoBoundaries:** attribution only.

Each source manifest records licence, attribution text, retrieval date and release or extract version, so the product can render attribution per layer.

## Expansion path

1. **Spine:** global ADM0 and ADM1 from a pinned geoBoundaries release, ISO3 keyed. World Bank and WHO country indicators attached. Show coverage on every place.
2. **Kenya depth:** ADM2 and below, an OSM Kenya load (staging layer), Wikidata and GeoNames matches, HDX and Kenya national datasets.
3. **Identity layer:** match places and facilities across geoBoundaries, OSM, Wikidata and GeoNames through the existing entity-resolution design.
4. **More regions:** repeat stage 2 for further countries, ordered by research value and storage.
5. **History:** link historical entities and changing boundaries, which none of these current-day sources provide, through the evidence pipeline.

## Use case: urban planning and place analysis (Kenya first)

Boundaries, buildings, roads and indicators are the standard inputs of urban and regional planning. Once Kenya is loaded, the same data can answer planning questions. This is an idea recorded on 2026-11-20, not an approved feature.

| Question | Data that answers it |
|---|---|
| Where is the city growing, and how fast? | OSM buildings compared between extracts, plus GHSL or WorldPop built-up and population rasters |
| Which neighbourhoods lack services? | OSM schools, clinics, water points and transport stops, measured as distance to the nearest one |
| Where should a new clinic or school go? | Population grid, existing facilities and the road network, as a coverage or catchment analysis |
| Which areas are crowded or informal? | Building density and size, road access, land use |
| Flood and climate risk | Rivers and elevation, with buildings and roads exposed to them |
| Transport and accessibility | OSM road network, bus and matatu stops, travel time to jobs and markets |
| Planning by county or ward | geoBoundaries ADM1 to ADM3, with HDX and KNBS population and census tables per area |
| Health and poverty patterns | WHO and World Bank indicators and DHS data, mapped by area |
| Land and heritage | Protected areas, historic sites and place names (OSM, Wikidata, GeoNames), so planning respects heritage |

What Mzizi adds that other planning tools lack is history: how places, boundaries and names changed, and the evidence behind each change.

Limits:

- OSM coverage is uneven, better in cities than in rural areas.
- WHO and World Bank values are national and cannot rank neighbourhoods.
- Rasters (WorldPop, GHSL, elevation) are large and stay outside PostgreSQL.
- Planning decisions need verified data, so planning outputs should show provenance, extract date and coverage, and rely on the candidate-to-review path for accepted facts.
- Other uses, such as disaster response, health coverage, education access and heritage mapping, use the same data and are not yet worked out.

## Current download state (2026-11-20)

Downloads are staged in the git-ignored `.dev/scratch/` folder, not yet loaded or manifested: Geofabrik OSM extracts for Kenya, Tanzania, Uganda and Rwanda; geoBoundaries gbOpen ADM0 to ADM5 for African countries from `seed/data/global/reference/countries.csv`; GeoNames and World Bank WDI files for the four countries; WHO GHO indicator rows for the four countries; HDX datasets tagged to the four countries; Wikidata places with coordinates. Completeness and contents are unverified, and the manifest with source URL, retrieval date and licence per file is still to be written.

## Limits and open questions

- Historical entities, the project's core goal, are not covered by any of these sources.
- Disputed borders need a visible stance. Which stance is a user decision.
- World-scale polygons need simplified geometry or vector tiles for low-bandwidth use.
- Language coverage lags the data.
- Whether to keep full-resolution geometry or only a simplified display copy.
- Whether the product will ever be commercial, which decides whether WHO data can be used.
- Where OSM staging tables live and how they relate to the accepted places model.
- Which Kenya national datasets are licensed for reuse.

## Related documents

- [System expansion and advancement proposal](advancement-and-system-expansion.md)
- [Geography model](../../design/geography/geography-model.md)
- [Source filesystem geography](../../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md)
- [Entity resolution](../../design/data/ENTITY_RESOLUTION.md)
- [Legality, safety and compliance](../../design/policy/LEGALITY_SAFETY_AND_COMPLIANCE.md)
- [Master planning register](mzizi-data-schema-storage-and-pipelines-redesign.md)
