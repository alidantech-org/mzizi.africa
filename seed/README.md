# Seed

This folder was emptied on 16 November 2026 so the seed inputs can be rebuilt from scratch against the approved schema and manifest redesign (group "Schema and manifest redesign" in `.docs/todo/work/W47/`). The previous tree is archived, unversioned by Git except through history, at `.dev/archives/seed/` on the machine that made the move, and in Git history before the commit that removed it.

## How it is rebuilt

- The owner reviews and approves every seed file before it is added. Agents propose a file or a small set of files, show them, and wait; nothing is added in bulk.
- Files are added one by one, and each must pass the validators once they exist (`uv run mzizi-manifest refs seed` checks codes, kinds, scope and paths today).
- No version appears in a folder or file name (`.docs/rules/versioning.md`).

## The planned layout

```text
seed/
├── manifest.yaml            registers files; never loads data (generated manifest.lock.yaml beside it)
├── data/<scope>/<domain>/<table>.csv
├── sources/<scope>/source/<websites|apis>/<name>/      manifest.yml, modules/, examples/, NOTES.md
├── mappings/<scope>/<domain>/<table>/<name>.yml
├── terms/<scope>/<area>/.../<name>.yml
├── engine/                  flat engine data and jobs: web-classification.yaml, jobs/<name>.json (a non-global scope adds a folder)
└── _fixtures/               tests only
```

- `<scope>` is `global` or a country code (`ke`); `<domain>` is a database group. A file's folder path mirrors its code (`.docs/rules/codes.md`), and a CSV's table is named by its path: `data/ke/geography/units.csv` is the rows of `geography.units`.
- Everything here is small and text: CSV, YAML and short JSON. Large files (GeoJSON, shapefiles, PDFs, spreadsheets) are **not** seed files. They stay outside Git and are referenced from the seed by hash and origin; see "Large inputs" below, which is a proposal awaiting approval.

## What is in it

- `engine/web-classification.yaml` (code `global.engine.web-classification`): the web classification data (URL kinds, challenge markers, file signatures) read by `mzizi-fetch`, validated by `source/schema/engine/web.schema.json`. It was moved here on 16 November 2026 at the owner's request; its schema comes first.

## Large inputs (proposal)

A seed file is at most about 1 MB of text. A larger input, such as the GeoJSON of county boundaries, lives only on the machine that prepared it (git-ignored, under `.dev/inputs/`) and in the object store; the seed keeps a small record that identifies it exactly: where it came from (`origin` URL and licence), its `sha256` and size, and the database rows that point at it (`filesystem.file_versions`, `source.captures`, and the `file_version_ref_id` columns such as `geography.datasets`). A check re-hashes the local copy against that record, so the file used is always identifiable without being committed. The design is task "Design references to large seed inputs" in the redesign group.
