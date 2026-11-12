# Mzizi Africa

**Mzizi Africa is an evidence-first African heritage, history, geography, culture, linguistics, governance and political intelligence platform.**

The project researches public and historical material, preserves the original evidence, extracts and cleans structured facts, records uncertainty and provenance, versions changes over time, and exposes the resulting knowledge through maps, timelines, research tools, public experiences and APIs.

Mzizi is not only a news site, museum, political dashboard, database, or AI application. It is the shared knowledge infrastructure beneath all of those experiences.

## Why Mzizi exists

Africa's history and present-day political reality are deeply connected, but the underlying information is usually fragmented across books, archives, government websites, PDFs, maps, colonial records, oral-history projects, datasets, election portals, legal documents and modern reporting.

That fragmentation makes it difficult to answer connected questions such as:

- What polity, kingdom, community or administration existed in this place at a given time?
- How did borders, names and administrative divisions change?
- Which languages and cultural communities moved through or shaped a region?
- How did migration, trade and colonial rule alter institutions and identities?
- Which constitution or law created a modern office, and who held it?
- How did a historical institution evolve into a current political structure?
- What promises, elections, budgets, debts, tenders or public actions followed?
- Which sources support each claim, and how confident should we be in it?

Mzizi exists to research and structure this information cleanly so that history, heritage and the current world can be explored as one connected, evidence-backed system.

Read [.docs/docs/WHY.md](.docs/docs/WHY.md), [.docs/docs/GOALS.md](.docs/docs/GOALS.md) and [.docs/docs/STORY.md](.docs/docs/STORY.md) first.

## Product surfaces

```text
mzizi.africa/
├── source/
│   ├── apps/
│   │   ├── www/        Public atlas, heritage museum and exploration experience
│   │   ├── web/        Research, curation, review and data-stewardship dashboard
│   │   └── mobile/     Flutter mobile client
│   ├── packages/       Reusable Python capabilities: filesystem, database, source, scraping, extraction, ocr, agent, manifest
│   ├── schema/         Input-artifact schemas and rewrite SQL (database/auth active, database/engine provisional)
│   └── backend/
│       ├── api/        NestJS product API (Dryv-generated, finished auth included)
│       └── engine/     One Python orchestration project: operational API, workers, events, callback outbox
├── seed/               Prepared seed data, patterns, manifests and test fixtures
├── scripts/            Thin commands calling package APIs
└── .docs/              Task workspace, product docs, and _archives/ (historical, non-executable snapshot of the replaced implementations)
```

The current repository is consolidated, but the target service architecture is intentionally broader than the code that exists today.

## Repository shape

The layout above is the active structure since the 8 November 2026 restructuring. Responsibilities: packages hold reusable capability, the engine orchestrates them, the NestJS API owns product decisions, canonical database writes and the UI contract, `seed/` holds prepared inputs, and `source/schema/` holds input schemas and rewrite SQL. Later milestones (domain schemas, source intelligence, pipelines) are not complete merely because their folders exist.

## Target system layers

Mzizi will separate responsibilities instead of treating one API as the whole backend.

```text
Sources / Archives / Government / Web / Datasets
                    │
                    ▼
             File Management
                    │
                    ▼
              Data Engine
      discovery • extraction • parsing
                    │
                    ▼
          Intelligence Layer / AI Tools
 classification • cleaning • linking • evaluation
                    │
                    ▼
       Versioned Evidence + Staging Records
                    │
                    ▼
       Database Management Engine
 migrations • schema • seeds • promotion • repair
                    │
                    ▼
            Canonical Mzizi Database
                    │
                    ▼
             NestJS API Layer
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      source/apps/www    source/apps/web
```

### 1. File management layer

Owns source files and their identity: PDFs, scans, images, maps, datasets, exports and other evidence artifacts. It records hashes, metadata, provenance and immutable/raw versions so structured data can always be traced back to evidence.

### 2. Data engine

A separate extraction and ingestion engine. It discovers sources, fetches permitted material, extracts text/tables/metadata, parses documents, normalizes basic representations and emits structured extraction results. Python is a natural fit for this layer because of its document, OCR, geospatial and data-processing ecosystem.

### 3. Intelligence layer

AI is an explicit tool-assisted intelligence layer, not the database itself. It helps classify, clean, reconcile, link, deduplicate, evaluate and enrich extracted material. Every AI-derived result must preserve evidence, confidence, method/model metadata and version history before promotion into canonical data.

### 4. Database management engine

A dedicated engine owns database lifecycle operations: schemas, migrations, seeds, reference data, validation, import/export, repair and controlled promotion of reviewed data. Database management must not be hidden inside the public API.

### 5. API layer

The long-term application API will be built in **NestJS**. It exposes stable product contracts over approved canonical data. The existing Python FastAPI service is not the target API architecture; its useful domain models, migrations, seed logic and research work should be extracted and migrated into the new system deliberately.

### 6. Applications

- **`source/apps/www`** — public-facing African atlas, heritage museum, historical explorer and evidence-backed knowledge experience.
- **`source/apps/web`** — internal/research workspace for source review, extraction review, curation, classification, corrections, publishing and governance intelligence.

## Knowledge domains

Mzizi connects historical and contemporary layers rather than isolating them:

- African heritage and culture
- History and historical periods
- Geography and changing boundaries
- Pre-colonial polities, kingdoms, states and communities
- Linguistics, languages and language families
- Human migration, settlement and mobility
- Trade routes, resources and economic networks
- Colonial influence and administrative transformation
- Independence, post-colonial state formation and institutional change
- Constitutions, laws and legal authority
- Governance structures, offices and institutions
- Political parties, movements and ideologies
- People, leaders, office holders and historical actors
- Elections, representation, candidates, results and manifestos
- Public finance, budgets, expenditure and revenue
- Public debt
- Procurement, tenders and contracts
- Diplomacy, conflict, alliances and major events
- Statistics and development indicators
- Sources, evidence, provenance, uncertainty and scholarly disagreement

See [.docs/docs/DOMAINS.md](.docs/docs/DOMAINS.md) for the reason each domain belongs in the same platform.

## Core principles

1. **Evidence first** — a claim should be traceable to one or more sources.
2. **Time is first-class** — borders, names, offices, laws, identities and relationships change.
3. **Place is first-class** — historical and modern information must be geographically contextualized.
4. **Uncertainty is preserved** — disputed, estimated or weakly evidenced claims must not be presented as unquestioned fact.
5. **Raw evidence is preserved** — extraction never replaces the source artifact.
6. **AI assists; it does not silently author truth** — AI output is evaluated, versioned and attributable.
7. **Canonical data is curated** — extraction/staging and published knowledge are separate states.
8. **History connects to the present** — heritage and pre-colonial history should explain, contextualize and challenge modern political/geographic assumptions.
9. **Africa is not modeled as timeless modern borders** — historical geography and changing political entities must be representable on their own terms.
10. **The system should be reusable** — public products, researchers and future tools should consume the same structured knowledge base.

## Documentation

The eight core documents are indexed in [.docs/docs/README.md](.docs/docs/README.md). Detailed designs and operational guides are grouped in [.docs/design/README.md](.docs/design/README.md).

## Running the repository

Everything runs from the repository root with Bun; Python projects are driven through uv and JavaScript and TypeScript projects through Bun.

```bash
bun run setup     # install every dependency, link Dryv, create development sign-in keys
bun run dev       # API, engine, dashboard and public site together
bun run check     # format check, lint, typecheck, structure and tests
bun run help      # every command
```

The full guide, including builds, start mode, Dryv generation, database and seed commands and the code quality rules, is in [`scripts/README.md`](scripts/README.md).

## Current state

The repository contains valuable code from earlier projects, especially the public Mzizi experience, the dashboard and the Python political/governance backend. Consolidation is complete at the repository level; architectural consolidation is now the work.

Existing code should be treated as source material to preserve, understand and migrate — not as proof that the current boundaries are the final system design.

<!-- BEGIN TASK MANAGED TASK-TOOL -->

## Task workspace

This project manages its work with Task (`taskcode`; `task` and `tc` are aliases). Task records, documents, decisions and handoffs live in `.docs/` as Markdown files with YAML frontmatter. Read `.docs/README.md` for how the tool works.

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

## Root seed registry — rewrite convention

All manually/AI-prepared system seed inputs belong in [`seed/`](seed/README.md): auth baselines, global file types and jurisdictions, fixed folders, reference-owned patterns and site structures in CSV/YAML/JSON or seed-specific code. Global definitions live under `seed/global/`, system definitions under `seed/system/`, and country-specific definitions under `seed/ke/` or another jurisdiction code. Versioned manifests map inputs to existing S3 bucket `mzizi`, recognized loaders and database targets. Reproducible/local outputs have explicit ignore rules; curated inputs remain tracked. Runtime loaders stay in `source/`, contracts in `dryv/`. Existing scattered inputs have been relocated there (folder-level origin/access metadata in `_folder.yaml`, functional `manifest.yaml` and generated lock; nothing uploaded yet); runtime S3/filesystem registration remains planned. See [`seed/README.md`](seed/README.md) for table ownership, lazy folder patterns, access and adoption rules.
