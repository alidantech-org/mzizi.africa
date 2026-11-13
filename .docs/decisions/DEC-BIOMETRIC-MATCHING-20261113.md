---
id: DEC-BIOMETRIC-MATCHING-20261113
name: Biometric matching is off by default and needs a compliance assessment
type: decision
tags: [biometric,people,compliance]
---

# Decision: facial recognition is off by default

**Date:** 2026-11-13 · **Status:** proposed

## Decision

1. No face detection, face embedding or face comparison runs in Mzizi by default. The site-policy `biometric` exclusion stands.
2. Person deduplication uses non-biometric evidence first: linked official pages, names and aliases, office, term, region, party, and exact or perceptual image-file equality (evidence about files, not people).
3. Same-person decisions are made by regional reviewers and stored as versioned must-link and cannot-link pairs.
4. Facial comparison may be proposed later only after a compliance assessment explicitly approves it. If approved, it is a reviewer aid only: it never merges, links or raises a score into automatic action, applies only to portraits an institution publishes of its own officials, and stores no face templates (or only restricted, deletable ones).

## Why

Face templates are biometric data, a sensitive category under the Kenyan Data Protection Act and comparable laws, even for public officials. `LEGALITY_SAFETY_AND_COMPLIANCE.md` and the site spec exclude biometric data by default, and the source-redesign research states that face similarity alone is never proof of identity. Non-biometric signals plus human review are explainable, reversible and lower risk.

## Consequences

- See [ENTITY_RESOLUTION](../design/data/ENTITY_RESOLUTION.md).
- A task tracks the compliance assessment; nothing is built until it concludes.
