# mzizi-database

Safe connections, ordered SQL migrations and the auth baseline for the disposable rewrite database.

Only `mzizi` and `mzizi_*` databases are connected; reset is limited to `mzizi_new` on a local host after `current_database()` is verified.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/database`.
