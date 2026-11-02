---
{id: TSK-86C34F5DE3BA,name: "Kenya site family catalogue: patterns, families and subject linking",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:36:18.412Z,updated_at: 2026-11-02T07:36:18.412Z,due_at: 2026-12-04,order: 19456}
---

# Kenya site family catalogue: patterns, families and subject linking

## Goal
Research and record Kenya's government site families and their domain patterns so most Kenyan government sites are generated and linked to geography and governance without hand-registering each.

## Context
Read .docs/docs/WEBSITE_DESIGN.md (section Families, domain patterns and similarity), .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. Domains and patterns are never identifiers. Work only on develop, record progress here and tick items with task check. Start from county governments, county assemblies, constituency development fund sites and ministries and state departments, then independent commissions and agencies. Verify each pattern by probing, record uncertainty and exceptions in the family NOTES.md, and respect rate limits. Subject sets come from the Kenya geography and governance imports.

## Acceptance checklist
- [ ] Catalogue of at least four families with patterns, subject kinds and expected traits.
- [ ] Expected sites generated for the 47 counties and probed, with exceptions listed.
- [ ] Sites linked to geography units and governance institutions where those records exist.
- [ ] Independent bodies registered as individual sites with traits and relations to families.
- [ ] Report coverage counts with explicit scope and counting rules.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Probing expected sites is automated access: keep it bounded, identified and rate limited, limited to reachability under a not_reviewed assessment, and never retry around a block or challenge. Generated expected sites are discovery only; none becomes active without its own assessment. Record family-level access conditions in the family NOTES.md and treat patterns as research aids, not authorisation.
