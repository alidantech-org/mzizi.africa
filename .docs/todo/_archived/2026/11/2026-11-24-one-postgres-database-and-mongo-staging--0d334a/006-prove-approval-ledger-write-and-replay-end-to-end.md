---
{id: TSK-8BFF95F74CC0,name: "Prove approval, ledger write and replay end to end",type: task,status: archived,priority: medium,created_at: 2026-11-15T16:32:05.025Z,updated_at: 2026-11-24T19:24:30.792Z,order: 6144,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:30.792Z}]},archived_at: 2026-11-24T19:25:24.571Z}
---

# Prove approval, ledger write and replay end to end

## Goal

Show that the database design delivers its promise: a staged candidate in Mongo is approved, written to the change ledger and to Main, and after Mongo is wiped the ledger replays into an empty Main with the same result. This closes the database phase so product work can resume.

## Context

The Engine API is the only writer to Main. Applying a ledger entry must be idempotent, so applying it twice changes nothing. Use one small entity kind from the first slice, such as a county governor with its source citation and file reference. The proof runs against scratch databases only. Documentation must be updated in the same work: the decision record, database README, design guides that name Operations, and the stale links to the missing operational decision.

## Acceptance checklist

- [ ] An automated test approves a staged candidate and checks the ledger row, the Main row, the source link and the Mongo reference.
- [ ] A second test applies the same entry twice and shows no duplicate.
- [ ] A replay test wipes the staging data and rebuilds an empty Main from the ledger with matching results.
- [ ] Documentation and links are current, `task validate` passes and `bun run check` results are reported accurately.
