---
{id: TSK-C1DEFF5842A4,name: "Site structure JSON Schema, validator and sample bundles",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.336Z,updated_at: 2026-11-02T07:26:37.336Z,due_at: 2026-11-13,order: 13312}
---

# Site structure JSON Schema, validator and sample bundles

## Goal
Define mzizi.site/v1 as a closed JSON Schema with static checks and a dry-run validator, plus two sample bundles, so agents have an exact target and the engine can reject invalid structures automatically.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. The format is modular: a manifest, module files, mapping files, optional tags file, NOTES.md and saved example responses. It is declarative only, with no executable code and no natural-language rules. Authentication, CAPTCHAs and evasion are unsupported. The validator belongs to engine/data in Python.

## Acceptance checklist
- [ ] JSON Schema files for manifest, module, mapping and tags, with unknown keys rejected.
- [ ] Static checks: module references, known tags, mapping targets exist in the contracts, transforms in the library.
- [ ] Dry run against examples applying each module's expect block.
- [ ] Two sample bundles (one HTML listing, one JSON API) with NOTES.md, and tests for valid and invalid cases.
