# Scripts

Thin repository commands. Each script only calls a package or engine API (no filesystem, database or network logic of its own). Run them from the repository root with `uv run`.

| Script | Calls | Purpose |
|---|---|---|
| `scripts/db.py <command>` | `mzizi_database.cli` | `status`, `init`, `reset`, `bootstrap-admin` for the disposable rewrite database `mzizi_new` |
| `scripts/seed_check.py <command>` | `mzizi_manifest.cli` | `check`, `lock`, `report` for the seed registry; `validate-structure <dir>` for a site bundle |
| `scripts/publish_seeds.py [--apply --store s3]` | `mzizi_filesystem.cli` | Publish prepared inputs from `seed/` through the filesystem package (dry run by default) |

The same operations are available as console commands once the workspace is installed (`uv sync --all-packages`): `mzizi-db`, `mzizi-manifest`, `mzizi-publish-seed`, `mzizi-engine`.
