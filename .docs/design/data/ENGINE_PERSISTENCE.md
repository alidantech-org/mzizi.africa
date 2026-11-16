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
              activity.py (the crawler's Activity port: retry through outages, disk spool, replay),
              run_ledger.py and run_codec.py (spec runs, leases and checkpoints),
              host_governor.py (shared host permits over generated documents)
  redis/      host_governor.py (optional Redis atomic host permit store)
  vector/     port.py (VectorStore protocol, VectorPoint, VectorHit) and UnimplementedVectorStore: every call refuses
```

## Rules

1. One store per folder. Every setting comes from the engine's single configuration file (`config/engine_config.py`, which reads the root `.env`); a store whose settings are missing fails with one error that names them. Nothing is guessed and no persistence module reads the environment.
2. A package depends on a port it defines (`RegistryRepository`, the crawler's `Activity`), never on a client library. The engine's assembly wires the implementation (`runtime/assembly/`).
3. PostgreSQL holds verified data; MongoDB holds staging and what the engine did and found; large files stay files linked by path and hash. This follows [DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md) and [DATABASE_ARCHITECTURE](DATABASE_ARCHITECTURE.md).
4. Hand-written SQL lives only in `persistence/postgres/` until Dryv generates Python repositories; the boundary check (`bun run boundaries`) fails if a database driver is imported anywhere else.
5. The crawler's activity adapter spools failed writes for replay. Run-ledger writes fail synchronously, and the run store retains the local copy of each emitted audit event.

## Run ledger

The engine generates the documents for `runs`, `run_events`, `run_artifacts` and `run_summaries` from [run-ledger.ts](../../../dryv/contracts/schemas/mongo/run-ledger.ts). The Mongo adapter writes those models using the generated field aliases. It checks the spec hash on read and compares the previous state before a transition. Dryv currently generates the document schemas, so the adapter creates the TTL index after resolving the generated `expiresAt` field. Run events and idle host-permit state have TTL indexes. Run records and permanent summaries remain available.

## Seeds and approved files

Approved files (the seed manifest today, accepted evidence later) live in S3 under `<access>/<path>` with their folders, files and versions in the Postgres `filesystem` schema. `filesystem.sync_seed` plans placements from `seed/manifest.yaml` and the `_folder.yaml` descriptors and registers them through the filesystem package; folder roles are reference values the engine creates on first use (`persistence/postgres/reference.py`). Supervised HTTP stages can stage their output files in a sealed temporary S3 bundle. The release CLI verifies the manifest, records an approval tied to the placement plan, and registers server-side copies in the filesystem schema.

## Vector (planned)

Not implemented. The port fixes the shape: a caller upserts typed points (id, vector, a string payload that traces a hit back to its source) into a named collection and searches by vector. The implementation will choose the store, the embedding model and the collection naming; none of that is decided here, and nothing in the engine may depend on a particular client.

## Not built

Persistent HTTP executor jobs and events (the executor uses the in-memory store), Dryv-generated Python repositories, per-folder authorization, and the vector implementation.
