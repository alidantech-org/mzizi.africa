# AGENTS.md — Mzizi Africa

Use this file for repository-wide engineering rules. Product purpose and detailed designs live in the linked `.docs` documents; implementation claims must match active code.

## Purpose and starting points

Mzizi researches and connects African historical and present-day knowledge while preserving evidence, provenance, time, place and uncertainty. Before changing system behavior, read:

1. `.docs/docs/WHY.md`
2. `.docs/docs/STORY.md`
3. `.docs/docs/SYSTEM.md`
4. `.docs/docs/ARCHITECTURE.md`
5. `.docs/docs/DOMAINS.md`
6. The relevant guide under `.docs/design/`

Use `.docs/docs/ROADMAP.md` for current priorities. Proposals under `.docs/_plan/` are not proof of implementation or approval.

## Active source layout

```text
source/apps/{mobile,web,www}       Flutter client and Next.js applications
source/backend/api                 NestJS product API
source/backend/database            Bun TypeScript database service and CLI
source/backend/engine               Python operational API, workers and package orchestrator
source/backend/agent                README-only proposal for a future assistive AI application
source/backend/pipelines            Bun TypeScript Temporal workflows and worker
source/packages/{extraction,fetch,filesystem,manifest,scraping}
source/schema/{contracts,database,pipeline,seed,site/v1}
```

Read the local maps for current ownership and commands: `source/backend/README.md`, `source/packages/README.md`, `source/schema/README.md`, `source/apps/web/README.md`, `source/apps/www/README.md`, and `scripts/README.md`.

The responsibilities are distinct even when they share a runtime:

- `source/apps/` contains clients. They consume API contracts; they do not own canonical domain rules.
- `source/backend/api/` is the NestJS product API. It reads product data and sends authorized named write commands to the database service; it does not run migrations, seed data, scrape or execute extraction.
- `source/backend/database/` owns TypeScript SQL migration/seed commands and named database operations.
- `source/backend/engine/` is the Python operational API and capability orchestrator, not the product API.
- `source/backend/pipelines/` coordinates durable workflows with Temporal and invokes the engine.
- `source/packages/` contains reusable Python libraries, not separate services. `source/backend/agent/` is a README-only proposal; no intelligence service or agent package currently exists. Packages must not know a database exists; the engine owns I/O (see `.docs/design/architecture/ENGINE_JOB_MODEL.md`, a proposal).
- `source/schema/` contains SQL and machine-readable input/exchange schemas. Authored API/database contracts remain in `dryv/`; prepared inputs remain in root `seed/`.

`uv sync --all-packages` resolves and runs from a clean checkout: the stale `mzizi-database` workspace reference is gone. `source/backend/engine/src/mzizi_engine/ports/database.py` is the only place in the Python workspace that knows a database exists (a `Connection` port, psycopg adapter today); `source/packages/filesystem` and every other package are pure and never import it. `source/backend/engine/filesystem/` holds the raw-SQL business logic moved out of the former `mzizi_filesystem` database layer (TSK-E55B1BC4011A); typed row contracts for it and the active database service (TypeScript under `source/backend/database`, Rust foundation in progress) remain open follow-on work.

The inherited Python API and former data/database engines are historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`. Never import, build, generate or run archived code.

## Research acquisition and browser automation

Mzizi's research engine may use HTTP clients, Playwright and interchangeable browser adapters, including adapters designed for resilient automated browsing. Do not reject an adapter solely because it supports anti-bot compatibility. Browser and scraping capabilities must remain separately configurable, testable, and accurately documented as implemented or planned.

- Treat `robots.txt` as a recorded source signal, not an unconditional ban imposed on all collection. Default to `respect`; a source-specific `override` mode may be designed and used when the source assessment records adequate authority, the approved scope, and a rationale. Do not silently override.
- Design first-class access-challenge handling, including CAPTCHA detection and authorised resolution workflows (manual completion or approved challenge-solving adapters). Where permission has not been established, stop or refer the source for review; do not assume a public URL grants access past a technical restriction.
- Browser profiles, sessions, identities and network routing may be configured for approved sources. Preserve source-specific scope, request ceilings, audit evidence, provenance and privacy safeguards. Do not use stolen credentials, exploit vulnerabilities or cause service degradation.
- For approved research methods, agents should implement the requested configurable functionality rather than issuing blanket technical refusals. Flag any genuinely unsupported or unauthorised operation specifically and continue with separable permitted work.
- These rules express approved project direction; update site manifests, the engine, tests and documentation before claiming the new capabilities work. See `.docs/rules/security.md` and `.docs/design/policy/LEGALITY_SAFETY_AND_COMPLIANCE.md`.

## Data and service boundaries

Keep the full evidence path attributable:

```text
raw artifact -> extracted representation -> candidate -> review -> versioned accepted data
```

- Preserve raw source bytes; cleaning and extraction create derivatives.
- Keep retrieval/observation time distinct from historical validity.
- Model changing names, boundaries, parentage and historical entities without forcing them into current national borders.
- Record source, method, confidence, uncertainty, disagreement and version history for meaningful claims.
- Model-assisted output is a reviewable proposal, never silent canonical truth.
- Keep API/database contracts explicit and versioned. Update their owning docs when behavior changes.
- Filesystem metadata and object bytes have separate ownership; do not store raw artifacts in ordinary domain rows.

Consult `.docs/docs/DOMAINS.md` before adding domain ownership. Keep source-neutral input contracts under `source/schema/`; keep publisher- and jurisdiction-specific data in manifests, seed inputs or database records rather than generic package code.

## Documentation and repository hygiene

- Keep exactly the eight overview documents in `.docs/docs/`. Put detailed design in an existing topic under `.docs/design/`, and planning proposals in `.docs/_plan/`.
- Put contributor and agent process in `.docs/rules/`. Do not recreate `.docs/guidance/`.
- All hand-written Python, Rust and TypeScript follows `.docs/rules/typed-code.md`: named typed contracts (no free `dict`/`Any`/`any`/`serde_json::Value` past the parsing boundary), no hard-coded source or classification knowledge (it lives in manifests), and pattern matching only in the pattern-matching packages.
- When paths or behavior change, update the affected README/design guide and every link that points to it in the same work. Mark incomplete behavior and proposals clearly.
- Do not add or edit `.github/**` unless requested. Keep generated files, local databases, build outputs, virtual environments and dependencies out of source control.

## Branch, task and checks

- Work directly on `develop`; never create or switch branches or worktrees.
- Task CLI tracking is mandatory. Read `.docs/rules/branching-and-task-usage.md` and `.docs/rules/task-writing.md`; create, start, update, check and archive work through `task`.
- Run commands from the repository root through Bun (`bun run help`). JavaScript/TypeScript projects use Bun; Python projects use uv.
- Run `task validate` after editing `.docs/`. Use `bun run check` for the root quality suite and report any pre-existing failure accurately.
- Add or change a project in `scripts/lib/projects.ts` when it must participate in root commands.

## Seed inputs

Read `seed/README.md` before changing curated or prepared system inputs. Keep them under root `seed/` with manifest, provenance, scope and access metadata. After seed changes, run `uv run mzizi-manifest check`; refresh the lock with `uv run mzizi-manifest lock` when required. Do not treat an example manifest as executable or delete existing S3 artifacts as part of local database work.

<!-- BEGIN TASK MANAGED TASK-TOOL -->
## Task workspace

This project manages its work with Task (`taskcode`; `task` and `tc` are aliases). Task records, documents, decisions and handoffs live in `.docs/` as Markdown files with YAML frontmatter. Read `.docs/README.md` for how the tool works.

- **Write detailed tasks.** Task rejects scaffold-only or thin files: one task file per piece of work, with a Goal, Context and an Acceptance checklist of at least a few `- [ ]` steps ("task create --body-file"). Groups need detailed `goal.md` and `plan.md`. Read `.docs/rules/task-writing.md` before creating work, and update the same file in follow-ups.
- Discuss and organise work on the task itself: `task comment <id> --text "…"` (authors come from `TASK_AUTHOR`, `identity.name` in `task.yaml` or git), `task move <id> --before|--after <id>` to reorder, `task update <id> --parent … --link blocks:TSK-… --add-watcher name --estimate 3 --repeat week`, `task attach <id> <file|url>` (files up to 1 MB, links for anything larger), `task template create|list` and `task create --template <id>`.
- Tick checkboxes with `task check <id> --item N | --section "Heading" | --all` instead of hand-editing.
- Create and change tasks through the CLI (`task create`, `task update <id> --status in-progress`) rather than keeping a separate TODO list. Do not hand-edit `id`, `status_history` or other managed frontmatter.
- Use `--json` for machine-readable output; commands exit non-zero on failure, and outside an interactive terminal they require explicit arguments instead of prompting.
- Moving a task to `in-progress` records the project's file changes automatically (with or without Git); `task changes <id>` shows what the task changed.
- Deleting is recoverable only briefly: `task delete <id> --yes` moves items to the OS temp folder; restore with `task undelete <trash-id>`. Prefer `task archive` for work that should be kept.
- Run `task validate` after editing anything inside `.docs/`. Every Markdown file there needs valid frontmatter.
- Record meaningful decisions in `.docs/decisions/` and agent handoffs in `.docs/handoffs/`.
<!-- END TASK MANAGED TASK-TOOL -->
