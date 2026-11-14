---
{id: TSK-5B87CAA82291,name: Remove unused shared read surface helpers,type: task,status: completed,priority: medium,created_at: 2026-11-14T06:04:01.198Z,updated_at: 2026-11-14T06:04:17.777Z,order: 17408,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-14T06:04:07.369Z},{from: in-progress,to: completed,at: 2026-11-14T06:04:17.777Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-5B87CAA82291/1794636247371-start,started_at: 2026-11-14T06:04:07.890Z,end_ref: refs/tracking/TSK-5B87CAA82291/1794636257779-end,ended_at: 2026-11-14T06:04:17.778Z,summary: {files: 2,insertions: 0,deletions: 81}}]}}}
---

# Remove unused shared read surface helpers

## Goal

Delete the unused helper block in the shared schema file. Keep the active database contracts focused on explicitly registered domain operations and remove documentation that still points readers to the old helper.

## Context

The helper was responsible for assembling legacy list and detail operation declarations from a generic specification. Searches of the current checkout found no active callers. The only current references outside the block are in an outdated README bullet, while archived task records describe the historical work. The shared schema file also holds failure declarations and reusable properties used by the database app. The scope of this change starts at the obsolete helper heading. The database contract checks will exercise the current schema and operation entrypoint after the cleanup.

## Acceptance checklist

- [x] Remove the obsolete helper interface, constants, and functions below the heading.
- [x] Remove the active README reference and preserve historical task records.
- [x] Run the database contract checks and confirm that no active references remain.
