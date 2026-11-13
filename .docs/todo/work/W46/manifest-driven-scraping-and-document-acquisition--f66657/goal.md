---
{id: GOAL-GRP-524E81F66657,name: Manifest-driven scraping and document acquisition goal,type: documentation,extra: {created_at: 2026-11-13T10:11:46.753Z,group: GRP-524E81F66657}}
---

# Goal

Crawl African government and public-sector sites properly and turn what they publish into reviewable evidence: decide with recorded evidence what each URL path, link, page, HTML region and downloaded file is for, download files such as PDFs, assign them a probable purpose, pick the right extraction profile, extract into the staging store and map to candidates for review. Every piece of site-specific or classification knowledge is a manifest; code only provides mechanisms. Agents help later by proposing manifest changes.

## Success measures

- A site manifest bundle (`mzizi.site/v1`) can describe path, link, page and file classification rules, including semantic queries, and validates against schemas with no code changes for a new site.
- A crawl runs as an engine job inside an approved scope, honours the collection gate, robots, rate limits and stop rules, and records the evidence for every classification (layer, rule id, score, manifest hash).
- No module outside the pattern packages compiles a regex or hand-rolls string matching, and no site, language or category knowledge is hard-coded (see `.docs/rules/typed-code.md`).
- Downloaded files keep their raw bytes, get a purpose with confidence, and flow through the right extraction profile into staged documents and candidates.
- Dry runs against saved examples and drift checks catch a broken manifest before it is activated.

Design: `.docs/design/acquisition/CRAWL_AND_PURPOSE_DETECTION.md`, `.docs/design/architecture/PATTERN_MATCHING.md`, `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`.
