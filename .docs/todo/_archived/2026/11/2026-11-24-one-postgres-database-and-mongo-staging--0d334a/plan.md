---
{id: GRP-BD59F40D334A,name: One Postgres database and Mongo staging,type: documentation,extra: {created_at: 2026-11-15T16:32:02.592Z}}
---

# Plan

## Approach

Work in small, checkable steps so a failure is always mechanical. First move files without changing behaviour, then remove the Operations store, then author the few new contracts, then regenerate and run on a fresh database, then add Mongo contracts, then prove the approval and replay path end to end. Each task has its own acceptance checks, and the work pauses for owner review after the structural steps.

## Milestones

1. Contracts live under one postgres folder with unchanged behaviour.
2. Dryv and the Rust service know a single store.
3. Auth subset, audit events and change ledger are authored and Main is compressed to the first slice.
4. SQL and Rust models regenerate and run on a fresh Postgres.
5. Mongo document contracts produce Python models.
6. The replay proof passes and documentation is current.

## Risks

Generation depends on a local Dryv checkout and API outside this repository. Generated SQL, Rust models and migrations are stale and will change heavily. The geometry column is still a placeholder. Some existing checks already fail for unrelated reasons and must be reported accurately. The Mongo generator is a spike with no existing pack.
