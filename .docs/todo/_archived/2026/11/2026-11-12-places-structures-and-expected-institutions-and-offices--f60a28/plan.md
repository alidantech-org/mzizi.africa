---
{id: GRP-879616F60A28,name: "Places, structures and expected institutions and offices",type: documentation,extra: {created_at: 2026-11-02T20:59:11.886Z}}
---

# Plan

Approach: design first (decision DEC-PLACES-AND-OFFICE-PATTERNS), then migrate. The place schema is added through the Dryv contract and a migration that also moves data from `organization.locations` and drops it, along with columns that mix logical and physical concerns. No compatibility layer is kept. Occupancy links use target kind and target id rather than cross-schema foreign keys, following repository rules.

Seeds come next: JSON files under `fixtures/seed` list ministries, state departments, state corporations, constitutional commissions, independent bodies and agencies such as TSC, DCI, NTSA, KeNHA, KRA, EACC, ODPP, the Judiciary, IEBC, NLC and CRA, with their offices and the places they are expected to occupy. Pattern definitions generate offices and expected places per geography unit (county, constituency, ward, administrative location) and per institution family.

Reinforcement then fills unknowns from crawled sites, PDFs such as the constituency offices list, and Wikidata or OpenStreetMap where licences allow, keeping every claim with its source. Milestones: schema and migration; institution and office seeds; pattern expansion; place patterns and linkage; reinforcement and reports. Risks: duplicate buildings from multiple sources, mitigated by entity-matching style scoring on name, address and point; names that change over time, mitigated by dated names; private contact data, mitigated by hidden identifiers.
