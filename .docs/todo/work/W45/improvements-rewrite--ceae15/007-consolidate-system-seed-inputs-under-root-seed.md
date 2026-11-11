---
{id: TSK-0F4398B91D38,name: Consolidate system seed inputs under root seed,type: task,status: in-progress,priority: medium,created_at: 2026-11-08T08:05:54.867Z,updated_at: 2026-11-11T06:30:37.300Z,depends_on: [TSK-1AC8F3754DAE],order: 1536,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-08T08:05:59.835Z},{from: in-progress,to: completed,at: 2026-11-08T08:18:28.718Z},{from: completed,to: in-progress,at: 2026-11-11T06:30:37.300Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0F4398B91D38/1794125159839-start,started_at: 2026-11-08T08:06:00.739Z,end_ref: refs/tracking/TSK-0F4398B91D38/1794125908725-end,ended_at: 2026-11-08T08:18:28.718Z,summary: {files: 182,insertions: 5729,deletions: 144}},{base_ref: refs/tracking/TSK-0F4398B91D38/1794378637302-start,started_at: 2026-11-11T06:30:37.953Z}]}}}
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

## Second pass (2026-11-08, user direction): fixtures out of source code, Keycloak removed

`source/dev/keycloak` was deleted. Test fixtures, samples, example payloads and test data moved to `seed/fixtures/{neutral-model,site-structures,extraction,contracts}` (classified by `_folder.yaml`, role `test_fixture`, excluded from the manifest and never registered); the old `fixtures`, `samples`, `tests/data` and `contracts/examples` directories no longer exist and a test guards against their return. Kenya/site/Wikimedia data constants in `crawl.py`, `gapclose.py`, `wikimedia.py` and `census_breakdowns.py` moved to seed files read through `read_seed_json` (manifest now 53 entries). Verification: `seed check` clean, 43 DB/seed tests, 148 API auth tests, 285 Python tests pass. Not moved: source-specific importer code and publisher definitions embedded in it.

## Reopened 2026-11-11 — one manifest, one YAML lock, new folder layout (user direction)

The user restructured `seed/` on 11 November 2026 (commit `5b36c21`) and deleted `seed/manifest.yaml`, `seed/manifest.lock.json` and `seed/manifests/`. This section is binding and replaces the manifest and layout statements above. The bucket layout is governed by `.docs/decisions/filesystem-readable-keys.md`.

### Exact rules the implementation must follow

- Layout: `seed/global/`, `seed/system/`, `seed/countries/<jurisdiction code>/`. A jurisdiction scope must sit under `countries/<code>/`. Top-level names that begin with `_` (`_fixtures`, `_examples`) are local-only: classified, checked for secrets, never in the manifest, never uploaded.
- Exactly two manifest files exist: `seed/manifest.yaml` (authored) and `seed/manifest.lock.yaml` (generated by `uv run mzizi-manifest lock`). No `seed/manifests/` folder, no JSON lock, no second sync manifest kind. Site-structure `manifest.yml` files inside site folders are source contracts and stay.
- `manifest.yaml` states `logical_root: /seed` and `root_code: seed`, so `seed/global/auth/roles.csv` is registered as `/seed/global/auth/roles.csv` and stored at `internal/seed/global/auth/roles.csv`.
- An entry selects files by `path` or `glob` and names its `loader`; `media_type`, `key_columns`, `depends_on`, `consumers`, `notes`, `origin`, `versioning` (`versioned` default, or `current`) and `pin` (default true for versioned) are optional. Every uploadable file is covered by exactly one entry.
- Per-folder facts (role, acquisition class, preparation, access, scope, review, whether the content is a seed) live only in `_folder.yaml` and are inherited. `_folder.yaml`, `README.md`, `.gitignore` and the two manifest files are not uploaded.
- The lock lists, per file: entry, SHA-256, size, media type, access, versioning and the exact object key. It records no upload state; publication state lives in the registry.
- Every consumer of the old paths (`seed/ke`, `seed/system/mappings`, `seed/fixtures`, `seed/examples`) is updated; no compatibility alias is left behind.

### Acceptance checklist — single manifest (2026-11-11)

- [ ] `seed/manifest.yaml` covers every uploadable file under `global/`, `system/` and `countries/`, and `uv run mzizi-manifest check` reports no error.
- [ ] `seed/manifest.lock.yaml` is generated, tracked and reported stale by `check` when a file or the manifest changes.
- [ ] `seed/countries/ke/reports/` has a `_folder.yaml` that classifies it honestly as generated reports and logs, not seed inputs.
- [ ] The generic sync manifest kind, `source/schema/filesystem/sync-manifest.schema.json` and their tests are removed; a schema for the seed manifest exists under `source/schema/seed/`.
- [ ] Python and TypeScript consumers read the new paths and their tests pass.
- [ ] `seed/README.md` describes the layout, the manifest, the lock, the bucket mapping and the upload commands as they now are.
