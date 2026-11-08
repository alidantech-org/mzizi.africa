# AGENTS.md — Mzizi Africa Repository Contract

This file defines how coding agents and contributors should reason about the Mzizi Africa repository.

## 1. Start with the purpose

Before changing architecture or domain behavior, read:

1. `.docs/docs/WHY.md`
2. `.docs/docs/STORY.md`
3. `.docs/docs/ARCHITECTURE.md`
4. `.docs/docs/DATA_LIFECYCLE.md`
5. `.docs/docs/DOMAINS.md`
6. `.docs/docs/MIGRATION.md`

Mzizi is an **evidence-first African heritage, history, geography, culture, linguistics, governance and political intelligence platform**. The goal is to research public/historical material and structure it cleanly while preserving provenance, time, place, uncertainty and version history.

## 2. Do not collapse the architecture

The system has intentionally separate responsibilities:

- public application
- research/dashboard application
- file management service
- data extraction engine
- intelligence/AI layer
- database management engine
- canonical database
- NestJS API

Do not place a responsibility in the nearest convenient service merely because code already exists there.

### Hard boundaries

- **Data extraction is not the API.**
- **AI classification is not data extraction.**
- **AI output is not canonical truth.**
- **Database migrations/seeding are not API responsibilities.**
- **File storage is not database record storage.**
- **The current Python FastAPI service is not the target API.**
- **The future product API is NestJS.**

## 3. Treat the current Python API as migration source material

`source/backend/api-legacy` contains valuable domain design, schema work, migrations, seeds and extraction-related code inherited from the previous political-governance project.

Do not deepen it as the long-term public API unless explicitly instructed.

When replacing it:

1. inventory useful models and behavior;
2. extract domain concepts and constraints;
3. move migration/seeding concerns into the database management engine;
4. move extraction concerns into the data engine;
5. move file concerns into the file service;
6. move intelligence concerns into the intelligence layer;
7. expose approved domain contracts through the NestJS API;
8. only remove old code after equivalent responsibilities are accounted for.

See `.docs/docs/MIGRATION.md`.

## 4. Evidence is part of the data model

Every meaningful historical or political claim should be able to answer:

- Where did this come from?
- What source artifact supports it?
- When was the source obtained?
- What location/time period does the claim describe?
- Was it directly extracted, inferred, manually curated or AI-assisted?
- How confident are we?
- Is the claim disputed?
- Which version is current?
- What changed from the previous version?

Never design domain records as if provenance can be added later as an optional afterthought.

## 5. Preserve raw evidence

The system must distinguish:

```text
raw source
  -> extracted representation
  -> normalized candidate data
  -> classified/linked/evaluated staging data
  -> reviewed/versioned canonical data
```

Do not overwrite raw source artifacts with cleaned text or normalized records.

## 6. Time and place are first-class

Historical truth changes by context.

Whenever applicable, designs should represent:

- `valid_from` / `valid_to` or equivalent historical validity;
- observation/retrieval time separately from historical validity;
- changing names and aliases;
- changing boundaries;
- changing parent/child geography;
- historical polities that do not map neatly to current states;
- uncertain or approximate dates;
- source-specific claims and disagreements.

Do not force pre-colonial or colonial history into today's national borders when the historical evidence does not support that model.

## 7. AI must be attributable and reviewable

The intelligence layer may assist with:

- classification;
- entity extraction;
- normalization;
- deduplication;
- entity resolution;
- relation suggestions;
- source comparison;
- contradiction detection;
- quality evaluation;
- confidence suggestions;
- summaries for reviewers;
- enrichment proposals.

AI-produced data must retain enough metadata to identify the method/model/tool invocation and inputs that produced it. AI must not silently mutate canonical records.

## 8. Domain naming should explain why it exists

Mzizi domains are not arbitrary database modules. Each should support the wider story:

- heritage/culture preserves identity and material/intangible history;
- history establishes chronology and change;
- geography establishes place and boundary evolution;
- linguistics reveals language relationships and movement;
- migration explains population movement and settlement;
- colonial influence links historical disruption/administration to modern institutions;
- governance explains formal authority;
- politics explains competition and organization around power;
- law explains the legal basis of authority;
- finance/debt/procurement reveal how public power uses resources;
- evidence/provenance makes the whole system trustworthy.

Read `.docs/docs/DOMAINS.md` before introducing new top-level domains.

## 9. Documentation is part of implementation

If a change alters architecture, data lifecycle, domain ownership or product purpose, update the corresponding `.docs` file in the same work.

Do not leave architectural truth only in code or chat history.

## 10. Prefer explicit contracts between layers

Services should communicate through documented, versionable contracts rather than importing each other's internals.

Examples:

- file artifact descriptor;
- extraction job/result;
- candidate record;
- intelligence evaluation;
- provenance/evidence link;
- canonical record version;
- API DTO/event.

These contracts should eventually live in shared packages or schemas once implementation begins.

## 11. Applications consume knowledge; they do not define it

`source/apps/www` and `source/apps/web` should consume stable domain contracts.

Avoid putting canonical domain rules only in React components or frontend-specific types.

## 12. Repository hygiene

- **Branch: `develop` only.** Work directly on `develop`. Never create, rename or switch to another branch, and never create git worktrees. See `.docs/rules/branching-and-task-usage.md`.
- Do not add or modify `.github/**` unless explicitly requested.
- Keep generated files, local databases, build outputs, virtual environments and dependency directories out of source control.
- Prefer small, meaningful commits when making repository changes.
- Preserve working functionality while migrating responsibilities.

## 13. Decision test

Before adding a feature, ask:

> Does this help Mzizi research, preserve, structure, verify, connect, version or explain African historical and present-day knowledge?

If the answer is unclear, document the reason before expanding the platform.

## 14. Task workspace (mandatory)

Using the Task CLI is **mandatory, not optional**. Every unit of work must be planned, started, recorded and completed through `task` (see `.docs/rules/branching-and-task-usage.md`). Work not tracked in Task is not done.

Use the repository Task workspace in `.docs` to organize implementation activities. The root `task.yaml` points the CLI to that workspace. Keep current planning and project guidance in sync:

- `.docs/todo/` — Task groups and tasks (created and changed only through the `task` CLI);
- `.docs/docs/` — project overview, repository map, development setup, testing guide, and roadmap;
- `.docs/rules/` — coding, testing, security, and Git rules;
- `.docs/guidance/codex.md` — agent workflow that supplements this file.

This section supplements the repository contract above; it does not replace or weaken it.

<!-- BEGIN TASK MANAGED TASK-TOOL -->

## Task workspace

This project manages its work with Task (`taskcode`; `task` and `tc` are aliases). Task records, documents, decisions and handoffs live in `.docs/` as Markdown files with YAML frontmatter. Read `.docs/README.md` for how the tool works. Using Task is mandatory.

- **Write detailed tasks.** Task rejects scaffold-only or thin files: one task file per piece of work, with a Goal, Context and an Acceptance checklist of at least a few `- [ ]` steps ("task create --body-file"). Groups need detailed `goal.md` and `plan.md`. Read `.docs/rules/task-writing.md` before creating work, and update the same file in follow-ups.
- Tick checkboxes with `task check <id> --item N | --section "Heading" | --all` instead of hand-editing.
- Create and change tasks through the CLI (`task create`, `task update <id> --status in-progress`) rather than keeping a separate TODO list. Do not hand-edit `id`, `status_history` or other managed frontmatter.
- Use `--json` for machine-readable output; commands exit non-zero on failure, and outside an interactive terminal they require explicit arguments instead of prompting.
- Moving a task to `in-progress` records the project's file changes automatically (with or without Git); `task changes <id>` shows what the task changed.
- Deleting is recoverable only briefly: `task delete <id> --yes` moves items to the OS temp folder; restore with `task undelete <trash-id>`. Prefer `task archive` for work that should be kept.
- Run `task validate` after editing anything inside `.docs/`. Every Markdown file there needs valid frontmatter.
- **Branch rule:** work only on `develop`; never create branches or worktrees (`.docs/rules/branching-and-task-usage.md`).
- Record meaningful decisions in `.docs/decisions/` and agent handoffs in `.docs/handoffs/`.
<!-- END TASK MANAGED TASK-TOOL -->

## Root seed input convention (user direction, 2026-11-08)

Read `seed/README.md` before adding any curated or AI-prepared seed data, baseline auth definitions, site structure, folder/file-type catalog, pattern definition or seed-specific source artifact. Keep all system seed inputs in root `seed/`, with global/system/jurisdiction separation and a manifest describing recognized DB loader/target, dependencies, content identity and S3 registration. Runtime loaders and contracts retain their existing code ownership. Do not introduce scattered per-service seed payloads or duplicate sources of truth. Do not treat the disabled example manifest as executable. Existing payload relocation/runtime adoption is not yet implemented. Synthetic test-only fixtures may remain beside tests; anything applied as a real system seed follows the root convention. Only `public/` in bucket `mzizi` is anonymously readable; other prefixes remain private. The disposable database rewrite does not authorize deleting existing S3 artifacts.
