# Seed inputs

`seed/` holds prepared system inputs, their manifests, and test-only examples and fixtures. Runtime loaders and validators live in `source/`; input contracts live in `source/schema/seed/`, `source/schema/site/`, and related schema folders. The database CLI and seed readers live in `source/backend/database/`.

## Current layout

```text
seed/
├── _examples/             # Non-executable examples
├── _fixtures/             # Test-only data; never applied as seeds
├── countries/ke/          # Kenya-specific source and reference inputs
├── global/                # Shared auth, reference, research and site inputs
├── system/                # Pipeline and policy inputs
├── manifest.yaml          # Authored inventory of uploadable seed files
└── manifest.lock.yaml     # Generated hashes and resolved manifest metadata
```

Country-specific inputs belong under `countries/<code>/`; do not place them in generic runtime code. Keep secrets, credentials, local databases, and private environment files out of this tree and Git.

## Owners and available commands

- The TypeScript database owner is `source/backend/database/`. Its current seed loaders apply the reviewed auth and reference baseline files. They do not apply every manifest entry.
- The Python manifest and filesystem packages provide validation and filesystem registration capabilities. Their workspace currently has an unresolved `mzizi-database` dependency: `source/packages/database/` is absent while the engine and filesystem project metadata still reference it. Consequently, a fresh `uv sync --all-packages` and Python seed validation are currently blocked.
- Other manifest entries may be preparation inputs or historical loader records; the manifest is not proof that every input is loaded into the database.

The root Bun command runner documents the supported entry points in [`scripts/README.md`](../scripts/README.md). Database operations are available through `bun run db`; the seed wrapper is `bun run seed -- <command>`. Do not rely on Python CLI commands until the missing workspace dependency is resolved.

## Manifest maintenance

`manifest.yaml` is authored and validated against [`source/schema/seed/manifest.schema.json`](../source/schema/seed/manifest.schema.json). `manifest.lock.yaml` is generated. When Python workspace resolution is restored, use `uv run mzizi-manifest check` to validate the registry and `uv run mzizi-manifest lock` to refresh its lock after changing inputs. Never hand-edit the generated lock.

The manifest records recognized loaders and their state. An archived or unconsumed loader does not mean its input is currently applied. Review the corresponding TypeScript loader, Python capability, or pipeline before documenting runtime behavior as complete.

## Fixture policy

Files under `seed/_fixtures/` are read by tests only. Files under `seed/_examples/` illustrate input shapes and are not executable. A fixture or example must not be described as production seed data or registered for upload.
