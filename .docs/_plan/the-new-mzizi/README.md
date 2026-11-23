---
id: PLAN-NEW-MZIZI-INDEX
name: The new Mzizi — database revisit
type: planning-proposal
tags: [mzizi, database, geography, performance, data-flow]
extra: {status: discussion_only, approval: not_approved, implementation: not_authorized, opened_on: 2026-11-23}
---

# The new Mzizi — database and data-flow revisit

**Working discussion, not an approved redesign.** The owner requested this folder as a place to document the topics we discuss and refine together. Creating these documents authorizes **documentation only**. No new schema, table, index, migration, seed, job, API behavior, deployment, task group or GitHub workflow is approved by their existence.

## Why revisit the database?

The owner has reported that Geography and common queries are getting slow, and that the complete path from acquired material to trustworthy Mzizi records is still difficult to understand. The purpose of this review is to make that flow understandable and measure performance **before** choosing a new design.

The initial review inspected source code and the generated PostgreSQL snapshot on `develop` as of 23 November 2026. No live `EXPLAIN ANALYZE`, query timings, real deployment inventory or server inspection was performed. A query that looks expensive is a **candidate bottleneck**, not a confirmed root cause.

## Topics in this workspace

| Document | Question |
| --- | --- |
| [Database boundaries](database-boundaries.md) | Which store and schema own each kind of data, and what is the current baseline? |
| [Evidence-to-data flow](evidence-to-data-flow.md) | How does a downloaded file become an accepted, evidence-backed PostgreSQL record? |
| [Geography and spatial queries](geography-and-spatial-queries.md) | Why might place, hierarchy, search and map reads get slower as geographic coverage increases? |
| [Common queries and read models](common-queries-and-read-models.md) | How should the API answer frequent multi-domain questions without repeatedly constructing the same facts? |
| [Performance investigation](performance-investigation.md) | What do we measure, and how do we distinguish SQL, application, cache and rendering costs? |
| [Discussion register](discussion-register.md) | Which concerns came from the owner, which findings are verified, and which proposals still need review? |

## Ground rules for our discussions

1. Start with the user's question and an example of a real user query or research workflow.
2. Inspect the active contract, SQL, API code and loader. Distinguish **observed implementation**, **documented behavior**, **hypothesis**, **proposal** and **owner-approved decision**.
3. Preserve the one-identity-per-real-thing principle; Geography is territory, Governance is governing authority, and Civic is an activity/service. Preserve a separate ownership boundary for Source, Filesystem and Reference.
4. Keep source bytes and supporting evidence attributable; never silently promote extracted or model-suggested material to canonical truth.
5. Diagnose using query plans and representative data before authorizing partitioning, denormalization, caching, new indexes or splitting databases.
6. Add or revise a topic file when we discuss it. Do **not** mark a recommendation "approved" without explicit owner agreement. Record actual approvals in the owning decision system when requested.
7. Leave `main` stable; implementation, if later approved, follows the repository's `develop`, Task and validation rules.

## Relation to existing authority

This folder does not replace [the current roadmap](../../docs/ROADMAP.md), [database architecture](../../design/data/DATABASE_ARCHITECTURE.md), [source/filesystem/geography ownership](../../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md), [data lifecycle](../../design/architecture/DATA_LIFECYCLE.md) or the existing [single-Postgres decision](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md). Those documents and the current contracts remain the source for existing decisions and implementation until deliberately revised.

**First review sequence:** understand both ingestion paths, trace one county from source to API, benchmark the highest-cost Geography and shared reads, then decide whether a read-model or canonical schema change is justified.
