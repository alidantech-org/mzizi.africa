# mzizi-filesystem

S3 object access, hashing, deduplication and seed publication to a registry.

See `src/mzizi_filesystem/publish.py` for the outcome and publication-mode contract (versioned, current, fixed_key) and `registry.py` for the registry port.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/filesystem`.
