---
{id: TSK-03AC73ABF2D2,name: "Model site families, domain patterns, subjects, traits, relations and fingerprints",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:36:18.111Z,updated_at: 2026-11-02T08:13:35.535Z,due_at: 2026-11-11,order: 17408,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:07:23.576Z},{from: in-progress,to: completed,at: 2026-11-02T08:13:35.535Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-03AC73ABF2D2/1793606843578-start,started_at: 2026-11-02T08:07:23.881Z,end_ref: refs/tracking/TSK-03AC73ABF2D2/1793607215537-end,ended_at: 2026-11-02T08:13:35.535Z,summary: {files: 221,insertions: 11652,deletions: 5}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Model site families, domain patterns, subjects, traits, relations and fingerprints

## Goal
Extend the website contracts with families, domain patterns, family membership, subject links, traits, relations and fingerprints so related sites share structure and the system understands what each site is for and who it serves.

## Context
Read .docs/docs/WEBSITE_DESIGN.md (section Families, domain patterns and similarity), .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. Domains and patterns are never identifiers. Work only on develop, record progress here and tick items with task check. Examples to model and test: county governments, county assemblies, constituency development funds and ministries in Kenya, plus independent bodies such as the electoral commission and the statistics bureau that share traits but not structure. Subjects link to geography units, governance institutions, organization entities and kinds of material by soft ids. Depends on the website contracts task.

## Acceptance checklist
- [x] Dryv contracts for families, domain patterns, members, subjects, traits, relations and fingerprints with validity and confidence.
- [x] Add family_version_id to source captures alongside the other soft links.
- [x] Read endpoints for families with members and patterns, and for a site's subjects and relations.
- [x] Worked examples in the contract tests for the four Kenyan families and one independent body.
- [x] Update DATABASE_DESIGN.md and run bun run check, generated:check and task validate.
