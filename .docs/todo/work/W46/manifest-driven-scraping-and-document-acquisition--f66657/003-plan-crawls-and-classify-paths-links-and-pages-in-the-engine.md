---
{id: TSK-11FDFAAE8B34,name: "Plan crawls and classify paths, links and pages in the engine",type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:17.778Z,updated_at: 2026-11-13T10:12:17.778Z,order: 3072}
---

# Plan crawls and classify paths, links and pages in the engine

## Goal

Add engine job kinds that plan a crawl from a site manifest and registry data, fetch within the approved scope, and classify each path, link and page using manifest rules, recording evidence for every decision.

## Context

Depends on the engine job model (plan, steps, ports), `fetch`, `scraping`, `patterns` and the classification schemas. The plan step may read the registry and object store (for example list the county sites and expected sections). Classification evidence records layer, rule id and version, matched span, score and manifest hash. Discovered links outside `policy.scope` are recorded as sightings and never followed. Section visits and document sightings follow the site spec. Crawls are bounded in depth, pages and bytes by the manifest.

## Acceptance checklist

- [ ] A `crawl.plan` job reads the manifest and registry data and produces a persisted, hashed plan with scope, limits and seed URLs.
- [ ] Path, link and page classification steps use only `patterns` and scraping mechanisms with manifest rules, and store evidence with each result.
- [ ] The collection gate, robots, rate limits, stop-on rules and depth and byte caps are enforced and tested with a mocked transport.
- [ ] A dry-run mode classifies saved examples without network access, and drift checks compare results with each module's `expect`.
