---
{id: TSK-E29DD2591768,name: Content section model in site structures,type: task,status: in-progress,priority: medium,created_at: 2026-11-02T20:24:22.388Z,updated_at: 2026-11-03T06:13:01.586Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:40:24.685Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E29DD2591768/1793655624687-start,started_at: 2026-11-02T21:40:25.297Z}]}},due_at: 2026-11-03}
---

# Content section model in site structures

## Goal
Let a site structure declare its content sections (publications, downloads, media, notices, tenders, legislation, reports, press) so crawling is driven by modelled meaning, not by a universal /downloads path, which most sites do not use.

## Context
Government sites place material under many different paths, and one section can be reachable from several paths. The product owner's rule: a section has a semantic label, one or more path rules, and paths may be dynamic, so a rule can be an exact path or a regular expression with named slots (year, county, number, page). Structures live in `website.structures` bundles with manifest, modules, mappings and tags; this task adds a section module and mapping shape, validated by the existing bundle code in the data engine, and seeds sections for site families. Seed rules are custom-prepared from manual research and labelled as such; discovery from crawled links only proposes new rules for review.

## Acceptance checklist
- [x] Define the section module schema: label, path rules (exact or regex with named slots), expected file types, pagination hints, and source of the rule.
- [x] Extend bundle validation and tests to reject invalid regular expressions and unknown labels.
- [x] Seed sections for county governments, assemblies, NG-CDF sites, ministries, commissions and regulators from manual research.
- [ ] Record each section's last visit, found items and the rule that matched.
- [x] Document the model in `.docs/docs/DOMAINS.md` and the structure README.

## Outcome notes
- Implemented as `sections.yml` in the bundle (`structure/sections.py`, `sections.schema.json`); rule origin is `provenance` on each rule.
- Seeds: `engine/database/fixtures/seed/ke-site-sections.json`, custom-prepared from manual research, unverified, low confidence.
- Item 4 (last visit, found items, matched rule) is NOT done: the schema has no table for it. Needs a proposed `website.section_visits` (structure version, section label, rule index, visited_at, items_found) in the database lane; `match_rule` already returns the matched rule.
