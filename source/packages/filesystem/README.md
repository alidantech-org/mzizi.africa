# mzizi-filesystem

S3 object access, hashing, deduplication and seed publication to a registry.

Schema and behavior: `.docs/docs/FILESYSTEM_SCHEMA.md`. Modules: `repository.py` (SQL), `service.py` (hash, dedup, upload, verify, register), `sync.py` (manifests and planning), `uploads.py`, `lineage.py`, `transitions.py`, `download.py`, `authz.py`, `store.py`, `livecheck.py`. Command: `uv run mzizi-filesystem --help`.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/filesystem`.
