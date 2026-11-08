---
{id: DOC-ARCHIVE-RELOCATION-INVENTORY,name: Archive relocation inventory (2026-11-08),type: documentation,tags: [archive,inventory,rewrite]}
---

# Relocation inventory

Source commit: `3e2f8c5d7a6f12d1c44851951e752a0ccf1db7fb`. Columns: old path, archive location (relative to this folder), reusable knowledge, new active owner, remaining gap. "Active owner" paths are in the live tree.

| Old path | Archive location | Reusable knowledge | New active owner | Remaining gap |
|---|---|---|---|---|
| `source/backend/api-legacy/app/routes/*` (models, routes) | `source/backend/api-legacy/app/routes` | Domain concepts for governance, elections, finance, offices, people, procurement, statistics; response shapes | Dryv contracts (`dryv/`) and later domain schema tasks 03-04 | Not ported; legacy geography seed documented as unfit |
| `api-legacy/alembic/versions/*` and `_seed/*.csv` | `source/backend/api-legacy/alembic`, `.../_seed` | Seed table designs and curated Kenyan rows | Re-prepared as `seed/ke/*`; designs in `.docs/improvements/schema-redesign/` | Remaining CSVs are reference only |
| `api-legacy/app/config/s3_service.py` | `source/backend/api-legacy/app/config/s3_service.py` | Path-style SigV4 S3 client settings, retry config, bucket check | `source/packages/filesystem` (`S3ObjectStore`, presign host rules) | Multipart/large uploads not implemented |
| `api-legacy/scripts/*`, `_archives/*` | `source/backend/api-legacy/scripts`, `.../_archives` | HTML table to CSV conversion ideas, old route experiments | `source/packages/scraping` (links, selectors) | Table conversion not extracted |
| `engine/data/src/mzizi_data/fetch.py`, `compliance.py`, `gate.py` | `source/backend/engine/data/src/mzizi_data/` | Polite identified fetching, limits, challenge detection, fail-closed gate | `source/packages/source` (`PoliteFetcher`, `evaluate`) | Loading assessments/dossiers from a database (`check_collection`) is not rebuilt; waits for the source schema task |
| `engine/data/.../files.py` | `source/backend/engine/data/src/mzizi_data/files.py` | Put-by-hash, derived results, store/folder/version rows | `source/packages/filesystem` (hashing, stores, registry port, deduplication) | Writing the old `filesystem` tables is intentionally not ported; PostgreSQL registry adapter waits for task 02 |
| `engine/data/.../structure/{selectors,extract,transforms}.py` | same under `structure/` | Deterministic css/xpath/jsonpath/regex selection, field extraction, transform library | `source/packages/scraping` | Family inheritance stays in manifest |
| `engine/data/.../structure/{bundle,effective,sections,validate}.py` and `schemas/site/v1` | same | Bundle loading, family overlay, section rules, JSON Schema + semantic + secret-lint validation | `source/packages/manifest`; schemas in `source/schema/site/v1` | Dry-run needs more examples; section vocabulary is Kenya-biased |
| `engine/data/.../extractors/{pdf,ocr,geojson}.py` | `.../extractors/` | PDF text/tables with OCR-needed reporting, Tesseract subprocess OCR, GeoJSON diagnostics | `source/packages/extraction`, `source/packages/ocr` | Budget-table realignment (`tables.py`) not extracted |
| `engine/data/.../extractors/*` (iebc, ngcdf, ppf, parliament, wikipedia, worldbank, ocds, legal, gazette, tenders, ...) and `imports/*` | same | Per-source parsing knowledge, edge cases, confidence conventions | Manifests and mappings in `seed/` (`seed/system/mappings`, `seed/ke/sites`) and database records | Deliberately not carried forward as Python; each needs a manifest-driven design |
| `engine/data/.../{jobs,runner,pipeline,candidates,batch,register,registry}.py` | same | Postgres queue, run lifecycle, candidate staging, batch submit | `source/backend/engine` (executor, outbox, jobs/runs/events) | Candidate staging/validation/promotion not rebuilt: pipeline milestone |
| `engine/data/.../{crawl,probe_domains,patterns,fingerprint,semantics,dedup,quality,reinforcement,measure,derived,place_research,wikimedia,landmarks}.py` | same | Crawling, DNS/host probing, fingerprinting, document semantics, entity matching, quality findings | Not yet owned; candidates for source/pipeline tasks | Not extracted |
| `engine/data/tests/*` | `.../tests` | Behavioral specs for the above | Ported tests live beside each package; fixtures in `seed/fixtures/` | Tests for unported code remain here only |
| `engine/database/rewrite/*.sql` | `source/backend/engine/database/rewrite` | Auth schema DDL and functions | `source/schema/database/auth` (active) | none |
| `engine/database/src/{rewrite,seed-auth,seed-manifest,seed,config}.ts` | `.../src/` | Auth init/reset/bootstrap, seed apply, manifest/folder metadata validation and lock | `source/packages/database` (migrate, loaders.auth, cli), `source/packages/manifest` (seed_registry) | none |
| `engine/database/test/{rewrite-auth,seed-registry}.test.ts` | `.../test/` | Auth and seed-registry checks | `source/packages/database/tests`, `source/packages/manifest/tests` | none |
| `engine/database/src/{gate,assessments,claims,staging/*,promotion,...}.ts` and `migrations/*` | `.../src/`, `.../migrations/` | Gate parity, assessments, staging, promotion, claims; Dryv-entity DDL | Gate rule in `source/packages/source`; the rest awaits the schema/pipeline milestones | Staging/promotion/claims not rebuilt; legacy migrations are historical and not replayed |
| `source/backend/files/README.md` | `source/backend/files/README.md` | Evidence-artifact custody responsibilities | `source/packages/filesystem` | Retention/archival lifecycle not implemented |
| `source/backend/intelligence/README.md` | `source/backend/intelligence/README.md` | AI-assisted classification/cleaning tool families | `source/packages/agent` (proposal and tool interfaces) | No provider or classification tools yet |
| `source/backend/contracts/*` (moved, not archived) | n/a | Exchange schema, targets, examples, gate vectors | `source/schema/contracts`, `seed/fixtures/contracts` | none |
| `source/backend/api` (moved, not archived) | n/a | NestJS product API with auth | `source/backend/api` | none |

## Manifests and seeds inside the archive

The old bundles (`pilots`, `samples`, `mappings`, `fixtures`) were already moved to `seed/` before the archive was made; the archive holds no authoritative seed payload. `api-legacy` CSV seeds remain here as historical reference and must not be loaded.
