---
{id: TSK-443D558BBB70,name: Make manifest a pure envelope and schema layer with a section registry,type: task,status: planned,priority: medium,created_at: 2026-11-13T09:53:30.677Z,updated_at: 2026-11-13T09:53:30.677Z,order: 4096}
---

# Make manifest a pure envelope and schema layer with a section-schema registry

## Goal

Keep the `manifest` package, but make it only responsible for loading and resolving manifest envelopes and validating them against schemas, usable by the engine CLI and by other packages. Packages register the schema for their own manifest section, so only `scraping` interprets scrape sections and only `fetch` interprets API sections. Remove the odd dependency from `manifest` on `scraping`.

## Context

`mzizi-manifest` has about 1750 lines and 32 tests with a CLI (`check`, `lock`, `report`, `validate-structure`). Seed manifest locking and publishing logic that touches storage belongs in an engine `seed/` module later, not in this package. Schemas are read from `source/schema`. AGENTS.md requires `uv run mzizi-manifest check` after seed changes, so the CLI must keep working or be replaced by an engine CLI command in the same change.

## Acceptance checklist

- [ ] A registry lets a package register a section name and JSON schema; `manifest` validates the envelope and delegates sections to registered schemas.
- [ ] `manifest` no longer depends on `scraping`; `scraping` and `fetch` register their sections.
- [ ] The package is split into small subfolder modules (envelope, lock, structure validation) and all current tests pass.
- [ ] The engine CLI can validate a manifest using the package, and AGENTS.md and READMEs describe the final command.
