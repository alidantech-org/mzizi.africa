---
{id: TSK-0F4398B91D38,name: Consolidate system seed inputs under root seed,type: task,status: completed,priority: medium,created_at: 2026-11-08T08:05:54.867Z,updated_at: 2026-11-08T08:18:28.718Z,depends_on: [TSK-1AC8F3754DAE],order: 1536,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-08T08:05:59.835Z},{from: in-progress,to: completed,at: 2026-11-08T08:18:28.718Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0F4398B91D38/1794125159839-start,started_at: 2026-11-08T08:06:00.739Z,end_ref: refs/tracking/TSK-0F4398B91D38/1794125908725-end,ended_at: 2026-11-08T08:18:28.718Z,summary: {files: 182,insertions: 5729,deletions: 144}}]}}}
---

# Consolidate system seed inputs under root seed/

## Goal

Move every real system seed input into the repository-root `seed/` registry, describe where each artifact came from and who may read it through folder-level metadata, update every loader to read the new locations, and prepare a functional manifest with S3 object mappings, so the filesystem milestone (task 02) can register seed artifacts with honest provenance instead of rediscovering scattered files. This is relocation and preparation only: it does not implement the filesystem schema, upload to S3 or import old database contents.

## Context

The user approved a clean rewrite (decision `DEC-CLEAN-REWRITE-MZIZI-NEW`) and established `seed/README.md` on 8 November 2026. Seed inputs are currently scattered: the new auth baseline lives inside SQL migration `rewrite/0002_auth_functions.sql`; Kenyan curated catalogues, reference vocabularies, policies, patterns and research registries live under `source/backend/engine/database/fixtures/`; the data engine keeps import mappings under `source/backend/engine/data/mappings/` and site-structure bundles under `pilots/` and `samples/`; the legacy Python service keeps CSVs in `api-legacy/**/_seed` and `_archives`. Readers include `engine/database/src/{seeds,catalogue,governance-catalogue,patterns,media}.ts`, the API fixture loader, and Python modules `landmarks.py`, `crawl.py`, `patterns.py`, `probe_domains.py`, `structure/validate.py` and the importers' `MAPPINGS` constants.

New requirement: origin and access are recorded at folder level in a machine-readable descriptor (`_folder.yaml`), with deterministic inheritance, explicit file overrides only when necessary, non-public default, explicit authorization for public access and no silent weakening of a parent's restriction. Artifact role, acquisition class, preparation method, access class and scope are separate dimensions. Historical provenance must survive a move, so the manifest lock records the effective classification, the descriptor it came from, checksum and generator information; current folder access and preparation provenance have different lifecycles. Nothing is uploaded: S3 mappings are prepared only (bucket `mzizi`, region `us-east-1`, only `public/` anonymous, existing credentials, no new infrastructure, existing objects untouched).

Dependencies: auth task `TSK-1AC8F3754DAE` (completed). Blocks filesystem task `TSK-3EA8C40B0F60`. Test-only fixtures (`fixtures/neutral-model`, `engine/data/tests/data`, `engine/data/samples`) stay beside tests and are classified, not moved. Legacy `api-legacy` CSVs are superseded legacy inputs and stay until the legacy service is removed; duplicates are resolved explicitly in the inventory.

## Acceptance checklist

- [x] Produce a relocation inventory (old path, new path, purpose, preparation method, consumers, manifest entry, validation result) and an explicit duplicate/conflict decision list, covering auth, reference, governance, patterns, site structures and mappings, curated research, embedded code payloads and generated artifacts.
- [x] Move the auth baseline out of SQL into `seed/global/auth/` and make `rewrite.ts init` apply it idempotently; move the older reusable seeds under `seed/global`, `seed/system` and `seed/ke`, update every TypeScript, Python, test and script consumer, and remove the old copies.
- [x] Define and document `_folder.yaml` inheritance and access rules, implement a validator that resolves effective metadata, rejects weakened access, unauthorized public folders and missing origin classification, and covers every adopted file.
- [x] Author functional `seed/manifest.yaml` and generated `seed/manifest.lock.json` (checksums, effective metadata, loader, target, dependencies, S3 key mapping), keep the disabled example separate, and verify dependencies and loader allowlist resolve.
- [x] Run focused checks (auth init and idempotency, representative loaders, manifest validation, no stale path references, no secrets or large generated files), update `seed/README.md`, AGENTS/README and improvement documents, refine filesystem task `TSK-3EA8C40B0F60`, run `task validate`, commit and push to develop.

## Progress and findings (2026-11-08)

**Moved.** 44 move operations (git mv, history kept): 6 reference and 2 policy files, the office patterns, 3 research registries and 11 curated Kenya seeds from `engine/database/fixtures`; 17 importer mapping bundles (58 YAML files) from `engine/data/mappings`; 3 site-structure bundles from `engine/data/pilots`. The auth baseline was extracted from SQL into `seed/global/auth/` (5 files) and is applied by `src/seed-auth.ts` from `rewrite.ts init`. No copies, symlinks or fallbacks remain at the old paths; a test scans `source/` for stale paths.

**Layout.** `seed/{global,system,ke}` with 19 `_folder.yaml` descriptors; `seed/manifest.yaml` (48 entries, release 2026-11-08.1), generated `seed/manifest.lock.json` (checksums, effective metadata, `relocated_from`, S3 key mappings, `not_uploaded`); the disabled example moved to `seed/examples/`.

**Consumers updated.** TypeScript: `fixture-loader.ts` (`seedRoot`, `readSeed`), `config.ts`, `seeds.ts`, `catalogue.ts`, `governance-catalogue.ts`, `patterns.ts`, `media.ts`, `assessments.ts`, API neutral specs, three DB tests. Python: new `seedroot.py`, 17 importers (`MAPPINGS_ROOT`), `landmarks.py`, `crawl.py`, `patterns.py`, `probe_domains.py`, `structure/validate.py`, `office_holders.py`, `test_batch.py`, `test_structure.py`.

**Duplicates resolved.** File formats: authoritative `seed/global/reference/media-formats.json` (44 codes checked identical in MIME and extension to the legacy CSV and its byte-identical `_archives` copy); legacy `directories.csv` pair not adopted; fixtures sharing keys with seeds stay test-only. Details: `.docs/docs/SEED_RELOCATION_INVENTORY.md`.

**Verification.** `bun src/seed.ts check` (48 entries, no errors, 96 classification warnings listed as review gaps); `bun test test/seed-registry.test.ts test/rewrite-auth.test.ts` (34 pass); DB tests orpp-seed, priority-publishers-seed, patterns, governance-catalogue, gate and 18 of 19 engine tests pass (the engine drift check reports website-schema differences unrelated to this change); 134 Python tests that read the moved files pass; `task validate` clean.

**Gaps.** Preparation is `unknown` for reference, mappings, policy, `ke/reference` and site bundles (needs review); `ke-iebc-catalogue.json` has no loader and two catalogues are read only by tests; non-auth loaders still write the legacy Dryv-entity database; nothing is uploaded to S3. Filesystem requirements are recorded in task `TSK-3EA8C40B0F60`.
