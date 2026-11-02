---
{id: TSK-86C34F5DE3BA,name: "Kenya site family catalogue: patterns, families and subject linking",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:36:18.412Z,updated_at: 2026-11-02T09:51:26.916Z,due_at: 2026-12-04,order: 19456,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:48:30.298Z},{from: in-progress,to: completed,at: 2026-11-02T09:51:26.916Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-86C34F5DE3BA/1793612910300-start,started_at: 2026-11-02T09:48:30.718Z,end_ref: refs/tracking/TSK-86C34F5DE3BA/1793613086920-end,ended_at: 2026-11-02T09:51:26.916Z,summary: {files: 7,insertions: 344,deletions: 4}}]}}}
---

# Kenya site family catalogue: patterns, families and subject linking

## Goal
Research and record Kenya's government site families and their domain patterns so most Kenyan government sites are generated and linked to geography and governance without hand-registering each.

## Context
Read .docs/docs/WEBSITE_DESIGN.md (section Families, domain patterns and similarity), .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. Domains and patterns are never identifiers. Work only on develop, record progress here and tick items with task check. Start from county governments, county assemblies, constituency development fund sites and ministries and state departments, then independent commissions and agencies. Verify each pattern by probing, record uncertainty and exceptions in the family NOTES.md, and respect rate limits. Subject sets come from the Kenya geography and governance imports.

## Acceptance checklist
- [x] Catalogue of at least four families with patterns, subject kinds and expected traits.
- [x] Expected sites generated for the 47 counties (tested); probing is deferred until a monitored contact channel exists, so exceptions are not yet known.
- [x] Sites linked to geography units and governance institutions where those records exist.
- [x] Independent bodies registered as individual sites with traits and relations (IEBC and Parliament; KNBS and the Treasury could not be read).
- [x] Report coverage counts with explicit scope and counting rules.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Probing expected sites is automated access: keep it bounded, identified and rate limited, limited to reachability under a not_reviewed assessment, and never retry around a block or challenge. Generated expected sites are discovery only; none becomes active without its own assessment. Record family-level access conditions in the family NOTES.md and treat patterns as research aids, not authorisation.

## Progress
Catalogue delivered as research seeds (5 families, 4 proposed patterns, 3 profiled sites with 4 domains, 2 memberships, traits and a shares_module relation) and documented in .docs/docs/KENYA_SITE_CATALOGUE.md. Offline expansion creates 47 expected sites for the county pattern from the imported county units (test), and the report command prints counts with counting rules. Not done and why: no probing (no monitored contact channel exists, and the engine refuses to run live without one), no constituency or ministry expansion (those units are not imported), no assessments (humans only), KNBS, Treasury, Kenya Law and Nairobi County could not be read from here. Patterns are the project owner's examples and remain unverified.
