---
{id: TSK-26EEF58EEA8C,name: "Pattern expansion, reachability probing and fingerprint similarity in the data engine",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:36:18.269Z,updated_at: 2026-11-02T07:36:18.269Z,due_at: 2026-11-24,order: 18432}
---

# Pattern expansion, reachability probing and fingerprint similarity in the data engine

## Goal
Make the data engine turn a domain pattern and a subject set into expected sites, probe them politely, promote or reject them, and compute fingerprints that suggest family membership and similarity relations.

## Context
Read .docs/docs/WEBSITE_DESIGN.md (section Families, domain patterns and similarity), .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. Domains and patterns are never identifiers. Work only on develop, record progress here and tick items with task check. For {county}.go.ke the subjects are the units of the county level in geography; slug rules and overrides handle names that do not map directly. Probing obeys the family politeness policy and never evades access controls. Fingerprint suggestions are written as data with a basis and score and never rewrite structures. Depends on the structure runner and the families modelling task.

## Acceptance checklist
- [ ] Pattern expander with slug rules and per-subject overrides, tested on the Kenyan county list.
- [ ] Rate-limited reachability probe writing checks and promoting or rejecting expected sites.
- [ ] Fingerprint computation (markup, navigation, assets, document types) with a similarity score between two sites.
- [ ] Suggestion writer for family membership and similar_to relations, with evidence.
- [ ] Family-plus-overlay resolution in the structure loader, with tests for replace, add and remove.
