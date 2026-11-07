---
id: DOC-A7B318C62E94
name: Site structure rendering Markdown extraction and change hashing plan
type: documentation
tags: [improvements, planning, websites, markdown, extraction, scraping, hashing, crawling]
extra: {status: planning_only}
---

# Website content → readable Markdown; intelligent site structures and change detection

**PLANNING ONLY.** This is the user's new high-priority proposal: instead of storing/analyzing an enormous collection of webpage HTML, JavaScript and CSS as the primary research representation, **turn website content into accurate, well-designed, human- and agent-readable Markdown files**, detect changes precisely at site/page/section/tree level, and map extracted facts from that content. Work must integrate with source evidence, the existing S3 service and concurrent pipelines.

## The user's requirement, in substance

- A website's rendered content and information should become **useful structured Markdown**, not unmanageable HTML/CSS/JS dumps.
- Improve site-structure specifications so they are **more powerful, maintainable, reusable and explainable**, not blindly more complex.
- Support site families, reusable patterns, page/section templates, discovered documents and extraction mappings to domain data.
- Hash and compare **site structures and HTML trees**, detect which subtree or section changed, and avoid processing unchanged material.
- Precisely map the changed/new information into readable Markdown sections and then structured candidate records, with provenance/citations.
- Keep file and folder organization simple, using logical paths and tags in MZIZI's file system and physical objects in the **existing self-hosted S3 instance**.
- This connects to the user's four acquisition classes: site templates are often seeded/pattern-based; captures and Markdown extractions are automated/collected; summaries may be derived.

## Important interpretation: not "convert executable CSS/JS source code to Markdown"

HTML represents content and semantic structure; CSS influences presentation/visibility; JavaScript may construct visible content dynamically or fetch underlying JSON. The goal is **Markdown expressing what a reader can meaningfully see, navigate and cite**, not a line-by-line transcription of executable HTML/CSS/JS source code.

- **Static pages:** use fetched HTML/DOM directly where sufficient.
- **JavaScript-rendered pages:** when collection policy permits and static HTML lacks meaningful content, run a controlled browser rendering step (possibly designated interactions/route states). Capture the resulting visible DOM and relevant structured API data separately.
- **CSS:** use computed visibility/structure and semantic cues selectively (e.g., hidden navigation, tab panels, layout tables). Do **not** try to reproduce arbitrary CSS animations or entire site appearance in Markdown.
- **Scripts, secrets, analytics, ad code, repetitive menus, cookie banners and boilerplate:** exclude from readable Markdown unless substantively important; preserve relevant acquisition diagnostics and evidence as appropriate.
- **Data tables/charts/maps/forms:** convert data tables to Markdown where feasible; for large tables retain a CSV/JSON attachment and a Markdown explanation; chart values and map facts should link to their underlying evidence or explicit notes if not recoverable; forms may document field definitions rather than pretending inputs were submitted.
- **Images, PDF links, videos, footnotes, download links and citations:** preserve meaningful captions, alt text and stable source URLs, link separately registered file versions where useful. Do not invent missing graphic content.
- **No legally restricted bypass:** respect the site collection gate, robots/terms and rate limits; never bypass logins, CAPTCHAs or anti-bot protection.

## Proposal: site structure that is powerful *and* understandable

The existing `.docs/docs/SITE_STRUCTURE_SPEC.md` and `.docs/docs/WEBSITE_DESIGN.md` already define modules, family inheritance, site overlays, `sections.yml`, CSS/XPath/JSONPath rules, legal collection policy, tags, mappings and structure-version manifests. The Python implementation includes `structure/{bundle,effective,sections,selectors,extract,validate}.py`. **Enhance the present machinery rather than creating an unrelated second site registry.**

Conceptual authored site-structure definition (illustrative fields, not an approved YAML contract):

```yaml
site:
  id: "official-site"
  jurisdiction: "ke"
  publisher_ref: "<verified publisher FK>"
  family: "county-government"
  version: "draft"
pages:
  - kind: "news_article"
    match: "/news/*"
    render: "static_then_browser_if_needed"
    title: "h1"
    main: "main article"
    remove: ["nav", "footer", ".cookie-banner"]
    fields:
      published_at: "time[datetime]"
      headline: "h1"
      body: "article"
    output:
      format: "markdown"
      folder: "websites/markdown-pages/"
  - kind: "procurement_notice"
    match: "/tenders/*"
    fields:
      contract_ref: ".reference"
      closing_date: ".closing-date"
      details: ".notice-body"
hashing:
  page: "normalized_semantic_dom"
  sections: true
  ignore_dynamic: ["ads", "rotating-clock"]
```

Do not store pseudo-selectors without validating them on actual examples. Existing rules have semantics and authorization gates; version and verify all changes. Each new effective structure should have an input hash/version, schema validation, sample pages, extraction accuracy checks, source URLs and confidence.

**Potential structure improvements:** meaningful page families/types, path/mime/DOM selectors, per-section page templates, pagination/list→detail navigation, multiple languages, country/jurisdiction binding, dynamic rendering only when necessary, reusable family traits/overlays, document download discovery, error rules, disallowed selectors, section identity, link extraction, incremental hash policies, extraction output validation and mapping profiles. Keep the model understandable and reviewable in UI, not a giant implicit AI prompt.

## Proposed end-to-end page extraction (independent pipeline stages)

1. **Discover**: identify canonical site, publisher, section, page URL, applicable approved structure version and collection permissions.
2. **Fetch/check**: URL normalization, conditional revalidation when supported (ETag/Last-Modified), safe timeout/rate limit and response metadata. A previously seen URL is **not** proof that it never changes.
3. **Render if needed**: use static HTML first; a bounded browser mode may render authorized JS content and meaningful states/tabs when necessary. Record method, viewport/config and render tool version.
4. **Preserve evidence**: store one immutable raw capture/content version (and relevant render snapshot or structured API payload) in external S3 when required for provenance. Reuse by content hash, not by URL alone.
5. **Extract semantic DOM**: locate main content, headings, sections, tables, dates, contacts, links, attachments and metadata using approved versioned site templates plus generic fallback.
6. **Normalize carefully**: drop clearly irrelevant boilerplate, strip volatile attributes in the *comparison representation*, canonicalize links and whitespace **without deleting meaningful text**. Preserve original extracted text separately if normalization could be lossy.
7. **Hash and compare**: raw bytes, normalized semantic page, stable section/subtree digests and site-level page inventory; compare to prior equivalent extraction configuration.
8. **Generate Markdown**: deterministic Markdown for the visible meaningful content with headings, tables, lists, citations, source links, dates, image alt/caption and attachment links. Emit diagnostics for unsupported elements.
9. **Persist versions**: one logical Markdown page per source page (with versioned derivative); optional section-level Markdown artifacts for very long pages. Link raw input file version, structure version, DOM section identity, extractor and output hash.
10. **Map facts**: feed Markdown sections and/or structured DOM fields to domain-specific mappers (ministries, official holders, tender notices, news, Acts, budget figures), creating *staged candidates and reviewable claims*, not automatic truth.
11. **Reconcile**: dedup exact candidates, compare extracted values, open quality findings for contradictions, and promote only under existing/approved rules.
12. **Refresh incrementally**: revalidate resource; only changed pages/sections and invalidated extractor/version dependencies need new work; downstream derived outputs update through explicit dependency graph.

## Multi-level hashing — distinguish structure similarity from content change

| Level | Hash / identity | What it should detect |
|---|---|---|
| Source URL/resource | Canonical URL + applicable publisher/route identity | Same logical source revisited |
| Raw artifact | SHA-256 of response bytes | Identical/downloaded content, even across URLs |
| Rendered document | Hash of bounded captured rendered DOM or render payload | JS-generated state change not apparent in raw HTML |
| Normalized semantic page | Hash of main content after *documented* noise normalization | Actual meaningful page change |
| DOM node / subtree | Stable semantic paths/IDs + recursively computed child/content digests (Merkle-style option) | Changed local content, new/removal/reordered sections |
| Markdown section | Stable section identity + normalized Markdown hash | Section-level change and reuse |
| Site index | Deterministic mapping of page IDs to last valid semantic/section hashes | Overall source-site changes and coverage |
| Extracted candidate | Domain natural key + normalized payload hash + mapper version | Meaningful data updates vs repeated extraction |
| Derived content | Input version hashes + tool/prompt/rule/config versions | Reprocessing only when necessary |

**Don't confuse different hashes:** `website.fingerprints` currently identifies similarities of sites' markup/navigation/assets/document-type mix. It does **not** prove that a particular news article or table's text stayed unchanged. Keep `site family fingerprint`, `page content hash` and `data record identity` separate.

### Hashing tree sections without false change storms

- Use a stable key when the site provides one (article identifier, heading ID, documented route, table label). When absent, use deterministic fallback based on a scoped heading/path and position with collision handling.
- Hash normalized semantic child text/structure; choose explicitly whether heading reordering changes the subtree ID or only its path. Record hash algorithm and normalizer version so changes in normalization do not silently look like website changes.
- Ignore volatile counters, ads, CSRF tokens and clocks **only under an explicit reviewed normalization policy**; never ignore legitimate tender deadlines or election result timestamps.
- For each page, compute a manifest of sections with label, stable key, source locator, hash, length and type. Compare old/new manifests; report added/removed/modified/moved sections with evidence.
- Site-level "changed" should not mean "recrawl the entire web" on one advertisement; plan bounded URL validation and page inventory diff. Prevent missing content by periodically revisiting supposedly unchanged pages.
- Identical page text with a changed extractor/site structure may require re-running Markdown generation and mapping even if the website bytes did not change.
- Store source-time, fetched-time and last-verified-time separately; a legally meaningful statement about an office holder can change with no page modification if the source is stale.

## Example Markdown page product (format only, not real data)

```markdown
---
source_url: "https://example.go.ke/news/sample"
site_id: "verified-site-id"
page_key: "news/sample"
captured_at: "2026-11-07T00:00:00+03:00"
content_hash: "sha256:..."
structure_version: "site-structure-version"
extractor_version: "markdown-extractor-version"
language: "en"
title: "Public Announcement"
source_file_version_id: "raw-capture-file-version"
---

# Public Announcement

**Published:** 7 November 2026

## What was announced

Readable, faithful text from the original page, with meaningful headings.

## Details

- Verifiable item one.
- Verifiable item two.

## Related documents

- [Official notice](https://example.go.ke/docs/notice.pdf)

## Source

[Original published page](https://example.go.ke/news/sample)
```

Metadata belongs in an appropriate structured manifest/schema, not necessarily all as inline Markdown frontmatter; some may be a sidecar and DB-linked record. Ensure links/citations are durable and can be traced to exact source versions.

## How this fits existing code / uncovered gaps

- `source/backend/engine/data/src/mzizi_data/crawl.py` already has bounded section crawling and document sightings. Its comments and behavior indicate a **known URL may be skipped without re-fetch**, which is useful for a one-off crawl but insufficient for ongoing website change monitoring. Review refresh/conditional fetch behavior before building incremental pipelines.
- `structure/sections.py` recognizes semantic section types; `SITE_STRUCTURE_SPEC.md` supports reusable site/family structure bundles and mapping modules.
- `source/backend/engine/data/src/mzizi_data/fingerprint.py` computes site similarity digests from navigation, assets, classes, generators, element types and document formats. This is **site structural fingerprinting, not a content-tree diff**.
- `filesystem` and `source.captures` already preserve raw/versioned artifacts; however, `files.py` currently uses a local-directory object adapter rather than the user's existing S3-compatible service.
- As inspected, a complete **HTML → faithful Markdown conversion plus semantic DOM subtree change index** is **proposed**, not confirmed as already implemented. Inspect any newer pipeline code before planning tasks.

## Evaluation cases before approval

1. Static official page with headings, lists, tables and multiple PDFs.
2. JavaScript news/tender list that renders after data load, with paginated detail pages.
3. Date-only or sidebar-only change; distinguish noise from meaningful updates.
4. Reordered or moved article section; determine whether changed content vs moved DOM.
5. Same PDF linked from several pages; one object but several verified source sightings.
6. Large budget table: short readable Markdown plus CSV attachment, exact row/column mapping.
7. Updated tender deadline in JavaScript state: must detect and not filter out as "volatile".
8. Kenyan county family site and an unrelated independent national commission site.
9. Language change/translation; link derivative language and source language explicitly.
10. No access/collection permission: discover as metadata, **do not fetch or bypass**.

## Open design decisions

Which rendering library/process is supported and where it runs; static-first vs mandatory rendering; the Markdown dialect/quality standard and frontmatter vs sidecar metadata; raw HTML retention policy and S3 cost; stable content section identity; reliable hashing normalization policy; page/site manifest storage; section-level vs page-level Markdown versioning; site structure authorship/editor and inheritance; official source/legal gate; recheck cadence; how site changes invalidate downstream candidates; human quality review triggers; high-volume concurrency and source rate limits. These require the user's later direction.

**Not permission to alter the current crawler, store, schema or Taskcode tracker.**
