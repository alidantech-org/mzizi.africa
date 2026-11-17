---
id: HANDOFF-EXTRACTION-RANKING-DRAFT-ROWS-20261117
name: Extraction, ranking, term intelligence and draft seed rows, handoff for the next chat
type: handoff
tags: [engine, extraction, ranking, patterns, seed, crawler, handoff]
extra: {status: ready_to_continue, date: 2026-11-17, base_commit: 0749b46e}
---

# Extraction, ranking, term intelligence and draft seed rows: handoff

Read `AGENTS.md` first. Work on `develop`, track work with `task`, never invent versions, never add seed files without the owner's approval, edit CSVs with scripts, no hard-coded source knowledge, no regex outside the pattern packages.

## 1. What was built (all committed on develop)

- **Crawl and download:** `site.watch` with reuse (`min_age_hours`), a Mongo download queue that never re-fetches tracked files, `download_kinds`, `passes`. Fixes this session: the run folder is created on first run (`evidence.save`); the apex (`_root`) and `www` share one site folder when the requested one holds no pages (`shared/layout.py`, `DevLayout.website`).
- **Extraction:** `extraction.folder` turns PDFs (text layer, OCR eng+swa, table competition, prose guard, stitching, alt-table CSVs) and now saved **HTML pages** (recursive under `pages/`, learned boilerplate, address from `state.json` when present) into `document.md`, `structure.json`, `report.json`, `tables/*.csv`, `assets/`. Skips unchanged files by SHA-256. Takes a `ranking` CSV and `top` N.
- **Ranking:** operation `patterns.rank` (`runtime/assembly/rank_site.py`) scores each file for kind, subject, impact with the deciding words, written to `ranking-pdf.csv`. Files without a text layer rank on filename only (reported as `has_text=false`).
- **Pattern intelligence (`source/packages/patterns`):** tokeniser, layered term lists (`seed/terms/{global,ke}`), column dictionaries (`seed/columns`), token-sequence pattern DSL, heading rules, `CellEngine`, column matcher (`propose-mapping`), `NameIndex` (exact/key/trigram/edit), code builder (dot = hierarchy, dash = words, `~` = qualifier), hashing embedder, near-duplicate detection, Qdrant vector tier with incremental sync (`index-sync`).
- **Draft seed rows (`draft-rows`):** entities, names (abbreviations, former names), identifiers, contacts, branding, parties, flows, procurements (placeholder when unknown), bids with `~bid number` qualifiers. Defaults live in `.docs/_plan/controlled-values/defaults/*.yml`.
- **Schema/contracts:** `language_code` everywhere, languages table, media/branding, coded tables, `~` in IdentityCode; migrations `0002`, `0003` written (NOT applied to the dev DB; needs a privileged role). Controlled values and branding/media kinds approved by the owner.
- **Jobs:** `.dev/jobs/{iebc,ppra,parliament,orpp-documents}.json` (git-ignored). Stages: `site.watch` -> `patterns.rank` -> `extraction.folder` (PDFs, ranked, `top` 150) -> `extraction.folder` (HTML pages, `suffixes [".html"]`, `site`). Run: `uv run --no-sync mzizi-engine run-job .dev/jobs/<name>.json` (MongoDB must be up).

## 2. Findings from the real runs

| Site | Result |
|---|---|
| ORPP | Full pipeline proven earlier: 277 PDFs scored, tables extracted, draft rows made from real tables. |
| IEBC | 148 PDFs ranked (28 HIGH). 40 extracted, 2,855 table CSVs. Rerun refetched nothing and skipped all 40 PDFs. 47 pages extracted to Markdown. |
| PPRA | 740 PDFs ranked (121 HIGH, 629 without text). 150 extracted after raising `top`. 60 pages. Top ranks: enterprise register, amendment regulations, county procurement plans. First Schedule table extracted as proper rows. |
| Parliament | 451 PDFs ranked (188 HIGH, 241 without text). Crawl hit its 600 s budget (557 pages visited), so it is incomplete. |

Content comes from both HTML pages (clean Markdown, links) and PDFs (Markdown plus tables as CSV). IEBC PDF extraction only covered 40 of 148 until `top` was raised (re-run not yet done).

## 3. What the engine is good at now

- Reusing saved crawls and extractions; resumable, hash-skipped, idempotent.
- Table extraction quality on text-layer PDFs, with weak tables flagged and alternates kept.
- Explainable ranking (kind, subject, words, confidence).
- Layered term/column knowledge, name and code matching, draft rows from real tables, reproducible codes.
- Clean quality gates: ruff, mypy, structure; about 600 tests passing at last full run.

## 4. What still needs work

1. **Duplicate crawling:** PPRA reported 3,884 hunted file links and downloaded 47 files with 0 pages fetched. Check whether those were already in `_root` under other names (queue keyed by URL vs file content). Parliament has two folders with pages (`_root` 45, `www` 254): merge them.
2. **Ranking scanned PDFs:** 629 (PPRA) and 241 (Parliament) PDFs rank on filename only. Plan: OCR the unranked ones, then re-rank. Slow, run in the background.
3. **Re-run IEBC and Parliament** at `top` 150; finish the Parliament crawl (raise `max_seconds`/`passes`).
4. **Run `propose-mapping` and `draft-rows` on IEBC/PPRA/Parliament outputs** (not done; only ORPP). PPRA tender/register tables and IEBC notices are the best candidates.
5. **Operation specs:** `patterns.rank` and HTML extraction have no unit tests yet; add them, plus a test for the twin-folder rule. Update the extraction README and `scripts`/docs for new params (`ranking`, `top`, `site`, `suffixes`). Update `SETUP.md` troubleshooting text (it lists only three phase-one operations).
6. **Ranking profile:** `.docs/_plan/orpp-sources/engine/docs/profile.yaml` is still a proposal; the `rank` default path points at it. Promote with owner approval. Ranking kinds are sometimes empty (e.g. funding-only hits); tune term lists.
7. **Migrations 0002/0003** not applied to the dev DB. Placeholder procurement codes must later point at the real tender code; former-name cells keep bracketed abbreviations.
8. **Embeddings:** only the hash baseline exists; real model undecided (HTTP adapters ready). Curated column dictionary covers about 29 of 608 seed columns.
9. **HTML pages:** extraction is generic (Markdown); there is no per-site structured field extraction from pages (e.g. IEBC office contacts) into draft rows yet.
10. **Mypy over test folders** reports many errors when run directly on `tests/`; the project gate (`bun run check`) is the reference.

## 5. How to continue

1. `docker start mongodb` (if needed), then `uv sync --all-packages --extra browser`.
2. Re-run the three jobs; inspect `.dev/runs/<site>/ranking-pdf.csv` and `text/`, `pages-text/`.
3. Do items 1 to 5 above, then show the owner draft-row examples from PPRA/IEBC for approval before touching `seed/`.
4. Run `task validate` after editing `.docs/`, then `bun run check`; commit on `develop`.

Last commits: `0749b46e` (rank operation, HTML extraction, crawler folder fix) and the two crawler twin-folder commits after it.
