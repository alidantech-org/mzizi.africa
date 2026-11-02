---
{id: TSK-F4228868E735,name: "Generate domain, place and statistics read API and document how to run Dryv",type: task,status: completed,priority: medium,created_at: 2026-11-02T22:25:03.526Z,updated_at: 2026-11-02T22:25:03.526Z,order: 43008}
---

## Goal

Make Dryv generation reproducible for any agent on this machine and generate the missing read endpoints for the domain, place and statistics modules, which had been reported as "cannot run here".

## Context

The Dryv engine API at `~/Projects/personal/alidantech-org/codepot/dryv` does start (port 8750). The contracts for domains, places and statistics had been authored but not generated, so the API had no read endpoints for them. Generation ends at the typecheck stage whenever a new operation is added because project-owned `*.service.impl.ts` files are never regenerated; here the statistics read service lacked ten methods. The steps and traps are now written in `.docs/guidance/running-dryv.md` so the next agent does not stop at "cannot run".

## Acceptance

- [x] Dryv engine API started and generation run (187 created, 52 modified).
- [x] Statistics read service implementation completed so the API typechecks.
- [x] `generated:check`, `access:export` and the API unit suite (15,864 passing) are clean.
- [x] Run guide written in `.docs/guidance/running-dryv.md` and the status document updated.
