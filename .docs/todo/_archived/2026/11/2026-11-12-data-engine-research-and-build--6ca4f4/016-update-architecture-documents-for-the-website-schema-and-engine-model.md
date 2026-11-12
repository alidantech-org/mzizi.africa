---
{id: TSK-75A35488E410,name: Update architecture documents for the website schema and engine model,type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.772Z,updated_at: 2026-11-02T09:54:07.378Z,due_at: 2026-11-06,order: 16384,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:53:25.479Z},{from: in-progress,to: completed,at: 2026-11-02T09:54:07.378Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-75A35488E410/1793613205481-start,started_at: 2026-11-02T09:53:25.982Z,end_ref: refs/tracking/TSK-75A35488E410/1793613247380-end,ended_at: 2026-11-02T09:54:07.378Z,summary: {files: 6,insertions: 43,deletions: 1}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Update architecture documents for the website schema and engine model

## Goal
Bring ARCHITECTURE.md, DATA_LIFECYCLE.md, DOMAINS.md and the roadmap in line with the website schema, the Mzizi-owned structure format and the engine layout, so architectural truth is not left only in the new design documents.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. AGENTS.md section 9 requires documentation changes with every architectural decision. The engine model is data package (acquisition, extraction, structures) and database package (migrations, staging, promotion), with files and intelligence as siblings. Also correct the table count to 89 where documentation says 91.

## Acceptance checklist
- [x] ARCHITECTURE.md: website schema, structure files, engine flow from site to candidate.
- [x] DATA_LIFECYCLE.md: source discovery and registration stages reference sites and structure versions.
- [x] DOMAINS.md and roadmap: add the website domain and the waves.
- [x] Fix table counts, run task validate.
