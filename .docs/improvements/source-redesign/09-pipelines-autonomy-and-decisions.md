---
id: DOC-9A8E56DB1C0A
name: Autonomous website research pipeline roadmap and open decisions
type: documentation
tags: [improvements, source-redesign, pipelines, governance, roadmap]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 09 — Autonomous research pipelines, quality, review and decisions

## Cohesive architecture

**Source registry (physical boundary OPEN)** knows websites, domains, pages, links, candidate data locations, publishers, observations and evidence. **Filesystem/S3** preserves immutable captures and derivative Markdown. **Semantic/vector layer** retrieves relevant reusable knowledge. **Specialist ML** classifies/ranks pages and fields. **LLM agents** examine narrow evidence and propose mapping/repair when ambiguity warrants it. **Deterministic extraction** parses and validates repeatable mappings. **Engine** schedules concurrency, budgets, jobs, candidates and retries. **Domain schemas** hold reviewed normal knowledge. **Audit** keeps human and automated decisions attributable. **Candidate `pattern` management** may define generative rules shared across domains.

All boundaries are conceptual. User approval is required before schemas are moved, created or deleted.

## End-to-end scenario: unknown county site

1. Discover candidate county site from verified geo unit, published reference, institution or pattern; do not present a guessed domain as real.
2. Check per-site/jurisdiction collection policy and permissible assessment scope.
3. Probe root, retain redirects and domain observations, sample landing-page markup, extract header/footer/main navigation and links.
4. Save page/link/URL inventory, classify internal/associated/external links, deduplicate safely and schedule bounded high-value links.
5. Match institutional and county context; use family expectations if any, but **do not require YAML**.
6. Identify templates, dynamic content, readable page blocks, PDFs, machine-readable API endpoints; preserve raw captures in S3.
7. Compute raw/template/semantic section hashes, create readable versioned Markdown and extract structured fields with source locators.
8. Retrieve vocabulary and previously validated examples using lexical/vector search; rank candidates. Provide LLM only selected evidence and target contracts when needed.
9. Produce staged domain candidates with person/institution/geo/period matching and citations; run quality/contradiction checks; promote only under approved review policy.
10. Monitor changes, revalidate URLs, repair drift, update indexes and dependent results without unnecessary full reprocessing.

Independent pipelines for procurement, KNBS statistics, elections, governance appointments, legal updates and site Markdown can share these tools while working concurrently. Share per-source politeness, domain rate limits, network/LLM/browser budgets, object caching and reconciliation.

## Confidence and automation boundary

- Routine URL parsing, safe normalization, hash checks, content reuse, deterministic extraction and observed response status can be automated.
- Semantic page types, field mappings and same-entity proposals carry model/version and calibrated confidence, with abstention.
- Source permission assessment and its human-review requirements remain separate; an agent cannot approve its own restricted-source collection.
- Canonical political/legal/historical facts need source evidence, temporal/geographic relevance, cross-source checks and review policy. Higher-impact ambiguity escalates to a person.
- Automation should reduce manual research **without** confusing a likely fact, an expected pattern record, and a verified observation.

## Staged review/evaluation sequence (not Taskcode tasks)

| Phase | Proposed deliverable | Demonstrate before proceeding |
|---|---|---|
| 0. Human schema audit | Review existing 27 source+website tables/columns, overlapping engine/filesystem state, FKs and test queries | User can explain each retained table and approve/reject alternatives |
| 1. Source memory | Root discovery, redirects, persistent links, page candidates, link classification, normalized URLs | Unknown site inventory and no duplicated fetches |
| 2. Reliable extraction | Templates, block identity, raw evidence, Markdown versions, hash-aware incremental updates | Detect changed deadline without reprocessing unchanged boilerplate |
| 3. Hybrid retrieval | Vocabulary, lexical search, separate vector-index benchmark, ranked relevant blocks | High recall@K with reduced LLM tokens vs baseline |
| 4. ML/adaptive mapping | County-site labeled data, held-out site evaluation, learned ranking/classification, selective agents | Measured field accuracy and grounded citations |
| 5. Autonomous monitoring | Drift repair proposals, scheduled refresh, idempotent pipeline dependencies, approved promotion gates | Recover from realistic site redesign and source outages |
| Cross-domain patterns | Evaluate central `pattern` schema vs engine registry; dry-run generation and lineage | Expected office/site records traceable and safely revised |

Ordering is an assistant proposal. The user will decide implementation tasks and ordering one by one, **after** reviewing design.

## Evaluation and failure cases

- Unknown site without YAML, missing `main` tag, duplicated header links, external Treasury/IEBC links and off-scope redirect.
- Candidate host created from county pattern but does not exist; no false verified site.
- HTML template changes while a tender deadline changes; detect substantive update and preserve old version.
- One document published on several sites, one stored object but independent sightings.
- A page is 304; another has changed bytes but same substantive text; a third changes only table data.
- Model overfits county CMS; hold out entire sites and compare against heuristics.
- LLM hallucinated officer name or uncertain office mapping; keep candidate unapproved.
- Collection assessment expires during a scheduled pipeline; jobs pause, existing evidence preserved.
- Changed extractor/model invalidates dependent results even when file bytes unchanged.
- Pattern generation changes expected offices; verified holders remain intact and reviewable.
- Search index unavailable; keyword/site graph fallback still returns attributable evidence.
- Every country-wide scoped entity has a real root geo-unit relationship where appropriate and historical scope is not conflated with address.

## Open decisions ledger (all not approved)

| ID | Question | Current status |
|---|---|---|
| SR-01 | Keep separate `website` and `source`, selectively consolidate, or wholly consolidate? | OPEN — human table/column review; no collapse approval |
| SR-02 | What are minimal page/URL/link/visit records and which warrant their own tables? | OPEN |
| SR-03 | Do TLD/zone and site family/trait/relation records survive independently? | OPEN |
| SR-04 | What distinguishes a logical page from document/capture/file versions? | OPEN |
| SR-05 | Which direct hard cross-schema FKs and exceptions are appropriate? | USER DIRECTION on principle; exact design OPEN |
| SR-06 | Should a shared `pattern` schema exist, vs shared `engine` registry and domain rules? | USER DIRECTION to evaluate; no schema approved |
| SR-07 | How to implement pattern lineage to arbitrary generated normal domain rows? | OPEN |
| SR-08 | Are family/explicit YAML and learned layouts separate contracts or one versioned structure? | OPEN |
| SR-09 | What are acceptable root discovery scope, redirect, rendering and dynamic navigation policies? | OPEN |
| SR-10 | How are normalized URL identities, aliases and link occurrences deduplicated? | OPEN |
| SR-11 | What content-block identity and hashing avoids both false changes and missed corrections? | OPEN |
| SR-12 | Which vector system/topology: Qdrant, LanceDB, Milvus, pgvector separate instance, or none initially? | OPEN |
| SR-13 | Which government site training dataset, annotation policy, evaluation and deployment models? | OPEN |
| SR-14 | What ranking/ML/LLM thresholds and human escalation rules are justified by tests? | OPEN |
| SR-15 | How do independent pipelines share source rate limits, jobs, caches and budgets? | OPEN |
| SR-16 | What lifecycle/retention applies to raw captures, page visits, model outputs and derived files? | OPEN |
| SR-17 | Which legal/source scope authorizes which automated assessment, collection, indexing and publication? | Existing gate must survive; details OPEN |
| SR-18 | What is final table/schema ownership and migration sequence after the user approves each? | OPEN |

## Future human review record

For each decision the eventual reviewer should see: alternatives; current repository evidence; relevant real queries; prototype/test evidence; confidence/unknowns; operational and data-loss risks; affected current tables/columns/APIs; approved result, reviewer/date and any subsequent version. An agent's recommendation is not an approval.

**No new tasks, migrations, deployment, training jobs or schema changes are authorized by these documents.**

## Research-to-design: staged rollout and hard gates

The study favors **assemble first, specialize second**: preserve current engine/legal admission and S3/file boundaries; validate site/link memory and deterministic DOM/Markdown extraction; benchmark government vocabulary/BM25; consider embeddings only after demonstrated retrieval lift; train specialist ML only on verified labels; use LLMs for pruned, evidence-grounded mapping and *proposals* for reusable rules. [WebArena](https://proceedings.iclr.cc/paper_files/paper/2024/hash/4410c0711e9154a7a2d26f9b3816d1ef-Abstract-Conference.html) cautions against unmeasured autonomous agents. Shared site budgets and validation stay mandatory. Additional open gates: licence/security, third-party source disclosure, artifact replay and vector index recovery, unknown-site metrics and false-repair risk. See [10 prior art](10-prior-art-and-build-vs-reuse.md), [11 integration](11-tool-integration-and-contracts.md), [12 artifacts](12-artifact-lifecycle-and-lineage.md), [13 experiments](13-benchmarks-and-research-questions.md). No tasks or implementation approved.

## Community-assisted identity and media quality loop

A later pipeline may combine automated candidates with citizen/local-watcher feedback, verified institutional attestations and administrator review. It should create a bounded review candidate with source evidence and a precise target; feedback is grouped and ranked for review; authorized decisions update versioned canonical records with reversible history. Verified officials can carry high authority within their verified institutional mandate, but identity merges and disputed/high-impact claims remain reviewable. Do not use raw vote counts as truth or training labels.

Person-media enrichment should discover image references in HTML/CSS, link them to their page/card context, fetch permitted assets through the existing files/S3 service, and create a reviewed portrait attachment. Facial biometric processing is not part of the default pipeline. See [person identity/media/community refinement](../person-identity-media-and-community-refinement.md).
