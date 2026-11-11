---
{id: DOC-E6AB729CDC3F,name: Testing Guide,type: documentation}
---

# Testing Guide

Run the narrowest existing checks that cover the changed surface, then expand to dependent consumers when contracts change.

All checks run from the repository root: `bun run test` (pytest, `bun test`, vitest), `bun run typecheck` (mypy, `tsc`), `bun run lint`, `bun run format:check` and `bun run structure`, or `bun run check` for all of them. Narrow a run with `--only`, for example `bun scripts/mz.ts test --only python` or `--only api`. See `scripts/README.md`.

- **API:** contract tests for DTOs, stable IDs, provenance/verification metadata, authorization, validation, pagination, and failure states. Keep legacy Python tests distinct from target NestJS checks.
- **Mobile:** Flutter analysis and relevant widget/client tests; geography tests should cover canonical IDs, verified-only boundary handling, empty results, HTTP errors, offline state, and rapid selection.
- **Public site/dashboard:** use the package's existing lint, typecheck, and build scripts. Check loading, empty, error, keyboard, narrow viewport, and large-text states.
- **Cross-surface:** when a contract changes, validate the API and each actual consumer. Do not use illustrative fixture data as proof of backend integration.

Record the command and outcome in the Task activity or review notes. For map performance, record representative device, memory, frame rate, and interaction latency before production rollout.
