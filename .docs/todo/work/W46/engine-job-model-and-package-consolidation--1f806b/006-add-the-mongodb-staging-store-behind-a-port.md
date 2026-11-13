---
{id: TSK-3F69817EB7B5,name: Add the MongoDB staging store behind a port,type: task,status: planned,priority: medium,created_at: 2026-11-13T09:53:31.236Z,updated_at: 2026-11-13T09:53:31.236Z,order: 6144}
---

# Add the MongoDB staging store behind a port

## Goal

Add a temporary, schemaless document store so collected data does not have to be handled as large JSON or CSV files. The engine and the database writer share it, and the agent gets a scratch area through the engine API. Staged data expires automatically and is never canonical.

## Context

Decided in `DEC-ENGINE-JOB-MODEL-20261113`: one collection per domain (for example `geography_raw`, `legal_raw`) with mock, non-exact mirrors of domain schemas, a provenance envelope on every document (job id, source, artifact hash, observed time, optional slot hints for later mapping) and a TTL index for maximum age. Raw artifact bytes stay in the object store. Access is only through a `StagingStore` port with a Mongo adapter and an in-memory adapter. Hosting, credentials and the list of collections are open and must be settled here.

## Acceptance checklist

- [ ] The `StagingStore` port is defined with put, get, query, delete and expiry operations and a required provenance envelope.
- [ ] A Mongo adapter creates per-domain collections with TTL indexes, and an in-memory adapter passes the same contract tests.
- [ ] A namespaced scratch area for the agent exists and is reachable only through authorised engine API routes.
- [ ] A job step stages extracted data and a second step reads it back by reference without loading large files into memory.
- [ ] Local development setup, configuration and the design guide are updated.
