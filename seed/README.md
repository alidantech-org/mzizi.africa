# Seed

This folder was emptied on 16 November 2026 so the seed inputs can be rebuilt from scratch against the approved schema and manifest redesign (group "Schema and manifest redesign" in `.docs/todo/work/W47/`). The previous tree is archived, unversioned by Git except through history, at `.dev/archives/seed/` on the machine that made the move, and in Git history before the commit that removed it.

## How it is rebuilt

- The owner reviews and approves every seed file before it is added. Agents propose a file or a small set of files, show them, and wait; nothing is added in bulk.
- Files are added one by one, and each must pass the new validators once they exist.
- The layout is `data/<scope>/<domain>/<table>.csv`, `sources/<scope>/source/<websites|apis>/<name>/`, `mappings/<scope>/<domain>/<table>/<name>.yml`, `vocabularies/<scope>/<area>/.../<name>.yml`, `extraction/<scope>/extraction/<name>.yml` and `_fixtures/`, with a root `manifest.yaml`. A file's folder path mirrors its code (`.docs/rules/codes.md`); `uv run mzizi-manifest refs` checks it.
- No version appears in a folder or file name (`.docs/rules/versioning.md`).

## What is in it

- `vocabularies/global/web/classification.yaml` (code `global.web.classification`): the web classification data (URL kinds, challenge markers, file signatures) read by `mzizi-fetch`, validated by `source/schema/vocabulary/web.schema.json`. It was moved here on 16 November 2026 at the owner's request; its schema comes first.
