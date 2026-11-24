---
{id: TSK-A0CC1B548DB3,name: Document the developer portal and reconcile acquisition guides,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:26:12.897Z,updated_at: 2026-11-17T07:33:25.387Z,order: 26624,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:26:20.406Z},{from: in-progress,to: completed,at: 2026-11-17T07:33:24.797Z},{from: completed,to: archived,at: 2026-11-17T07:33:25.387Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A0CC1B548DB3/1794900380408-start,started_at: 2026-11-17T07:26:20.919Z,end_ref: refs/tracking/TSK-A0CC1B548DB3/1794900804808-end,ended_at: 2026-11-17T07:33:24.798Z,summary: {files: 47,insertions: 429,deletions: 121}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Document the developer portal and reconcile acquisition guides

## Goal

Make the developer portal and agent parity direction discoverable in one authoritative guide, with a decision record that distinguishes the approved direction from capabilities already running and choices still open for implementation.

## Context

The owner selected HTTP parity for the portal, CLI and future agent, including replay. The first pilot uses saved IEBC constituency-office evidence and a shared data workspace. It compares the portal with an API client, evaluates code-based CSV drafts, and ends at export for owner review. Several acquisition and runtime guides still describe the retired website schema layout, older database service and workflow, or the replay command as operational. Reconcile the affected active docs and preserve dated material with visible supersession links. The scope is documentation only. Implementation tasks will be drafted separately after review.

## Acceptance checklist

- [x] Publish the portal design and linked decision, with current capability status, the evidence workflow, examples and implementation dependencies.
- [x] Reconcile overview, acquisition, jobs, persistence, seed and component guidance with current code and the agreed direction.
- [x] Validate the Task workspace and affected links, review the diff and preserve concurrent code changes.

## Comments

### 2026-11-17T07:33:23.904Z · PETER IRUNGU

Published the developer portal guide and decision. Aligned active docs on HTTP replay status, source schema and code grammar, engine and database responsibilities, workspace and seed approval boundaries. Verified all eight overview documents remain, 198 relative link destinations resolve across 41 documentation files, manifest examples resolve with 8 codes and zero problems, and the worked examples match generated seed fields and the existing Changamwe identifier. Task validation and git diff --check passed. The root check reports unrelated format, lint, typing, structure and test failures, including the missing policy fixture and web catalog mismatch. No runtime, schema or seed data changes and no implementation tasks were created for this documentation pass.
