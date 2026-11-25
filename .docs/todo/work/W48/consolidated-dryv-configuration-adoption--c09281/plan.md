---
{id: GRP-D8D2D5C09281,name: Consolidated Dryv configuration adoption,type: documentation,extra: {created_at: 2026-11-25T13:11:22.924Z}}
---

# Consolidated Dryv configuration adoption

Adopt the consolidated Dryv project configuration approved in the Dryv conversation. The project continues using its existing dryv folder, independent authoring roots, custom packs and explicit application destinations. Add workspace.path and servers.api to dryv.yaml, preserve every existing source and destination reference, and leave the obsolete project dryv.server.yaml file untouched and unused. Seed agent instructions, a portable skills index and skills inside dryv, and add a short managed root AGENTS.md pointer. Preserve all existing repository rules and the authored backend-only Dryv README, including ongoing uncommitted edits. This task does not relocate files, apply generated application output, change backend/frontend contracts or alter database data. Validation uses the updated local Dryv checkout and records any local service or pre-existing project limitations accurately. Machine caches and validation reports stay outside the project. Cross-reference Dryv validation task TSK-76D0B0AB7CD9 in the sibling Dryv workspace for implementation evidence. The canonical v1alpha1 contract family is extended in place; no contract migration or version family is introduced.
