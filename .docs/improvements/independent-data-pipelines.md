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


## 2026-11-07 event-driven monitoring and admin/agent refresh execution

**USER IDEAS; planning only:** Allow agents to watch authorized official websites for **announcements/news** that cause specific data rechecks; allow authenticated admins to record event information or issue direct refresh/research requests; combine legally prescribed schedules, real activity occurrences, source change detection and manual requests in one system. The engine must be able to track a verified no-change result separately from a discovered difference.

### One reusable pipeline contract, many trigger sources

Trigger context (proposed fields, not finalized schema): `trigger_type` (schedule_due, activity_announced/verified, source_section_changed, dependency_changed, manual_admin, approved_agent_monitor), `trigger_id`, `rule_version`, `jurisdiction_id`, `subject/entity`, `target field_group`, `source assessment`, `source/document hash`, `requested_by`, `approved_by` (when applicable), `due_at`, `idempotency_key`, and budget limits. These are **contract concepts**, not a requirement for columns on each table.

An approved agent may run a registered generic capability such as `discover_official_announcement` or `verify_current_holder` with a source profile selected from data. A country-specific parser (e.g. for an official election or statistics publisher) is a replaceable adapter under a jurisdiction manifest, never a hardcoded branch in the universal watcher. Verify official source access before fetching. Reuse site structure/Markdown hashing to avoid unnecessary downloads, while still scheduling revalidation when sources are stale even if content hashes match.

**Pipeline outcomes**: successful verified unchanged; supported changed value/relationship → staged candidate and controlled promotion; conflicting sources → claim/review; unknown/not-applicable; blocked legal collection; unavailable/failed check; postponed/cancelled activity. “New HTML/Markdown” ≠ “changed canonical fact”; “no changed website content” ≠ “fact independently verified”.

**Admin input requirements (design to validate):** Separate commands for (A) submit an activity candidate with source and event date, (B) request a one-time scoped refresh without stating a new fact, (C) create a bounded recurring monitor or schedule exception, (D) approve/reject reviewed activity/candidate when RBAC allows. Include actor identity, reason, source, jurisdiction, target, rate/budget and audit trail. Don't silently give any logged-in administrator permission to mutate highly sensitive canonical facts. Admin actions need explicit review depending on source sensitivity, event kind and consequences.

**Systemic safeguards**: only one engine scheduler/leases/host admission boundary; rule/versioned dependencies, rate limits, retries, cancellation and cooldown; dedup by rule/target/event/source version/due window; prevent event→verification→event infinite loops; only refresh affected domains/field groups, and recompute derived results only when accepted upstream facts change. Avoid independent polling services secretly bypassing the engine.

**Cross-domain examples**: `electoral` official date/nomination/result updates; `statistical` census data release/vintage; `legal` parliament readings and Acts; `finance` budget timetables/versions; `governance` appointments; `procurement` tender deadline/award. Each action follows schedule → activity/source evidence → engine → candidates/verifications → reviewed domain changes, without duplicating canonical subject identities.

**Still open:** executable manifest grammar, one source of truth for verification status, verification ledger FK target design, scheduler/job reuse, cadence/tier thresholds, agent permissions, administrator form workflow, schedule rules vs real-world event statuses, UI status vocabulary and legal/source constraints. These require user validation and separate implementation/task approval. See [schema-wide freshness rule](schema-redesign/README.md) and [activity](schema-redesign/activity.md).

## 2026-11-08 — Root seed convention and folder/file-type design

The user now requires all manually or AI-prepared seed inputs, including auth baselines and site-structure YAML/JSON/CSV/code artifacts, under repository-root `seed/`. The authoritative convention and design proposal are in [seed/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Use global file types without jurisdiction linkage, jurisdiction-specific fixed folder CSVs, and system/jurisdiction pattern definitions producing concrete folders from actual resources. Shared pattern definitions belong in reference, execution in engine. Files link to concrete folder and physical type; exact versions retain their actual format. Global/system/jurisdiction files are separated locally, and manifests identify dependencies, keys, recognized loaders/targets, hashes and S3 destination for each adopted artifact. Generated/reproducible outputs may be ignored but require replay or fetch metadata.

Existing SeaweedFS configuration is fixed: bucket `mzizi`, region `us-east-1`, existing environment credentials, laptop endpoint `http://192.168.100.13:18333`, Docker endpoint `http://object-storage:8333` on `home-services`, public origin `https://res.alidantech.org/mzizi/`. Only `public/` allows anonymous reads; every other prefix is private. Do not provision storage, regenerate credentials, use per-object public ACLs or change infrastructure. Local logical folder paths need not mirror object keys. Seed CSV bytes normally go under `internal/seeds/` even when their rows define public folders.

This approves documentation and the directory convention; bulk legacy relocation, actual catalog content, production folder generation, runtime manifest support and S3 uploads remain future work. Existing objects require inspection; disposable `mzizi_new` does not imply disposable S3. No backward compatibility is needed for the approved database rewrite. Earlier per-service seed locations and preservation/compatibility statements are historical and are superseded for this rewrite by the newer user direction.

## 2026-11-08 — Approved package-first layout and single Python engine

The user now authorizes the local agent to establish the new structure, move reusable code, and archive the previous implementations before the later source/pipeline milestones. This supersedes the earlier unresolved package/runtime topology. It does not authorize all later domain features. Work remains on develop; no .github or home-infrastructure changes.

### Target ownership

| Path | Responsibility |
|---|---|
| source/packages/ | Reusable capability packages with independent contracts, metadata, tests and documentation. |
| source/backend/engine/ | One complete Python project: orchestration, job/run lifecycle, scheduling/admission, workers and its own operational API. |
| source/apps/api/ | Existing NestJS product/domain API, relocated from source/backend/api so backend contains only engine; preserve finished auth behavior and update Dryv/build paths atomically. |
| source/apps/web, source/apps/www, source/apps/mobile | Existing application surfaces. |
| source/schema/ | Shared input-artifact schemas and validation contracts, with deliberate package exports. |
| seed/ | All prepared seed artifacts, patterns and source manifests; reusable code does not move into seed/. |
| scripts/ | Thin repository/operator entry points using package APIs instead of duplicating filesystem/database/network logic. |
| .docs/_archives/<dated-rewrite-snapshot>/ | Clearly marked historical learning material, excluded from active imports, discovery, builds, generators and execution. |

source/apps/api is the chosen destination for preserving the existing product API while enforcing the requested backend-only-engine layout. Update root configuration, Dryv outputs/tooling, relative imports and commands consistently. The engine API is for jobs, runs, packages/capabilities, manifest validation/activation, registry publication and operator actions; it does not silently replace or duplicate the public NestJS domain API or invent a second user-account system. Reuse the agreed auth identity/authorization contract for engine operations, including service actors and scoped actions.

### Packages and Python project

Start with capabilities actually reused: filesystem (S3, registry, hashing, access and publication), database (connection/transactions/schema lifecycle primitives), source-client (polite fetching/HTTP/API admission), scraping (HTML/link extraction/render adapters), extraction (PDF/tables/JSON/CSV/GeoJSON/text), OCR, agent (model/provider/tool interactions with attributable proposals), and shared manifest/schema validation. Refine names and combine tiny capabilities when justified; do not scaffold a separate service per package. Jurisdiction/publisher specifics remain in seed manifests and DB records.

Use Python packages (pyproject metadata, src layout, declared dependencies/exports) for Python capabilities and a pyproject-based engine with a documented reproducible workspace/install/lock strategy. Select tooling from actual environment/repository constraints and record the choice. Do not add competing toolchains needlessly. Cross-language consumers, especially the NestJS product API, use explicit supported interfaces/contracts; no importing Python internals from TypeScript or copying a full capability implementation without justification.

The engine depends on packages, packages must not import engine internals, and reusable capabilities should not import each other's private modules. Orchestration controls retries, leases, scheduling, limits and cancellation. Packages perform capabilities and expose progress/results with versioned contracts. Use one coordinated queue/admission boundary even if multiple workers execute concurrently. Package-specific HTTP wrappers live at the engine boundary, not separate daemons per package. Source rules, API structures, indicator selections and country facts remain data.

### Archive and remove old active paths

Archive source/backend/api-legacy and the old source/backend/engine/data and source/backend/engine/database implementations under .docs/_archives/<dated-rewrite-snapshot>/, preserving their original relative paths and a relocation inventory. Snapshot/archive first, extract reusable code into new packages with recorded origins, then remove old active directories. Remove source/backend/files and source/backend/intelligence after their useful responsibilities/docs are accounted for in filesystem and agent/extraction packages and the archive as appropriate. No compatibility copies or symlinks remain in active source.

Before moving engine/database, audit newly completed auth work: retain the functioning auth schema/setup, role seeds and checks as active rewrite code, not only historical archive. The database package owns generic infrastructure; new schema-specific definitions remain in their documented owner. Do not replay old migrations into mzizi_new merely to retain a command. Preserve root seed consolidation and current source/schema definitions.

Archive README must say historical, non-authoritative, not executable, and explain lessons to reuse. Record old path -> archive path -> extracted active capability/remaining knowledge, with the source commit. Inventory archived manifests and do not reintroduce duplicate authoritative seed payloads outside seed/. Existing archive-relative references may be historical, but active documentation must resolve current paths. Integrate the archive with Taskcode/document validation using documented supported exclusions or compliant metadata, without weakening validation of current tasks or editing every historical artifact indiscriminately.

### Seed publication through filesystem package

Scripts and engine operations use one reusable filesystem package API for seed registry publication. Inputs come from seed manifests/folder metadata; preserve artifact role, seed flag, acquisition class, preparation method, source identity and effective access. Do not use a raw S3 script that bypasses registration or provenance.

Support dry-run, upload/verify/register, idempotent retry and reconciliation. Deduplicate using byte hash/length within compatible visibility/security boundaries, not global public/private merging. Keep each seed/document identity distinct even when bytes can be reused. Existing S3 service remains bucket mzizi with public/ anonymous only; other prefixes private. Existing S3 objects are not disposable even though mzizi_new is.

Support both immutable versioned releases and explicitly non-versioned current content. For a non-versioned registry item use a stable logical identity/alias with a current-object pointer and conditional revision/hash checks; changed bytes update current state without requiring a new public logical version. Prefer immutable physical objects plus pointer replacement for dedup safety. If a fixed physical key must be overwritten, declare that mode, prevent shared-object corruption, and account for caches and failed partial writes. Non-versioned input must not silently alter historical evidence or a manifest release pinned by an existing run. Record publication/update events and return created/unchanged/updated/conflict outcomes. Do not run automatic garbage collection over the existing bucket.

### Execution and acceptance boundary

The local agent is authorized now to implement structure/package extraction, archive relocation, thin engine API skeleton and seed-publication capability needed by this restructure. It must create/refine a detailed Taskcode restructuring task and record that this enabling work runs before later source/pipeline feature implementation. Exact later schema tasks retain their user review/order; directory setup is not completion of those milestones.

Deliver working imports, package installation, engine startup/health and registered capability contracts, preserved auth checks after relocation, package-level publication tests (mocked S3 first), and a bounded explicit live smoke only where credentials and test namespace are available. Validate that no active code/build/generation references archived paths. Do not start real collectors, migrate existing objects, provision services, erase unrelated databases or implement bespoke country extractors. Record actual gaps rather than declare a scaffold fully implemented.

Document the final tree, package ownership, package/engine/API commands, archive learning index, auth preservation, seed registry behavior and focused verification. Commit and push to develop after checks. Database operations target only the approved disposable mzizi_new.
