# mzizi-filesystem

Versioned files at caller-chosen placements. One class, `FilesystemOrchestrator`, does everything; the package never knows a database exists and names no bucket, host, prefix or folder.

The caller (the engine, deciding from the task it is doing: scraping, hunting a country's data, and so on) supplies:

- a `FilesystemConfig` (bucket, region, public endpoint, protected key prefixes, reserved top-level folders, temp prefix),
- a `RegistryRepository` (the persistence port; the engine implements it over its database),
- an `ObjectStore` (`S3ObjectStore(S3Settings, protected_prefixes)` or `MemoryObjectStore`),
- a `MediaCatalog` (extension to media type, reference data),
- and, per call, a typed `Placement`: the folder names, access, retention and role for that file.

What it does: register bytes (`register`) with hashing, content-type checks, versions, retention (`preserve_history` or `replace_current`, pinned versions never dropped), duplicate and name-conflict policies, recovery of missing objects and server-side copies inside an access class; two-step presigned uploads; download links; exact lineage between versions with cycle refusal; moves, renames and access changes where bytes follow the registry path; a directory sync that registers a local tree under folders the caller names.

Layout (`orchestrator/`, `shared/`, `features/<capability>/`): `features/{keys,media,store,placement,register,transitions,upload,download,sync,registry}`. Object keys are readable registry paths: `<access>/<folder path>/<file name>`, and superseded revisions sit under `_versions/<name>/rNNNN/`.

Not here, by design: who may do what (authorization is the engine's decision), classification of folders, and any source-specific naming. Tests use an in-memory registry and store; `uv run pytest source/packages/filesystem`. The engine's tests run the same orchestrator over the real PostgreSQL schema.
