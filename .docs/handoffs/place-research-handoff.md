---
{id: HANDOFF-PLACE-RESEARCH,name: "Handoff - place research, constituency offices and place integrity (lane H4)",type: handoff,tags: [data-engine,places,reinforcement,integrity,handoff]}
---

# Handoff: place research (lane H4, 3 November 2026)

Read `AGENTS.md`, `.docs/decisions/place-research.md` (DEC-PLACE-RESEARCH), `DEC-PLACES-AND-OFFICE-PATTERNS` and the "Place research" section of `.docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md` (its numbers are authoritative; verify them with `place-coverage`).

## What exists

- `data/src/mzizi_data/imports/constituency_offices.py` reads the IEBC PDF (293 rows including 6 county-office rows) and loads places, attributions, verifications, occupancies and resolved expectations. Command: `import-constituency-offices <pdf> [--dry-run] [--report path]`. The report `.data/reports/constituency-offices.json` lists unlinked rows with scores and ward hints.
- `landmarks.py` and `database/fixtures/seed/ke-landmark-places.json` (custom-prepared, text addresses only): national bodies, every county government and assembly. Command `load-landmarks`. It resolves nothing.
- `place_research.py` and `placecli.py`: refill handlers `site_documents`, `wikidata_place`, `osm_nominatim`; `place-refill`, `place-apply`, `place-duplicates`, `place-coverage [--markdown]`, `place-register-osm`; moves, closures, splits and merges; `add_space`; `import_contact`; `dispute`.
- Database engine: integrity rules in `integrity.ts` (evidence, pattern versions, contacts), `resolveContact` that never crosses subjects, migration `1795500000400` (kind `place` in the match tables), trusted-host entry for Nominatim.

## Blocked or open

1. **Nominatim is refused by its robots.txt** (the gate stops on `/search`). Do not bypass it. Options for the owner: a self-hosted Nominatim, or another route the OSM usage policy allows. Until then a landmark point has one source (Wikidata, trust 0.6) and stays a proposed claim.
2. **Unlinked constituency rows** (names that the geography table spells differently: Garissa Township, Mbeere North and South, Dagoretti North and South, Chuka/Igambang'ombe, Mwingi Central, Tindiret, Bureti, Sisiria, Homa Bay Town) and constituencies the database has under old names. Add aliases or correct the geography names, then re-run the import (it is idempotent).
3. **NG-CDF offices and MP constituency offices** have no document naming a location in the registry; their expectations stay `expected`. The NG-CDF directory pages and county government sites are the next sources; use `site_documents` once those captures are registered and linked to the institutions (`website.subjects`).
4. **Contacts**: no preserved document publishes a switchboard that could be imported; `import_contact` and the visibility rules are tested but unused on live data. The refill framework is per field, so contact claims need either a claim kind for contact points or a scoped import job.
5. **Enrichment of structures and spaces** has the tested function `add_space` but no source-reading job: nothing in the registry names a building, floor or room yet.
6. Duplicate-place flags (about 700) await review; many are real (for example "The National Assembly" and "National Assembly" places from procurement); do not merge on a name.
7. The database drift test in `engine.test.ts` and `places.test.ts` currently fails because of the in-progress website entities from another lane (dns snapshots, domains), not because of the place tables.
