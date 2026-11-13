---
id: DOC-ENTITY-RESOLUTION-20261113
name: ENTITY_RESOLUTION
type: documentation
tags: [matching,candidates,people,review,proposal]
---

# Entity resolution: from extracted values to database-ready candidates

**Status: proposal, 13 November 2026.** It extends [PATTERN_MATCHING](../architecture/PATTERN_MATCHING.md), [CRAWL_AND_PURPOSE_DETECTION](../acquisition/CRAWL_AND_PURPOSE_DETECTION.md) and [PEOPLE_DESIGN](PEOPLE_DESIGN.md), and the research in `.docs/_plan/source-redesign` (files 04, 05 and 06). Binding code rules: [typed-code.md](../../rules/typed-code.md). Nothing here is implemented.

## Goal

Turn staged, extracted data into reviewable, database-ready candidates by matching each value and record to reference entities (places, institutions, offices, people, document types) with scored evidence, so that duplicates are detected, links are explainable, and people can confirm or reject uncertain matches. Meaning is built from manifest rules, scored signals and review decisions. It is not a model we train from scratch.

## Pipeline

```text
staged document ─► normalise (manifest transforms) ─► block (cheap keys) ─► compare candidate pairs
      ─► score components ─► decide: link | review | new ─► candidate (natural key, mapping version, evidence)
      ─► review (people) ─► versioned accepted data
```

1. **Normalise** with named transforms from the mapping manifest (dates, amounts, name forms). No inline string handling in code.
2. **Block** on cheap keys such as region, office, term and institution so only plausible pairs are compared.
3. **Compare** each pair with the `patterns` rule matcher first (codes, aliases, normalised and fuzzy names), then the `meaning` semantic matcher for fuzzy and multilingual text.
4. **Score** as separate, stored components (lexical, semantic, institutional and regional context, structure, source authority). Components are never collapsed into an opaque number, and weights are calibrated on reviewed labels before any automatic action. The matcher abstains when evidence is weak.
5. **Decide** with thresholds from the manifest: link automatically only on exact keys or very high calibrated confidence; send the middle band to review; otherwise propose a new record.
6. **Emit a candidate** carrying the natural key, mapping version, evidence locators, component scores, model and index versions, and the manifest hash.

## Manual mapping manifests

Manifests carry what humans know and code must not: alias tables, forced links, **cannot-link** pairs ("never merge these two"), per-domain thresholds, hard negatives (similar names that are different entities) and region scoping. A human override outranks any score and is recorded with who, when and why.

## People and the review loop

`official.individuals` is canonical. A "same person?" decision shows both records side by side with their evidence (names, aliases, office, term, region, party, source pages, portrait files) to a reviewer scoped to the region. The answer is stored as a **must-link** or **cannot-link** pair, versioned and attributable. Those pairs constrain future scoring and calibrate thresholds. Merges are reversible: a merge can later be split, and downstream records keep their evidence.

Signals for people, strongest first: a linked official profile page; name and alias match with the same office, term and region; party and institution; identical or near-duplicate portrait files (exact hash or perceptual hash). A near-duplicate image is evidence about a file, never proof about a person.

## Facial recognition: off by default

Face templates are biometric data. Biometric data is a sensitive category under the Kenyan Data Protection Act and comparable laws, the site-policy block excludes `biometric` data by default, and the plan files state that face similarity is never proof. Therefore:

- No face detection, embedding or comparison runs unless a separate decision record and a compliance assessment explicitly approve it ([DEC-BIOMETRIC-MATCHING-20261113](../../decisions/DEC-BIOMETRIC-MATCHING-20261113.md)).
- If later approved, it is a **reviewer aid only**: it suggests similar portraits for a human to compare, never merges, never auto-links and never raises a score above the review band.
- Scope limits: only portraits an institution publishes of its own officials; never children, crowd or news photographs; no stored face templates (compute on demand) or, if storage is unavoidable, restricted and deletable.

## Where it runs

The `patterns` and `meaning` packages do the matching. The engine runs resolution as job kinds over staged documents, using the `Reader` port for reference data and the staging store for working data. Candidates, review decisions and must/cannot-link pairs persist through the database service. NestJS serves the review interface. Agents may propose aliases, thresholds and links as reviewable manifest patches.

## Open decisions

- Calibration set and annotation policy (plan file 05: hold out whole sites and regions).
- Thresholds per domain and the review-band policy.
- Where must/cannot-link pairs live in the database (a Dryv contract in the review or people domain).
- Whether facial comparison is ever approved (see the decision record).
