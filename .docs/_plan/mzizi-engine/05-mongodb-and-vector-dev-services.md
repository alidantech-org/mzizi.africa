---
id: DOC-3D7A1F5E2B06
name: MongoDB and vector database dev services
type: documentation
tags: [mongodb, vector, qdrant, dev-services, plan]
extra: {status: planning_only, implementation_approved: false}
---

# 05 — MongoDB and vector database as dev services

> **Status:** implemented as dev-only sandboxes in `source/backend/engine/src/mzizi_engine/devservices/`. See the engine README for commands and settings. Defaults: MongoDB `mongodb://127.0.0.1:27017` (database `mzizi_dev`), Qdrant `http://127.0.0.1:6333`. Collections are per embedding model; the chunker is `mzizi_extraction.document.chunk_markdown`. Still planned: a docker-compose helper (`mzizi dev services`).

## Position and caveat

The accepted architecture keeps relational identity in PostgreSQL, bytes in S3-backed `filesystem`, and treats a vector index as a replaceable derivative whose service count "may be **zero**" ([07](../source-redesign/07-storage-and-vector-options.md)). No document that exists approves MongoDB. Therefore this plan treats both services as **dev-only sandboxes**, reachable only through the CLI and `dev_only` capabilities, used to learn whether they earn a place. A decision to adopt either is separate and follows the benchmark gates in 07 and [13](../source-redesign/13-benchmarks-and-research-questions.md).

## What each is for in the sandbox

| Service | Sandbox role | Not its role |
|---|---|---|
| MongoDB | Hold raw run documents (page records, link graphs, extraction output) as flexible JSON so we can query and eyeball results before the relational model for them is final. | Canonical truth, evidence storage, a second source registry |
| Vector DB | Index Markdown chunks, run semantic search, nearest-example classification of page/section types; measure recall and token savings. | Canonical truth, access control, the only copy of text |

## Setup

Docker is present on the dev machine; MongoDB and a vector server are not installed natively. `mzizi dev services up` writes `.local/dev/services/docker-compose.yml` and starts:

- `mongo:7` on `127.0.0.1:27018` with a volume under `.local/dev/services/mongo/`, database `mzizi_dev`.
- Vector: **Qdrant** (`127.0.0.1:6334`), the provisional preference in 07, **or** LanceDB embedded under `.local/dev/services/lance/` for zero services; pick with `--vector qdrant|lance`. A third `pgvector`-in-separate-Postgres option stays documented but unbuilt.

Bind to loopback only; random generated password in `.local/dev/services/.env`; images pinned by version. Connection settings come from `DEV_MONGO_URL` / `DEV_VECTOR_URL`, never from production `.env`.

## Commands

| Command | Proves |
|---|---|
| `mongo test` | Connect, write/read/delete one document, report server version |
| `mongo load --run <run> [--collection pages]` | A run's `records.jsonl`/`links.csv` land as documents with run id, content hash, source URL and fetch time kept distinct from any validity date |
| `mongo find --collection pages --query '{"host":"…"}' --limit 5` | Query back and print |
| `mongo drop-dev` | Drop `mzizi_dev` (refuses any other database name) |
| `vector test` | Connect, create a throwaway collection, upsert and search a toy vector |
| `vector index --run <run> [--model <name>]` | Chunk Markdown, embed locally, upsert with deterministic ids (text hash + model + preprocessing version) |
| `vector search "county budget estimates" --top 5` | Ranked chunks with source run/URL and score |
| `vector classify --input <text|run> --labels labels.yaml` | Nearest labelled examples → proposed class with score; output is a **proposal**, never a stored fact |
| `vector drop-dev` | Delete dev collections only |

Embedding model: a small local multilingual sentence-embedding model by default (no API key, no page text leaves the machine); model name and version are recorded in every index entry. Selecting the production model is an open research question in 13.

## Engine wiring

Adapters live in `mzizi_engine/ports/` next to the existing database port (`Connection`), behind small typed protocols (`DocumentSink`, `VectorIndex`). Packages never import them. Production configuration refuses to register `dev_only` capabilities.

## What success looks like

After a scrape run you can: see documents in Mongo; ask a natural-language query and get the right page sections back; give five labelled example pages ("budget", "tender", "news") and watch unlabelled pages get a proposed class; delete the sandbox and rebuild it from the run folders, which mirrors the rule that vectors rebuild from stored artifacts, not from re-crawling.
