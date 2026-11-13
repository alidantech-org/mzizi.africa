---
{id: TSK-89996CE6A1CA,name: Compliance assessment for biometric matching,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:25:42.712Z,updated_at: 2026-11-13T10:25:42.712Z,order: 9216}
---

# Compliance assessment for biometric matching

## Goal

Decide, with evidence, whether facial comparison may ever be used as a reviewer aid for person deduplication. Until an assessment explicitly approves it, no face detection, embedding or comparison is built or run.

## Context

`DEC-BIOMETRIC-MATCHING-20261113` records that biometric matching is off by default. Face templates are sensitive data under the Kenyan Data Protection Act and comparable laws, the site-policy block excludes `biometric` data, and the source-redesign research says face similarity is never proof. If approval is ever given, the use is limited to a reviewer aid on portraits an institution publishes of its own officials, with no automatic merge, no score effect above the review band and no stored templates (or only restricted and deletable ones). This task is blocked until a qualified person completes the assessment.

## Acceptance checklist

- [ ] A qualified reviewer assesses lawful basis, necessity, proportionality, retention and data-subject rights, and records the outcome in `.docs/decisions/`.
- [ ] If approved, the decision record states scope, limits, retention and the reviewer-aid-only constraint; if not approved, the record says so and no work follows.
- [ ] Any implementation task created afterwards links the approval and is reviewed against the limits.
