---
{id: TSK-17B26AFBFE28,name: Validate acquisition correctness and repair observed failures,type: task,status: in-progress,priority: medium,created_at: 2026-11-15T16:03:46.977Z,updated_at: 2026-11-15T16:03:56.413Z,order: 20480,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T16:03:56.413Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-17B26AFBFE28/1794758636415-start,started_at: 2026-11-15T16:03:57.033Z}]}}}
---

# Validate acquisition correctness and repair observed failures

## Goal

Exercise the existing HTML discovery, extraction, browser traversal, attachment budgeting and PDF extraction commands against controlled cases and saved real sources, correcting defects exposed by those checks.

## Context

The IEBC malformed HTML fix now preserves sibling body content and existing Markdown has been rebuilt. Prior validation still identified missing nutrition tables, unstructured party list tables and a fresh Nairobi crawl that timed out. Review these issues using the existing engine and packages. Preserve raw evidence and use reviewed expected rows and cells for verification. Confirm that partial browser states and unsupported extraction methods remain visible as incomplete evidence. The database preparation and canonical acceptance workflow is still a separate integration boundary and must be documented accurately if its entry points are absent. Existing unrelated root suite failures should be reported separately with their actual test output.

## Acceptance checklist

- [ ] Verify PDF strategies against nutrition and party-list source layouts and fix reproducible extraction defects.
- [ ] Exercise HTML replay, merged cells, rendered media, lazy loading, continuation limits, retry and resume behavior.
- [ ] Verify attachment plans enforce source, file and byte budgets through their normal entry points.
- [ ] Run relevant package tests and root checks, document unresolved workflow gaps and save reviewable evidence.
