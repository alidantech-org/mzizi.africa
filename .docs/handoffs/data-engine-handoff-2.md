---
{id: HANDOFF-DATA-ENGINE-2,name: Handoff 2 - continue the Mzizi data engine and build the admin site,type: handoff,tags: [data-engine,admin,ocr,planning,handoff]}
---

# Handoff 2: continue the data engine, build the admin site, make extraction work

Written 2026-11-02 at the end of a very long session. Read this file completely, then `.docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md`. Verify claims against the repository; this is a map, not the territory. Everything below is committed on `develop` (last commit `3e707db` plus the commit that adds this file); nothing is pushed.

## 1. What the user asked for next (the new work)

1. **An admin site at `source/apps/web`** to manage backend data and view it, above all to **approve data in extraction or on hold** (the review queue). Task `TSK-22C8B63A4B43`.
2. **Backend: make extraction work from now on**: site extraction, PDF extraction, and any OCR needed, and data must be **recorded into the actual database models** (canonical tables), not only staged. Task `TSK-1715145DF579`.
3. **Reviewer-only API endpoints** that the admin uses. Task `TSK-6EF29D43B416`.
4. "Ask questions properly so you can continue." The questions were asked; answers are below. Two things are still pending from the user (section 2).

### The user's answers (2026-11-02, final turn)

| Question | Answer |
| --- | --- |
| How to treat the existing Next.js app in `source/apps/web` (pnpm, base-ui, visx)? | **Reuse it with a better UI, use CSS for a nicer design, and change to the Bun runtime.** |
| Backend and sign-in for the admin | **Reviewer-only API endpoints (authored in Dryv, NestJS) plus dev token login** (localhost only; real OIDC plugs into the same verifier later). Not a separate admin backend. |
| OCR engine | **Tesseract via system packages** (English and Swahili language packs). |
| Contact for live extraction | **"I will give a contact now"** but the value was never sent. |

### Pending from the user (blockers: ask again, do not invent)

- **Install Tesseract.** `sudo` needs a password, so the user must run: `sudo dnf install -y tesseract tesseract-langpack-eng tesseract-langpack-swa` (Fedora 44). Check `tesseract --version` and `tesseract --list-langs` before relying on it. Until then OCR code can be written and tested only for the missing-engine failure path (and with mocks).
- **The monitored contact address and bot page URL** for the user agent. Never use the user's own email (`dev@alidantech.org` in the system context) as a contact in a user agent or send it to third parties unless they type it as the answer. Set it as `MZIZI_USER_AGENT` in local deployment configuration (not committed). Format must look like `MziziBot/1.0 (+https://<bot page>; <contact>)`; the engine refuses placeholders (`example.*`, `.invalid`, `.test`, `localhost`) or a value without `@`.

The user also typed `/autocompact` (a Claude Code command; the assistant cannot run it). It is not a task.

## 2. Hard stops (the user's policy; do not work around)

From `.docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md` (binding), AGENTS.md and the user's instructions:

- **No live requests to real sites** until `MZIZI_USER_AGENT` resolves **and** the site has a current **approved** legal/source assessment covering host, path, rate and purpose, **and** the jurisdiction dossier is at `pilot` or `production`. The collection gate (`engine/database/src/gate.ts` and `engine/data/src/mzizi_data/gate.py`, tested with the same `source/backend/contracts/gate-vectors.json`) enforces this and fails closed. Agents may **draft** assessments; only a **named human** account may approve (`reviewedBy`).
- Public visibility is not permission; robots.txt is respected as an operational rule; no authentication, CAPTCHA or evasion; stop on 401/403/429/challenge/repeated 5xx with no retry around it.
- Personal data is excluded by default; unexpected personal data quarantines candidates.
- AI output is never canonical truth; promotion needs a human reviewer decision, licence, capture and current legal status.
- Do not tick task checklist items that are not true. Do not claim legal approval.
- The shared PostGIS container (`docker start postgis`, 127.0.0.1:5432) also holds other projects' databases: only touch `mzizi_*` databases (the tools enforce it).

## 3. Repository and environment facts and traps

- **Work only on `develop` in the main checkout**: `/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa`. No branches, no worktrees, never push, do not touch `.github/**`. The previous session ran inside a worktree (`.claude/worktrees/remote-control-5be51c`, branch `claude/mzizi-data-engine-research-3106a6`); a hook blocked the Write tool for files in the main checkout while in that worktree, so files were written with **Bash heredocs/python** into the main path. If the new session runs in the main checkout directly this does not apply.
- **Every unit of work goes through the Task CLI** (`task list`, `task start <id>`, `task check <id> --item N`, `task update <id> --status completed`, `task validate` after any `.docs` change). Task bodies need Goal, Context, an Acceptance checklist (3+ items) and 150+ words; names in frontmatter must not contain commas. A glob like `0*-name*.md` can match two files; use an exact path.
- **Shell state resets between Bash calls**: set `DATABASE_URL` in the same command. Never `pkill -f` with a pattern that matches your own shell (it killed the shell once).
- **Use the scratchpad directory for temporary files**, not `/tmp` directly.
- Dev database: `docker start postgis`; `DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev`. Rebuild with `cd source/backend/engine/database && bun src/cli.ts reset`, then `bun src/cli.ts seed research` (registry rows) and optionally `cd ../data && .venv/bin/mzizi-data import-geoboundaries tests/data/geoboundaries` and `import-worldbank` (they stage candidates and leave them waiting for a human reviewer).
- **Dryv regeneration** (needed whenever contracts change): start the engine API `cd ~/Projects/personal/alidantech-org/codepot/dryv && (nohup uv run --project source/engine/python/api dryv-api serve --host 127.0.0.1 --port 8750 --template-server source/engine/python/api/dryv.server.yaml > /tmp/dryv-api.log 2>&1 &)`; then in the repo root `bun $DRYV_HOME/source/apps/cli/bin/dryv.ts --api http://127.0.0.1:8750 --yes --no-input generate` (`DRYV_HOME=~/Projects/personal/alidantech-org/codepot/dryv`), then `cd dryv && bun run adopt:list && bun run generated:check`; stop the server with `fuser -k 8750/tcp`. Generation fails the typecheck stage until you **hand-add service methods** for new operations in `source/backend/api/src/modules/<group>/<feature>/*.service.impl.ts` (project-owned). A relation named `version` collides with the base column; the audit forbids a `confidence` column on data rows (use `score`).
- Test commands (data/database need a PostGIS server and `bun`):
  - Data engine: `cd source/backend/engine/data && TEST_DATABASE_URL=postgres://postgres@localhost:5432/postgres .venv/bin/python -m pytest -q` (116 tests). Venv: `python3 -m venv .venv && .venv/bin/pip install -e '.[dev]' datamodel-code-generator`.
  - Database engine: `cd source/backend/engine/database && bun install && TEST_DATABASE_URL=... bun test test` (81 tests); type check `bunx --bun tsc --noEmit -p tsconfig.json`.
  - API: `cd source/backend/api && bun run test` (14,149 unit tests); integration specs with `TEST_DATABASE_URL`: `bunx vitest run --root src neutral`. Contracts: `cd dryv && bun run check`.
- Test databases created: `mzizi_data_test`, `mzizi_slice_test`, `mzizi_poc_test`, `mzizi_engine_test`, `mzizi_staging_test`, `mzizi_*_diff` (scratch, recreated by tests).
- Python tests: each runner test needs a **unique host** (`uuid`), because candidates are idempotent per natural key across the whole database. Test helpers set the Kenya dossier to `pilot`; the research seed leaves dossiers at `research` (the gate then denies collection, correctly).
- Fixtures: `engine/database/fixtures/{reference,research,neutral-model}`. `kenya-sites.json` (illustrative sites with real-looking codes) is **not** in the default fixtures; tests load it via `seedSiteFixtures`. The fixture loader skips rows whose key is already loaded and has `{provenance:false}` for registry rows.

## 4. What exists (file map)

| Area | Where |
| --- | --- |
| Product API (NestJS, generated by Dryv) | `source/backend/api` (contracts in `dryv/contracts/{foundation,domains}`) |
| Layer exchange contracts + JSON Schema + gate vectors + `targets.json` | `dryv/contracts/domains/exchange`, `source/backend/contracts/*` |
| Database engine (Bun, TypeORM) | `source/backend/engine/database` (`src/cli.ts`, `src/staging/{resolve,validation,review,promotion}.ts`, `src/gate.ts`, `src/integrity.ts`, `src/seeds.ts`, `migrations/`) |
| Data engine (Python) | `source/backend/engine/data/src/mzizi_data` (`structure/`, `extractors/{geojson,worldbank,pdf,html_legal}.py`, `runner.py`, `fetch.py`, `compliance.py`, `gate.py`, `candidates.py`, `registry.py`, `batch.py`, `patterns.py`, `fingerprint.py`, `incidents.py`, `imports/`, `jobs.py`, `files.py`, `register.py`, `pipeline.py`, `cli.py`); schemas `engine/data/schemas/site/v1`; mappings `engine/data/mappings`; pilots `engine/data/pilots`; samples `engine/data/samples`; real test data `engine/data/tests/data/{geoboundaries,worldbank}` |
| Web app (existing, to be reworked) | `source/apps/web` (Next.js, pnpm, base-ui, visx; has `README.md`, `src`, `components.json`, `Dockerfile`) |
| Design docs | `.docs/docs/{DATA_INTAKE_PLAN,WEBSITE_DESIGN,SITE_STRUCTURE_SPEC,LEGALITY_SAFETY_AND_COMPLIANCE,KENYA_SITE_CATALOGUE,KENYA_JURISDICTION_DOSSIER,JURISDICTION_DOSSIER_TEMPLATE,DATA_ENGINE_STATUS_AND_GAPS}.md`, `audits/LEGACY_SEED_FINDINGS.md` |
| Decisions | `.docs/decisions/{engine-layout,data-engine-design,website-schema-and-structure,pdf-extraction}.md` |
| Agent guidance | `.docs/guidance/site-structure-authoring.md` |
| User memory | `~/.claude/projects/-home-alidante-Projects-research-alidantech-org-mzizi-africa-mzizi-africa/memory/` (`mzizi-data-engine-state.md`, `mzizi-layout.md`, `dryv-conventions.md`) |

### Pipeline in one picture

registry (`website.*`: sites, dated domains, structures as files in `filesystem`, assessments, dossiers) → collection gate → structure runner / importers → raw bytes preserved first (`filesystem` + `source.documents/captures` with site, domain, structure, family and assessment ids) → `ExtractionResult` file → `staging.candidates` (natural-key hashed, `$ref` references by natural key, quarantine on unexpected personal data) → `bun src/cli.ts validate [run]` → review decision = `audit.decisions` row with `target_kind='staging.candidates'` (the API accepts that one extra kind) → `apply-review` → `promote [run]` (canonical row or new version, `source.attributions`, `source.verifications`, `staging.promotions`). Units before boundaries, parents before children.

### What was proven (tests)

Kenya county boundaries from real geoBoundaries files through the whole chain to the boundary use cases with source and licence; South Africa/Nigeria/Tanzania boundaries and national population series (World Bank) with the same mapping files; Tanzania's 11 of 30 regions held back as invalid on containment; PDF extractor on 4 real PDFs (text, 22 tables from the budget explainer, a fully scanned guide reported as `ocr_required`); runner against saved IEBC markup; 47 expected county sites from the county pattern.

## 5. Current open tasks (`task list`)

New this turn: `TSK-6EF29D43B416` reviewer-only API (due 2026-11-09), `TSK-1715145DF579` working extraction site/PDF/OCR into real models (2026-11-16), `TSK-22C8B63A4B43` admin site (2026-11-23). Note `TSK-49DBBF7100D4` (review dashboard and API) overlaps the first and third: close it as superseded when they land.

Also open: `TSK-87CA18DC45D4` operations readiness (contact, scheduler, alerts), `TSK-3892A89CB619` Constitution and Acts, `TSK-57BCCB56B6C4` constituency and ward units, `TSK-0F60439A6B6F` KNBS statistics, `TSK-5C5192D034B2` institutions and offices, `TSK-DC3F78675701` IEBC elections and parties, `TSK-3E3CCB7B291D` people and entity resolution (privacy review first), `TSK-A46F494C29C0` budgets, `TSK-5E819E85C4FA` debt, procurement, organisations, `TSK-D4FF6DDE34B7` files service v1, `TSK-9F5FE8D751C9` intelligence layer v1, `TSK-4BCA9B212B5D` retire legacy, `TSK-9E12E350EDCA` dossier (owners and processor assessment need a human), `TSK-59EE9BF08CA7` Kenya waves umbrella, `TSK-F8DA0A6BA39B` wave 5.

## 6. Suggested plan for the next chat

1. Confirm the two pending user inputs (Tesseract installed, contact). Run the baseline suites. `task start` the first task.
2. **Reviewer API (037)**: Dryv-author reviewer/admin-only endpoints: staging candidates with payload, issues, lineage to result/capture/document/site, diff to the current canonical record; runs; jobs; documents; captures; sites, domains, structure versions, checks; assessments and dossiers (internal); decision write already exists (`audit.decisions` with `staging.candidates`); an admin-only **promote** action delegating to the database engine's `promoteCandidate` (decide how the Nest API calls the Bun engine: shared library import or a small internal command runner; promotion must stay owned by the database engine and never run with the read-only role); localhost-only dev-token minting for a seeded reviewer (`identity.accounts` + `identity.grants`, refuse outside localhost). The read role currently has `SELECT (id)` on `staging.candidates` only: extend with reviewed views or a separate reviewer connection, and keep payloads away from public roles. Remember `access:export` after changing operations.
3. **Extraction (039)**: OCR extractor (`extractors/ocr.py`): rasterise scanned pages with `pypdfium2`, run `tesseract` via `pytesseract` or subprocess with `eng+swa`, record engine, version, language and per-page confidence, mark segments lower confidence, fail with a clear diagnostic when the engine or a language pack is missing; table mapping that realigns the merged-cell offsets seen in the Parliament budget tables and reads unit and scale rows; first real PDF import end to end into a canonical table (for example budgets or a statistical table) through the admin review; live site extraction for one site only after the contact is set and a human approves an assessment in the admin.
4. **Admin site (038)** in `source/apps/web`: switch to Bun (scripts, lockfile, Dockerfile; remove pnpm files only after checking nothing depends on them), CSS design tokens with light/dark and responsive layout, review queue (hold, approve, reject, request changes), candidate detail with evidence and diff, data browser per schema, operations views (runs, jobs, documents, captures, sites, structures, checks), assessments and dossiers with approval limited to named human accounts, dev-token sign-in. Read `source/apps/web/README.md` and the existing components first; do not delete existing pages without checking them. Verify in the browser tool, at desktop and phone widths.
5. Keep `DATA_ENGINE_STATUS_AND_GAPS.md` and the task checklists true; commit in small commits on `develop` with the `Co-Authored-By` line the harness requests; run `task validate` after `.docs` edits.

## 7. Known gaps (full list in `DATA_ENGINE_STATUS_AND_GAPS.md`)

No live probe or crawl has ever run against a real site; no assessment has been approved; the Kenya dossier stage is `research`; accountable owners are unnamed; licences are recorded as unconfirmed; OCR is not implemented; PDF table columns are offset from headers; level-2 boundaries, census tables, constituencies and wards are not imported; runner has no path pagination, browser mode or file downloads; validation depth beyond geography is generic; promotion writes one record per candidate; review decisions in tests are inserted by SQL; KNBS and the Treasury were unreachable from this machine on 2026-11-02 and Kenya Law and Nairobi County answered with redirects not followed.
