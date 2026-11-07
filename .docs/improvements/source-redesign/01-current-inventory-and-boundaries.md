---
id: DOC-9A8E56DB1C02
name: Current source and website model audited from repository
type: documentation
tags: [improvements, source-redesign, inventory, evidence, boundaries]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 01 — Current repository inventory and boundaries

**Planning baseline, not a live database inspection.** Review was based on current `develop` Dryv contracts, migrations and data-engine code. Do not confuse tables defined in code, research fixtures, migrated tables and live populated rows.

## Present repository model

The source design document inventories **7 `source` tables** and **20 `website` tables**. Neither schema's physical retention is approved. For every entry below, the column-by-column live review remains necessary.

| Current table | Current responsibility | Specific question before redesign |
|---|---|---|
| `source.publishers` | Distinct publishing authorities, jurisdiction and kind | Link reliably to verified organizations/institutions without conflating publisher and website |
| `source.documents` | Logical publications, URLs, titles, dates, publisher | One document can have many formats, hosts and captures; distinguish from files |
| `source.captures` | Retrieval occurrence, URL, time, tool, content/file reference | Can page and file captures share this evidence identity? Which FKs are hard? |
| `source.methods` | Research/extraction method identity | Duplicate model/version/job registries? |
| `source.attributions` | Evidence for assertions, records and fields | Generic target linkage versus real enforceable FKs |
| `source.verifications` | Verification outcomes | Relationship to review/audit/claims |
| `source.document_classifications` | Versioned document-kind predictions and evidence | Reuse for documents; do not pretend this classifies all webpages |
| `website.sites` | Stable site code, status, kind, jurisdiction and sightings | Rename/move? Site identity distinct from domain and publisher |
| `website.domains` | Dated hostname roles, status, last probe and redirects | Hostnames vs path/URL identity; aliases and site history |
| `website.site_publishers` | Time-aware site/publisher relationship | Is relationship independently many-to-many with roles? |
| `website.structures` | Structure identity owned by site/family and purpose | Can naming/mapping be simplified with files? |
| `website.structure_versions` | Immutable bundle versions and reports | Necessary independent version records vs filesystem version? |
| `website.structure_files` | Bundle files and filesystem refs | Avoid a duplicate file manager or losing file-role metadata |
| `website.checks` | Reachability, fit, drift observations | Unify with visit/check events or keep specialized observations? |
| `website.families` | Similar website groups | Classification vs reusable pattern/structure families |
| `website.domain_patterns` | Family-related hostname templates | Candidate for shared pattern management, not an approved move |
| `website.members` | Site/family membership, basis, score and validity | Justify lifecycle/role and real FKs |
| `website.subjects` | Link site to geography, institution or subject | Resolve soft `target_kind + target_id` references safely |
| `website.traits` | Scored site/family tags | Could classifications/tags cover the use case? |
| `website.relations` | Similarity/reuse relationships between sites/families | Is a separate graph necessary, what relation types are factual? |
| `website.fingerprints` | Structural fingerprints of navigation, markup, assets, documents | These are not semantic embeddings or substantive content hashes |
| `website.assessments` | Source/legal permissions, current approval and evidence | Preserve permission gate and human authorization |
| `website.dossiers` | Jurisdiction-level collection/legal review | Distinguish from per-site assessment and any general legal rules |
| `website.domain_zones` | DNS suffix/registry-zone metadata | Need separate zone/TLD table only if a real requirement justifies it |
| `website.dns_snapshots` | Dated DNS observations | Evidence of host behavior vs operational logs |
| `website.document_sightings` | Where a file was found, URL/hash and capture | Keep independent sightings for one content object on many sites |
| `website.section_visits` | When content section was crawled and what was found | Could be generic page observation or an engine run event |

## Capabilities already present in code

- `mzizi_data/registry.py` publishes versioned structure bundles and resolves current domains.
- `mzizi_data/structure/{bundle,effective,sections,extract,validate}.py` supports authored YAML, inheritance and deterministic extraction; `mzizi.site/v1` is an existing **closed schema**. Proposed semantic YAML keys need contract changes and explicit approval.
- `mzizi_data/crawl.py` extracts permitted links, normalizes basic URLs and remembers visited URLs for a crawl; this is **not** a persistent, full-site link graph nor a complete generalized page registry.
- `mzizi_data/probe_domains.py` performs bounded domain checks, records DNS history, captures redirect outcomes, applies restrictions and can fingerprint a landing page. This does not imply that the root's entire page graph is stored.
- `mzizi_data/fingerprint.py` extracts navigation labels, markup counts, classes, generator metadata and resource types, with weighted similarity suggestions. This is not trained ML for page semantics.
- `mzizi_data/semantics.py` performs layered URL/text/fuzzy classification of **documents** with versioned, attributable suggestions. Reuse this boundary rather than building an unrelated competing classifier.
- `source.captures`, `source.documents`, `website.document_sightings` and `filesystem` already preserve a portion of the publication/evidence/capture chain.
- Current `engine`/`staging` tables already represent jobs, gaps, candidates and quality issues. Do not invent new operational managers without comparing them.

Code and documentation can disagree. Current table lists are drawn from `dryv/contracts/domains/website/index.ts`, source contracts and migration history; actual deployed rows, constraints and migration status are unverified.

## Important separations

1. **Institution/organization vs publisher vs website vs domain:** one institution may operate several sites; a site may have many domains over time; a domain may change owner. The concepts can be linked even if the final physical schema is consolidated.
2. **Page vs URL/path vs link occurrence:** a logical page may move; links have an origin and anchor context; a URL may be a candidate that is not yet fetched. Independent tables are optional until reviewed.
3. **Publication vs content object vs capture:** same document at several URLs must retain source sightings; same bytes can be stored once; a fetched page may contain several publications.
4. **Source evidence vs generated interpretation:** HTML/PDF is raw evidence; Markdown is a versioned derivative; classification/mapping creates candidates, not canonical truth.
5. **Static/family website structure vs adaptive learning:** explicit YAML may be available for specific high-value sites but is not required for the proposed generic discovery path.
6. **Structural fingerprint vs semantic embedding vs content hash:** different data and uses; do not use one digest to mean all three.
7. **Source metadata vs engine execution:** durable website knowledge is not the same thing as an ephemeral crawl attempt or a job lease.

## Data and FK audits still required

For every current and proposed table, gather actual fields/types/nullability/defaults, indexes, unique checks, FKs, data volumes, write/read paths, cardinality, lifecycle, retention and migration dependencies. Review `source.captures` links to `source.documents`, website/domain/structure/assessment and filesystem file versions. Audit `website.subjects` polymorphic targets. Prefer hard cross-schema FKs for known, stable targets, with justified exceptions documented.

## Unverified inputs that must not be treated as crawled facts

Research fixtures such as `ke-expected-sites.json` and `ke-site-families.json` contain hypotheses, generated hostname patterns and unprobed candidates. Pilot examples may be profiled but remain subject to collection approval. No row counts or site coverage claims here are live statistics.

**Human decision pending:** Keep current boundaries, partially consolidate, or fully consolidate website concerns into `source`; the user explicitly has not approved a collapse.
