---
id: DOC-CRAWL-PURPOSE-DETECTION-20261113
name: CRAWL_AND_PURPOSE_DETECTION
type: documentation
tags: [scraping,crawling,patterns,documents,proposal]
---

# Manifest-driven crawling and purpose detection

**Status: proposal, 13 November 2026.** It extends the existing [site structure specification](SITE_STRUCTURE_SPEC.md) (`mzizi.site/v1`: modules, `sections.yml` path rules with slots, tags, mappings, policy block) and builds on [PATTERN_MATCHING](../architecture/PATTERN_MATCHING.md) and [ENGINE_JOB_MODEL](../architecture/ENGINE_JOB_MODEL.md). Nothing here is implemented unless the site spec says so. The binding code rules are in [typed-code.md](../../rules/typed-code.md): no hard-coded site or classification knowledge, and all matching goes through the pattern packages.

## Goal

Crawl government and public-sector sites properly (with bounded requests and an approved source-specific access scope) and decide, with evidence, what each **URL path, link, page, HTML region and downloaded file is for**. Then download files such as PDFs, assign them a probable purpose, choose the right extraction profile, extract data into the staging store, and map it to candidates for review. Everything site-specific is a manifest. Agents help later by proposing manifest changes; running a manifest never needs a model.

## The flow

```text
site manifest (+ family) ──► crawl plan (engine plan step, reads registry/database/object store)
        │
        ▼
  fetch (gate, source robots mode, rate limits, challenge policy)  ──►  raw bytes kept as-is (object store, hashed)
        │
        ├─► classify PATH      (sections.yml rules: exact/regex slots, then semantic query)
        ├─► classify LINK      (href + anchor text + surrounding text + file extension + section of origin)
        ├─► classify PAGE      (title, headings, breadcrumbs, table/list/form signals, repeated item blocks)
        └─► classify FILE      (sniffed type, file name, first-page text, metadata, semantic label)
        │
        ▼
  purpose + confidence + evidence  ──►  extraction profile (pdf text/tables/OCR, csv, json, geojson, html fields)
        │
        ▼
  staged documents (temporary store) ──► mappings ──► candidates ──► review ──► versioned accepted data
```

Every classification stores **what decided it**: the layer (rule or semantic), rule id and version, matched span or neighbours, score, and the manifest hash. A low score means "unclassified", not a guess.

## Classification kinds (all data in manifests)

| Subject | Signals | Rule kinds (manifest) |
|---|---|---|
| Path | path segments, slots (year, county, number), depth, pagination | `exact`, `regex` with named slots (existing), `semantic` query against section labels |
| Link | href, anchor text, title/aria text, nearby heading, file extension, origin section | `link_text` alias sets, `href_pattern`, `file_type`, `semantic` |
| Page | `<title>`, `h1`–`h3`, breadcrumb, repeated item blocks, tables, forms, language | `content_signal` (named structural signals with thresholds), `semantic` |
| File | content type sniffing, file name tokens, size, PDF metadata and first-page text | `file_name`, `content_signal`, `semantic` |

The purpose and section vocabularies (tenders, budgets, bills, gazettes, publications and so on) are reference data (classification schemes), not code. A new label is a data change.

## Purpose of a downloaded file

1. Store the raw bytes unchanged (content hash, one document per hash, a sighting per URL).
2. Sniff the real type (never trust the extension alone) and decide whether it is allowed by size and type caps.
3. Classify its purpose with the rule matcher first, then the semantic matcher on file name, link text, and extracted first-page text.
4. Select an extraction profile for that purpose and type (digital PDF text and tables, scanned PDF through OCR, CSV, JSON, GeoJSON).
5. Extract into staged documents with diagnostics, never silently repairing. Anything with unexpected personal data is quarantined by policy.

## Safety and scope

The collection gate, source approval, bounded rate/concurrency limits and scope checks remain mandatory. `robots.txt` handling defaults to `respect`, with an `override` only when approved in the source assessment with its rationale recorded. Access challenges (401, 403, 429, CAPTCHA, block notices) cause a stop or review by default; an explicitly approved, source-scoped browser/challenge-handling workflow may resume within its documented limits. Authentication and challenge-solving permissions are separate capabilities to design and validate, not permissions inferred from a public URL. Classification never widens scope: a link outside `policy.scope` is recorded and not followed. Download size, count and depth are capped per job; the engine enforces memory bounds. See [collection policy](../policy/LEGALITY_SAFETY_AND_COMPLIANCE.md).

## Where agents help (later)

Agents propose, in a reviewable way: new section rules and link aliases from crawl samples, tag extensions, mapping fixes after drift, and purposes for low-confidence files. Proposals are manifest patches validated against the schema and dry-run against saved examples before any activation (see `backend/agent`).

## Work

Tracked in the task group "Manifest-driven scraping and document acquisition": the `patterns` package, classification rule schemas, crawl planning and link/page classification, file download and purpose assignment, the semantic `meaning` index, and agent-assisted rule proposals.
