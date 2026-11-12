# mzizi-filesystem

S3 object access, hashing, deduplication and seed publication to a registry.

Schema and behavior: `.docs/design/data/FILESYSTEM_SCHEMA.md`. Modules: `repository.py` (SQL), `service.py` (hash, dedup, upload, verify, register), `sync.py` (manifests and planning), `uploads.py`, `lineage.py`, `transitions.py`, `download.py`, `authz.py`, `store.py`, `livecheck.py`. Command: `uv run mzizi-filesystem --help`.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/filesystem`.


## Environment and security files

`mzizi-filesystem` loads the repository-root `.env` (git-ignored) for unset variables; `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` alias the `S3_*` names. Security files are stored only under the private `/security` folder and fetched with `mzizi-filesystem secure-get <path>` (or `fetch_secure_file`) into `.local/secure/`.

## Codes

Folders and files carry an optional `code` that follows `.docs/rules/code-columns.md`. Root folders in a manifest set an explicit code; everything below derives (`seeds.global.auth.roles_csv`, `legacy_artifacts.backups.<name>`). `identities` in a sync manifest may give a file an explicit code. `registry_prefix` no longer exists.
