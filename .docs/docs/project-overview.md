---
{id: DOC-90A97C062F8A,name: Project Overview,type: documentation}
---

# Project Overview

Mzizi Africa is an evidence-first platform for exploring African heritage, history, geography, culture, languages, governance, and public records. It connects claims to sources and preserves place, time, uncertainty, and version history.

## Product surfaces

- `source/apps/www`: public atlas and knowledge exploration experience.
- `source/apps/web`: research, review, and stewardship workbench.
- `source/apps/mobile`: Flutter client for map and civic evidence exploration.
- `source/backend/api`: NestJS product API (read-mostly).
- `source/backend/engine`: Python orchestration engine; `source/packages`: reusable capability packages; `source/schema`: input schemas and rewrite SQL; `seed/`: prepared inputs and fixtures; replaced implementations are archived under `.docs/_archives/2026-11-08-rewrite-snapshot/`.

## Work areas

See the Task groups **API**, **Mobile app**, and **Sites** for scoped activities. The Mzizi Africa group holds cross-cutting planning and the initial legacy API inventory.

## Architecture references

Read the repository `AGENTS.md` and `.docs/docs/WHY.md`, `.docs/docs/STORY.md`, `.docs/docs/ARCHITECTURE.md`, `.docs/docs/DATA_LIFECYCLE.md`, `.docs/docs/DOMAINS.md`, and `.docs/docs/MIGRATION.md` before changing domain ownership or architecture.

The mobile map client contract is documented in `.docs/docs/geography-api-contract.md`.
