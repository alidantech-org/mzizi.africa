---
id: DOC-6DB908A17FE4
name: Source and website schema simplification plan
type: documentation
tags: [improvements, schema-redesign, source, website, provenance, planning]
extra: {status: planning_only, merge: undecided}
---

# Source — evidence, publishers, website registry and provenance (with website simplification)

> **2026-11-07 clarification:** The user has **NOT** approved merging `website` into `source`. The concept of `source.websites`, domains, pages, paths, links, visits and TLD/zones is an alternative to assess **table by table**, not an accepted target schema. Also evaluate a separate shared `pattern` schema. See [source redesign and adaptive website intelligence](../source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**

**PLANNING ONLY.** The user wants `source` and `website` meaningfully linked or potentially consolidated, **not aggressively** or by losing functionality. Existing website tables are too complicated to understand in places; `filesystem`, `source`, `website` and `staging` have overlapping concerns. The user wants clear custody and extraction contracts, reusable site structures and readable Markdown derivatives with fine-grained content change hashing.

## Four concepts that must never be confused

1. **Publisher or publishing organization** — authority/organization that produces or is responsible for an information source.
2. **Website identity and source location** — official site, domain, sections, source URLs, website family patterns, routes and discovery policies.
3. **Published document or capture** — a specific publication/record and retrieval instance, including URL, time and content version.
4. **Stored file, extracted content and candidate claim** — respectively `filesystem` artifact bytes/logical identity, Markdown/structured extraction output, and `engine` staging/review candidate. These are not one table.

Source attributions connect **which statement or version was supported by which artifact, locator, publication and method**. They must survive extraction improvements and later contradictions.

## Current `source` tables (7)

| Table | Current purpose and redesign question |
|---|---|
| `publishers` | Identifiable publishing authority; FK to `organization.entities`/`governance.institutions` where verified, independent of the website. |
| `documents` | Logical publication/document identity and external IDs; must not be synonymous with S3 object or URL. |
| `captures` | Individual retrieval, source URL, file version/content hash, tool, site, domain, structure version, retrieval metadata. |
| `methods` | Evidence/extraction/research methods; compare against pipeline-run/tool version registry to avoid duplicated semantics. |
| `attributions` | Record/field/value-level evidence links; existing flexible targets need real FK design discussion. |
| `verifications` | Verification/review outcome for claims/artifacts; distinguish review decision from proof itself. |
| `document_classifications` | Auto/curated document type/scope/semantics and confidence, with version and provenance. |

**Review all current columns.** Check `source.captures.document_id` as a concrete intra-schema FK, plus `file_version_id`, `site_id`, `structure_version_id`, `domain_id` and `assessment_id` which may currently be plain UUIDs. Their real target tables live in `filesystem` or `website` and must receive typed, hard cross-schema constraints where meanings are correct. A site isn't necessarily its publisher and a document can be discovered at multiple URLs.

## Existing `website` tables (20) — deliberate simplification map

| Current table | What to preserve / simplify / possibly move |
|---|---|
| `sites` | Stable website identity and official status independent of hostname. |
| `domains` | Dated mappings of domain/hostname to website. |
| `site_publishers` | Site↔publisher roles over time; avoid duplicating publisher identity. |
| `structures` | Named site extraction/structure definition identity. |
| `structure_versions` | Versioned authored structure profile and effective inheritance/rules hash. |
| `structure_files` | Versioned files/bundles that make a structure; FK to `filesystem.versions`. |
| `checks` | Site verification/crawl checks; could be operational source monitoring rather than domain content. |
| `families` | Reusable website families, e.g. county government sites. |
| `domain_patterns` | Rules predicting/recognizing sites; needs pattern registry lineage and date/scope. |
| `members` | Site/family relationship; inspect actual meaning and uniqueness. |
| `subjects` | Site→geography/institution/organization subject associations; currently flexible target issue. |
| `traits` | Site/family labels/characteristics; check if tags overlap classifications. |
| `relations` | Site↔site or family cross-relations; ensure constrained typed meaning. |
| `fingerprints` | Structural similarity features/digests; **not semantic page content hash**. |
| `assessments` | Legality/source collection assessment and permission gate; do not drop. |
| `dossiers` | Sourced investigation/review of site structure or approval; distinguish from generated site report. |
| `domain_zones` | DNS zone/TLD data; assess if needed for actual website research, avoid unnecessary unrelated technical modeling. |
| `dns_snapshots` | DNS changes; source monitoring and identity evidence, not a publication. |
| `document_sightings` | Links between captured documents and where they were discovered; keep reappearance at multiple URLs. |
| `section_visits` | A crawler's page/section visit record and source coverage, more operational than canonical site identity. |

**No automatic website merge:** A few website tables may properly stay as a distinct `website` domain if user wants that, or be relocated to a clearer `source`/`engine` arrangement. Decide per table and column. A site family structure is not merely a capture's "source". Preserve legal collection gate, structure inheritance and page provenance.

## Website → Markdown and change-aware ingestion design

Use `.docs/docs/SITE_STRUCTURE_SPEC.md` and Python `structure/{bundle,effective,sections,selectors,extract,validate}.py` as existing foundations. The new requirement is a faithful **HTML/CSS/JS-rendered site content → readable Markdown** extraction, not line-by-line CSS/JS conversion. Store raw capture as evidence, normalise meaningful DOM sections, identify stable content sections and hash the semantic tree; create Markdown with titles, headings, dates, lists, links, tables, references and attachments, plus an extraction manifest.

Maintain distinct fingerprints:
- Raw content-object SHA-256.
- Structural website-family fingerprint for similarity and template selection.
- Semantic page/section/subtree hash for change detection, including newly added/removed/moved sections.
- Extractor/profile/version/config hash for reproducible Markdown output.
- Candidate payload/natural-key hash for domain updates.
- Site inventory/page manifest hash for overall source coverage.

The current `fingerprint.py` generates structural similarity, and `crawl.py` tracks section visits and can skip previously sighted URLs. **A URL seen once is not proof the page never changes**; change-aware revalidation, conditional requests and versioned DOM comparisons are proposed extensions. Avoid losing important dynamic deadline changes when ignoring volatile page elements.

## Data classes, patterns and relationships

1A: verified official publishers/site IDs, curated site structures and known source registries. 1B: website family patterns, common extraction modules and expected domain/site sections. 2A: fetched pages, documents, HTML→Markdown, extracted tables, source metadata and link sightings. 2B: semantic similarity, site coverage and derived entity relationship proposals. Link per-record acquisition metadata, source validity, structure version and object hash, never conflate source URL with stable identity.

Fks: publisher→canonical `organization`/`governance` when verified; document→publisher; capture→document, website/domain/structure/source assessment and file version; site subject→typed entity/geo links; structure file→filesystem file version; generic attributions→explicit typed association FKs or a rigorously constrained registry. Avoid a generic reference masquerading as FK by storing text `target_kind` plus UUID only.

## What stays operational rather than canonical

A source document may be long-lived canonical evidence identity. A transient crawl attempt or section visit should be associated with `engine.runs/jobs`, not mistaken for a verified website. Web properties can have observed domain/DNS changes independent of content changes. Keep evidence and site owner relationships temporally stable. `filesystem` owns bytes/tags/folders, `engine` owns execution state, `audit` owns review actions; responsibility changes do not necessarily imply immediate schema moves.

## Evaluation queries and safety

Locate official sites publishing for Kenya or a county institution; show all document captures and independent sightings for an official notice; identify which Markdown subsection supported a candidate law or appointment; detect a changed tender deadline but skip unchanged site navigation; show website family structure overlays and approved source assessment; prevent source fetching when the collection gate disallows it. Every mapped fact must retain its page URL/time, section locator and extraction version.

## Migration and unresolved decisions

Audit all 27 combined source+website entity tables, actual columns, cardinalities, privileges, unique keys, existing source download objects and current source attributions. Map old→new targets and enforce actual cross-schema FKs where meaning is stable. Never delete raw evidence or collapse distinct publisher identities to reduce table count. Existing Dryv website and source contracts, crawlers, importers and legal gates must remain coherent during later migration.

**OPEN:** whether one merged `source` schema is the best result; how many site-family/trait/relation tables to retain; where DNS, site checks and section visits belong; artifact/document/capture identity; stable semantic DOM hashing schema; site Markdown bundle format and derived file metadata; generic attribution hard-FK strategy; original source publication license/public-access review. See [site Markdown plan](../site-structure-and-markdown-extraction.md), [file management](../file-management-and-s3.md), and [master record](../mzizi-data-schema-storage-and-pipelines-redesign.md).

**Status: not approved for schema compression or implementation.**

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._
