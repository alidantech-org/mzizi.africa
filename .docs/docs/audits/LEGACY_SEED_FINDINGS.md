---
{id: AUDIT-LEGACY-SEED-FINDINGS,name: Legacy seed quality findings,type: audit,tags: [migration,legacy,seeds,quality]}
---

# Legacy seed quality findings (2026-11-02)

The CSV seeds under `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/api-legacy/app/routes/*/_seed` were measured before any import (`mzizi_data.imports.legacy_seeds`, regression-tested in `tests/test_structure.py`). The seeds name no sources, were written for the previous project and are mostly sample-sized (most files hold fewer than 30 rows). They are **not** bulk-copied into canonical tables; at most a reviewer promotes a curated candidate that has been checked against a real source.

## Geographic units (`geo_units.csv`)

| Measure | Result |
| --- | --- |
| rows | 550 |
| distinct unit codes | 382 (156 codes repeat; 168 rows are repeats) |
| repeated codes that disagree on name or level | 140 (for example `ke/kisumu-central` is both a constituency and a sub-county) |
| rows per level | national 1, county 44, constituency 264, sub-county 241 |
| distinct units per level | national 1, county 42, constituency 249, sub-county 90 |
| counties versus the 47 official counties (geoBoundaries) | 7 missing: Elgeyo-Marakwet, Embu, Murang'a, Nyandarua, Tharaka, Uasin Gishu, West Pokot |
| legacy "counties" that are not counties | `ke/eldoret` (a town), `ke/pokot` |
| constituencies | 249 distinct against the 290 constituencies in Kenya |

Conclusion: usable only as a cross-check of names. County units come from the boundary dataset (promoted through the pipeline); constituencies and wards need a real source (the IEBC boundary delimitation documents or an open dataset) and a decision about sub-counties, which the legacy seed conflates with constituencies by code.

## Other seeds

| Group | Rows | Assessment |
| --- | --- | --- |
| statistics (indicators 96, periods 85, tables 27, geo values 100) | small | indicator and period definitions may be reviewed as vocabulary; the 100 value rows have no sources and are not imported |
| governance institutions 40, relationships 21 | small | candidate vocabulary for the governance wave; each institution needs a source |
| legal constitutions 2, sections 42 | small | the 42 sections belong to one text; the real text is re-extracted with pinpoint locators |
| people 32, holders 28, offices 12 | small | personal data of named people with no source: not imported; privacy review first |
| political 10 parties, elections 9, results 22, candidates 20 | sample | test data; real results come from the electoral commission |
| finance, debt, procurement | 3 to 24 rows each | samples; replaced by real documents |
| files (file types 44, directories 13) | | already moved to `fixtures/reference/media-formats.json` and the folder model |

Rule applied: nothing from these seeds is promoted without a source document, a licence and a human reviewer, so no seed rows were imported in this run. `MIGRATION.md` keeps `api-legacy` in place: nothing there can be removed until its replacement exists and its responsibilities are accounted for.
