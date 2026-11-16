# mzizi-manifest

Seed manifest and folder metadata resolution, lock, and site-structure validation.

Schemas are read from `source/schema`; `mzizi-manifest check|lock|report|refs|validate-structure`; `refs` checks that every source, mapping, vocabulary and extraction code resolves (see `source/schema/README.md`).

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/manifest`.
