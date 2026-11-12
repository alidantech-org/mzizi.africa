---
{id: TSK-E9211F81D1F6,name: Replace jurisdiction references with country references,type: task,status: completed,priority: medium,created_at: 2026-11-12T10:18:39.790Z,updated_at: 2026-11-12T10:22:03.072Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T10:18:47.510Z},{from: in-progress,to: completed,at: 2026-11-12T10:22:03.072Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E9211F81D1F6/1794478727521-start,started_at: 2026-11-12T10:18:47.969Z,end_ref: refs/tracking/TSK-E9211F81D1F6/1794478923075-end,ended_at: 2026-11-12T10:22:03.073Z,summary: {files: 5,insertions: 34,deletions: 30}}]}}}
---

# Replace jurisdiction references with country references

## Goal

Align the authored database contracts and current schema decision records with the product direction that jurisdiction terminology is being removed. Operational authorization scopes that previously carried `jurisdiction_ref_id` should carry `country_ref_id`, and the unapproved Main geography candidate should name countries rather than jurisdictions. Country links from Operational remain typed identifiers because Main and Operational are separate databases and cannot share a database-enforced foreign key.

## Context

The approved Operational baseline is recorded in `.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md`, and its Auth inventory is repeated in `.docs/_plan/schema-redesign/mzizi-operational-db/auth.md`. The user has explicitly directed that the prior `jurisdiction_ref_id` naming be replaced and that Main remove the jurisdiction concept in favor of countries. This instruction supersedes the earlier exact-name inventory for this field, while retaining the approved table count and all other approved fields. The Main geography contract is still a review-required shell; this change must not activate or fully define it. The active API contains older generated and legacy domain surfaces with jurisdiction terminology, so this task must identify whether those artifacts have an authoritative generator/source before changing them; do not perform a blind repository-wide replacement or alter archives.

## Acceptance checklist

- [x] Replace `jurisdiction_ref_id` with `country_ref_id` in `auth.scopes`, preserving its optional typed-reference semantics and the rest of the approved table contract.
- [x] Update the Operational approval decision and Auth design inventory to record the user-directed field rename and country-based relationship boundary.
- [x] Rename the unapproved Main geography candidate from `geography.jurisdictions` to a countries candidate without activating or authoring an unreviewed table definition.
- [x] Audit active source and documentation references; update only authoritative current schema surfaces, and record any generated/legacy scope that cannot be safely changed from its source of truth.
- [x] Run formatting/typecheck and contract checks appropriate to the changed code, plus `task validate` and `git diff --check`.
- [ ] Update this task with results and complete it only when all scoped changes and validations are accurate.

## Constraints

Work directly on `develop`. Do not apply migrations, alter a live database, deploy, or treat the Main candidate as approved. Preserve historical archives and distinguish legacy implementation from the current schema target.
