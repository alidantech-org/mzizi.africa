# Mzizi Africa

Mzizi is an evidence-first platform for researching African history, heritage, geography, culture, languages, governance and public life. It preserves source material and provenance so that claims can be reviewed in context, across time and place, with uncertainty visible.

Start with [WHY](.docs/docs/WHY.md), [GOALS](.docs/docs/GOALS.md) and [STORY](.docs/docs/STORY.md) for the purpose and product direction. The eight core project documents are indexed in the [documentation guide](.docs/docs/README.md). Detailed designs live under [.docs/design](.docs/design/README.md); planning proposals live under [.docs/_plan](.docs/_plan/README.md).

## CLI and scraping

New machine? Follow [SETUP.md](SETUP.md): prerequisites per operating system, and how to write and run a scrape-and-extract job for any site.

Start with the [CLI and engine jobs quickstart](.docs/design/operations/cli-and-jobs.md) to install from a fresh checkout, run a bounded crawl or submit a job.

## Source code map

```text
source/
├── apps/
│   ├── mobile/                 Flutter geography client
│   ├── admin/                  Next.js research, review and inherited admin dashboard
│   ├── app/ web/ dev/          Dryv-generated frontend slices
│   └── www/                    Next.js public landing experience
├── backend/
│   ├── api/                    NestJS product API
│   ├── database/               Bun CLI, generated SQL and immutable migrations (no server)
│   ├── engine/                 Python runtime: EngineRuntime, HTTP front door, persistence (PostgreSQL, MongoDB)
│   └── README.md
├── packages/
│   ├── extraction/             PDF, GeoJSON, CSV and JSON extraction, with OCR
│   ├── fetch/                  Identified fetching, limits and stop rules
│   ├── filesystem/             Object storage and filesystem metadata capabilities
│   ├── manifest/               Seed and site-manifest validation
│   ├── browser/ cli/ crawler/  Browser sessions, developer CLI and web acquisition
│   ├── search/                 Search capabilities
│   └── README.md
└── schema/
    ├── database/               Dryv-generated PostgreSQL table and seed schemas
    ├── engine/                 Job, mapping and classification inputs
    ├── seed/                   Seed manifest schemas
    ├── sources/                Source and module schemas
    └── README.md
```

`dryv/` holds authored API and database contracts. `seed/` holds prepared, manifest-registered inputs. `scripts/` provides the root command runner. See the [backend map](source/backend/README.md), [package map](source/packages/README.md), [schema map](source/schema/README.md), and [root command guide](scripts/README.md) for details.

## How the active components fit

- The public site, research dashboard and Flutter client are consumers. They do not own canonical domain rules.
- The NestJS API serves product contracts and connects to PostgreSQL directly with its own role.
- The Bun database CLI applies SQL releases; there is no database service.
- The Python engine is the runtime: it assembles package capabilities, schedules their work and owns PostgreSQL, MongoDB and (later) vector persistence.
- Python packages provide browsing, crawling and scraping, fetching, extraction (including OCR), filesystem operations, search and manifest validation. There is no intelligence service yet; `source/backend/agent/` is a README-only proposal.
- SQL lives in `source/backend/database/`. Machine-readable schemas live in `source/schema/`.

The evidence path is intended to preserve the original artifact while creating attributable extraction and review proposals. Some handoffs are still in migration: persistent job state, per-folder authorization and the vector store are not built yet.

## Run from the repository root

Use Bun for the root runner and TypeScript projects, and uv for Python packages. `bun run help` lists commands; the [root command guide](scripts/README.md) explains setup, services and checks.

```bash
bun run setup
bun run dev
bun run check
```

The CLI-only install is `uv sync --locked --all-packages`. Use the [quickstart](.docs/design/operations/cli-and-jobs.md) for its independent workflow.
