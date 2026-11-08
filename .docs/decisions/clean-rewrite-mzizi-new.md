---
{id: DEC-CLEAN-REWRITE-MZIZI-NEW,name: Decision - clean schema rewrite in mzizi_new,type: decision,tags: [schema-redesign,database,policy]}
---

# Decision: clean schema rewrite in `mzizi_new`

Date: 2026-11-08. Source: explicit user instruction in the improvements-rewrite work session.

## Former policy (kept for history)

Until this decision, the schema-redesign documents and the `improvements-rewrite` tasks required that existing canonical identities, records, account/role/grant IDs and login continuity be preserved, that every change carry a data-preserving migration mapping, and that no implementation start until the user approved a design. `auth.md` still records that earlier migration strategy; it was a valid instruction at the time and is not rewritten, only superseded where stated here.

## Decision

The user approved a from-scratch schema rewrite. A separate PostgreSQL database named `mzizi_new` is created deliberately and the new schemas are built there from scratch.

- All data and schemas in `mzizi_new` are disposable and may be dropped, rebuilt and reseeded.
- Existing project data and designs are reference material. No backward compatibility, legacy ID preservation, data migration, dual writes, compatibility views or old API compatibility is required.
- Existing code is inspected for useful behavior and domain requirements, not to preserve accidental architecture.
- Task 01 (auth, `TSK-1AC8F3754DAE`) is authorized to be designed and built now. Tasks 02-06 stay planned and inherit this policy; each still needs the user to start it.

## Safety limits that remain

- Destructive operations target `mzizi_new` only. Existing databases (`mzizi`, `mzizi_dev`, `mzizi_test`) are reference sources and are never dropped by this work. Before any reset, verify the connected host and `current_database()`.
- The database engine's `_dev`/`_test` rule stays on globally. It gains one exact-name allowlist entry, `mzizi_new`, and only for the rewrite migration set.
- Product rules about provenance, raw evidence and AI attribution still shape the new designs; this decision only removes the obligation to carry old data and identifiers across.

## Consequences

Rewrite DDL lives in its own migration set under `source/backend/engine/database/rewrite/`, applied to an empty `mzizi_new`. The existing `migrations/` directory and the `_dev` database keep working untouched until the user decides to retire them.
