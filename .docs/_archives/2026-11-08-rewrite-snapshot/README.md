---
{id: DOC-ARCHIVE-REWRITE-SNAPSHOT,name: Archive of pre-rewrite implementations (2026-11-08),type: documentation,tags: [archive,historical,rewrite]}
---

# Archive: implementations replaced by the package-first rewrite (snapshot 2026-11-08)

**Historical. Non-authoritative. Not executable.** This folder preserves the implementations that existed on `develop` at commit `3e2f8c5d7a6f12d1c44851951e752a0ccf1db7fb` (the commit before the restructuring), under their original relative paths, so their knowledge is not lost. Nothing here is imported, built, generated, packaged, tested or executed by the active system. Do not copy code out of it wholesale: read it, take the lesson, and implement it in the active owner named in [RELOCATION_INVENTORY.md](RELOCATION_INVENTORY.md).

## What is here

| Archive path | What it was |
|---|---|
| `source/backend/api-legacy/` | The inherited Python FastAPI political-governance service: SQLAlchemy models, Alembic seed migrations, CSV seeds, S3 service, scripts. |
| `source/backend/engine/data/` | The old Python data engine (`mzizi_data`): site-structure validator, polite fetcher, collection gate, extractors, importers, job queue, runner, crawler and its tests. |
| `source/backend/engine/database/` | The old Bun/TypeScript database engine: Dryv-entity migrations, seeds, staging/promotion, gate, plus the first auth rewrite tooling (now ported). |
| `source/backend/files/`, `intelligence/`, `engine/README.md`, `engine/scripts/`, `README.md` | Architecture scaffolds and the old backend grouping. |

## How to use it

1. Look up the capability in the inventory. The active owner says where the idea now lives (a package, the engine, `seed/`, `source/schema/` or a later milestone task).
2. If the remaining gap column says the knowledge is not yet reimplemented, read the archived code to learn the edge cases, then design the new version against the documented contracts. Do not restore the old file.
3. Never point an import, script, workspace, generator or test run at this folder. Root test configuration excludes `.docs`.

## What to learn and what not to copy

Learn: politeness and fail-closed gate rules; why extractors return diagnostics instead of repairing silently; the structure-bundle validation rules; that idempotent, hash-based registration needs recovery paths; the evidence-first staging and promotion shape; which legacy seed data was unfit (see `.docs/docs/audits/LEGACY_SEED_FINDINGS.md`).

Do not copy: source- or country-specific Python extractors and importers (that knowledge belongs in manifests and database records); code that writes the old Dryv-entity `filesystem`/`website`/`staging` tables; fixtures or data embedded in code; ID- or data-preserving compatibility; Bun seed tooling that duplicates the Python packages; the legacy FastAPI service as an API.

## Validation note

Taskcode validates every Markdown file under `.docs`. Thirteen archived Markdown files gained a minimal metadata block and one broken relative link was rewritten as text so the archive is compatible with the supported frontmatter and link validation; no code was changed. Active tasks keep full validation.
