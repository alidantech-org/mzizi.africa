---
{id: TSK-E22A8A227D4B,name: Statistical quality and reconciliation between sources,type: task,status: in-progress,priority: medium,created_at: 2026-11-02T19:25:52.713Z,updated_at: 2026-11-03T01:24:49.988Z,order: 9216,depends_on: [TSK-ACEF2C1816E2],extra: {status_history: [{from: planned,to: completed,at: 2026-11-03T01:24:40.168Z},{from: completed,to: in-progress,at: 2026-11-03T01:24:49.988Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E22A8A227D4B/1793669089990-start,started_at: 2026-11-03T01:24:50.510Z}]}}}
---

# Statistical quality and reconciliation between sources

## Goal

Detect and record disagreement between statistical sources instead of picking one silently: KNBS against HDX against WorldPop for population, official area against computed area, IEBC registers against census adult population.

## Context

Different publishers count the same thing differently, use different reference dates, and sometimes contain errors from scanning or transcription, as the OCR work on the budget summary already showed. Quality rules must run over the loaded statistics and write findings that a reviewer, an AI agent or a person, can accept, resolve or dispute: a ward whose population exceeds its constituency, a constituency whose voters exceed its adult population, a density above a plausibility bound, a unit missing a figure that its siblings have, a source figure that changed between releases. Findings reuse the staging issue and review machinery so a decision names the account that made it, and a disputed figure carries a disputed verification state until resolved. Reports are produced per source and per geography level so gaps are visible, and source rankings are not hard-coded: the reviewer decides which figure is canonical and the rejected figure remains as history.

## Acceptance checklist

- [x] Write the rule set (parent equals sum of children, plausibility bounds, cross-source tolerances, missing siblings).
- [x] Run the rules over every loaded dataset and store findings with the figures involved.
- [x] Add a review path for findings: accept, resolve or dispute, recorded against the deciding account.
- [x] Produce a per-source and per-level coverage and quality report in the status document.
- [x] Add tests with deliberately inconsistent fixture data.
