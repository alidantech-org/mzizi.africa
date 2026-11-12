---
{id: TSK-49353B6FB23E,name: Rewrite root README and AGENTS for current code,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T06:32:32.801Z,updated_at: 2026-11-12T06:32:36.341Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T06:32:36.341Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-49353B6FB23E/1794465158174-start,started_at: 2026-11-12T06:32:39.693Z}]}}}
---

# Correct root guidance against the active source tree

## Goal

Make `README.md` a concise product and codebase orientation, and make `AGENTS.md` an accurate set of contributor and agent instructions. Their source maps and linked documentation must describe the repository's real structure and avoid presenting archive paths, future services, or unimplemented capabilities as active code.

## Context

The user supplied the source layout to use: applications under `source/apps/{mobile,web,www}`, four backend projects under `source/backend/{api,database,engine,pipelines}`, reusable Python libraries under `source/packages/{agent,extraction,filesystem,manifest,ocr,scraping,source}`, and contracts, database SQL, pipeline, seed and site schemas under `source/schema/`. Actual code inspection found the NestJS API, TypeScript database service, Python orchestration engine, and Temporal worker are present. The research web app and mobile client still have inherited or development constraints. There is no `source/packages/database/` workspace member even though engine/filesystem configuration imports `mzizi-database`; document this mismatch as unresolved instead of claiming a package exists. Current app entry points are linked to additional README files that also contain stale paths and ports, so those references must be reconciled in the same change.

## Acceptance checklist

- [ ] Rewrite the root README as a clear introduction and exact source map with current implementation status.
- [ ] Rewrite AGENTS.md as actionable engineering guidance using the actual active paths and current service boundaries.
- [ ] Correct stale paths, API ports, commands and implementation claims in the core system and directly referenced source READMEs.
- [ ] Ensure the user-provided source hierarchy is represented accurately, including a clear note for the unresolved `mzizi-database` workspace reference.
- [ ] Verify local links and run `task validate`; report any unrelated existing failures without hiding them.
- [ ] Review and record the final diff, complete this task, and archive its Task group.
