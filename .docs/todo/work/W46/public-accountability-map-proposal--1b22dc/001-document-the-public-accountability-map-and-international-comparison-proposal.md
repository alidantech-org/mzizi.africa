---
{id: TSK-C9561447F396,name: Document the public accountability map and international comparison proposal,type: task,status: completed,priority: medium,created_at: 2026-11-15T08:38:19.099Z,updated_at: 2026-11-15T08:57:53.548Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T08:38:21.144Z},{from: in-progress,to: completed,at: 2026-11-15T08:38:26.300Z},{from: completed,to: in-progress,at: 2026-11-15T08:57:48.362Z},{from: in-progress,to: completed,at: 2026-11-15T08:57:53.548Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C9561447F396/1794731901146-start,started_at: 2026-11-15T08:38:21.801Z,end_ref: refs/tracking/TSK-C9561447F396/1794731906310-end,ended_at: 2026-11-15T08:38:26.300Z,summary: {files: 0,insertions: 0,deletions: 0}},{base_ref: refs/tracking/TSK-C9561447F396/1794733068364-start,started_at: 2026-11-15T08:57:48.892Z,end_ref: refs/tracking/TSK-C9561447F396/1794733073550-end,ended_at: 2026-11-15T08:57:53.548Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Document the public accountability map and international comparison proposal

## Goal

Record, in the planning documents, a proposal for a source-linked map of Kenyan public bodies and public money, together with a cross-country comparison layer. The outcome is one proposal document that a future task group can pick up, so the discussion that produced it (how Kenya's constitutional, statutory and executive bodies differ, who controls them, where the money goes and how other countries compare) is not lost in chat. This task documents the idea only. It does not approve schemas, migrations, seed data or code.

## Context

Kenya has no single official register of public bodies, and the classification of a body (constitutional, statutory or executive) depends on its founding instrument, not its name or web domain. The proposal lives at `.docs/_plan/guides/public-accountability-map-and-international-comparison.md` and is linked from `.docs/_plan/README.md`. Proposals under `.docs/_plan/` are not proof of implementation or approval, and the plan index says task groups are created only when the user directs them. Figures quoted in the originating discussion (headcounts, budget shares, county allocations, the claim that one county built 32 hospitals) were from memory and are unverified. The proposal must stay aligned with the approved Phase 01 civic accountability schemas and must not add schemas.

## Acceptance checklist

- [x] The proposal document exists under `.docs/_plan/guides/` with valid frontmatter and states clearly that it is a planning proposal with no implementation authorised.
- [x] The plan index `.docs/_plan/README.md` links to the document with an accurate one-line purpose.
- [x] The document marks all quoted Kenyan figures as unverified and lists verification against the Economic Survey, budget documents and Controller of Budget reports as a next step.
- [x] The placement of each need against the Phase 01 schemas is recorded as unconfirmed, with the open question about foreign institutions and indicators stated.
- [x] `task validate` passes with no new findings from these files.
- [x] A supporting design guide exists under `.docs/design/data/` and is linked from that folder's README.
- [x] `.docs/docs/DOMAINS.md` and `.docs/docs/ROADMAP.md` point to the design guide and say it is an unapproved proposal, without adding a ninth file to `.docs/docs/`.
- [x] `task validate` passes after the follow-up edits.

## Notes

No branches, worktrees, database changes or source-code changes are part of this task.
