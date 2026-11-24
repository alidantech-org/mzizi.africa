---
{id: GOAL-GRP-BD59F40D334A,name: One Postgres database and Mongo staging goal,type: documentation,extra: {created_at: 2026-11-15T16:32:02.592Z,group: GRP-BD59F40D334A}}
---

# Goal

Replace the two-Postgres design with one verified-data Postgres database plus Mongo contracts for staging, and get every database need working before any other product work starts. Success is measured by one Dryv contract tree that compiles, generates SQL and Rust models for a single store, runs on a fresh empty Postgres, has Python models for the Mongo document types, and passes an end-to-end proof: approve a staged candidate, write the change ledger and the Main record, wipe Mongo, and replay the ledger into an empty Main.

## Scope

Moving and trimming Dryv contracts, removing the Operations store from Dryv and the Rust service, authoring the small set of new tables, regenerating, and proving the approval and replay path. Product features, new data sources and user interfaces are out of scope until this group is finished.

## Constraints

No existing database, migration release or S3 object is deleted. Work stays on develop. The owner decision is DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.
