---
id: DOC-9A8E56DB1C06
name: Semantic retrieval learning-to-rank models and LLM decision boundaries
type: documentation
tags: [improvements, source-redesign, ml, vector, agents, ranking]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 05 — Semantic search, ranking, specialist ML and selective LLMs

## Core user idea: retrieve before asking the LLM

The user explicitly rejects shipping entire site structures, long HTML pages or the whole website inventory to every LLM call. Instead, progressively narrow with cheap rules, fuzzy lexical search, embeddings, context-aware models and ranking.

**Proposed flow:**
`site/page inventory -> cheap filters -> BM25/full-text and URL/anchor signals -> dense/sparse vector search -> hybrid fusion -> ML/cross-encoder rerank -> selected DOM/Markdown snippets and field evidence -> LLM if needed -> validators -> candidate data`.

An LLM request should receive the source identity/institution/geo context, a small set of candidate paths, relevant text/tables/locators, known mapping examples, and only the required target schema fields. Include links and timestamps. The model should cite the original capture and explain missing fields, never treat nearest-neighbor scores as truth.

## Semantic vocabulary and reusable memory

Index controlled Mzizi concepts (governor, CEC member, tender, county budget, KNBS indicator, candidate, ballot tally), alternate terms, abbreviations, languages, plausible headings, page types, structured field names, site family examples and validated mapping successes. Do **not** collapse merely similar legal or administrative offices: context/jurisdiction/valid time determine equivalence.

Each embedding/search document needs source record ID, content/version hash, model name/version, jurisdiction and appropriate access/permission scope. Embeddings are **derived indexes**, rebuildable from stored artifacts and structured knowledge. The vector store is not canonical evidence.

## Models to evaluate instead of training an LLM from zero

1. **Site-family classifier:** county government, county assembly, ministry, statistical bureau, legislature, election commission, procurement portal.
2. **Page classifier:** homepage, leadership, department, finance, legislation, tenders, downloads, data catalogue, announcement.
3. **Layout model:** header/footer/nav/sidebar/main/list/detail/table/document card.
4. **Link-priority ranker:** predict useful next pages from anchor, URL, parent context, network graph and family.
5. **Field recognizer:** identify reference numbers, dates, amounts, names, offices, geographies, identifiers and citations, with token/DOM evidence spans.
6. **Schema matcher:** candidate field-to-Mzizi target mapping using validated examples; may abstain.
7. **Change/novelty classifier:** meaningful new content vs volatile UI/boilerplate; must not suppress important deadline changes.
8. **Cross-encoder/relevance reranker:** expensive but bounded evaluation over top candidates for each target research task.

Start with rules and pretrained models. Collect **reviewed** Kenya county-site training examples across CMS types, layouts, years, languages and institutions. Hold out whole sites for testing: splitting individual pages from the same template between train/test causes leakage. Expand across Africa only after measuring out-of-distribution accuracy and institutional/legal differences.

An LLM may assist weak labeling/active learning, but self-generated labels must not automatically become ground truth. Keep annotation source, reviewer, version, uncertainty and disagreement.

## Multi-level ranking

Ranking is **task conditional**, not one absolute number that tells whether a URL is important.

- **Site:** source authority, institution coverage, jurisdiction, quality, access conditions and freshness.
- **Page/link:** predicted subject relevance, link placement, link-graph authority, expected new information, crawl cost and status.
- **Content block:** main-content probability, target-field presence, extraction clarity and evidence density.
- **Field mapping:** semantic and structural fit, domain type compatibility, geographical/temporal validity and supporting locator.
- **Evidence:** directness, dated issuer, completeness, conflict, provenance and review.

Illustrative formula for an early prototype (NOT calibrated): `score = 0.25*semantic + 0.20*institutional_context + 0.15*structure + 0.15*link_context + 0.15*novelty + 0.10*extractability`. Do not treat numbers as production thresholds. Normalization, sparse/embedding calibration and evaluation are necessary before trusting combinations. Reciprocal Rank Fusion or learned ranking can combine incomparable lexical/dense score scales. Use confidence **calibration** and abstention.

Separate **ranking score** (what to inspect next), **extraction confidence** (does selected text fit a target field?), **source authority** and **truth verification**. High semantic similarity cannot authorize collection or prove a fact.

## Learning and feedback

Record features, model/version, query or research objective, candidate set, selected content blocks, model rationale where useful, validation results, human corrections, cost and time. Train on confirmed examples, including hard negatives: a procurement scandal article is not a tender listing; two similarly named officials may be different people; budgets for 2025 and 2026 are distinct.

Retain exploration (e.g. diverse, lower-ranked candidates) to avoid self-confirming bias toward familiar page layouts. Refresh datasets as government sites evolve. Compare small specialist models against general LLM prompts and deterministic baselines.

## LLM-agent responsibilities and safety

Agents can propose URL classifications, site family, unknown page meaning, field mappings, structure repair, data candidates, related institutions and follow-up research. Tools handle URL normalization, HTML parsing, schema checking, hash comparison, repeatable extraction, storage, policy enforcement and identity constraints.

LLMs should not:
- freely browse private/authenticated sites or evade blocks;
- write canonical politics, governance or election data without an approved and evidenced workflow;
- manufacture an officeholder or imply a generated expectation is observed;
- merge entities merely by textual similarity;
- declare a site changed because an unrelated banner or timestamp changed.

## Evaluation contract

Measure precision/recall on **site-held-out** page labels, link recall@K and precision@K, ranking NDCG/MRR, source coverage, field extraction exact match/F1, grounded schema mapping precision, citation/locator completeness, change-detection miss rate, token cost per verified fact, embedding index cost, latency and fairness across languages/platforms/countries. Define benchmark versions and thresholds before automated promotion.

**Open:** training corpus and annotation policy; model/provider choice; semantic taxonomy; embedding/LLM costs; score fusion and calibrated thresholds; offline vs managed serving; acceptance review rules. **No model or vector product is approved.**

## Research-to-design: narrow the LLM funnel

[AutoScraper](https://aclanthology.org/2024.emnlp-main.141/), [Co-Scraper](https://arxiv.org/abs/2606.14821) and [SchemaRAG](https://aclanthology.org/2026.acl-industry.78/) support pruning DOM and target schema before LLM mapping, and producing reusable extraction strategies where possible. Start with exact/fuzzy/site-context ranking + BM25, then compare embeddings and hybrid recall on judged queries. Train one specialist classifier only after reviewed labels exist, splitting training/test by **whole site and unseen CMS family**, with out-of-country checks. Store score components, evidence locators and model/prompt versions, never treating relevance as factual proof. See [10](10-prior-art-and-build-vs-reuse.md), [11](11-tool-integration-and-contracts.md), [13](13-benchmarks-and-research-questions.md).

## Person ambiguity, prominence and evidence confidence are different model outputs

When ranking people or matching records, do not collapse these dimensions:

- **Prominence (0–1):** likely public/structural visibility within a declared geographic and temporal context; useful for estimating search breadth.
- **Identity ambiguity (0–1):** difficulty distinguishing a record from plausible people with similar names or incomplete identifiers.
- **Evidence confidence (0–1):** strength of evidence for a specific identity match or claim.
- **Source credibility:** whether a source is suitable for a particular claim and scope.

An AI agent may rank a batch of people by likely prominence and ambiguity, explain collision drivers, suggest external profile matches and propose next research sources. It must retain inputs, evidence, model/prompt version, explanation and abstention. The engine/reference rules remain the explainable scoring baseline; AI output is a proposal, not a canonical score or identity decision.

Prominence can guide whether to search broad media/knowledge bases or concentrate on county, ward and institutional sources. It must never make Wikipedia, a search snippet, a high view count or a facial-similarity result automatically trustworthy. See [entity prominence and discoverability](../entity-prominence-and-discoverability.md) and [person identity/media refinement](../person-identity-media-and-community-refinement.md).
