---
{id: TSK-285C22DD5D24,name: "File ranking, expectation maps and Kasarani family bundle",type: task,status: in-progress,priority: medium,created_at: 2026-11-14T07:04:27.443Z,updated_at: 2026-11-14T07:04:42.897Z,order: 13312,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-14T07:04:42.897Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-285C22DD5D24/1794639882907-start,started_at: 2026-11-14T07:04:43.705Z}]}}}
---

# File ranking, expectation maps and Kasarani family bundle

## Goal

Preserve where every downloaded file was found, rank it against Mzizi target tables from manifest rules, and store the resulting expectation map and scores before any extraction.

## Context

Downloads now write `catalog.json` with link context (`found_at`). Ranking rules live in a bundle file (data, not code) and map link text, section, filename and extension to target tables listed in `source/schema/contracts/targets.json`. Scores are recorded in the engine's MongoDB activity store, with a JSON Lines ledger as fallback. Existing approved tables are used as they are; gaps found in real data are listed for later review, not added.

## Acceptance checklist

- [ ] `ranking.schema.json` and an `expect` block in the mapping schema, closed to unknown keys.
- [ ] A ranking module in `mzizi_scraping` that scores catalog entries from rules, with evidence per match.
- [ ] `web rank` capability writes `expectations.json` and records scores.
- [x] A Kasarani NG-CDF family bundle fixture validates against the schemas.
- [ ] Alternatives to the `found_at` shape are documented for later review.

## Comments

### 2026-11-14T07:15:40.240Z · PETER IRUNGU

Built ranking schema, mapping expect block, web rank, NGCDF family fixture, MongoDB activity store and download queue. Open: Mongo-backed profile/family reuse tests, found_at alternatives doc is in SITE_STRUCTURE_SPEC.

### 2026-11-14T08:05:51.794Z · PETER IRUNGU

Built .dev layout module, readable naming module, site store with layered change detection and versions, site watch command, site-scoped download queue with readable file names. Open: screenshots stall when the shared window is not painting; Qdrant bind-mount source (.local/dev/services/qdrant) was removed externally.

### 2026-11-14T08:21:50.097Z · PETER IRUNGU

Added per-site browser tabs (registry, site lease, 2-tab cap, pop-up tracking), query-aware page keys, per-site extra CA bundle. Batch crawl of NG-CDF, Nairobi and county sites in progress.
