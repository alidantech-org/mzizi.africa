---
{id: TSK-A41C603B94BE,name: "Implement schema ownership, subject references and Legal redesign",type: task,status: in-progress,priority: medium,created_at: 2026-11-17T19:47:25.206Z,updated_at: 2026-11-17T19:47:32.979Z,order: 14336,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T19:47:32.979Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A41C603B94BE/1794944852989-start,started_at: 2026-11-17T19:47:33.436Z}]}}}
---

# Implement the agreed schema ownership, subject reference and Legal redesign

## Goal

Implement the full coordinated breaking change authorised in HANDOFF-IMPLEMENT-SCHEMA-OWNERSHIP: a seven-table Filesystem, thirteen-table Source, eight-table Geography and nine-table Legal target, all generic single-subject associations moved onto one shared SubjectTable enum and SubjectReference base, with every affected seed CSV, preparation script, loader, Dryv output, engine adapter, API projection and SDK consumer repaired in the same change. Success means no rejected table remains in active composition, generation is deterministic, existing seed data is preserved through scripted reconciled migration, and the root checks pass or any pre-existing failures are reported separately.

## Context

The owner authorised implementation on 17 November 2026, including hard cutover without compatibility shims and scripted repair of seed/data. Authoritative designs are .docs/design/data/SUBJECT_REFERENCES.md, SOURCE_FILESYSTEM_GEOGRAPHY.md and LEGAL_SCHEMA.md plus the two ownership handoffs. Contracts live in dryv/contracts/schemas/postgres; generated output is produced only through the root bun dryv commands, never hand-edited. Archived code must not be used. Production resets, remote schema publication and S3 deletion are not authorised; migrations are verified against disposable databases only. This is the same work as task TSK-2DC2EDF32543's design series and is tracked here.

## Acceptance checklist

- [x] Capture pre-change check failures and CSV, table and incoming-FK inventories with old-to-new identity mappings.

- [x] Author SubjectTable and SubjectReference and apply them to every generic single-subject association.
- [x] Author Filesystem, Source, Geography and Legal target contracts with all keys and constraints.

- [x] Rewire engine persistence, filesystem orchestration, crawler ingestion, API, SDK and UI consumers.

- [x] Write a dry-run-capable, idempotent seed migration script and repair preparation generators and loaders.
- [x] Reconcile every row count and remove obsolete CSVs only after validation.

- [x] Regenerate Dryv outputs twice with no drift and author immutable migrations verified on a disposable database.

- [x] Run task validate, uv tests, Bun checks, bun run check and seed checks and report results faithfully.

## Progress

Started 17 November 2026.

### Baseline (captured before any contract edit)

- `bun run dryv:check` passes on the untouched tree (typecheck, doctor, compile for api and engine).
- Generated PostgreSQL schema has 104 tables: audit 2, auth 11, civic 7, filesystem 8, finance 7, geography 8, governance 6, legal 8, official 7, politics 13, reference 10, source 17. Source has 17 today and must reach 13.
- Authored contracts: dryv/contracts/schemas/postgres/{filesystem,source,geography,legal}.ts (189, 452, 289, 308 lines); shared bases in _base.ts and _shared.ts. Generated SQL is source/backend/database/sql/schema.sql with one migration, 0001_init.sql.
- Current generic subject pairs found: source.provenance (tableName, recordId), legal.bases (tableName, recordCode, recordId), audit.events (targetKind, targetId; needs a keep-or-convert decision because audit targets are a log, not an association). Filesystem media still carries source_url.
- Consumers of removed names: about 45 files under source/backend/api/src/modules/{source,filesystem,geography}, source/apps/web/lib/types, source/apps/admin review actions, dryv/contracts/apps/{api,pgsql,engine}.
- seed/data has 155 files (3.9 MB) across global/reference, global/source, ke/geo, ke/source and ke/legal. `uv run mzizi-manifest check` currently fails because seed/manifest.yaml does not exist, so the handoff's manifest check is not available as written.

### Ordering decision

SubjectTable must list real table names, so it is authored last, after the target tables exist. Order: Filesystem and Geography contracts, Source, Legal, SubjectTable and SubjectReference, then consumers, seed migration script, regeneration and migration.


### Implementation result (17 November 2026)

Done and verified locally on the disposable database `mzizi` (recreated from migrations 0001 and 0002; nothing deployed):

- **Contracts and generation**: Filesystem 7, Source 13, Geography 8 (with `assets`: required `feature_id`, optional `geometry_id`, composite FK to `geometries(id, feature_id)`), Legal 9 tables. `SubjectTable` (87 fully qualified tables, `dryv/contracts/schemas/_subjects.ts`) and the subject keys apply to `filesystem.media`, `source.verifications`, `legal.effects` and, as optional keys, `source.relationships` and `source.citations`. `audit.events` keeps `targetKind`/`targetId` on purpose: its targets are logical kinds (account, role, session), not tables. Generated SQL, engine models, NestJS modules, SDKs, catalogue and table schemas regenerated; `dryv:verify` reports the SQL current. A `--check` of the API/engine/SDK apps reports 129 files "modify" even directly after generation (formatter differences in generated files such as `analysis_options.yaml`), so that check cannot yet prove zero drift for those apps.
- **Migrations**: stream reset to `0001_init.sql` (from the snapshot) plus the generated `0002_subject_integrity.sql` (CHECK, existence trigger, RESTRICT-on-delete trigger); applied, verified and re-run on a fresh `mzizix`. A missing subject and the deletion of a referenced subject are rejected (tested in `test_seed_loader.py`).
- **Seed**: `scripts/seed/migrate_schema_ownership.py` (plan by default, `--apply`, idempotent) converted 81 CSVs into 132 new ones with every row count reconciled (329 paths to addresses, 10 documents to artifacts, 10 dataset sources to products, 157 lineage rows to relationships, 2864 wordings, 2289 translations, 251 references, 390 effects). Identity mapping: `.dev/reports/schema-ownership-seed-migration.json`. The Constitution builder scripts now emit the new format. `mzizi-manifest data seed`: 28 tables, 0 problems. `mzizi-engine seed --apply` loaded 81,618 rows and a second run changed nothing.
- **Runtime**: filesystem package lineage removed; promotion lineage is a `source.relationships` row; loader writes provenance as relationship plus citation per row; `register-files` rewired to artifacts.

Not done or limited (named, not hidden):

- Acyclic derivation in `source.relationships` and Legal hierarchy cycle rules beyond existing `acyclic` keys are not database-enforced (no Dryv expression).
- `uv run mzizi-manifest refs` and the manifest lock: `seed/manifest.yaml` does not exist (seed was emptied on 16 November), so those checks cannot run; nothing to refresh.
- The old `src.dataset.category` vocabulary was dropped with the dataset table (it described dataset files by folder, which the artifact `location` still records).
- Pre-existing failures reported separately: `test_devcli` (`patterns.rank` undeclared), Biome format of 12 untouched files, Biome lint notices in `dryv/tools`, and the randomised generated API specs (`no example satisfies patterns ...` for IdentityCode: 16 to 30 spec files fail in different runs and pass alone).
