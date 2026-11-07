---
id: DOC-9A8E56DB1C03
name: Human-reviewed source schema alternatives
type: documentation
tags: [improvements, source-redesign, database, normalization, review]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 02 — Source schema alternatives and human table review

**No website-to-source merger has been approved.** The user's preferred review question is whether a simpler `source.*` model (websites, domains, TLDs/zones, pages, paths, links, visits, publishers, captures) can replace confusing overlap **without prematurely normalizing**. This document records **candidate concepts**, not DDL.

## What simplification should mean

- A human can explain each table in one or two sentences; its columns tell a cohesive story.
- A table is independent only if identity, cardinality, history, constraints, performance or ownership justify that independence.
- Before separating `pages`/`paths`/`urls` or `domains`/`tlds`, test concrete cases for unique identities, redirects, aliases and historical ownership.
- Avoid both extremes: too many tiny junction tables for one-page attributes, and one opaque mega-table that loses independent occurrences and integrity.
- Prefer validated fields when frequently queried; JSONB can hold sparse provider-specific observations with shape validation, not replace all typed keys or proven joins.
- Cross-schema PostgreSQL FK constraints should be enforced where structurally possible, per the user's direction; `target_kind + target_id` alone is not a real FK.

## Three boundary alternatives (all OPEN)

| Alternative | Description | Benefit | Risk |
|---|---|---|---|
| A. Keep `website` distinct | Improve names and remove redundant website-specific tables | Clearer source-vs-web boundaries, fewer moves | User still faces two related registries and duplicated concepts |
| B. Selective consolidation | Relocate stable website/location facts into `source`; leave operational checks in `engine` and artifacts in `filesystem` | One place for evidence and site knowledge without forcing process logs into source | Requires careful migration of FKs and API paths |
| C. Full website consolidation | Fold most `website` entities into `source`, simplify families/structures as supported | Potentially simpler public mental model | Risks a broad domain that mixes collection policy, content identity, discovery and provenance |

No alternative is preselected. A preference for source-centric naming is not an implementation approval.

## Candidate concepts and table necessity tests

| Candidate concept | Plain-language meaning | One-table alternative / split trigger |
|---|---|---|
| `source.websites` | Stable logical internet property; category, status and institutional scope | Compare current `website.sites`, keep stable identity independent of hostname |
| `source.domains` | Hostnames historically assigned to websites, redirects and status | A hostname may be shared over time or host separate sites; determine if junction or dated mapping needed |
| `source.tlds` or zones | Information about registry suffixes such as `.ke` and `.go.ke` | Current `website.domain_zones` may suffice; do not create a second TLD registry without a query use case |
| `source.pages` | Discovered/expected logical pages with purpose and lifecycle | Can hold present path/url for simple case; splitting URL aliases later only if demonstrably necessary |
| `source.paths` / page URLs | URL/path variants, paginated/parameterized resource addresses, alias history | Could be fields in pages; justify a table for many-to-one URL mapping, redirects or historical identity |
| `source.links` | The source-to-destination connection and anchor context | Often independently many-to-many; can store target URL even if no target page has been resolved |
| `source.visits` / observations | Dated attempt or observation of a website/page response | Compare `website.checks`, `section_visits`, `source.captures` and `engine.jobs` to avoid duplicate history |
| `source.sections` / blocks | Main article, table, listings, navigation, shared boilerplate and locators | Store in a versioned Markdown/manifest file unless fast block-level queries demand dedicated rows |
| `source.structures` | Controlled extraction profile for site/family, optional for discovery | Can version bundles in filesystem; determine minimal relational identity and activation metadata |
| `source.documents` | Logical cited publication, not a URL or storage object | Preserve identity and multiple capture/format/source relationships |
| `source.captures` | Time-stamped immutable retrieval evidence | Preserve original raw evidence, processing inputs and source/site lineage |

This is **not** an instruction to add all listed tables. For example, a first iteration may store page URL aliases within a page record if the real query patterns are simple. Conversely, a unique URL registry or a first-class link relation may be essential for durable deduplication. Decide from cardinality, lifecycle and measured query needs.

## Example human queries that design must support

1. List all sites for a Kenyan county and their currently valid primary/alias domains; distinguish the county government's site from the county assembly.
2. For a national institution, associate the source with Kenya's root geographic scope while separately recording its headquarters in a specific city, if verified.
3. Start from a domain, discover links and show **every observed or expected page**, current availability and likely subject, without declaring unvisited paths real.
4. Find all locations where a budget PDF was published, its independent download sightings and whether bytes are identical.
5. Show a page's previous and current URL, changes over time and exactly which capture/Markdown section supported a claim.
6. Identify relevant pages for a new source family without an authored YAML structure.
7. Show site/domain assessment approval and whether a fetch was permitted at a given time.
8. Review whether `domain_patterns` really needs a site-specific home once shared pattern management is evaluated.

## Human review record template (use one per current table, later when requested)

**Current evidence:** exact `schema.table`, current migration/Dryv type, description, every column (type, nullability, default), PK/unique/check/FKs/indexes, foreign use paths, expected cardinality, sample rows if live data reviewed.

**Necessity test:** What real entity is this? Who writes it? Does it have independent state/history? Which queries fail or become confusing without it? Are attributes duplicated in files, `source`, `engine`, `filesystem` or other domain schemas?

**Alternatives:** keep; rename; embed columns/JSON in existing record; merge; split; move to `engine`/`filesystem`; remove after proven unused. For each, show benefits, lost functionality and migration path.

**Data correctness:** 1A/1B/2A/2B eligibility, independently observed vs inferred, jurisdiction/geographic root vs address, legal approval, temporal validity, provenance and correction.

**Integrity:** known-target hard FKs, source/version identities, duplicate/foreign data backfill, query indexes, valid-time constraints, on-delete policy.

**Review decision:** exact option, **USER CONFIRMED** only after explicit approval, reasons, outstanding evidence and affected APIs/packages/tests. Neither ChatGPT nor prior notes may fill a human approval slot on the user's behalf.

## Historical data and physical simplification

Avoid collapsing a page version into a mutable `pages.html` field, deleting old redirects, or replacing all independent source sightings with one URL. Compression must preserve defensible evidence and correction history. For high-volume visits/observations, evaluate retention, partitions and archival in S3 rather than designing excessive new tables by default.

## Next review sequence (proposal, not tasks)

Audit the seven current `source` and twenty current `website` tables **with their actual columns**; then compare each with the conceptual model above. Only afterward decide boundary, table names, FK mapping and staged migrations. The detailed [existing inventory](01-current-inventory-and-boundaries.md) is a starting list, **not** live column verification.

**Decision:** `website` collapse = NOT APPROVED. Exact `source.*` table set = OPEN.
