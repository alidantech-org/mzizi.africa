---
id: DOC-9A8E56DB1C04
name: Website root discovery link graphs and page memory
type: documentation
tags: [improvements, source-redesign, crawler, links, dedup]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 03 — Root discovery, links, URL identity and site memory

## Desired behavior

Given an unfamiliar domain, Mzizi should build a bounded, dated, queryable inventory of discoverable public pages and resources, infer their probable content and institutional context, and improve that inventory over repeated observations. The site may have **no authored YAML bundle**. Source approval and fetching policy still apply.

## Root-first discovery protocol (proposed)

1. Register a **candidate** site or host; resolve known institution/publisher, jurisdiction and possible site family. A hypothesis is never a verified website.
2. Within approved assessment/collection boundaries, probe the root with a bounded HTTP request. Observe DNS, scheme, canonical host, TLS/response metadata, HTTP status, redirects and redirect chain. Each hop must reapply access scope, robots and host restrictions; never follow arbitrary external redirects automatically.
3. Parse available HTML; use controlled rendered DOM **only when needed, permitted and budgeted**. Save the source URL, original `href`, resolved destination, anchor label, nearby text, enclosing heading, DOM region and relation to source page.
4. Gather other permitted discovery hints: `robots.txt`-advertised sitemap URLs, XML sitemaps, navigation, relevant links, feeds, pagination, APIs and provider-declared canonical URLs. Sitemaps are hints, not guarantees.
5. Classify links by relationship and potential value. Store all useful occurrences and enqueue selected resources under per-host budgets; do not send whole site to an LLM.
6. Expand recursively with depth/page/time budgets and trap detection; preserve unvisited candidate pages and why they were deferred.
7. Compare later inventories with prior observations, track newly added/missing links and recheck uncertain or changed pages.

**Completeness limit:** No crawler can enumerate literally every possible dynamic, hidden, authenticated, orphaned or form-generated URL. Record discovery coverage and uncertainty; never label inferred pages confirmed.

## Internal, external and related classifications

Classification must use **registered site identity and observed host relationships**, not only `www`-stripped hostname equality.

| Class | Meaning | Typical action |
|---|---|---|
| Internal | Same logical site and approved host/path | Add page candidate and schedule bounded discovery |
| Alias / historical host | Old/current alias for this site, date-aware | Resolve identity and retain redirect history |
| Associated resource host | File CDN, approved API or data download host used by site | Register relationship and assess collection scope separately |
| Related institutional site | Different site operated by same publisher/institution | Preserve relationship; separate site jobs and policy |
| Known external | Another registered publisher/site | Create outgoing edge, not same-site crawl |
| Unknown external | Outside site registry | Store URL/anchor; propose classification under separate gate |
| Non-HTTP | `mailto:`, `tel:`, fragments, scripts and other schemes | Preserve relevant contact/reference metadata; never treat as web page |

Cautions: two unrelated sites may live on the same parent domain; a redirect or CDN hostname is not proof of same ownership; country-code TLDs do not define government legitimacy.

## Deduplication is layered, not destructive

1. **Link occurrence:** The same URL in header, footer and a budget paragraph represents three observed occurrences. Keep meaningful source positions or grouped occurrence evidence.
2. **Normalized URL:** Resolve relative links, lower-case scheme and hostname, strip fragments for HTTP resource identity, normalize safe encodings/default ports and dot segments. Query params are **not automatically dropped**: `?year=2025`, `?page=2` and `?doc=123` may change meaning. Use a versioned, tested tracker-param policy for analytics noise.
3. **Canonical/redirect alias:** Maintain explicit alias/canonical claims with origin and observation time; a `rel=canonical` declaration is evidence, not unquestionable truth.
4. **Logical page/resource:** Group different addresses only after suitable redirect, canonical, identity and content evidence; maintain source URLs for provenance.
5. **Exact content:** Reuse identical immutable stored bytes by strong hash while preserving multiple independent URL/site sightings.
6. **Near-duplicate content:** Compute lexical or semantic similarity, but avoid auto-merging year-specific budgets, different institution notices or legally distinct publication versions.

Dedup identity must be valid over time. The same URL can serve different versions, and two distinct URLs can point to identical bytes without being the same publishing event.

## What page memory needs to answer

- `site_id`, candidate/observed status, probable page type and last known URL.
- Source URL and link provenance: referring page, anchor text, DOM location, discovery method and time.
- Last observation (reachable, redirect, unavailable, gated, rejected, retry due), status code, content type, validators `ETag` / `Last-Modified` and errors.
- Prior URL aliases, content/capture hashes, current and historical content versions and processed derivative refs.
- Page-family/template prediction; navigation/header/main/footer context.
- Potential domain data: tenders, offices, county executives, budgets, election data, statistics, legislation, news and datasets.
- Discovery breadth/depth, skipped/blocked/redundant URLs, pagination state and crawl budget.

These are **fields and logical entities to evaluate**, not a mandate for `pages`, `page_urls`, `page_observations`, `page_versions`, `links`, `paths` and `visits` to all become separate tables. Compare a compact page-centered model against normalized history/link tables in [schema review](02-source-schema-and-human-review.md).

## Ranking next links before costly fetching

Use cheap lexical URL/anchor matching, site-family expectations, institutional/geographic context, source-page section, historical success and content freshness first. Next use embedding retrieval and ML reranking; invoke LLM selectively for ambiguity or new structural behavior. Reserve an exploration budget for unfamiliar/low-score links so the system can learn beyond current expectations.

Prioritize by expected information gain **and** allowed policy, freshness, novelty, latency, data quality and crawl cost. Do not use one rank score as a factual truth or access authorization.

## Crawling safeguards

Budget number of pages, bytes, depth, redirects and browser executions; per-host rate limits; robots/access gate; URL parameter/cardinality caps; calendar/search/login/cart trap detection; pagination termination; allowed MIME; retry/backoff for 429/5xx; resume failed jobs without violating the gate. Avoid scanning guessed routes aggressively.

## Example (illustrative, not a live crawl)

`https://county.example.go.ke/` redirects to `https://www.county.example.go.ke/`. Its header contains `/departments` and `/tenders`, main contains `/budget/2026`, footer contains `/downloads`; a link to a national Treasury host is external and related. Save one logical root page with the redirect path, all link occurrences and their context. If `/tenders` later becomes `/procurement/opportunities`, infer a possible continuation and verify rather than forgetting the old URL.

## Acceptance scenarios for future review

A site with no YAML is mapped at root; the same file linked from three sites is stored once but has three sightings; a redirected hostname retains its history; two query-param pages remain distinct; a JS listing yields paginated detail links; an external link is recorded but not automatically fetched; restricted URLs are never bypassed; repeated visits reuse unchanged artifacts and revisit after refresh policy.

**Status:** Functional requirements and data-model options only; no accepted `source` schema DDL.

## Research-to-design: crawling tools and correct connections

[Scrapy](https://docs.scrapy.org/en/master/topics/architecture.html) and [Crawlee](https://github.com/apify/crawlee) are alternative mature crawl primitives, not production choices. Benchmark **current Mzizi engine against one** on the same legally approved site set before replacing a working scheduler. Keep a single engine-owned host budget, source permission gate, URL/link memory and request idempotency across all pipelines. Store link *occurrences* including navigation anchor context even if main-text cleaning removes navigation; resolve internal/associated/related/external using registered site identity, not hostname alone. Preserve query params carrying fiscal year or page state. Refer to [11 adapters](11-tool-integration-and-contracts.md), [12 artifacts](12-artifact-lifecycle-and-lineage.md), [13 benchmarks](13-benchmarks-and-research-questions.md).

## Media assets are discovered separately from navigable pages

A website inventory must preserve image and other asset references without confusing them with ordinary page links. CSS background images, stylesheet assets and responsive image variants can be essential content (for example, member portraits) even though they are not anchors in the page navigation.

Record the **occurrence** and its context: source page/capture, DOM block or CSS rule, stylesheet URL/hash when applicable, original and resolved asset URL, discovery method, nearby heading/card/person candidate and fetch-policy decision. Resolve a relative CSS `url(...)` against the stylesheet URL. An external asset host is not automatically a separate publishing site, and an asset URL is not automatically permission to fetch it. Reuse the same host/source admission, redirect and byte budgets as the existing engine. See [person media enrichment](../guides/person-identity-media-and-community-refinement.md), [extraction details](04-structures-templates-and-extraction.md) and [artifact lineage](12-artifact-lifecycle-and-lineage.md).
