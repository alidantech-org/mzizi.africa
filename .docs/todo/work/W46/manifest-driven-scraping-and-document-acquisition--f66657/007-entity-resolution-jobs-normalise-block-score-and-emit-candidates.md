---
{id: TSK-163EBB9A74F9,name: "Entity resolution jobs: normalise, block, score and emit candidates",type: task,status: planned,priority: medium,created_at: 2026-11-13T10:25:42.181Z,updated_at: 2026-11-13T10:25:42.181Z,order: 7168}
---

# Entity resolution jobs: normalise, block, score and emit candidates

## Goal

Add engine job kinds that turn staged extracted data into database-ready candidates by normalising values with manifest transforms, blocking on cheap keys, comparing pairs with the rule and semantic matchers, scoring with stored components and deciding link, review or new, with full evidence.

## Context

See `.docs/design/data/ENTITY_RESOLUTION.md`. Matching uses the `patterns` and `meaning` packages and manual mapping manifests (aliases, forced links, cannot-link pairs, thresholds, hard negatives). Score components are stored separately and weights are calibrated on reviewed labels before any automatic link; automatic links happen only on exact keys or very high calibrated confidence. Candidates carry the natural key, mapping version, evidence locators, model and index versions and the manifest hash. Staged data comes from the temporary store; reference data comes through the `Reader` port.

## Acceptance checklist

- [ ] Typed contracts exist for match features, score components, decisions and candidates, with the unresolved dynamic parts confined to parse modules.
- [ ] A resolution job normalises, blocks, compares and scores, and records component scores, thresholds used, and abstentions.
- [ ] Manifest overrides (forced link, cannot-link, alias, threshold) are applied and outrank scores, and are recorded with provenance.
- [ ] Calibration tooling computes thresholds from reviewed pairs on whole-site and whole-region held-out sets.
- [ ] Candidates are delivered through the database service and tested end to end on fixture data.
