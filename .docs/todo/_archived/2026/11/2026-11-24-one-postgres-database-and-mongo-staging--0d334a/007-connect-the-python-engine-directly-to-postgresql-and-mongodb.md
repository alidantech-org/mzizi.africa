---
{id: TSK-62EF5EDA082C,name: Connect the Python engine directly to PostgreSQL and MongoDB,type: task,status: archived,priority: medium,created_at: 2026-11-15T16:54:06.004Z,updated_at: 2026-11-24T19:24:38.768Z,order: 7168,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:38.768Z}]},archived_at: 2026-11-24T19:25:24.571Z}
---

# Connect the Python engine directly to PostgreSQL and MongoDB

## Goal

Replace the removed database-service client in the engine with direct PostgreSQL access under the `mzizi_engine` role, and give the engine MongoDB access for staging, run state and events. After this task the engine starts, authenticates callers, stores job state, events and the callback outbox without any database service, and promoted facts reach PostgreSQL only through named engine operations.

## Context

The engine currently selects `ENGINE_STORE=database_service` with `DATABASE_SERVICE_URL` and a token for accounts, permissions, jobs, events and the outbox, and its filesystem code uses an explicit legacy PostgreSQL URL. `source/backend/engine/src/mzizi_engine/ports/database.py` is the only place the Python workspace may know a database exists; packages stay pure. Job, event and outbox persistence moves to MongoDB (per the owner decision), while accounts and permissions read the Postgres auth schema. Typed row and document models come from the generated Python models task. Connection settings use `MZIZI_DB_URL` and a Mongo URL.

## Acceptance checklist

- [ ] The engine reads accounts and permissions from the Postgres auth schema through its own role, with typed rows and no free dictionaries.
- [ ] Jobs, events and the outbox persist in MongoDB through typed documents, and the memory store remains for tests.
- [ ] The engine filesystem metadata code uses the same single connection settings and the legacy URL variable is removed.
- [ ] Engine tests pass against scratch PostgreSQL and Mongo instances, and any failure is reported with its cause.
