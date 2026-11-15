---
{id: TSK-748FB13FED4D,name: "Author auth, audit events and the change ledger, and compress Main",type: task,status: planned,priority: medium,created_at: 2026-11-15T16:32:03.829Z,updated_at: 2026-11-15T16:32:03.829Z,order: 3072}
---

# Author auth, audit events and the change ledger, and compress Main

## Goal

Create the few new or retained Postgres contracts and shrink Main to a first vertical slice. The retained pieces are six auth tables, audit events and a new append-only change ledger. Main generation is limited to reference, geography, official, governance, source and filesystem, while legal, politics, civic, finance and accountability stay authored but not generated.

## Context

The change ledger records each approval: what to write, who approved it, when, the target Main record, and a soft Mongo reference with a content hash. It makes human effort replayable if Mongo is lost. Mongo links are never foreign keys. The auth operations in `contracts/apps/database/auth.ts` need accounts, login identities, roles, permissions and role assignments. Read the existing audit decisions and management publications shapes before deciding what the ledger reuses.

## Acceptance checklist

- [ ] The six auth tables, audit events and the change ledger compile as Dryv contracts with indexes and checks.
- [ ] The database app composes only the first-slice groups, and the deferred groups are listed in the task notes.
- [ ] A named operation applies one approved ledger entry idempotently, and the contract states how.
- [ ] `bun run database:check` passes with the smaller set.
