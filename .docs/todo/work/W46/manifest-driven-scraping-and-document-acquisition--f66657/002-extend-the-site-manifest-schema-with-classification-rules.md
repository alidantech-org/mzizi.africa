---
{id: TSK-382DD9E38552,name: Extend the site manifest schema with classification rules,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:17.507Z,updated_at: 2026-11-13T10:12:17.507Z,order: 2048}
---

# Extend the site manifest schema with classification rules

## Goal

Extend `mzizi.site/v1` (schemas under `source/schema/site/v1`) so a site bundle can declare how to classify URL paths, links, pages and files, including optional semantic queries, so new sites need no code changes.

## Context

`SITE_STRUCTURE_SPEC.md` already defines `sections.yml` with exact and regex path rules, named slots, provenance and tags. `CRAWL_AND_PURPOSE_DETECTION.md` proposes `link_text`, `href_pattern`, `file_type`, `file_name`, `content_signal` and `semantic` rule kinds. The `manifest` package validates bundles and, after the section-registry task, delegates sections to the package that owns them. Purpose and section vocabularies live in reference classification data, not code. Rules found by crawling are proposals with provenance until reviewed.

## Acceptance checklist

- [ ] JSON schemas for the new rule kinds are added to `source/schema/site/v1` with provenance, confidence and thresholds, closed to unknown keys and executable code.
- [ ] `manifest` validates them through the section registry and the `patterns` package, rejecting unknown labels and slots.
- [ ] Dry-run validation against saved examples covers path, link and file rules, and the spec and authoring guide are updated.
- [ ] Sample bundles under `seed/fixtures/site-structures` include the new rule kinds on fictional hosts.
