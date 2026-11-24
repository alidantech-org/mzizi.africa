---
id: DOC-9A8E56DB1C05
name: Adaptive structure and reusable website template extraction
type: documentation
tags: [improvements, source-redesign, yaml, dom, markdown, templates]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 04 — Optional structures, learned templates and faithful extraction

## Reframe the role of site structure

The old assumption — **a predefined site-specific YAML structure must exist before useful data can be found** — does not scale to all African government websites. In the proposed redesign, explicit structure is **one tool** in a cooperating intelligence system, not the universal entry requirement.

| Mode | Behavior | Appropriate context |
|---|---|---|
| Generic adaptive | No YAML needed. Discover links/DOM/metadata, classify and extract candidate blocks | Unknown websites or unanticipated page types |
| Family/context guided | County government, assembly, ministry, commission, procurement or statistics site expectations | Unfamiliar site with a known institutional family |
| Explicit site structure | Versioned YAML, validated selectors, pagination, field mappings and expectations | Highly valuable/stable portals: KNBS, IEBC, procurement and special document repositories |

All modes can coexist. Even sites with explicit structures need background monitoring for pages and content their mappings do not anticipate. Learnable family expectations should be independent of whether they are persisted as a specific YAML bundle.

## Header/main/footer and repeated template learning

A site often serves a recurring shell (header navigation, footers, sidebar, banners) and dynamic article/main content. **Do not just search literal HTML5 tags.** Many sites use nested `div` layouts, injected UI, ARIA landmarks, CMS classes and templates that differ between listing and detail pages.

Proposed procedure:
1. Sample several distinct page types and compare rendered/static DOM trees.
2. Normalize ephemeral IDs, whitespace and known volatile attributes; retain original captures separately.
3. Cluster recurring DOM subtrees and navigation label sets; identify header, footer, sidebar, form, card grid, detail article, table and document listing.
4. Record a reusable template signature/version, per-page block references and confidence. Keep stable content region locators plus fallback selectors.
5. When layout changes, compare new skeleton with prior templates; attempt alternative locators and evaluate field coverage. High-impact deviations become repair candidates, not silent overwrites.

Shared navigation is **not junk**: it is essential for link discovery, although repeated rendering and embedding can be avoided. Footer links may expose official policy, archives and contact sections. A page's main region can include multiple meaningful sections or tables.

## Technical feature signals

DOM tree shape, tag sequence/depth, ARIA roles, text/link density, heading hierarchy, CSS class/name vocabulary, asset domains, visible text, repeated n-grams, platform generator tags, breadcrumb trails, document extensions and sibling/parent link context. Graph similarities can reveal menu hierarchies and page families. Distinguish structure fingerprint, page type classification and factual content meaning.

The current `mzizi_data/fingerprint.py` already provides a hand-built weighted site similarity signature. Its purpose is not interchangeable with trained models, semantic embeddings or Merkle-style content hashes. Reuse it as one cheap signal.

## HTML, CSS, JavaScript and faithful Markdown

- Static HTML: parse directly when the meaningful page is in the response.
- JS-rendered sites: use controlled browser rendering when necessary, supported by the source assessment and resource budget. Preserve relevant structured API responses separately if permitted.
- CSS: use visibility, ordering and semantic cues; do not attempt to turn stylesheet code into Markdown.
- Semantic DOM: extract title, dates, heading nesting, paragraphs, ordered/unordered lists, tables with headers, captions, links and download references, image alt/captions and source locators.
- Markdown: produce versioned, legible **human-and-agent-readable** representations with a sidecar manifest describing source URL/time, input object hash, source DOM locator, extractor, language, template/profile version and output hash.
- Raw evidence remains immutable in the file system/S3; Markdown is derivative and can be regenerated.
- Preserve records with no meaningful text (scanned PDFs, maps, charts) as explicit capability gaps rather than hallucinating content.

## Fuzzy selectors and semantic extraction

Fuzzy matching can use known phrases (tender, procurement, bid, EOI, zabuni; budget, fiscal estimates; county executive, cabinet secretary), institutional context, page title, nearby labels, table headings and semantic embeddings. A match generates **candidate page type and candidate field mappings**.

Example: a county website path `/opportunities/current` might contain tender reference, entity, deadlines and attachments even without `tender` in the URL. Ranking should inspect those fields before presenting the page as a tender feed. A news story that mentions tenders is not automatically a procurement listing.

Use existing YAML patterns as **precision controls and examples**, not a precondition. The `mzizi.site/v1` schema is currently closed: any proposed `semantic`, `expected_terms` or learned-locator fields are illustrative until the schema and runner are separately updated and validated.

## Structure proposals and drift repair

An agent may:
- classify an unknown page layout; propose a section/module or family template;
- locate likely field selectors using evidence; test on saved real examples;
- compare with previously successful mappings from similar sites;
- prepare a new versioned candidate YAML bundle when a controlled structure is helpful;
- report which fields improved/regressed and which sources disagree.

It may not bypass source collection approval, silently activate a materially untested mapping, or turn uncertain candidates into canonical records. Versioned extraction rules are technical recipes, not licences or proofs.

## Reuse and adaptation

A family model can learn `county government -> likely /departments, /executive, /budget, /tenders` without claiming every county follows identical paths. Site-specific overrides may specialize this, especially high-value portals. An ML model may infer page meaning despite changed paths and templates, then deterministic logic validates fields and provenance.

Template changes should be **recoverable operating events**, not assumed fatal; but a changed budget table may convey a meaningful correction and needs review, not automatic adoption of the old interpretation.

## Evidence-aware tests

Cross-platform county homepages; JS tender listing; article without semantic HTML5 tags; same header on many pages; mixed-language page labels; PDFs referenced from tables; removed/moved headings; changed deadlines but unchanged navigation; valid structure with unexpected new content; family structure that predicts wrong path.

**Status:** Exploratory extraction design. Final YAML, ML and page schema changes are OPEN.

## Research-to-design: structure learning and parser baseline

[RoadRunner](https://www.vldb.org/conf/2001/P109.pdf) established repeated-template induction; [Trafilatura](https://trafilatura.readthedocs.io/en/latest/extraction-overview.html) is a strong main-content/Markdown baseline, with [Crawl4AI](https://docs.crawl4ai.com/) an optional comparison. [FreeDOM](https://research.google/pubs/freedom-a-transferable-neural-architecture-for-structured-information-extraction-on-web-documents/) and [MarkupLM](https://aclanthology.org/2022.acl-long.420/) support preserving DOM/text structure when later training models. Proposed flow: retained raw capture -> DOM and link graph -> shared block/template detection -> cleaned Markdown and table artifacts -> evidence locators and parser/version -> reviewed optional extraction strategy/YAML. Compare tools on the **same saved captures**, including div-heavy pages, PDFs, JS and navigation. No mandatory YAML or trained model. See [11](11-tool-integration-and-contracts.md), [12](12-artifact-lifecycle-and-lineage.md), [13](13-benchmarks-and-research-questions.md).

## CSS-backed images and person-media extraction

The extractor must discover image candidates beyond `img[src]`. Cover `srcset` and `picture/source`, lazy-loading attributes, inline `style`, CSS `background-image`, linked/external stylesheets containing `url(...)`, relevant SVG `image` references, Open Graph/Twitter image metadata and JSON-LD image properties. A browser-rendered/computed-style fallback may inspect pseudo-elements or JavaScript-created images when static parsing cannot see them; do not run a browser for every page by default.

For an external stylesheet, resolve relative `url(...)` values against that stylesheet's URL. Preserve the stylesheet capture/hash and CSS rule/selector as evidence. Shared navigation and site logos must not be mistaken for page-specific person portraits.

Use repeated DOM blocks to associate content: if a member card contains a name, ward, profile link and CSS background image, preserve those as one extraction block and propose a person-to-image association with its exact locators. Confirm against the linked official profile or other suitable evidence before treating the image as that person's portrait. An image URL, filename or face similarity alone is not proof.

Image discovery, image downloading, person association and portrait selection are separate stages. Download only within the source's approved scope; store through the existing files service and S3-backed filesystem; attach through the existing `filesystem.attachments` portrait role after review. Preserve original image bytes and provenance. See [person identity and media refinement](../guides/person-identity-media-and-community-refinement.md), [tool contracts](11-tool-integration-and-contracts.md) and [artifact lifecycle](12-artifact-lifecycle-and-lineage.md).
