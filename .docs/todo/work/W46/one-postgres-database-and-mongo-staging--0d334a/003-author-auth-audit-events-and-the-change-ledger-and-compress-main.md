---
{id: TSK-748FB13FED4D,name: Author the change ledger and compress Main to a first slice,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:32:03.829Z,updated_at: 2026-11-15T16:54:08.084Z,order: 3072}
---

# Author the change ledger and compress Main to a first slice

## Goal

Add the one genuinely new Postgres contract, the append-only change ledger, and decide how much of Main is generated now. The ledger records each approval (what to write, who approved, when, the target Main record, a soft Mongo reference with a content hash) so human effort is replayable if Mongo is lost. Main compression to a first vertical slice (reference, geography, official, governance, source, filesystem) is decided here.

## Context

Auth (11 tables) and audit (2 tables) were kept in Postgres unchanged and moved to the main store; trimming auth to six tables is deferred because role assignments reference scopes, memberships and delegations. All twelve schemas and 94 tables are currently generated; compressing means removing legal, politics, civic, finance and accountability from the app composition without deleting their files. The ledger replaces the former publications, publication items and the staging promotion request. Read the existing audit decisions shape before deciding what the ledger reuses. Mongo links are never foreign keys.

## Acceptance checklist

- [ ] The change ledger compiles as a Dryv contract with indexes and checks, and the replay and idempotency rules are stated in the contract.
- [ ] A decision on which groups the database app composes now is written here, and deferred groups are listed.
- [ ] A named operation applies one approved ledger entry idempotently, and its contract states how.
- [ ] `bun run database:check` passes and the snapshot is regenerated and still applies to a fresh database.
