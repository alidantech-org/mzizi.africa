---
id: DOC-C92D5E8176A3
name: Independent concurrent data pipelines and reusable packages plan
type: documentation
tags: [improvements, planning, pipelines, packages, concurrency, agents, extraction]
extra: {status: planning_only, topology: unresolved}
---

# Independent data pipelines, packages, agents and coordinated goals

**PLANNING ONLY — user has not approved a pipeline runtime, language, package layout or deployment topology.**

## User's central idea

Replace the current "one data engine owns everything" arrangement with a collection of **independently running pipelines**, each focusing on a concrete objective or subject, running **concurrently toward the same goal or different goals**. Extract standalone reusable feature packages (agent/AI, scraping, file management client, webpage/site structure reader, PDF/OCR/tabular extraction, record normalization, entity matching, quality validation, pattern generation). This request must respect the user's **two main data classes/four subtypes** and the redesigned schema with hard foreign keys.

The user expressly said they want **more explanation and code examples before deciding** the exact architecture. Do not mark "microservices", "central queue", "one worker per domain" or "Python-only" as approved.

## Four independent concepts to avoid mixing

| Concept | Job | Examples |
|---|---|---|
| Pipeline | Reusable end-to-end **domain workflow** with input, dependency graph, output and review policy | County leadership, procurements, legislative documents, statistical coverage, site Markdown acquisition |
| Package | Shared **feature capability** that many pipelines use | Source fetcher, S3 file client, HTML→Markdown converter, site tree hasher, classifier, entity matcher |
| Worker | Independently runnable process executing one or several stages | Crawl worker, render worker, extraction worker, generation worker, review-promotion worker |
| Orchestrator | Declares goals, schedules dependencies, bounded concurrency, retry/resume/cancel and run progress | Expansion of 47 county jobs, staged tender imports, periodic revalidation |

One pipeline can invoke multiple packages; one package can serve multiple pipelines. Concurrent execution is a runtime capability, **not** proof that every package needs a network microservice.

## Existing foundation to reuse, not rewrite blindly

- `source/backend/engine/data`: Python importers, source compliance, `crawl.py`, site structure bundles, extractors, `jobs.py` (Postgres queue, input hashes, SKIP LOCKED, bounded retries), candidate creation, matching and derived statistics.
- `source/backend/engine/database`: Bun/TypeScript migrations, seeds, validation, controlled review/promotion, integrity and governance patterns.
- `source/backend/files` and `source/backend/intelligence`: mostly architecture scaffolds in the inspected revision; verify implementation before moving code.
- `source/backend/contracts` and Dryv: exchange contracts and canonical domain definitions; must evolve with cross-schema FKs.
- `engine`/`staging` and `source`/`filesystem` already provide substantial processing and evidence metadata, although responsibilities are confusing in places.

The user seeks **simplification, clarity and real capability**, not just renaming directories.

## Illustrated workflow and package responsibilities (provisional)

```text
User or scheduled goal: "Fill verified Kenya county leadership"
    |
    v
Orchestrator declares pipeline run and dependencies
    |
    +-- county 001 -> discover -> fetch -> file/S3 -> Markdown -> extract -> match -> validate
    +-- county 002 -> discover -> fetch -> file/S3 -> Markdown -> extract -> match -> validate
    +-- ... 47 county jobs with bounded per-site/global concurrency
    |
    +-- independent procurement pipeline -> portal packages -> tender/award/contract mapping
    +-- independent statistics pipeline  -> KNBS/IEBC datasets -> observations/validation
    +-- independent legal pipeline       -> official texts -> provisions/rules/authority
    |
    v
Staged candidate and claim review / correction policy
    |
    v
Database-controlled canonical promotion with hard FK checks
    |
    v
Coverage counters / freshness / dependent derived records / UI reports
```

## Possible repository direction (EXAMPLE ONLY)

```text
source/backend/
  pipelines/
    county-leadership/
    procurement/
    statistics/
    legal-publications/
    website-to-markdown/
  packages/
    pipeline-sdk/
    site-client/
    scraper/
    renderer/
    markdown-extractor/
    file-client/
    agent/
    entity-matcher/
    validator/
    pattern-generator/
  workers/
    scheduler/
    runner/
  engine/
    database/
  api/
```

Exact folder topology, package naming, Python/TypeScript boundaries and runtime integration await review. The user's established choice is **independent pipelines with reusable features**; **not** this directory shape.

### Illustrative public contract, not functioning code

```python
class Pipeline:
    name: str
    version: str
    def plan(self, inputs): ...
    def execute_step(self, step, context): ...

class SiteMarkdownPipeline(Pipeline):
    name = "site-markdown"
    version = "draft"

    def plan(self, inputs):
        # Resolve approved site structure and source permissions.
        # Fetch/validate changes, render when needed, hash DOM sections.
        # Create versioned readable Markdown artifact and link original evidence.
        # Map new facts into staged candidates; never directly overwrite truth.
        ...
```

**Contracts should have:** stable run/job IDs, pipeline/version, input/resource hash, geographic/jurisdiction scope, legal collection policy, retries/timeouts, artifact links, tool/model/structure versions, dependencies, progress, output schema, error categories, quality status, review policy and audit reference.

## Coordination and concurrency behavior to design

1. An independently deployed or independently executed **pipeline** can start without waiting for unrelated pipelines.
2. Shared declared **goal** (e.g., fill 47 counties) expands to many independently claimable, idempotent jobs.
3. Another pipeline with a different goal (e.g., procurement) can run in parallel subject to global capacity.
4. A pipeline that requires geography/office patterns declares input dependencies and waits only for those dependencies; no implicit global lock.
5. Same URL or S3 content already captured: reuse immutable artifact and compatible extraction; revalidate if refresh due; rerun if extractor/structure version changed.
6. Rate-limit per source/publisher/site and bounded CPU/memory/browser/LLM budgets; avoid simultaneous burst scraping and duplicated browser work.
7. Failed step is retryable when safe, otherwise quarantine/defer; resume partial completion without losing history or repeating entire extraction.
8. State includes planned, queued, running, waiting for dependency/review, completed, partially completed, failed/cancelled. Exact status vocabulary is **OPEN**; avoid introducing competing status systems.
9. Dependency invalidation: pattern legal rule changes, new geography unit, revised source content, new extraction algorithm, corrected observation or updated Markdown should trigger **only affected downstream steps**.
10. Data lineage and correction must remain visible on current canonical records, and all upstream artifacts kept addressable.
11. Allow review-approved manual triggers from UI (generate, synchronize, rerun extraction) with dry-run/preview when changing canonical structures.
12. Dashboard shows run tree, source/publisher, costs/limits, failed steps, quality, coverage, reprocessing and evidence.

## Alternatives for the user to evaluate

| Architecture | Pros | Tradeoffs | Status |
|---|---|---|---|
| One Python runtime with modular pipelines and plugins | Few deployables; easy reuse | Isolation is weaker; a process bottleneck can affect many jobs | Unapproved |
| Modular shared packages + separate workers with PostgreSQL job queue | Parallel execution, easy independent scaling, reuses existing queue | Requires stable contracts and coordinated DB/run semantics | **Assistant currently leans here; not user approval** |
| Independent microservices with message broker | Strong isolation/scaling for very high load | More deployment, monitoring, contracts and eventual consistency | Unapproved |
| Hybrid with worker packages plus selectively external services | Gradual scaling and isolation by workload | Need clear rules for when to split | Unapproved |

No reason to build Kubernetes, new brokers or separate databases now merely because "concurrent" appears in the goal. First inspect actual throughput, domain complexity, CPU/browsers and existing infrastructure.

## Independence with one canonical database

Pipelines may run independently, but canonical records must not be independently and unsafely overwritten. Use one governed promotion transaction/path with real FKs, natural keys, locking/version checks and audit. Source captures, extracted Markdown and staged candidates may be produced concurrently; the promotion layer detects duplicates/conflicts.

A pattern-generator pipeline may produce only *expected* office structures. A leadership research pipeline then produces *observed* evidence and holder candidates. A statistics pipeline can derive coverage metrics from the verified results. These are logically separate, even if coordinated by one goal.

## Open decisions and minimal proof-of-design

- Choose one representative site→Markdown pipeline, a county-governance generation/research pipeline and procurement (different goal) to demonstrate actual concurrent execution.
- Test shared input artifact caching; same-page content/noise changes; re-extraction on tool update; common canonical supplier identity; independently corrected records; worker failure/restart; source gate and role permissions.
- Assess package boundaries, worker scheduling API, desired CLI/admin UI, review authorization, source policies, error vocabulary, remote S3 client and multi-tenant (future) concerns.
- Define exact pipeline run and job table ownership after `engine`/`staging` redesign; avoid duplicate queues.
- Define observability, job cancellation, emergency stop, retries/recoverability, deployment and resource quotas.

**Not a Taskcode task and not an implementation plan. The user will instruct the agent how to create tasks one by one when the architectural review is complete.**

## Related source redesign planning

See [source redesign and adaptive website intelligence](source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**

## Research adapter integration (planning)

See [replaceable adapters and one engine-owned scheduling boundary](source-redesign/11-tool-integration-and-contracts.md), [existing S3 artifact lineage](source-redesign/12-artifact-lifecycle-and-lineage.md) and [benchmark gates](source-redesign/13-benchmarks-and-research-questions.md). Do not independently deploy multiple crawler schedulers or refresh loops (current engine, Scrapy, Crawlee, changedetection.io, browser agents) without shared host admission, leases, budgets, dedup and source policy. All tool adoption and Taskcode tasks remain unapproved.
