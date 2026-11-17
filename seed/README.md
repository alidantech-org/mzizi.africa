# Seed

This folder was emptied on 16 November 2026 so the seed inputs can be rebuilt from scratch against the approved schema and manifest redesign (group "Schema and manifest redesign" in `.docs/todo/work/W47/`). The previous tree is archived, unversioned by Git except through history, at `.dev/archives/seed/` on the machine that made the move, and in Git history before the commit that removed it.

## How it is rebuilt

- The owner reviews and approves every seed file before it is added. Agents propose a file or a small set of files, show them, and wait; nothing is added in bulk.
- Files are added one by one, and each must pass the validators: `uv run mzizi-manifest refs seed` checks codes, kinds, scope and paths, and `uv run mzizi-manifest data seed` checks every CSV against the database schemas.
- A CSV row is identified by its `code` and links to other rows by code (`scheme_code`); it never carries ids or system fields (`.docs/rules/codes.md`).
- No version appears in a folder or file name (`.docs/rules/versioning.md`).

## The layout

```text
seed/
├── manifest.yaml            registers files; never loads data (generated manifest.lock.yaml beside it)
├── codes: see source/schema/seed/codes.json (short names)
├── data/<scope>/<domain>/<usage folders...>/<table>.csv   (<label>.<table>.csv when several files feed one table)
├── sources/srs/<scope>/<name>/manifest.yml           (+ modules/, examples/, NOTES.md)
├── mappings/<schema short>/<table short>/<scope>/<name>.yml
├── terms/<scope>/<domain>.yml                      words, patterns, heading rules and splits, by meaning (sys.trm.<scope>.<domain>)
├── columns/<scope>/<domain>.yml                    which terms define each seed column, code recipes, name lookups (sys.col.<scope>.<domain>)
├── engine/               engine data and jobs: web/classification.yaml, job/<scope>/<name>.json
└── _fixtures/            tests only
```

- `<scope>` is `global` or a country code; `<domain>` is a database group. A file's folder path mirrors its code (`.docs/rules/codes.md`), and a CSV's table is named by its path. A seed CSV never carries ids or system fields; its `code` and link cells hold the identity path alone (`ke`, `geo.continent.africa`).
- Everything here is small and text: CSV, YAML and short JSON. Large files (GeoJSON, shapefiles, PDFs, spreadsheets) are **not** seed files; they stay outside Git and are referenced by hash and origin (a proposal, `Design references to large seed inputs` in the redesign group).

## What is in it

- `data/global/reference/schemes.csv` (5 schemes), `values/` (282 values in `values/fin.values.csv`, `geo.values.csv` and `ref.values.csv`, one file per domain) and `countries.csv` (205 countries): every known country, whether or not the UN recognises it, added on 16 November 2026 with the owner's approval. A country is a country by its recognition status (`geo.recognition.status`): 193 UN member states, 2 UN observer states, 6 partially recognized, 2 unrecognized, 2 in free association. `established_on` is the date of independence or, where there is none, the date the current state was founded; the judgment calls (Japan, Thailand, Ethiopia, Iran, Nepal, the UK and others) are for the owner to review. Official names, ISO numerics and calling codes are from the preparer's knowledge, not a checked source. Codes follow `.docs/rules/codes.md`. They are not yet registered in a `manifest.yaml`.
- `engine/web/classification.yaml` (code `sys.eng.web.classification`): the web classification data (URL kinds, challenge markers, file signatures) read by `mzizi-fetch`, validated by `source/schema/engine/web.schema.json`. It was moved here on 16 November 2026 at the owner's request; its schema comes first.

## Large inputs (proposal)

A seed file is at most about 1 MB of text. A larger input, such as the GeoJSON of county boundaries, lives only on the machine that prepared it (git-ignored, under `.dev/inputs/`) and in the object store; the seed keeps a small record that identifies it exactly: where it came from (`origin` URL and licence), its `sha256` and size, and the database rows that point at it (`filesystem.file_versions`, `source.captures`, and the `file_version_ref_id` columns such as `geography.datasets`). A check re-hashes the local copy against that record, so the file used is always identifiable without being committed. The design is task "Design references to large seed inputs" in the redesign group.

## Splitting a growing table

A table that gets large is split into a folder named for the table, holding parts named `<label>.<table>.csv`: `data/global/reference/values/geo.values.csv`, `fin.values.csv`, `ref.values.csv`. The label is the domain the rows belong to. When one part grows too, nest further inside the folder (`values/geo/water.values.csv`); any depth is read, and the codes stay unique across all parts. Keep a file small enough to read in one sitting.

## Geography classification and Kenya

`geo.feature.kind` is one hierarchy (natural, built, administrative, cultural; kinds such as water body and river below them) written with `parent_code` in `values/geo.values.csv`. A feature stores its kind and the category follows from the hierarchy. Other questions have their own schemes: `geo.feature.function`, `geo.feature.reality`, relationship kind and system, geometry role and basis, name kind and identifier scheme. Kenya's first rows are in `data/ke/geo/`: the country feature, three names and three identifiers. The outline is a large input and is not seeded. The domain folder may use the schema short (`geo`).

## Usage folders and where data comes from

Between the domain and the file, folders group the data the way it reads best: `data/ke/geo/counties/`, `data/global/reference/values/`. The file name alone says which table it feeds (`names.csv`, or `geo.values.csv` for the values table); folders carry no other meaning and can be split further as they grow.

Every real-world folder should say where its rows come from in a `_source.yaml` beside the CSV files. `status: verified` names a dataset (publisher, licence, url, a local copy and its sha256) and what to compare; `mzizi-manifest verify` then checks that every identifier is one the dataset has, names match the dataset, and, with `complete: true`, that no dataset feature is missing. `status: unverified` records that no dataset has been matched yet, and the command keeps reporting it. Do not seed a country's divisions from memory without saying so there.

Kenya's administrative levels under `data/ke/geo/` are verified against real datasets with `mzizi-manifest verify` (each folder's `_source.yaml` names the dataset, licence, url and sha256; the dataset files live in `.dev/datasets/`, outside git, and `verify` reports a folder as unavailable when its copy is missing):

| folder | rows | dataset |
|---|---|---|
| `counties/` | 47 | OCHA COD-AB Kenya level 1, place codes by the IEBC |
| `constituencies/` | 290 | OCHA COD-AB Kenya level 2, place codes by the IEBC |
| `wards/` | 1450 | IEBC place codes for county assembly wards (American Red Cross, HDX) |
| `sub-counties/` | 304 | Kenya Sub Counties (American Red Cross, HDX; DHIS2 ids) |
| `provinces/` | 8 | unverified: general knowledge, no dataset matched yet |

Each feature carries its IEBC place code (`KE-030`, `KE-027-144`, `KE-030-0787`: county, constituency and ward) as an identifier, plus the OCHA code, geoBoundaries id or DHIS2 id where the dataset gives one. Where each row came from is a chain of records: the CSV it was loaded from is a dataset (`data/ke/source/datasets.csv`), the dataset's lineage names the captures it was prepared from (`dataset_lineage.csv`), each capture records the link, time and path it was fetched from (`captures.csv`). A source is a `website` (HDX, with its domain and paths), an `api`, or a `dataset`: files or data obtained from somewhere that is neither, such as the geoBoundaries files on GitHub or the IEBC codes on Google Drive. Those hosts are not sources; they appear only as the link a capture was fetched from (`data/global/source/`) and the document holds the content's sha256 (`documents.csv`). The loader will write one `source.provenance` row per seeded record to tie it to its dataset and CSV line; until it exists, `provenance` is empty. Constituencies and sub-counties are different layers (290 and 304). Districts are not seeded: no dataset for them has been found.

## Loading, and loading again

`uv run mzizi-engine seed` loads every CSV into PostgreSQL (`DATABASE_WRITE_URL`); without `--apply` it does the work inside a transaction and rolls it back, so the counts it prints are exact. It is safe to run again and again:

- A row's id is derived from its table and natural key, so the same row always has the same id and a repeat cannot duplicate it.
- A row is written only when a seeded column really differs from the database (`IS DISTINCT FROM`). With no edits nothing is written, no timestamp or `version` moves; a small edit changes that one row and raises its `version`.
- Columns a CSV does not mention are left alone, so a new column in the schema changes nothing until a CSV names it. A column that left the schema is refused by `mzizi-manifest data` until the CSV is fixed.
- Nothing is ever deleted. A row in the database that no CSV names is reported ("not in seed") and left for a deliberate decision. Changing a key column (for example the text of a name) is a new row plus an old row that is no longer in the seed.
- Links are written as codes; the loader derives the target id the same way, so it never looks one up. Tables load in link order and a self-link (a value's parent) loads parents first.
- Every seeded record gets a `source.relationships` row (the record, prepared from the exact CSV artifact) and a `source.citations` row for its CSV line. Every CSV is a product with one edition and one artifact per content hash (`data/global/source/seed.products.csv`, `seed.editions.csv`, `seed.artifacts.csv`), generated by `uv run mzizi-manifest datasets`; the check reports a CSV whose current bytes have no artifact row, so edit the CSV, run `datasets`, then load. Provenance written for earlier bytes keeps pointing at the artifact it was read from.
- A table that names one subject row (`legal.effects`, `source.relationships`, `source.citations`, `filesystem.media`, `source.verifications`) has a `subject_table` cell (a fully qualified table such as `geography.features`) and a `subject_code` cell (that table's code); the loader resolves the id, and the database refuses a subject that does not exist.

`uv run mzizi-engine register-files [--apply]` stores the files themselves in the object store through the filesystem package: the downloaded originals listed in `data/ke/source/_files.yaml` (under `sources/downloads/<source>/`, with a credit and a rights statement written to `source.attributions`) and every seed CSV (under `seed/…`). It links each `source.artifacts` row to its stored file version. Run again, it stores nothing new.

To start from scratch: drop and recreate the database, `bun run db migrate` (`0001_init`, built from the current schema, and the generated `0002_subject_integrity`), `bun run db roles`, then `mzizi-engine seed --apply` and `mzizi-engine register-files --apply`.

## The Constitution of Kenya, 2010

`data/ke/legal/constitution-2010/` holds the Constitution as one statement per row: a folder per chapter (`chapter-01/` to `chapter-18/`), the preamble and each schedule (`schedule-1/` to `schedule-6/`), each with a small `provisions.csv` (the tree: chapter, part, article, clause, paragraph, sub-paragraph, definition, schedule item), `wordings.csv` (the English authority text; its exact source is a citation in `data/ke/source/constitution-2010/<folder>/citations.csv`: a PDF page or the KLRC address), `translations.csv` (the Kiswahili text, `proposed`, tied to the exact wording, aligned by article, clause and paragraph number) and `references.csv` (every "Article 24 (1) (b)", "Chapter Four" or "Fifth Schedule" in the English wording, with the exact characters of the mention, so a reader can follow it like a link). `data/ke/legal/effects/geography.effects.csv` records, as reviewable effects (`proposed`), what the provision wording establishes, defines or governs: it links the country, the 47 counties, the 290 constituencies and their kinds to the provision that creates them; the same `legal.effects` table can name any record in any subject table as its subject.

The files are generated, not typed: `uv run python scripts/seed/build_constitution.py` reads the PDFs in `.dev/datasets/kenya-constitution/` and the KLRC link map in `.dev/datasets/klrc/` with the extraction package (`mzizi_extraction.legislation`) and rewrites them. The English text is the NCLR print (Laws of Kenya, with the authority of the Attorney General); the Kiswahili text is URAIA's translation of it and the English governs (Article 259). The 6 May 2010 Kiswahili *proposed* constitution is stored as a product with its artifact only. KLRC page addresses for 209 of 264 articles come from its chapter and part pages (`data/global/source/addresses.csv`); the rest cite the PDF page.

## Drafts that wait for approval

The [developer portal pilot](../.docs/design/architecture/DEVELOPER_PORTAL.md) will export draft CSVs and their evidence for owner review. Export, registering approved seed files and applying them to PostgreSQL are separate actions.

`seed/drafts/` is outside `seed/data/`, so nothing in it is loaded. `drafts/constitution-patterns/` drafts the patterns, institutions, offices and mandates the Constitution establishes (its README lists them with the articles they rest on). `uv run python scripts/seed/check_drafts.py` checks a draft against the schemas together with the real seed. Approving a draft means moving the files you accept into `seed/data/`.

## Never delete objects to make registration succeed

If the database is rebuilt while the object store keeps the old files, `register-files` refuses to overwrite an object that no registry row owns. Remove only objects you created and can regenerate (the seed CSVs), never other stored artifacts: the old seed files under `internal/seed/countries/…` are archives and stay.
