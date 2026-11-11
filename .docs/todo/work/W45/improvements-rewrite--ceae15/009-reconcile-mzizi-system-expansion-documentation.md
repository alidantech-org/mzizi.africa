---
{id: TSK-744E1FD3DEFB,name: Reconcile Mzizi system expansion documentation,type: task,status: completed,priority: medium,created_at: 2026-11-11T11:23:13.756Z,updated_at: 2026-11-11T11:31:42.862Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T11:23:17.952Z},{from: in-progress,to: completed,at: 2026-11-11T11:31:42.862Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794396197962-start,started_at: 2026-11-11T11:23:18.861Z,end_ref: refs/tracking/TSK-744E1FD3DEFB/1794396702864-end,ended_at: 2026-11-11T11:31:42.862Z,summary: {files: 35,insertions: 870,deletions: 13}}]}}}
---

# Reconcile and publish the Mzizi system expansion documentation

## Goal

Make the expanded Mzizi Africa vision understandable and consistent across the central proposal, improvement indexes, domain design documents and project architecture documentation. The result must distinguish active implementation, existing design proposals, user-confirmed decisions and new hypothetical ideas. It must help a future architect work through the expanded knowledge system without treating proposed domains or tables as approved SQL.

## Context

The user supplied a documentation-only handoff dated 11 November 2026. The working proposal already exists at `.docs/improvements/advancement-and-system-expansion.md`; it is untracked at task start and must be preserved and reconciled rather than discarded. The connected Reference–Geography–Legal foundation and Task 03 (`TSK-7E5E18758D9C`) remain controlling for that bounded work. Task 04 (`TSK-D6949284672E`) is broader downstream schema design and must not be silently completed or expanded into implementation. Work directly on `develop`; do not modify SQL, migrations, seeds, runtime contracts, applications, infrastructure, production data or `.github/**`. Use Task CLI, preserve existing user review notes, and run `task validate` after documentation changes.

## Acceptance checklist

- [x] Audit active schemas/contracts and relevant design documents; label existing implementation, prior proposals, confirmed decisions, hypothetical expansion and unresolved questions accurately.
- [x] Refine the central system-expansion proposal with candidate domains/tables, domain ownership, spatial and temporal semantics, acquisition/evidence lifecycle, query and UI/API capabilities, technical standards and open decisions.
- [x] Reconcile the improvements index, master redesign register, schema-redesign index and justified existing domain design files without erasing previous findings or conflating actual and proposed schema counts.
- [x] Update main project purpose, story, architecture, lifecycle, domains and migration documentation only where needed, retaining all unimplemented ideas as proposals.
- [x] Verify cross-domain ownership and FK logic for Geography/Civic, Environment/Statistical, Biology/Agriculture, Agriculture/Economy, Economy/Statistical, History/Activity, History/Geography, History/Heritage, and Person/Statistical.
- [x] Check Markdown frontmatter, relative links, index references, schema-count wording, proposal status and documentation-specific consistency; record remaining architectural questions.
- [x] Run `task validate`; report its result and confirm the work stayed documentation-only with no Task 03 acceptance status changes.
