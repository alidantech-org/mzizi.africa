---
{id: HANDOFF-SEED-CONSOLIDATION,name: Handoff - seed inputs consolidated under root seed,type: handoff,tags: [seed,filesystem,relocation]}
---

# Handoff: seed consolidation (task `TSK-0F4398B91D38`)

Date: 2026-11-08. Next milestone: filesystem `TSK-3EA8C40B0F60` (still planned).

## State

- Real system seeds live in root `seed/` (`global/`, `system/`, `ke/`). Folder metadata is in 19 `_folder.yaml` descriptors; `seed/manifest.yaml` (48 entries) and generated `seed/manifest.lock.json` describe every file with checksum, effective metadata, `relocated_from` and a mapping S3 key. Nothing is uploaded.
- Auth baseline: `seed/global/auth/` applied by `src/seed-auth.ts` through `bun src/rewrite.ts init`.
- Tooling (`source/backend/engine/database`): `bun src/seed.ts check|lock|report`; modules `src/seed-manifest.ts`, `src/seed-auth.ts`; tests `test/seed-registry.test.ts`.
- Loaders read `seedRoot` (`config.ts`, override `MZIZI_SEED_ROOT`) and `seedroot.py` (Python).
- Documents: `seed/README.md`, `.docs/docs/SEED_RELOCATION_INVENTORY.md`, AGENTS.md and README.md notes.

## For the filesystem task

Derive `global/filesystem/file-types.csv` and extension aliases from `seed/global/reference/media-formats.json`; implement `_folder.yaml` inheritance and effective provenance at registration; keep historical origin apart from placement; enforce S3 prefix per effective access; generate folders from reference-owned patterns. Details are in the task.

## Known gaps

Preparation `unknown`/needs review for reference, mappings, policy, `ke/reference` and site bundles; `ke-iebc-catalogue.json` has no loader; two catalogues are test-read only; non-auth loaders still target the legacy Dryv-entity database; legacy `api-legacy` CSVs remain with the legacy service.
