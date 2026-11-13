---
{id: TSK-867490967324,name: Remove the agent package and add the backend agent placeholder,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T09:53:29.800Z,updated_at: 2026-11-13T10:12:27.538Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T09:56:26.631Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-867490967324/1794563786641-start,started_at: 2026-11-13T09:56:27.291Z}]}}}
---

# Remove the agent package and add the backend agent placeholder

## Goal

The `mzizi-agent` package has about 180 lines, two tests, no providers and no callers. AGENTS.md states no standalone intelligence service exists. The user wants the package removed and a new `source/backend/agent/` folder created containing only a README, describing a future full assistive application for AI and LLMs with tooling and the ability to do heavy work.

## Context

See `.docs/design/architecture/ENGINE_JOB_MODEL.md` (section "Where the agent operates") and `DEC-ENGINE-JOB-MODEL-20261113`. The agent is a client of the engine API and only produces Proposals; the `Proposal` shape belongs in `source/schema/contracts`, not in a Python package. The engine does not import `mzizi_agent`, but the workspace configuration, `source/packages/README.md`, AGENTS.md, `source/backend/README.md` and possibly `scripts/lib/projects.ts` reference it.

## Acceptance checklist

- [ ] `source/packages/agent/` is deleted and every reference (root `pyproject.toml`, `uv.lock` workspace members, READMEs, AGENTS.md, `scripts/lib/projects.ts`, docs links) is updated or removed.
- [x] `source/backend/agent/README.md` exists as the only file, marked as a proposal, describing purpose, engine-API-only access, Proposal outputs and the four hooks from the design guide.
- [x] AGENTS.md and `source/backend/README.md` describe the placeholder accurately and no longer say the agent package exists.
- [ ] `task validate` passes and `bun run check` is run, with any pre-existing failure reported accurately.

## Comments

### 2026-11-13T10:31:51.367Z · PETER IRUNGU

Package removed, backend/agent README added, docs updated. Not done: uv.lock still lists mzizi-agent/ocr/source because 'uv lock' cannot run until the missing mzizi-database workspace member is resolved (TSK-E55B1BC4011A); bun run check not run in this session.
