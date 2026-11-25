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
source/sdk/{api-ts,api-dart}      Generated API client SDKs (Dryv)
source/sdk/ui/{web,flutter}            Hand-written components the generated screens assemble
source/apps/{app,web,dev,www}      Flutter app and Next.js applications (app and dev use Dryv frontend generation; web UI is handwritten, with a permanent isolated src/app/demo and fresh src/app/(app) real routes; source/package.json is the Bun workspace for the SDK and the Next.js apps). The earlier admin and mobile apps are deferred and removed (2026-11-18); `dev` is the administrative interface until an admin app is funded
source/backend/api                 NestJS product API
source/backend/database            Bun CLI, generated SQL and immutable migrations for the single PostgreSQL database
source/backend/engine               Python runtime: EngineRuntime, its HTTP front door and executor, persistence adapters, Dryv-generated code
source/backend/agent                README-only proposal for a future assistive AI application
source/packages/{browser,cli,crawler,extraction,fetch,filesystem,manifest,search}
source/schema/{database,engine,sources} and codes.json
```

Read the local maps for current ownership and commands: `source/backend/README.md`, `source/packages/README.md`, `source/schema/README.md`, `source/apps/www/README.md`, and `scripts/README.md`.

The [developer portal design](.docs/design/architecture/DEVELOPER_PORTAL.md) records the planned shared HTTP operations for the portal, CLI and agent. The current web app provides the review workbench.

The responsibilities are distinct even when they share a runtime:

- `source/apps/` contains clients. They consume API contracts; they do not own canonical domain rules.
- `source/backend/api/` is the NestJS product API. It reads product data and sends authorized named write commands to PostgreSQL with its own role; it does not run migrations, seed data, scrape or execute extraction.
- `source/backend/database/` owns the Bun CLI, SQL migrations and named database operations.
- `source/backend/engine/` is the Python runtime, not the product API: `runtime/` (the `EngineRuntime`, its operations registry, `assembly/` composition root, `policy/` collection gate, HTTP front door and executor), `persistence/` (PostgreSQL adapters, the MongoDB activity store and a vector-store skeleton), `cli/` (`mzizi-engine`) and Dryv-generated `api/`. Every capability lives in a package under `source/packages/` with one orchestrator; the engine root holds only folders.
- `source/packages/` contains reusable Python libraries, not separate services. `source/backend/agent/` is a README-only proposal; no intelligence service or agent package currently exists. Packages must not know a database exists, but may own network and browser adapters behind ports. The engine runtime and several capability packages are in place. The target adds generated repositories and organizes each capability package around one orchestrator and `features/<capability>/` (see `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`).
- `source/schema/` contains machine-readable input and exchange schemas. Authored API/database contracts remain in `dryv/`; prepared seed inputs live only in the git-ignored `.dev/seed/`.

`uv sync --all-packages` resolves and runs from a clean checkout. There is no database service: the engine and the NestJS API connect to PostgreSQL directly with their own roles, and `source/backend/database` holds only the SQL, migrations and Bun CLI (see `.docs/design/data/DATABASE_ARCHITECTURE.md`). The engine's PostgreSQL access lives in `source/backend/engine/src/mzizi_engine/persistence/` (adapters over the Dryv-generated row models; Dryv does not generate Python repositories yet). The filesystem is the `mzizi-filesystem` package (one `FilesystemOrchestrator`, no database knowledge); the engine only wires it and registers the `filesystem.*` operations on its runtime, and placement (folders, names, access, retention) is always decided by the caller of an operation, never hard-coded.

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
- Manifest and seed row codes follow [codes.md](.docs/rules/codes.md). Filesystem registry codes follow [the filesystem code rules](.docs/rules/code-columns.md).
- Never invent versions: no version folders, file-name suffixes or new version fields unless the owner asks. Read `.docs/rules/versioning.md`.
- API modules are named after the database schemas they own and never overlap; screen-shaped composition lives in one frontend-mapping module. Follow `.docs/rules/api-modules.md`.
- Web navigation, scroll position and URL state (place in the path, subject and selections in the query, `#section` in the hash, never lose scroll when switching place) follow `.docs/rules/web-navigation.md`.
- Every web screen paints first and fills in after: skeleton frame, `loading.tsx`, sized placeholders and per-region `Suspense`. Follow `.docs/rules/loading-states.md`; a feature without it is not finished.
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

Seed data and seed tooling live only in the git-ignored `.dev/seed/` and are never committed ([decision](.docs/decisions/DEC-SEED-OUTSIDE-GIT-20261125.md)). Code that reads column dictionaries, term lists or engine data takes its root from `MZIZI_SEED_ROOT` (default `.dev/seed`); nothing reads an in-repository seed. **Seed files no longer need owner approval.** Do not delete existing S3 artifacts as part of local database work.

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

<!-- dryv:begin -->
## Dryv

Read [the project Dryv guide](dryv/README.md), [agent instructions](dryv/AGENTS.md), and [the skills index](dryv/agents/README.md) before changing Dryv inputs or generated output. Configuration lives in dryv.yaml. Official documentation: https://dryv.alidantech.org/docs.
<!-- dryv:end -->
