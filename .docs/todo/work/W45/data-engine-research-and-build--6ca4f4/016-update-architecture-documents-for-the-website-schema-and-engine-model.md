---
{id: TSK-75A35488E410,name: Update architecture documents for the website schema and engine model,type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.772Z,updated_at: 2026-11-02T07:26:37.772Z,due_at: 2026-11-06,order: 16384}
---

# Update architecture documents for the website schema and engine model

## Goal
Bring ARCHITECTURE.md, DATA_LIFECYCLE.md, DOMAINS.md and the roadmap in line with the website schema, the Mzizi-owned structure format and the engine layout, so architectural truth is not left only in the new design documents.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. AGENTS.md section 9 requires documentation changes with every architectural decision. The engine model is data package (acquisition, extraction, structures) and database package (migrations, staging, promotion), with files and intelligence as siblings. Also correct the table count to 89 where documentation says 91.

## Acceptance checklist
- [ ] ARCHITECTURE.md: website schema, structure files, engine flow from site to candidate.
- [ ] DATA_LIFECYCLE.md: source discovery and registration stages reference sites and structure versions.
- [ ] DOMAINS.md and roadmap: add the website domain and the waves.
- [ ] Fix table counts, run task validate.
