---
{id: GRP-524E81F66657,name: Manifest-driven scraping and document acquisition,type: documentation,extra: {created_at: 2026-11-13T10:11:46.753Z}}
---

# Plan

## Approach

Build the mechanisms bottom-up and keep every rule in data. First the safe `patterns` package, because the rest depends on it and the code rules forbid inline matching. Then extend the site manifest schema with classification rule kinds, then the engine jobs that plan a crawl and classify paths, links and pages, then file download and purpose assignment, and finally the semantic `meaning` index and agent-assisted proposals. The package consolidation group (typed contracts, fetch, extraction, manifest registry, engine job model, staging store) provides the foundation and runs first.

## Milestones

1. `patterns` package: typed rule sets, linear-time regex, alias and fuzzy matching, typed results.
2. Classification rules in the `mzizi.site/v1` schemas (link, page, file, semantic) plus validation and dry-run support.
3. Crawl planner and classification jobs in the engine, with evidence recorded and scope/gate enforced.
4. File download and purpose assignment with extraction-profile selection and staged output.
5. `meaning` package and `VectorIndex` port with a pgvector or dedicated store, threshold calibration from reviewed decisions.
6. Agent-assisted rule and mapping proposals (blocked until `backend/agent` exists).

## Risks

- Government sites change; every manifest needs `expect` checks and drift detection so failures are visible.
- Vector matches can confuse near-identical names; they stay proposals with scores and hard negatives, never silent decisions.
- Crawling must stay inside legal assessments and scope; classification must never widen it.
- Heavy PDFs and large crawls need memory and size caps, bounded queues and process pools, enforced by the engine.
