---
id: HANDOFF-REBUILD-RUN-20261125
name: Rebuild wave autonomous run handoff
type: handoff
tags: [rebuild, autonomous, dryv, database, api, web, handoff]
extra: {status: ready_to_start, wave: GRP-1E8DA9A0E58E, prepared_on: 2026-11-25}
---

# Handoff: autonomous run of the rebuild wave

**Read this whole document before doing anything.** It is the brief for one long, uninterrupted run that implements the approved database redesign, the API and the web app. The owner has approved the design and the way of working described here (25 November 2026).

## 1. Goal

Rebuild Mzizi from the contracts up, in this order, without stopping:

| Order | Task | What it delivers |
|---|---|---|
| 1 | TSK-D0EC3D8B6D47 | The approved design authored into `dryv/contracts/schemas`, with partitioning and descriptions that become SQL comments |
| 2 | TSK-70669AC571AA | The API redesigned in `dryv/contracts/apps`: schema-named modules, every query and type declared, cache rules, one frontend-mapping module |
| 3 | TSK-6065C44E5476 | Seed out of the codebase and Git; seed lives only in git-ignored `.dev/seed/`; engine and Python no longer use in-repository seeds |
| 4 | TSK-1265807A54E3 | A new local database built from a fresh baseline migration, partitioned, indexed and seeded |
| 5 | TSK-7BA66E947A39 | The NestJS API regenerated in the new format with Redis caching, measured faster |
| 6 | TSK-402D8C6A91DD | The real web app, server-rendered through the generated SDK, tested in the browser and measured faster |

TSK-75981BF08EA5 (UI/UX) is **not** part of this run. TSK-C61A06DEFCB9 (the design discussion) is complete.

Each task file in `.docs/todo/work/W48/rebuild-mzizi-from-contracts-up-schemas-apps-database-api-web-ux--a0e58e/` holds the full checklist, including an "Owner direction" section. The wave's `goal.md` and `plan.md` explain the why.

## 2. Sources of truth

1. **`.docs/design/data/FOUNDATION_REDESIGN.md`** is the approved design (sections 2–34, with ERDs). Where any other document disagrees, it wins. Do not reopen approved decisions.
2. **`AGENTS.md`** and **`.docs/rules/`**, especially `typed-code.md`, `api-modules.md`, `code-columns.md`, `versioning.md`, `web-navigation.md`, `loading-states.md` and `task-writing.md`.
3. **`.docs/design/data/DRYV_GAPS.md`**, section "Rebuild capabilities delivered": what Dryv now supports (partitioning, SQL comments, integrity checks, typed NestJS reads, writes and transactions, scoped Redis caching, TS/Dart response shapes). Update the local Dryv checkout (`~/Projects/personal/alidantech-org/codepot/dryv`) from its source repository and relink it before generating.

## 3. Owner directions for this run

- **Permissions:** the run has full permissions (bypass mode).
- **No commits.** Do not commit or push. The owner starts the run from a clean, committed tree and reviews every change afterwards.
- **Breakage scope:** until task 6, breakage is allowed **only** in `source/apps/`. Everything else in `source/` (backend API, engine, database, packages, `source/schema`, `source/sdk`) is your responsibility and must build, typecheck and pass its tests. Regenerate the Python engine schemas and models and `source/schema` from the new contracts.
- **Migrations start afresh:** create a **new, separate database** on the local PostgreSQL server; delete the old migration stream and generate **one new baseline** from the redesigned contracts. Never write migrations that continue from or acknowledge the old design. Record the new database's name and settings in the dev environment docs.
- **Seed:** seed files no longer need owner approval. Prepare and load seed freely from `.dev/seed/`; never commit seed data or seed code.
- **Descriptions:** where contracts use code comments to explain schemas, tables or columns, move the explanation into Dryv descriptions so it becomes SQL comments.
- **Module names:** follow `.docs/rules/api-modules.md`: modules named after schemas, no vague or overlapping modules (`explorer`, `insights`, `experience`, `locality`, `structure`, `ledger`, `interactions` go), and one module that maps system data into clean frontend shapes.
- **When blocked:** fix Mzizi contracts and local packs first. In extreme cases fix the problem in Dryv itself rather than stopping, following Dryv's own rules: **Dryv is neutral and must never gain Mzizi-specific behaviour.** Record every Dryv change in DRYV_GAPS.
- **Running services:** start the API, web and supporting services yourself when you need to test them, on their own ports. Never stop or reuse instances the owner started, never kill processes by name or command line, and stop only processes you started (by their pid).
- **Databases:** reset only the new rebuild database. Keep at most one scratch test database (`mzizi_test`) and drop any other you create. Never touch production or delete S3 artifacts.
- **Owner decisions:** when something genuinely needs the owner, write it in `.docs/handoffs/REBUILD-OWNER-QUESTIONS.md` (question, options, your recommendation, what you did meanwhile) and **continue with other work**. Never stop to wait.

## 4. How to work

1. **Start the run guard** (section 5) before any other step.
2. Take the tasks in the order of section 1. For each: `task start <id>`, work through its checklist top to bottom, and after each finished item run `task check <id> --item N` and add a `task comment <id> --text "…"` with what changed and the proof (command and result).
3. When a task's checklist is done and its acceptance items are proven, `task update <id> --status completed`, then start the next task.
4. Run the checks each task names (`bun run check`, the Dryv checks in `dryv/`, typechecks, tests, `task validate`) and report real results, including failures that existed before.
5. Keep docs in step with behaviour: when paths or behaviour change, update the affected README, design doc and links in the same step.
6. Before moving to the next task, re-read this handoff's section 3.

## 5. The run guard: no stopping mid-work

A Stop hook (`.claude/hooks/keep-going.sh`, configured in `.claude/settings.json`) refuses to let the run end while work remains. It is active **only** while `.dev/run/active` exists, so ordinary sessions are not affected.

- **Start it** at the beginning of the run:

  ```bash
  mkdir -p .dev/run && printf '%s\n' TSK-D0EC3D8B6D47 TSK-70669AC571AA TSK-6065C44E5476 TSK-1265807A54E3 TSK-7BA66E947A39 TSK-402D8C6A91DD > .dev/run/active
  ```

- While any listed task is not completed, an attempt to stop is refused with the next task and its first open item.
- **The only legitimate early stop** is a real blocker that no amount of work can get around (for example, a required service the run cannot start). Write it to `.dev/run/blocked` (what, why, what was tried) and to the owner-questions file; the guard then allows the stop.
- If several stop attempts in a row make no checklist progress, the guard lets the run stop to avoid an endless loop, and records that in `.dev/run/log`.
- When every listed task is completed, remove `.dev/run/active` and stop.

## 6. Finishing

At the end, write a closing section in this handoff: what was done per task, the proofs, what failed and why, open owner questions, and where the new database and services run.

## 7. Start prompt for the new chat

Paste this as the first message of a fresh session in this repository:

```text
Read .docs/handoffs/HANDOFF-REBUILD-RUN-20261125.md completely, then AGENTS.md and the rules it names.
Start the run guard exactly as its section 5 says, then carry out the rebuild wave tasks in the order of its section 1,
following every owner direction in its section 3. Track all progress with the task CLI. Do not commit.
Do not stop until every task in .dev/run/active is completed; put owner questions in
.docs/handoffs/REBUILD-OWNER-QUESTIONS.md and keep working.
```

## 8. Closing report (25 November 2026)

All six tasks are **completed** in the task CLI; each has comments with commands and results. Nothing is committed: the owner reviews the working tree.

| Task | What was done | Proof |
|---|---|---|
| TSK-D0EC3D8B6D47 schemas | 22 schemas / 202 tables authored from FOUNDATION_REDESIGN; identity-backed tables (composite kind FK), `_term` columns with scheme checks on `vocabulary.terms`, 18 partitioned tables (identity kind LIST, country HASH, month RANGE, evidence by subject table), descriptions as SQL comments. Local `postgres-sql` pack extended (partitions, comments, arrays, composite targets). Audit rewritten. | `dryv bun run check` and `database:check` pass; SQL applies with 1 205 column and 203 table comments; kind, FK and scheme checks proven; partition pruning by EXPLAIN |
| TSK-70669AC571AA app contracts | 19 schema-named API modules plus `frontend`; old vague modules and 37 hand-written `reads/` removed; cache classes; vendored `nestjs-persistence` pack; Python rows and `source/schema` regenerated | API IR 993 records; API typecheck clean; 15 352 API tests pass |
| TSK-6065C44E5476 seed | Seed data, tooling and seed code out of Git into `.dev/seed/`; engine seed loader and seed catalog removed; configured root `MZIZI_SEED_ROOT` | engine 222 tests pass; decision DEC-SEED-OUTSIDE-GIT-20261125 |
| TSK-1265807A54E3 database | New database **`mzizi_rebuild`**; old stream deleted; one baseline `0001_init.sql`; roles; `db refresh` and `db partitions` commands; seeded from `.dev/seed/rebuild/` | migrate/verify ok; plans 0.04–0.17 ms (database README) |
| TSK-7BA66E947A39 API | Regenerated with typed use cases, optional Redis (`REDIS_URL`), project wiring in `database.module.ts`, `src/implementations/` for screens | place page 343 ms (5 calls, old) → 38 ms (one call), 25 ms with Redis; same values |
| TSK-402D8C6A91DD web | Real app rebuilt as server components on the new SDK; server-drawn map; streamed regions | browser: first byte 8 ms, DOM ready 143 ms, 0 browser API calls |

**Failures and limits, reported as they are.** A browser test in `source/packages/browser` needs `MZIZI_USER_AGENT` (environment). The old web could not be rebuilt outside the repo for a browser baseline (hoisted dependencies); the before figure is the old API's five place-page reads. Law, parliament, elections, finance and source tables have no rows in the rebuilt database yet. Outlines are simplified per place, not as one shared topology. Sign-in is not wired (policy routes fail closed). Dryv gaps and one neutral Dryv engine change (`url` format in persistence validation, uncommitted in the Dryv checkout) are in DRYV_GAPS.

**Open owner questions:** Q1–Q11 in [REBUILD-OWNER-QUESTIONS](REBUILD-OWNER-QUESTIONS.md).

**Where things run (started by the run; stop by pid when done):** database `mzizi_rebuild` on `127.0.0.1:5432`; rebuilt API on `:8711` (pid in `.dev/run/api-8711.pid`, Redis-backed); web production build on `:3311` (pid in `.dev/run/web-3311.pid`); Redis container `mzizi-rebuild-redis` on `127.0.0.1:6390`. The owner's own instances and databases were not touched. Helper scripts: `.dev/run/gen.sh`, `plan.sh`, `api.sh`, `bench.py`, `sqltest.sh`.
