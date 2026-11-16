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
├── data/<scope>/<domain>/<table>.csv            (or <table>/<label>.<table>.csv once a table grows)
├── sources/wbs|api/<scope>/<name>/manifest.yml           (+ modules/, examples/, NOTES.md)
├── mappings/<schema short>/<table short>/<scope>/<name>.yml
├── terms/<schema short>/<table short>/<scope>/<name>.yml
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
