---
id: DOC-9A8E56DB1C11
name: Prior art and build-versus-reuse assessment for website intelligence
type: documentation
tags: [improvements, source-redesign, research, tools, prior-art]
extra: {status: planning_only, implementation_approved: false, research_date: 2026-11-07}
---

# 10 — Prior art, research findings and build-versus-reuse

**Status: planning and research, not a product choice.** This document integrates the 2026-11-07 Deep Research study into Mzizi's source-redesign review. Its claims identify research precedents and candidate capabilities, not proof that any tool works on Kenyan government sites or is installed in the repository.

## Principal conclusion

Automatic site discovery, learned HTML templates, DOM-aware data extraction, fuzzy/semantic retrieval, vector search, adaptive recrawling and LLM-generated extractors have been studied or deployed independently. Mzizi's potential differentiation lies in combining **institutional and jurisdictional context**, persistent site/page/link memory, time-aware public records, evidence, rigorous validation and historical provenance. We should **assemble proven generic primitives and only build domain-specific intelligence where measured baselines are inadequate**.

The research does NOT justify: a source/website schema merger; many new tables; a new pattern schema; one enormous government website ML model; one YAML bundle for every site; a permanently running vector database; unreviewed self-repair; or unrestricted AI writes to canonical facts.

## Prior art: what each finding changes

| Research / product | Relevant demonstrated capability | Mzizi implication | Limitation |
|---|---|---|---|
| [RoadRunner, VLDB 2001](https://www.vldb.org/conf/2001/P109.pdf) | Learn extraction wrappers by comparing repeated HTML structures | Compare pages within site/family to separate template from unique content | Research antecedent, not a current production SDK |
| [SWDE](https://github.com/woailaosang/swde), [FreeDOM](https://research.google/pubs/freedom-a-transferable-neural-architecture-for-structured-information-extraction-on-web-documents/), [SimpDOM](https://arxiv.org/abs/2101.02415) | Cross-site field extraction with DOM + text | Train/test by **held-out whole site**, not random pages | Public benchmarks do not capture African government specifics |
| [MarkupLM](https://aclanthology.org/2022.acl-long.420/), [WebFormer](https://ai.meta.com/research/publications/webformer-the-web-page-transformer-for-structure-information-extraction/) | HTML topology and textual semantics jointly help prediction | Retain DOM context and evidence locators before flattening into Markdown | No justification to train a big model before simple baseline |
| [AutoScraper, EMNLP 2024](https://aclanthology.org/2024.emnlp-main.141/), [Co-Scraper preprint, 2026](https://arxiv.org/abs/2606.14821) | LLM-assisted synthesis of reusable extraction strategies | Generate a tested selector/rule/YAML candidate once, rerun deterministically | Published results cannot be assumed to transfer |
| [Prune4Web](https://arxiv.org/abs/2511.21398), [AXE](https://arxiv.org/abs/2602.01838), [SchemaRAG](https://aclanthology.org/2026.acl-industry.78/) | Reduce DOM/schema context before model inference | Lexical/graph/DOM pruning precedes selective LLM calls | Research and current model-support limitations |
| [LiveWeb-IE, ICLR 2026](https://proceedings.iclr.cc/paper_files/paper/2026/hash/3184497246703156104b3ceb1e379dc5-Abstract-Conference.html) | Evaluate extraction on evolving live sites | Version-aware replay and explicit drift regression are required | Static test success is insufficient |
| [Common Crawl](https://www.commoncrawl.org/about) and [WARC](https://www.iso.org/standard/68004.html) | Separate raw capture, URL metadata, text, indexes and link graph | Preserve independent identities/lineage **logically** | Does not imply a new table for every intermediate |
| [Scrapy](https://docs.scrapy.org/en/master/topics/architecture.html), [Crawlee](https://github.com/apify/crawlee) | Request scheduling, duplicate filtering, links and browser adapters | Benchmark vs existing Mzizi engine; avoid rebuilding mature primitives | Running multiple competing schedulers is unnecessary |
| [Trafilatura](https://trafilatura.readthedocs.io/en/latest/extraction-overview.html), [Crawl4AI](https://docs.crawl4ai.com/) | Main-content cleaning/Markdown, browser/AI parsing options | Reuse as extraction baseline; retain navigation for crawling | Main-text cleaning can hide link evidence |
| [Qdrant](https://qdrant.tech/documentation/hybrid-queries/), [LanceDB](https://github.com/lancedb/lancedb), [Milvus](https://milvus.io/docs/hybrid_search_with_milvus.md), [pgvector](https://github.com/pgvector/pgvector) | Dense, sparse, hybrid and filtered retrieval alternatives | Evaluate on same labelled government queries | No vector service is yet needed or selected |
| [Browsertrix](https://docs.browsertrix.com/user-guide/concepts/), [W3C PROV](https://www.w3.org/TR/prov-o/) | Replayable web evidence, derivation/attribution vocabulary | Link canonical claim -> reviewed proposal -> source block -> raw capture | Review Browsertrix's AGPL licence before adoption |
| [RFC 9110](https://www.rfc-editor.org/info/rfc9110/), [changedetection.io](https://github.com/dgtlmoon/changedetection.io) | Conditional requests and content monitoring | Layer HTTP validators, hashes and meaningful-content comparison | Servers may give unreliable validators |
| [Diffbot](https://www.diffbot.com/docs/extract/), [Zyte](https://docs.zyte.com/zyte-api/usage/extract), [Apify](https://apify.com/apify/website-content-crawler) | Managed generic extraction and crawling | External quality/cost benchmarks only when permitted | Cost, usage/licensing, third-party data exposure and lock-in |

## Candidate tool disposition — no adoption approved

| Tool | Preferred research stance | Reason |
|---|---|---|
| Existing Python data engine and legal gate | **Keep as baseline** | Audit before replacing working fetch/structure/assessment logic |
| Scrapy | **Early candidate** | Mature HTTP crawler in current Python environment |
| Crawlee | **Alternative to Scrapy** | Compare if browser-heavy use cases dominate; do not stack schedulers |
| Playwright | **Conditional browser fallback** | Use for JS-dependent pages, not all pages |
| Trafilatura | **Early content baseline** | Cheap, maintained main-text extractor |
| Crawl4AI | **Optional comparison** | Broader browser/LLM integrations, requires exact-version and licence check |
| Browsertrix/WARC | **Evidence-fidelity experiment** | High fidelity can be worth storage/operations only for selected sources |
| Qdrant | **Candidate vector benchmark** | Separate filtered/hybrid search service, still unapproved |
| LanceDB / separate-instance pgvector | **Alternative benchmark** | Simpler or storage-aligned topologies; primary Postgres isolation remains desirable |
| Milvus | **Defer unless scale warrants** | Additional distributed operational surface |
| Diffbot/Zyte/Apify | **Optional external benchmark** | Compare accuracy and costs without coupling authoritative lineage to vendor output |
| MarkupLM/FreeDOM-style small specialist model | **Research only** | Train only on reviewed labels and held-out sites after baseline failure |

## Build-versus-reuse decisions

**Own in Mzizi:** public institution/jurisdiction identity, source/legal permission state, URL/site history, reliable provenance, geo/time context, evidentiary linking, audited human promotion and verified domain pattern outputs.

**Prefer reuse:** HTTP transactions, link extraction, browser automation, HTML cleaning, PDF parsing, WARC writing, ordinary lexical search, ANN/vector index technology, checksums and standard metadata serialization.

**Defer:** replacing current crawler without comparative evidence; requiring YAML for unknown sites; training many ML models; running a vector database before a judged retrieval corpus; autonomous repair/promotion; inventing another file-storage backend.

**Schema warning:** separation of concepts is not a command to normalize every concept into its own SQL table. The human reviews real columns, joins, row volume, lifecycles and alternatives first. The newest **reference-managed pattern definitions + engine execution** option remains a *candidate*.

See [11 integration](11-tool-integration-and-contracts.md), [12 artifacts](12-artifact-lifecycle-and-lineage.md), [13 evaluation](13-benchmarks-and-research-questions.md), and [02 human schema review](02-source-schema-and-human-review.md).
