---
{id: GRP-761C6BB6FA2E,name: Root documentation and source map,type: documentation,extra: {created_at: 2026-11-12T06:32:18.438Z}}
---

# Root documentation and reference repair plan

Inspect the tracked source tree and the READMEs under apps, backend, packages, and schema. Compare the actual directories and representative entrypoints with the user-provided source layout. Rewrite the root README as a short orientation and source map, and rewrite AGENTS.md as concise agent rules with current architecture boundaries, exact paths, current root commands, documentation/task rules, and seed conventions. Update directly referenced core system/design documents and source READMEs where they still point to archived or missing code. In particular, distinguish the NestJS product API from the Python engine, the Bun TypeScript database service, and the Temporal pipeline worker; describe reusable capabilities by their actual package directories; identify the missing `mzizi-database` workspace member as an unresolved code/config mismatch without claiming it exists. Check local Markdown links, run Task validation, review the diff, and record check outcomes. Keep all work on `develop`, and archive the Task group after completion.
