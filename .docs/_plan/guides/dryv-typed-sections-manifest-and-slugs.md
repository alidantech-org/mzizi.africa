---
id: DOC-DRYV-TYPED-SECTIONS-MANIFEST-SLUGS-20261118
name: Dryv work - typed sections, generation manifest and slug registry
type: documentation
tags: [dryv, typed-sections, manifest, traceability, slugs, plan]
extra: {status: in_progress_investigation, date: 2026-11-18, dryv_repo: "codepot/dryv"}
---

# Dryv work: typed sections, generation manifest and slug registry

Owner decision (2026-11-18): start Dryv work with **typed sections and the manifest/gates**, and **the slug registry** alongside. This note records what reading the Dryv repository found **before any change**, because it changes the scope estimated in [DRYV_CAPABILITY_PLAN](../../design/architecture/DRYV_CAPABILITY_PLAN.md).

## 1. Findings from reading Dryv (verified in the repository)

- **Dryv repo:** `~/Projects/personal/alidantech-org/codepot/dryv`, branch `develop`, its own `AGENTS.md` (work only on `develop`, typecheck and format before tests, `v1alpha1` evolved in place, no parent-relative imports, Task in `.tasks/`). At the time of reading it had **uncommitted changes by the owner** in five engine files (generation context, theme composition, projection structural, interaction facets, a regression test). Those are not mine: they must not be committed, reverted or mixed into my commits, and any generation run uses the engine as it stands in that working tree.
- **Typed sections need no Dryv change in authoring.** The TypeScript author already supports nested schemas, arrays, `maybe`, records, tuples, literals and **discriminated unions** (`dryv.property.union(discriminant, members)`, with generation templates for `union` in the packs for TypeScript types, class-validator DTOs, OpenAPI and JSON Schema). The 82 `dryv.dynamic()` fields in `dryv/contracts/apps/api/insights.ts` were an authoring shortcut in Mzizi, not a missing Dryv capability. Remaining risk, to be tested: whether every pack used by Mzizi (NestJS, TypeScript SDK, Dart SDK, Python models) emits correct code for unions and nested arrays.
- **Provenance already exists, but outside the project.** Dryv records every generation in its state directory (`state/projects/<project>/state/last-applied.json`, 44 MB, 2,906 artifacts): for each file its path, pack, template, ownership (`managed`), the expected current digest and the applied digest, plus a trace of the generation (`dryv.generation-evidence`). It is machine-local and not committed. The gap is **exporting a compact manifest into the Mzizi repository and gating on it**, not building provenance.
- **A verification gate already exists:** `bun run dryv:verify` runs generation with `--check` for the database app ("fail when generated output is not current"). It needs to cover every app (api, engine, web, dev, app, SDKs), and `bun run check` must run it.
- **Generated files carry no header** naming their contract and generator (sampled SDK and NestJS files). Adding a header is a pack change, and the manifest makes it optional.

## 2. Revised scope (replaces the estimates for capabilities 1 and 9)

| Item | Where the work is | Dryv engine change? | Revised size |
| --- | --- | --- | --- |
| Typed sections | author the nested and union schemas in `dryv/contracts/apps/api`, replace `dynamic()`, regenerate, then delete the hand parsers | none unless a pack fails on unions or nested arrays | M (many schemas, mechanical) |
| Manifest | script in Mzizi that reads Dryv's last-applied evidence and writes a compact committed manifest (path, pack, contract source, digests, engine and pack revisions) | none, if the evidence carries the source contract path; otherwise a small export in Dryv | S-M |
| Gates | `bun run check` runs `dryv:verify` for all apps; a pattern check for hand edits to managed files using the manifest digests; forbidden-pattern lint | none | S |
| Slug registry | author `source.slugs` (with parent scope, namespace, language, period, canonical pointer) and `source.slug_relations` in `dryv/contracts/schemas/postgres/source.ts`; add routable tables to a new `RoutableTable` enum; resolver as a composed read | maybe partitioning (not found in packs) | M |

## 3. Method and safeguards

1. Read-only first: run `dryv:verify` to learn whether the committed generated output matches the contracts today (results in the Task record).
2. Author changes in Mzizi contracts on `develop`; regenerate with `--conflicts keep` only after a clean working tree and with the known `app.module.ts` overwrite restored; review the diff before committing.
3. Dryv repository changes only when a test proves a pack or engine gap, in separate commits that exclude the owner's uncommitted files.
4. Everything recorded in a Task and the design documents; this note is updated with each finding.

## 4. Open questions

1. May regeneration run now against the Dryv working tree that contains your uncommitted engine changes, or should those be committed or stashed first?
2. Is it acceptable to commit regenerated SDK and API output in one commit per contract change (large diffs)?
3. Should the manifest live at the repository root (`dryv/manifest.json`) or beside each generated folder?

## 5. Progress (2026-11-18)

- `bun run dryv:verify` (database app) passed before any change: "Generated output already matches the workspace" (5 diagnostics, none blocking).
- **Slug registry authored** in `dryv/contracts/schemas/postgres/source.ts`: `source.slugs` (country, namespace, slug, parent slug, language, canonical slug, subject keys, years, code) and `source.slug_relations`. Parent is the parent's own slug row (a real foreign key), so paths are walked, re-parenting is a new row, and history is the closed row. Uniqueness is among active rows only (partial unique index over country, namespace, parent, slug, language). No title column.
- Checks passed: TypeScript typecheck of the database contracts, `database:doctor` READY, `database:compile` exits 0 with the new tables and the partial index in the compiled output.
- **Not done:** generation (SQL, migration, API module, SDKs, engine models), the `SubjectTable` and `codes.json` sync (`bun run tables:sync`, which needs generated tables), the three seed schemes (`src.slug.namespace`, `src.slug.relation`) which need owner approval per `seed/README.md`, design-doc updates (source table count, `SOURCE_FILESYSTEM_GEOGRAPHY.md`), and the routable-table subset.
- **Typed sections:** not started; the sections' shapes are specified by the hand-written types in `source/apps/web/lib/site/insights.ts` and `governance/contracts.ts`; first candidates are `IndicatorSeries`, `IndicatorMap`, `PlaceStatistics`.
- **Manifest:** not started; source of truth is Dryv's `last-applied.json` evidence.

## 6. Removals authored (2026-11-18)

`audit.ts` and `facts.ts` were deleted from `dryv/contracts/schemas/postgres`, their imports and groups removed from `apps/pgsql/index.ts`, and the `ListFacts` operation with `FactList` and `FactsInput` removed from `apps/api/insights.ts` and from the `app` and `web` consumer lists. Typecheck of both project configurations passes and `database:compile` and `contracts:compile` exit 0. Not generated yet: the generated SQL, API, engine and SDK output, the migration, `tables:sync` and the hand-written consumers still reference facts (see FEATURE_REGISTER section E).

## 7. Database generation and a Dryv fix (2026-11-19)

All planned schema additions were authored (see DATABASE_CHANGES_20261119) and generated for the `pgsql` app. Generation first failed with `HTTP 413: Maximum request body size 1048576 exceeded` from the Jinja template server: aiohttp's default 1 MiB request limit was exceeded by the render request once the schema grew. **Dryv fix (uncommitted in the Dryv repository):** `source/plugins/templating/jinja/src/dryv_jinja/server/app.py` now sets `client_max_size` to 256 MiB (override with `DRYV_JINJA_MAX_REQUEST_BYTES`); the running template server had to be restarted. The other template servers (handlebars, liquid, mustache) were not checked for the same limit. Generation then needed `--conflicts overwrite` for ten managed files whose digests differed from the last applied output (the committed generated files had been reformatted); verification (`dryv:database:verify`) passes after the final run.
