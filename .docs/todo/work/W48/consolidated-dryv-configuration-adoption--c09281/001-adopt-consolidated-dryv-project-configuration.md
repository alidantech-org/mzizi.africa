---
{id: TSK-CA4DBAECB998,name: Adopt consolidated Dryv project configuration,type: task,status: completed,priority: medium,created_at: 2026-11-25T13:11:34.997Z,updated_at: 2026-11-25T13:39:37.729Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T13:13:22.901Z},{from: in-progress,to: completed,at: 2026-11-25T13:17:59.892Z},{from: completed,to: in-progress,at: 2026-11-25T13:20:35.213Z},{from: in-progress,to: completed,at: 2026-11-25T13:20:37.230Z},{from: completed,to: in-progress,at: 2026-11-25T13:35:13.167Z},{from: in-progress,to: completed,at: 2026-11-25T13:39:37.729Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-CA4DBAECB998/1795612402904-start,started_at: 2026-11-25T13:13:25.737Z,end_ref: refs/tracking/TSK-CA4DBAECB998/1795612679898-end,ended_at: 2026-11-25T13:17:59.892Z,summary: {files: 8,insertions: 138,deletions: 0}},{base_ref: refs/tracking/TSK-CA4DBAECB998/1795612835223-start,started_at: 2026-11-25T13:20:36.292Z,end_ref: refs/tracking/TSK-CA4DBAECB998/1795612837232-end,ended_at: 2026-11-25T13:20:37.230Z,summary: {files: 1,insertions: 0,deletions: 7}},{base_ref: refs/tracking/TSK-CA4DBAECB998/1795613713178-start,started_at: 2026-11-25T13:35:14.779Z,end_ref: refs/tracking/TSK-CA4DBAECB998/1795613977731-end,ended_at: 2026-11-25T13:39:37.729Z,summary: {files: 2,insertions: 30,deletions: 36}}]}}}
---

# Adopt consolidated Dryv project configuration

## Goal

Adopt the consolidated Dryv project configuration approved in the Dryv conversation. The project continues using its existing dryv folder, independent authoring roots, custom packs and explicit application destinations. Add workspace.path and servers.api to dryv.yaml, preserve every existing source and destination reference, and leave the obsolete project dryv.server.yaml file untouched and unused. Seed agent instructions, a portable skills index and skills inside dryv, and add a short managed root AGENTS.md pointer. Preserve all existing repository rules and the authored backend-only Dryv README, including ongoing uncommitted edits. This task does not relocate files, apply generated application output, change backend/frontend contracts or alter database data. Validation uses the updated local Dryv checkout and records any local service or pre-existing project limitations accurately. Machine caches and validation reports stay outside the project. Cross-reference Dryv validation task TSK-76D0B0AB7CD9 in the sibling Dryv workspace for implementation evidence. The canonical v1alpha1 contract family is extended in place; no contract migration or version family is introduced.

## Context

The Dryv CLI and VS Code now consume client settings directly from dryv.yaml. Mzizi already has a working folder and root agent instructions; this adoption updates only those integration surfaces and preserves active work.

## Acceptance checklist

- [x] Add workspace and API settings without changing explicit source/destination paths.
- [x] Seed managed documentation and portable skills while preserving existing authored content.
- [x] Validate typed project settings and skill files and run available planning/generation previews without applying output.

## Comments

### 2026-11-25T13:17:08.225Z · PETER IRUNGU

Added workspace.path=dryv, servers.api=http://127.0.0.1:8750 and ignore=[] without changing any existing project settings. Seeded managed guides and portable skills, preserving the existing backend-only README and root rules. All three skills validate. CLI server inspect resolves the project endpoint. Full usage validation, live plan and generation preview reproduce the existing missing #/actions/format-dart reference on destination app-app; before/after typed validation shows the identical error. No generated application output was applied. Task validation also reports the pre-existing untracked .docs/SETUP.md without frontmatter. These unrelated ongoing edits were preserved.

### 2026-11-25T13:20:36.740Z · PETER IRUNGU

Follow-up user instruction supersedes the original decision to leave the obsolete file untouched: removed the root dryv.server.yaml. Confirmed workspace.path, servers.api and ignore remain in dryv.yaml, and the working-folder README, AGENTS.md, skills index and all three skills are present. Static CLI server validation passes using dryv.yaml. References to the separate Dryv API deployment manifest in the external Dryv checkout remain valid and were preserved.

### 2026-11-25T13:35:15.646Z · PETER IRUNGU

Approved follow-up: convert every inline command in Mzizi project actions into the new top-level commands list, referencing unique IDs from actions. Preserve exact argv, stages, extension filters, dependencies, action order, source/destination paths and unrelated work. Add formatter ignore directives so argv remains on one source line; refresh managed documentation. Validate exact inline/reference equivalence and formatter stability after Dryv implementation gates pass, and report the existing missing format-dart action independently.

### 2026-11-25T13:39:36.818Z · PETER IRUNGU

Reusable-command follow-up implemented: all seven inline project action commands are now declared once in top-level commands and referenced by ID. Every argv, metadata field, stage, filter and action ordering matches the pre-conversion configuration; sources, destinations and other settings are unchanged. Each registry run array occupies one source line with a Prettier ignore directive, and Prettier validation passes. Managed documentation now explains command references. Engine/CLI regression tests and an isolated live API/Jinja proof passed file-action and final-action execution through command IDs, including custom staging and exact argv. Mzizi live validation reaches its unchanged missing format-dart action reference; no generated Mzizi application files were applied. Global Task validation still reports unrelated SETUP.md missing frontmatter.
