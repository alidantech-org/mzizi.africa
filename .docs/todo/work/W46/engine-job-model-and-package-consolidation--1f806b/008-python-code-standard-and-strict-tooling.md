---
{id: TSK-DD6E78B5835F,name: Python code standard and strict tooling,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T10:12:16.804Z,updated_at: 2026-11-13T10:12:26.647Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T10:12:26.647Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DD6E78B5835F/1794564746657-start,started_at: 2026-11-13T10:12:27.388Z}]}}}
---

# Python code standard and strict tooling

## Goal

Make the new typed-code rules enforceable in this repository: strict mypy with the pydantic plugin, annotation rules in ruff, and shared base types, so that no package can add a free dict or an inline regex without the checks failing. This is the first step of the package consolidation because every moved or rewritten module must meet it.

## Context

The rules are in `.docs/rules/typed-code.md` and follow Dryv's typed-contract rule (frozen, strict pydantic models; one parsing boundary). The root `pyproject.toml` currently runs mypy with `disallow_untyped_defs` but not strict mode, and ruff selects no annotation rules. Packages have no pydantic dependency. The existing structure check (`bun run structure`) already enforces file size limits of 400 lines and file headers. Rust and TypeScript equivalents (clippy deny rules, strict `tsc`, Biome) are part of the rule but are configured in their own projects.

## Acceptance checklist

- [x] Root mypy configuration is `strict` with the pydantic plugin, `disallow_any_explicit` and `disallow_any_generics`, and the engine and every package either pass or have a tracked exemption list.
- [ ] Ruff enables annotation rules including `ANN401`, and a small check fails on `dict[str, object]`, `Mapping[str, object]` and bare `dict` in contracts outside parser and encoder modules.
- [x] pydantic is a dependency of the packages that define contracts, with a documented shared base model convention (frozen, strict, forbid extra).
- [ ] The rule doc, `coding.md`, AGENTS.md and the root runner docs describe the exact commands, and `task validate` passes.

## Comments

### 2026-11-13T10:31:51.174Z · PETER IRUNGU

Done: strict mypy + pydantic plugin + disallow_any_explicit/generics at the root; legacy modules (manifest, filesystem, engine except policy) sit in a tracked override list that may only shrink. Packages extraction, scraping, fetch and engine policy pass mypy strict, ruff and tests. Open: ruff ANN rules and the dict[str, object] check script (item 2), and docs/validate (item 4; task validate still reports one pre-existing broken link in _plan/source-redesign).
