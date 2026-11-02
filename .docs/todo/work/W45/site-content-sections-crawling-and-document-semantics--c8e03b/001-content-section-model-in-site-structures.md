---
{id: TSK-E29DD2591768,name: Content section model in site structures,type: task,status: planned,priority: medium,created_at: 2026-11-02T20:24:22.388Z,updated_at: 2026-11-02T20:24:22.388Z,order: 1024}
---

# Content section model in site structures

## Goal
Let a site structure declare its content sections (publications, downloads, media, notices, tenders, legislation, reports, press) so crawling is driven by modelled meaning, not by a universal /downloads path, which most sites do not use.

## Context
Government sites place material under many different paths, and one section can be reachable from several paths. The product owner's rule: a section has a semantic label, one or more path rules, and paths may be dynamic, so a rule can be an exact path or a regular expression with named slots (year, county, number, page). Structures live in `website.structures` bundles with manifest, modules, mappings and tags; this task adds a section module and mapping shape, validated by the existing bundle code in the data engine, and seeds sections for site families. Seed rules are custom-prepared from manual research and labelled as such; discovery from crawled links only proposes new rules for review.

## Acceptance checklist
- [ ] Define the section module schema: label, path rules (exact or regex with named slots), expected file types, pagination hints, and source of the rule.
- [ ] Extend bundle validation and tests to reject invalid regular expressions and unknown labels.
- [ ] Seed sections for county governments, assemblies, NG-CDF sites, ministries, commissions and regulators from manual research.
- [ ] Record each section's last visit, found items and the rule that matched.
- [ ] Document the model in `.docs/docs/DOMAINS.md` and the structure README.
