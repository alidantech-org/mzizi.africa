---
{id: TSK-26EEF58EEA8C,name: "Pattern expansion, reachability probing and fingerprint similarity in the data engine",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:36:18.269Z,updated_at: 2026-11-02T09:32:01.314Z,due_at: 2026-11-24,order: 18432,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:30:04.614Z},{from: in-progress,to: completed,at: 2026-11-02T09:32:01.314Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-26EEF58EEA8C/1793611804615-start,started_at: 2026-11-02T09:30:04.968Z,end_ref: refs/tracking/TSK-26EEF58EEA8C/1793611921315-end,ended_at: 2026-11-02T09:32:01.314Z,summary: {files: 5,insertions: 518,deletions: 5}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Pattern expansion, reachability probing and fingerprint similarity in the data engine

## Goal
Make the data engine turn a domain pattern and a subject set into expected sites, probe them politely, promote or reject them, and compute fingerprints that suggest family membership and similarity relations.

## Context
Read .docs/docs/WEBSITE_DESIGN.md (section Families, domain patterns and similarity), .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. Domains and patterns are never identifiers. Work only on develop, record progress here and tick items with task check. For {county}.go.ke the subjects are the units of the county level in geography; slug rules and overrides handle names that do not map directly. Probing obeys the family politeness policy and never evades access controls. Fingerprint suggestions are written as data with a basis and score and never rewrite structures. Depends on the structure runner and the families modelling task.

## Acceptance checklist
- [x] Pattern expander with slug rules and per-subject overrides, tested on the Kenyan county list.
- [x] Rate-limited reachability probe writing checks and promoting or rejecting expected sites.
- [x] Fingerprint computation (markup, navigation, assets, document types) with a similarity score between two sites.
- [x] Suggestion writer for family membership and similar_to relations, with evidence.
- [x] Family-plus-overlay resolution in the structure loader, with tests for replace, add and remove.

## Progress
Implemented in the data engine: slug rules with ordered spelling variants (lowercase-strip-county, lowercase-hyphen, initials), pattern expansion creating expected sites with pattern-based family membership, subject links and a candidate-hostname check (idempotent per subject, and the candidates are not domains until a probe confirms one), a gated polite probe (one GET of the home page per spelling, robots respected, 401 403 429 and challenges stop and pause the site, a rejected or restricted assessment refuses contact), page fingerprints stored as four kinds with digests and feature vectors, a weighted similarity (navigation, assets, class vocabulary, generator, markup structure, document types), trait hints (platform and section tags), and suggestion writers for family membership and similar_to relations with basis fingerprint and a score, idempotent. Family plus overlay resolution was delivered with the structure runner. 92 pytest cases pass. No real site was contacted: the user agent must name a monitored contact channel, and none exists yet, so live probing of Kenyan county sites is left for the next run once a contact page and address are provided. Limits: one slot per pattern; subject sources are geography units and institutions; thresholds (0.6 membership, 0.5 relation) are untuned; trait keywords are English; no shared-module detection (shares_module) yet.
