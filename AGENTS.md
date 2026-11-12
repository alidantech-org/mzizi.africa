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
source/backend/pipelines            Bun TypeScript Temporal workflows and worker
source/packages/{agent,extraction,filesystem,manifest,ocr,scraping,source}
source/schema/{contracts,database,pipeline,seed,site/v1}
```

Read the local maps for current ownership and commands: `source/backend/README.md`, `source/packages/README.md`, `source/schema/README.md`, `source/apps/web/README.md`, `source/apps/www/README.md`, and `scripts/README.md`.

The responsibilities are distinct even when they share a runtime:

- `source/apps/` contains clients. They consume API contracts; they do not own canonical domain rules.
- `source/backend/api/` is the NestJS product API. It reads product data and sends authorized named write commands to the database service; it does not run migrations, seed data, scrape or execute extraction.
- `source/backend/database/` owns TypeScript SQL migration/seed commands and named database operations.
- `source/backend/engine/` is the Python operational API and capability orchestrator, not the product API.
- `source/backend/pipelines/` coordinates durable workflows with Temporal and invokes the engine.
- `source/packages/` contains reusable Python libraries, not separate services. `agent/` provides provider-neutral model and tool interfaces; no standalone intelligence service currently exists.
- `source/schema/` contains SQL and machine-readable input/exchange schemas. Authored API/database contracts remain in `dryv/`; prepared inputs remain in root `seed/`.

The Python workspace still references `mzizi-database` from the engine and filesystem package configurations, but there is no `source/packages/database/` member in the repository. The active database service is TypeScript under `source/backend/database`. Treat this as an unresolved packaging/configuration gap; do not describe the missing Python package as present or claim a fresh `uv sync --all-packages` works.

The inherited Python API and former data/database engines are historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`. Never import, build, generate or run archived code.

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
