---
id: DOC-9A8E56DB1C14
name: Source-redesign research questions, experiments and go/no-go measures
type: documentation
tags: [improvements, source-redesign, benchmarks, research, evaluation]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 13 — Proposed research agenda, benchmarks and decision gates

**Unapproved research plan.** Suggested sample sizes and numbers are **proposed engineering targets, not achieved metrics or user decisions**. Do not launch public-site crawls, install services, train models, spend money or create Taskcode tasks without user direction and existing legal/source authorization.

## Unanswered questions worth investigating

1. What is the minimum comprehensible source/website model after a **human audit of actual existing columns, FKs, usage, row counts and lifecycles**? Which concepts merit independent relations, and which can reference current capture/file/job metadata?
2. How reliably can root/site-map/navigation crawling discover important county, ministry, electoral and statistics content **without mandatory YAML**? When do redirects, paths, query years and site families confuse identity?
3. Does Mzizi's existing Python fetcher need Scrapy/Crawlee, or can current code meet coverage and politeness requirements? How many pages truly need Playwright rendering?
4. How well do current parsers, Trafilatura and optional Crawl4AI preserve main content, **tables, PDF links and navigation** on non-semantic div-heavy HTML?
5. Can a modest institution-aware synonym taxonomy (budgets, estimates, tenders, procurement, laws, gazettes, appointments, constituencies) plus link context beat a general embedding model on Kenyan county sites?
6. What **incremental recall** does dense or hybrid retrieval provide over exact/fuzzy/BM25 + site/graph context, at what RAM, storage and operational cost?
7. Which one DOM/page/link task has enough reviewed labels and failure cases to justify a small classifier; how does it perform on held-out websites and unseen CMS families?
8. Does a pruned, evidence-grounded LLM generate reusable validated strategies better/cheaper than per-page LLM extraction or human-authored structures?
9. What capture types need WARC/Browsertrix replay instead of raw HTTP/PDF; which artifact types may be derived or discarded safely?
10. Does **reference-owned pattern definitions + engine execution** simplify multi-domain rule management with hard FKs and no false real-world observations better than a new pattern schema?
11. What country-specific legal restrictions, publisher licenses, source robots/terms and data protection rules govern archiving, publication, vendor APIs and model training?
12. How many workers, queues and independent indexes can actual operation justify before system maintenance outweighs data quality?

## Government-site corpus

A **proposed** first study could cover 12–20 diverse, permitted Kenyan sites (county governments, ministries, commissions, KNBS/publications, procurement portals), then 30–50 across families and selected other African countries. Audit examples manually: URL/link graph, discovered high-value pages, page labels, expected relevant queries, PDF facts and citations. Preserve each source's capture and assessment. **Split by whole site and, when practical, entire CMS/template family; keep non-Kenyan sites blind**. Random page-level splitting from the same template inflates apparent generalization. Distinguish reviewer-approved labels from model/agent guesses.

Public research comparators: [SWDE](https://github.com/woailaosang/swde) for cross-site extraction, [WebSRC](https://aclanthology.org/anthology-files/pdf/emnlp/2021.emnlp-main.343.pdf) for structure, [LiveWeb-IE](https://proceedings.iclr.cc/paper_files/paper/2026/hash/3184497246703156104b3ceb1e379dc5-Abstract-Conference.html) for live web, [NEXT-EVAL](https://arxiv.org/abs/2505.17125) for representation choices. These do not replace Mzizi-specific government data.

## Experiments with a comparison baseline

| Experiment | Baselines versus candidates | Evidence/measure |
|---|---|---|
| E1 site discovery | Current engine vs Scrapy **or** Crawlee on identical legal scopes | Relevant-page recall, false-internal rate, duplicate bytes, redirects, restarts, requests/useful page |
| E2 structure/text | Current parser vs Trafilatura vs optional Crawl4AI; raw/slim DOM/Markdown/selected blocks | Main-content/block F1, boilerplate leakage, PDFs/tables/link recall, token count, processing cost |
| E3 ranking/search | Exact/fuzzy + site/graph -> BM25 -> embeddings -> hybrid/reranking | Judged recall@20, nDCG@10, source scope, multilingual performance, p95 and cost |
| E4 vector storage | Lexical baseline, Qdrant, LanceDB, isolated pgvector; Milvus only if scaling need | Filtered recall, memory/disk, rebuild/restart, backup, index version updates and operations |
| E5 change resilience | Real dated captures + synthetic CSS wrappers, CMS changes, JS, PDF switches and changed deadlines | Substantive-change precision/recall, false-repair rate, network/CPU savings, replay success |
| E6 extraction | Deterministic baseline vs direct LLM vs pruned LLM-generated tested selector/YAML | Field/record F1, unsupported values, locator completeness, regeneration reuse, cost/accepted record |
| E7 artifacts | Simulate storage/index loss, replay without live site | Restore S3 artifact, reproduce field candidate/provenance, rebuild vectors from stored text |
| E8 patterns | Existing model vs reference+engine vs dedicated pattern schema | Explainable generated rows vs hypotheses, lineage, FK integrity, table burden and review clarity |

### Draft targets to review before using as gates

- Relevant high-value page discovery recall around **95%** on audited pilot; prioritize avoiding unauthorized fetches and destructive URL false merges.
- Link internal/external classifier around **98% macro-F1**, with zero permission bypasses.
- Main-text recall around **95%** with no more than **5% boilerplate leakage** on a defined corpus.
- Page classification target around **90% macro-F1** on unseen whole sites **before** automated decisions depend on the classifier.
- Substantive-change recall around **95%**, explicitly measure false alarms and silent factual loss.
- Accepted canonical fields: **100% retrievable capture + extraction/review lineage**; zero automatically promoted unsupported values.
- Retrieval: judge relative lexical-to-hybrid lift, index cost/latency and value on real multilingual queries before setting a permanent recall/latency SLO.

These figures are **ideas for acceptance discussion**; small samples cannot justify certainty.

## Stop / go guidance

**Keep deterministic tools** if they satisfy audited site needs. **No per-site YAML requirement** when generic/family-assisted discovery works. **No vector service** unless measured retrieval gain offsets operating a new index. **No custom ML** without reviewed, non-leaking labels and repeatable improvement. **No autonomous repair/promotions** until safe failure and abstention behavior is demonstrated on actual site drift. **No SQL schema collapse or new pattern schema** without the user's line-by-line decision record. Third-party services must pass license, privacy, geographic and source collection reviews.

## Follow-on deep-research topics (questions, not tasks)

- Government CMS/template taxonomy and site-aware link prioritization, including multilingual African public sites.
- PDF table extraction/OCR for scanned Kenya gazettes, KNBS statistical publications, elections results and budgets with source-page evidence.
- WARC/WACZ/Memento replay and long-term archival retention, including public-sector provenance requirements.
- Entity resolution for political names, institutions, legal offices and effective dates, with contradictory-source handling.
- Version-aware incremental reindexing and index reconciliation against existing S3 and relational object identities.
- Operational benchmark at 100k, 1m and more meaningful-text blocks using actual sizes and filters; do not assume internet-scale traffic.
- Secure third-party SaaS comparisons and lawful public-data publication/model-training rules in Kenyan and later African jurisdictions.
- Shared reference pattern definitions and watcher dependency graphs, with verified legal existence vs merely predicted site/office presence.

See [10 prior art](10-prior-art-and-build-vs-reuse.md), [11 integration](11-tool-integration-and-contracts.md), [12 artifact storage](12-artifact-lifecycle-and-lineage.md), and [02 schema review](02-source-schema-and-human-review.md).

## Additional proposed experiments: portraits, community review and prominence

These are proposed evaluation work, not approved collection, biometric experiments or acceptance targets.

| Experiment | Compare | Measure |
|---|---|---|
| E9 image discovery | Static HTML/CSS parsing vs optional browser fallback on the same saved captures | Recall of real content images, false decorative-image candidates, CSS URL resolution and processing cost |
| E10 portrait association | Card/profile context rules vs human-reviewed labels | Correct person-to-portrait precision, wrong-person association rate, source/rights completeness |
| E11 media dedup/refresh | SHA-256 and optional perceptual hashes across dated captures | Exact object reuse, false duplicate suggestions, correct replacement detection and source-sighting preservation |
| E12 community review | Independent contributors, county watchers and verified institutional attestations | Agreement with evidence-reviewed outcomes, false-merge risk, brigading resistance, time to resolution and appeal quality |
| E13 prominence | Structural reference baseline vs recognition/attention features and AI-assisted ranking | Contextual ranking quality, local-vs-national relevance, calibration, stability and fairness across regions/office types |
| E14 ambiguity | Name-only matching vs aliases, offices, geography, dates, source links and optional approved signals | False merges, false splits, abstention quality and reviewer workload |

Facial-recognition evaluation is **not authorized by these experiments**. Any proposal to process biometric templates must first pass a separate legal/privacy/security decision, including review of the Kenya Data Protection Act and ODPC biometric/DPIA guidance. The initial benchmark should use non-biometric source context and image-file deduplication only.

Prominence metrics must not reward view manipulation, duplicated/syndicated coverage or popularity at the expense of local discoverability. See [person identity/media/community refinement](../guides/person-identity-media-and-community-refinement.md) and [entity prominence/discoverability](../guides/entity-prominence-and-discoverability.md).
