---
id: DOC-CRAWL-PURPOSE-DETECTION-20261113
name: CRAWL_AND_PURPOSE_DETECTION
type: documentation
tags: [scraping,crawling,patterns,documents,proposal]
---

# Manifest-driven crawling and purpose detection

**Status: staged design.** The [runtime guide](WEB_ACQUISITION_RUNTIME.md) identifies working acquisition commands and the scope of workspace replay. Use the [current source and engine schemas](../../../source/schema/README.md), [site authoring guide](site-structure-authoring.md) and [developer portal design](../architecture/DEVELOPER_PORTAL.md). Source and classification knowledge belongs in validated inputs. The [typed code rules](../../rules/typed-code.md) govern matching and package boundaries.

## Goal

Crawl government and public-sector sites properly (with bounded requests and an approved source-specific access scope) and decide, with evidence, what each **URL path, link, page, HTML region and downloaded file is for**. Then download files such as PDFs, assign them a probable purpose, choose the right extraction profile, extract data into the staging store, and map it to candidates for review. Everything site-specific is a manifest. Agents help later by proposing manifest changes; running a manifest never needs a model.

## Markdown-first acquisition roadmap

Discovery captures the HTML needed for a listing and inventories the references it contains. Store the URL, fragment or interactive state, observed link label, and the page or panel that supplied each document or media reference. Classification can then compare content and reference context and submit selected files to the existing downloader. Browser rendering may fetch assets needed by the page. Content selection controls what is subsequently downloaded and archived.

1. **Extraction checks and offline replay.** The crawler replay function compares saved HTML and PDFs against reviewed expectations. The CLI and engine HTTP jobs invoke `scraping.replay` on saved suites inside the configured input workspace. Durable run-artifact references are planned.
2. **Rendered media inventory.** The opt-in browser capture is available in one-page Markdown, scoped crawls and listing sections. It records computed backgrounds, picture candidates, browser-selected URLs and declared lazy sources. Crawls and single-page runs can scroll a bounded sample of lazy targets. Images observed only in network activity are outside this DOM-based pass.
3. **Tables and weak DOMs.** The HTML extractor lays out spans and header groups before rendering. Its table JSON preserves original cells, positions and links. Manifest-based `scrape url --render auto` compares static and browser captures when the static version falls short of the module's item or field expectations.
4. **Verifiable traversal.** Crawls emit `listings.json` with source hashes, continuation actions, new row and item counts, and stop reasons. `web sections` records tab and disclosure states, and its section coverage report distinguishes a disabled Next control from a repeated result, timeout or cap. The general crawler retains ordinary URL continuations and marks whether the destination was captured.
5. **Attachment selection.** `download select` ranks crawl references with manifest rules before transfer, reserves a byte and file budget, and downloads the selected set with `--apply`. The report accepts reviewed useful URLs for cost accounting.

The [acquisition runtime](WEB_ACQUISITION_RUNTIME.md#offline-coverage-replay) describes the saved evidence and limits. The Nairobi roster, Papers Laid and IEBC DataTables captures exercise different extraction and navigation cases. Site-specific selectors and expected counts stay in replay inputs and site modules.


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
