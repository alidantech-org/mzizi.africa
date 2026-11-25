---
{id: DOC-DB0NEMZIZIX01,name: The one local database,type: documentation}
---

# The one local database: `mzizix`

Mzizi uses **one** PostgreSQL database on a developer machine, named by `MZIZI_DB_NAME` in the root `.env` (`mzizix`). The engine, the API, every web app and the database CLI read the same root `.env`; no app has its own `.env*` file.

## Rules for people and AI agents

- **Never create another database.** No `mzizi_test`, `mzizi_ux`, `mzizi_rebuild`, scratch, proof, per-task or "just for now" copies. Tests that need isolation use transactions, schemas inside `mzizix`, or fixtures, not new databases.
- **Never point a tool at another name.** `bun run db` refuses any `MZIZI_DB_ADMIN_URL` whose database is not `MZIZI_DB_NAME`; seed loaders do the same. Do not weaken this guard or add a database-name override.
- **When the owner asks to restart, reset or start over, run exactly this** and do nothing cleverer:

  ```bash
  bun run db reset --yes                       # drop and recreate mzizix, apply the baseline, provision roles
  uv run python .dev/seed/rebuild/load.py      # load the seed from .dev/seed
  bun run db refresh                           # rebuild outlines, pieces and figures
  ```

- Reset only when asked. It deletes all data in `mzizix`. Never reset, drop or rename any database you did not create in this session without being told; leftover databases from earlier work are the owner's to drop.
- Environment variables come only from the root `.env` (template: `.env.example`). Add a new variable there and to `.env.example`; do not create per-app env files. Root commands, `bun dev` and each app's own `dev` script load the root file.
- Seed data lives only in the git-ignored `.dev/seed/`; downloaded source data lives in `.dev/scratch/`. Never commit either.
- Start the whole stack with `bun dev` from the repository root; it runs the API, engine, web, dev portal and public site on `mzizix`.
