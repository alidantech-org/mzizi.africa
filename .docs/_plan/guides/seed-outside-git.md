---
id: DOC-SEED-OUTSIDE-GIT-20261120
name: Seed outside Git, dev seed workflow and move plan
type: planning-proposal
tags: [seed, dev-seed, portability, storage, migration-plan, long-term-goal]
extra:
  status: implemented
  approval: approved
  implementation: done
  recorded_on: 2026-11-20
---

> **Implemented on 2026-11-25** ([decision](../../decisions/DEC-SEED-OUTSIDE-GIT-20261125.md)). This proposal is kept as history; the decision is authoritative.


# Seed outside Git: the dev seed workflow and the plan to move it

**Planning only. Nothing is removed from `seed/` and the owner has not approved the move. Part 1 describes what was set up on 2026-11-20 and how it works. Part 2 is the plan. Where a statement is unverified it says so.**

## Part 1. The dev seed workflow (set up 2026-11-20)

### Why
Public data (World Bank, WHO, geoBoundaries, GeoNames, Wikidata, OSM, HDX) is large and still test data. The owner decided that such seed is prepared in the git-ignored `.dev/` folder, not in `seed/`, and that no seed files are added to the repository for it. This keeps Git small and avoids owner-approval-per-file for bulk public data, as `seed/README.md` otherwise requires.

### What exists
- **Downloads** (raw, unchanged): `.dev/scratch/` holds `osm/`, `geoboundaries/`, `geonames/`, `worldbank/`, `who/`, `hdx/`, `wd/`. They are the evidence layer. A manifest with URL, retrieval date, licence and sha256 per file is still to be written.
- **Dev seed root:** `.dev/seed/` is where generated seed CSVs go, laid out like `seed/` (`data/<scope>/<domain>/<table>.csv`). It is empty apart from a `.keep` file. No generator script has been written yet.
- **Tools:** `.dev/seed-tools/pack.sh` archives `.dev/seed/` to `.dev/seedpacks/<name>-<UTC time>.tar.gz` with a `.sha256` file. `.dev/seed-tools/restore.sh <pack> [--apply]` checks the checksum, unpacks, validates and loads. Both were created but only `pack.sh` was smoke-tested, and only on the empty root.

### How the engine already supports a different seed root (verified in code)
- `mzizi-manifest data [root]` validates every CSV under `<root>/data/` against the database schemas. It accepted `.dev/seed` and reported column errors for a test file.
- `uv run mzizi-engine seed --root <folder> [--apply]` loads CSVs from a different root. Without `--apply` it runs inside a transaction and rolls back, so counts are exact.
- `MZIZI_SEED_ROOT` overrides the default root for the manifest package. `register-files` also takes `--root`.
- The loader writes to whichever database `DATABASE_WRITE_URL` names, so a seed pack can be loaded into any PostgreSQL database that has the migrations applied. No engine change was needed.
- Loading is repeatable: row ids derive from table and natural key, a row is written only if a column differs, nothing is deleted, and unlisted database rows are reported only.

### Portability steps
1. Prepare or change CSVs in `.dev/seed/`.
2. `uv run mzizi-manifest data .dev/seed` must pass.
3. `.dev/seed-tools/pack.sh <name>` makes the archive and checksum. Copy both to backup storage or another machine.
4. On any machine with the repo: create the database, `bun run db migrate`, `bun run db roles`, set `DATABASE_WRITE_URL`, then `.dev/seed-tools/restore.sh <pack>` (dry run) and again with `--apply`.

Because `.dev/` is git-ignored, the pack in `.dev/seedpacks/` is the only copy until it is copied elsewhere. Copying packs off the machine, and the generator scripts, is therefore a required step. The generators should later live under the repository's `scripts/` folder (a decision for the owner).

### What the first statistics slice taught us
A test `statistics.indicators` CSV was rejected for missing required columns `description`, `is_derived`, `measure_kind_code` and `topic_code`. The current reference values contain statistics dimensions (sex, age group, residence) and indicator roles, but no topic, measure-kind or unit values were found. The generator must therefore also emit new reference schemes and values for topics, measure kinds and units. A dev seed root must be a superset of the repository seed plus these additions, so the build starts by copying `seed/` into `.dev/seed/`. Both points are findings, not implemented.

### Planned generators (not written)
| Step | Reads | Writes |
|---|---|---|
| Source and file registration | raw downloads | source product, edition, artifact rows (hash, licence), and filesystem registration |
| Country features | `countries.csv` | features, names, identifiers (ISO3, geoBoundaries id) |
| World Bank | WDI bulk CSV per country | reference values, `statistics.indicators`, `statistics.observations` with a file-level citation |
| WHO | GHO indicator files | the same tables, with sex and age mapped to existing dimension values |
| GeoNames, Wikidata | zips and SPARQL results | names and identifiers on features, Wikidata dates and types |
| geoBoundaries | GeoJSON files | a small seed record (hash, source) plus a loader job that writes geometries, not a CSV |
| OSM | `.pbf` files | `osm2pgsql` staging schema in a scratch database, then candidate and review |

A World Bank observation cannot carry a citation per row at this size. The plan is one citation per indicator file, which depends on whether the citation table allows file-level citations. That is unverified.

## Part 2. Plan: move seed out of Git (not started, not approved)

### Idea
Seed data should not live in the code repository. It lives outside the main code, first in `.dev/` on the owner's machine, later in managed storage such as Google Cloud Storage once data is official. For now everything is test data and can stay local.

### Not decided
- Whether the existing `seed/` (reference values, countries, Kenya geography, Kenya legal text, terms, columns, engine configuration) moves too, or only bulk public data. Small, hand-curated reference files may be better kept in Git where reviews happen. This needs an owner decision.
- Which storage and what access rules.
- Who may publish a seed pack as official, and how it is reviewed.

### Proposed phases
1. **Local only (now).** Bulk public seed lives in `.dev/seed/`, backed up as packs. `seed/` is untouched.
2. **Pack format and catalogue.** A seed pack is a versioned-by-hash archive with a manifest listing every CSV, its sha256, its source and licence. Per the repository's versioning rule, no version numbers are invented; a pack is identified by content hash and date.
3. **Storage.** Packs are uploaded to managed object storage (Google Cloud Storage is the owner's example). A small pointer record in the repository, naming the pack hash and location, would say which pack a checkout uses. The existing large-input design (`011-design-references-to-large-seed-inputs.md`) already proposes exactly this pattern for large files.
4. **Fetch and load.** A command downloads a pack by hash, verifies it, and runs the existing `mzizi-engine seed --root`.
5. **Decide the fate of `seed/` in Git.** Only after phases 1 to 4 work, and only with explicit owner approval, move or remove committed seed files. Nothing is removed before then.

### Risks
- Anything outside Git is not reviewed or versioned by Git. Hash-addressed packs and a catalogue replace that, and must be kept.
- `.dev/` is local. If it is lost before packs are copied elsewhere, the prepared seed is lost, although downloads can be re-fetched.
- Tests and CI that read `seed/` would need a pack or fixtures. `seed/_fixtures/` is for tests only and should stay.
- Official data needs licence, attribution and review records that the pack catalogue must carry.
- The owner approval rules in `AGENTS.md` and `seed/README.md` apply to anything added to `seed/`. They need updating once the policy changes.

### Documents to update when approved
`AGENTS.md` (Seed inputs), `seed/README.md`, `.docs/rules/codes.md` if paths change, and the root docs where seed is described.

## Related
- [Global open data expansion, long-term goal](global-open-data-expansion.md)
- `seed/README.md`
- [Design references to large seed inputs](../../todo/_archived/2026/11/2026-11-24-schema-and-manifest-redesign--600e51/011-design-references-to-large-seed-inputs.md)
