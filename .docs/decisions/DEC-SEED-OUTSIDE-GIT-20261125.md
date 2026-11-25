---
id: DEC-SEED-OUTSIDE-GIT-20261125
name: Seed data and seed tooling live only in the git-ignored .dev/seed
type: decision
tags: [seed, git, engine, manifest]
---

# Decision: seed lives only in `.dev/seed/`

**Owner decision, 25 November 2026; carried out by task TSK-6065C44E5476 in the rebuild run.**

- The root `seed/` folder, the seed builders (`scripts/seed/`, `scripts/seed_check.py`, `scripts/dev/build_dev_seed.py`, `scripts/dev/dev_seed/`, `scripts/dev/dev-data.sh`, `scripts/dev/sync-copy.sh`) and the seed-fixture tests are removed from Git. Copies are in `.dev/seed/repository/` (see `.dev/seed/LOCAL.md`). `.gitignore` refuses `/seed/` and `**/seed-dev/`; `.dev/` was already ignored.
- Removed seed code: the manifest package's `features/seeds` (registry, lock, folder metadata) and its `check`, `lock` and `report` commands; the seed JSON schemas in `source/schema/seed/`; the engine seed loader (`mzizi-engine seed`), filesystem seed sync, source-file and media registration from the seed root, the generated seed catalog (engine contract `catalog`, its route, models, SDK actions and dev portal screen) and `manifest.check_seeds`.
- Kept as generic code, with a configured root: research tools that read column dictionaries, term lists and engine data (`MZIZI_SEED_ROOT`, default `.dev/seed`), the code grammar and `source/schema/codes.json` (code short names, moved from `source/schema/seed/`), the table contracts in `source/schema/database/` and the stable-id function (`mzizi_manifest.features.data.ids`).
- Seed files need no owner approval. The rebuilt database is seeded from `.dev/seed/` by local tooling that is never committed.
