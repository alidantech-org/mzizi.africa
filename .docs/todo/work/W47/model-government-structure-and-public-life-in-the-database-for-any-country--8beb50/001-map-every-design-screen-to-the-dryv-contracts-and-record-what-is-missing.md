---
{id: TSK-66884B9CFE4E,name: Apply the approved schema change inventory to every Dryv contract and generated model and prove it works,type: task,status: completed,priority: medium,created_at: 2026-11-19T09:53:15.133Z,updated_at: 2026-11-19T11:45:44.473Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-19T11:09:12.622Z},{from: in-progress,to: completed,at: 2026-11-19T11:45:44.473Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-66884B9CFE4E/1795086552638-start,started_at: 2026-11-19T11:09:14.197Z,end_ref: refs/tracking/TSK-66884B9CFE4E/1795088744482-end,ended_at: 2026-11-19T11:45:44.473Z,summary: {files: 398,insertions: 30500,deletions: 1956}}]}}}
---

# Apply the approved schema change inventory to every Dryv contract and generated model, and prove it works

## Goal

Turn the approved inventory into working code. When the owner has approved `.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md` (or an amended version), change every affected Dryv contract, regenerate the single PostgreSQL schema and all generated models, rebuild a scratch database, and prove with real queries that the new structure holds Kenya and a second, structurally different country without any Kenya literal in a contract. This task replaces the earlier plan of writing a requirements map first: the map is now section B and D of the inventory, and the proof is the work done here.

## Context

The inventory lists 17 new tables (reference.templates and instances; governance.positions, procedures, powers, functions, assignments, promises, fulfilments; politics.contributions; civic.partners, variations, officials; statistics.components; source.disputes and contenders; community.replies), changes to 16 existing tables, about 28 new vocabularies and the generated-output consequences. Contracts live in `dryv/contracts/schemas/postgres/`; `_subjects.ts` is kept in step by `bun dryv/tools/sync-tables.ts`. Naming follows `.docs/rules/database-naming.md` (one-word plural tables, real foreign keys across schemas). Unstructured material uses `filesystem.contents` and `filesystem.media`. Generation is `bun run dryv:database:generate` and writes `source/backend/database/sql/schema.sql`, `migrations/0001_init.sql`, `.snapshot`, the Python row models under `source/backend/engine/src/mzizi_engine/api/schemas/postgres/` and `source/schema/database/*.schema.json`. Dryv cannot yet produce change-aware migrations (DRYV_GAPS gap 1), so the pre-release recipe is regenerate, reset the one scratch database, reseed. The working tree holds uncommitted statistics changes; preserve them.

## Method

Work table by table in dependency order (reference, geography, official, governance, politics, civic, finance, statistics, source, filesystem, legal, community), one commit-sized step each, running generation after each group. Where a rule the pack cannot generate appears (exactly-one across several columns, acyclic self references, conditional requirements) record the exact failure in DRYV_GAPS and keep the intended rule in the contract. Move readers of removed columns (`offices.office_kind_id`) in the same work: the NestJS insights reads, `source/apps/web/lib/site/insights.ts` and `scripts/dev/dev_seed/`.

## Acceptance checklist

- [x] Owner approval of the inventory is recorded in DEC-SCHEMA-CHANGE-INVENTORY-APPROVED-20261119; confirm it is in `.docs/decisions/`, listing every table, column and vocabulary approved and any refused.
- [x] Author every approved new table and column change in the Dryv contracts with descriptions, indexes, foreign keys and rules; run `bun dryv/tools/sync-tables.ts`.
- [x] Generate; the generation check passes and the diff contains only approved objects; the contract audit (`dryv/tools/audit-contracts.ts`) passes the naming rules.
- [x] Reset the single scratch database from the generated schema; confirm every constraint and index exists and drop extra scratch databases.
- [x] Move every reader of a removed or renamed column and regenerate the API, engine models and SDK types without hand edits.
- [x] Load, in the scratch database only, hand-written test rows for Kenya and one other country covering a pattern expansion, a seat rule, a multi-step power, a joint-venture contract with a variation, a graded ownership link, a promise with a media row and a content row, a dispute, a reply, and a candidate domain; run the queries each task specifies (vacant seats, expected versus verified, chain of removal, supplier concentration, promise with no record, as-of lookups).
- [x] Record results and every Dryv gap found; update DATABASE_CHANGES-style change note and the design documents.
- [x] Run `bun run check` and `task validate` and report any pre-existing failure accurately.

## Progress (19 November 2026)

- Authored the approved inventory in `dryv/contracts/schemas/postgres/` (reference, geography, official, governance, politics, civic, finance, statistics, source, filesystem, community) and moved the API contract's office reads to position titles (`dryv/contracts/apps/api/governance.ts`). `legal.effects` needed no change (already a subject carrier).
- Generated with `bun run dryv:database:generate`, `dryv.ts generate --app api --app engine --conflicts overwrite --yes`, `bun run catalog`; reassembled the release stream (`bun run db assemble`, `subject-integrity`); 17 new tables, 165 tables total, 154 subject tables. The contract checks (`dryv` `bun run check`) pass.
- Deviations for owner review are in section G of `SCHEMA_CHANGE_INVENTORY_20261119.md` (position title column, optional domain source and status, confidence property).
- Moved readers: nine hand-written SQL reads in `source/backend/api/src/modules/{insights,locality}` now join through `governance.positions`; the dev seed builds positions; the web app's facts import points at the experience action; two stale insights `list-facts` files were deleted.
- Proof on scratch database `mzizi_test` (rebuilt from the new release stream): `scripts/dev/model_proof/` loads Kenya and South Africa test rows and runs the queries. Results: completeness meter (3 expected, 1 verified), seat rule check (Kenya 3 of 3 governor offices, South Africa 1 of 2 premier offices, a gap), judge appointment chain in step order, national root feature for both countries, supplier concentration (94.3 percent), award at 111 percent of estimate with a single bidder, officeholder-owner signal published only for verified ties (the 55 percent inferred tie stays out), donor-before-award at 282 days, joint venture with a signatory, a promise with a recording moment, a transcript, a proposed link and a "none published" coverage row, a dispute with both claims kept, a right of reply, a candidate host with no source, and as-of lookups. Constraints rejected bad rows (exactly-one product, exactly-one holder, office without a position, a subject that does not exist).
- Full dev seed loaded into the scratch database (407,262 rows) and the API served place officials, the governance tree, the leaders tree, search and institutions from it.
- Dryv gaps found: DRYV_GAPS 74 to 77 (enum not checked in SQL, conditional rules, duplicate offices per position and unit, cross-country consistency).
- `bun run check` result: contracts and the touched web import are clean. Failing before and unrelated to this work: the 800-line limit on `dryv/contracts/apps/api/insights.ts`, Ruff and Biome format and lint findings in other files (for example `scripts/dev/dev_seed/extra.py`), 7 mypy errors in `dev_seed/slugs.py` and `extra.py`, `.next` type noise in the web app, and 8 manifest tests that expect older `reference.values` and `reference.countries` columns. `uv run mzizi-manifest check` could not run (no `seed/manifest.yaml`).
