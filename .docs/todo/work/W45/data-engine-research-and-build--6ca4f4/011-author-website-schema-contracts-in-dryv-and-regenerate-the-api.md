---
{id: TSK-55F47BC49B60,name: Author website schema contracts in Dryv and regenerate the API,type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.051Z,updated_at: 2026-11-02T07:26:37.051Z,due_at: 2026-11-09,order: 11264}
---

# Author website schema contracts in Dryv and regenerate the API

## Goal
Model sites, domains, site-publisher links, structures, structure versions, structure files and checks as Dryv contracts so the generated entities, DTOs and read endpoints exist like every other schema, with soft links to source and filesystem.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Follow .docs/rules/database-naming.md (full-word schema, no cross-schema foreign keys). Generator limits are listed in dryv/README.md. Writes to this schema come from the engine, so the public API is read-only except for sites marked public.

## Acceptance checklist
- [ ] Contracts for the seven tables with validity and precision on domains, soft ids for publisher, folder, file version and method.
- [ ] Add soft site_id, domain_id and structure_version_id to source captures, and site_id to documents.
- [ ] Read endpoints for sites, domains and structure versions with a file listing; tests following the existing API pattern.
- [ ] Run bun run check and generated:check, update DATABASE_DESIGN.md catalogue and run task validate.
