---
{id: DOC-3D28B3806CE8,name: Development Setup,type: documentation}
---

# Development Setup

## Root commands

Everything is run from the repository root with Bun. Python projects use uv and JavaScript and TypeScript projects use Bun; the runner in `scripts/` knows which is which, so there is no need to change directory.

```sh
bun run setup        # currently blocked by the missing mzizi-database Python workspace member
bun run doctor       # report required tools and local files
bun run dev          # database (3301), pipelines (3302), API (3000), engine (8760), dashboard (3100), public site (3200)
bun run check        # format check, lint, typecheck, structure and tests
bun run build        # Python wheels and both Next.js apps
bun run start        # the same services without watchers
bun run dryv:check   # contract checks
bun run dryv:generate  # generate the NestJS API and everything derived from it
bun run help         # every command
```

`scripts/README.md` is the full guide: the command table, `--only` filters, ports and their overrides, the Dryv flow, and the code quality rules (ruff, mypy, Biome, and the hard file size and layout limits enforced by `bun run structure`). Local values for `dev` and `start` come from the git-ignored root `.env`.

## Task workspace

Run commands from the repository root:

```sh
task                 # workspace overview
task list            # active tasks
task group list      # API, Mobile app, and Sites groups
task show <id>       # inspect an activity
task run             # open the local Task dashboard
task doctor          # check workspace health
```

Create work with `task create --title "..." --group <group-id> --status planned --priority medium --tag area,topic`. Use `planned`, `in-progress`, `blocked`, or `completed` statuses and add dependencies when one activity genuinely gates another.

## Flutter mobile

Use `source/apps/mobile/README.md` as the source for SDK and platform setup. The app reads compile-time values such as `MZIZI_API_BASE_URL` through Dart defines; a `.env.local` file is not automatically loaded unless application code explicitly implements that behavior. Use the API origin reachable from the chosen target (Chrome, Android emulator, or physical device), and keep backend secrets out of the client.

## API and sites

Follow each application README and package scripts. The active product API is NestJS in `source/backend/api/`; the operational Python API is `source/backend/engine/`. The former Python API is historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`. The research dashboard and public landing experience are separate Next.js apps in `source/apps/web/` and `source/apps/www/`.
