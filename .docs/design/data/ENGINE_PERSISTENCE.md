---
id: DOC-ENGINE-PERSISTENCE-20261116
name: ENGINE_PERSISTENCE
type: documentation
tags: [engine, persistence, postgres, mongo, vector, design]
---

# Engine persistence

**Status: 16 November 2026. PostgreSQL and MongoDB are built; vector is a skeleton.** The engine handles all persistence. Packages never open a database: they return typed results or write through a port the engine implements. Everything is under `source/backend/engine/src/mzizi_engine/persistence/`.

```text
persistence/
  postgres/   connection.py (one connect helper), filesystem.py (the filesystem registry port over the Dryv row models)
  mongo/      store.py (MongoStore: ping, upsert_many, find, counts),
              activity.py (the crawler's Activity port: retry through outages, disk spool, replay)
  vector/     port.py (VectorStore protocol, VectorPoint, VectorHit) and UnimplementedVectorStore: every call refuses
```

## Rules

1. One store per folder. Every setting comes from the engine's single configuration file (`config/engine_config.py`, which reads the root `.env`); a store whose settings are missing fails with one error that names them. Nothing is guessed and no persistence module reads the environment.
2. A package depends on a port it defines (`RegistryRepository`, the crawler's `Activity`), never on a client library. The engine's assembly wires the implementation (`runtime/assembly/`).
3. PostgreSQL holds verified data; MongoDB holds staging and what the engine did and found; large files stay files linked by path and hash. This follows [DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md) and [DATABASE_ARCHITECTURE](DATABASE_ARCHITECTURE.md).
4. Hand-written SQL lives only in `persistence/postgres/` until Dryv generates Python repositories; the boundary check (`bun run boundaries`) fails if a database driver is imported anywhere else.
5. A write that cannot reach MongoDB is spooled to disk and replayed, so a record is not lost; the PostgreSQL adapter fails loudly instead.

## Vector (planned)

Not implemented. The port fixes the shape: a caller upserts typed points (id, vector, a string payload that traces a hit back to its source) into a named collection and searches by vector. The implementation will choose the store, the embedding model and the collection naming; none of that is decided here, and nothing in the engine may depend on a particular client.

## Not built

Persistent job and event state (jobs use the in-memory store), Dryv-generated Python repositories, per-folder authorization, and the vector implementation.
