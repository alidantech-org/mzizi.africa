---
id: DOC-3D7A1F5E2B05
name: Scraping, real browser and site manifests proving ladder
type: documentation
tags: [scraping, browser, manifest, plan]
extra: {status: planning_only, implementation_approved: false}
---

# 04 — Scraping proof ladder, real browser, manifests

The scraper was designed around site-structure and API-structure YAML (`source/schema/site/v1`, [site structure spec](../../design/acquisition/SITE_STRUCTURE_SPEC.md)). The source redesign also says unknown sites without YAML are first-class ([README principle 6](../source-redesign/README.md), [03 discovery](../source-redesign/03-discovery-links-and-site-memory.md)). The ladder below proves both, one rung at a time; each rung is one CLI command a person watches.

## Ladder

| # | Question | Command | You should see |
|---|---|---|---|
| 1 | Does the environment work? | `mzizi dev doctor` | Chrome, Tesseract, docker found/missing |
| 2 | Can a browser open? | `mzizi browser open --url https://example.org --headed` | A real Chrome window; printed title/status/final URL |
| 3 | Can a URL be fetched politely? | `mzizi fetch url …` | Identified UA, robots verdict, saved bytes and headers |
| 4 | Can content be scraped from saved HTML? | `mzizi scrape file --input page.html --manifest county.yaml` | Records with fields, transform results, per-field fallback trace |
| 5 | Same from a URL? | `mzizi scrape url --url … --manifest county.yaml` | Same records, plus fetch metadata |
| 6 | Does a manifest-free site yield structure? | `mzizi scrape links` then `scrape markdown` | Link inventory (internal/external, normalised, deduped); readable Markdown |
| 7 | Does navigation work? | `mzizi browser navigate … --click … --steps N` or `scrape crawl --max-pages 10` | Ordered page list with budgets honoured |
| 8 | What needs JavaScript? | `mzizi browser compare --url …` | Diff of raw vs rendered text/links; verdict "needs browser" or not |
| 9 | Is a challenge present, and is resolution approved? | `mzizi scrape challenge --input page.html` | Challenge signals, source-policy decision, approved resolution path or stop reason |
| 10 | Do real results land as files? | Run folder inspection; `mzizi fs put --path outputs/<run> --dry-run` | Planned object keys, hashes, dedup hits |
| 11 | Do they land in Mongo? | `mzizi mongo load --run <run>` | Counts and a `mongo find` sample ([05](05-mongodb-and-vector-dev-services.md)) |
| 12 | Can vectors classify content? | `mzizi vector index` then `vector classify` | Nearest labelled examples and scores ([05](05-mongodb-and-vector-dev-services.md)) |

## Browser mode

- **Adapter:** Playwright driving the installed system Chrome (`channel="chrome"`; `/usr/bin/google-chrome` is present) is the initial browser adapter, not a mandatory or exclusive choice. Allow other browser adapters and anti-bot-resilient profiles behind the same engine interface. Preserve whether a capture is HTTP or rendered, plus browser version, viewport, adapter, session mode and capture conditions. Prefer conditional browser fallback when HTTP suffices (see [10 build vs reuse](../source-redesign/10-prior-art-and-build-vs-reuse.md) and [11](../source-redesign/11-tool-integration-and-contracts.md)).
- **Packaging:** an optional dependency group (`browser`) of the engine, not of any package. Packages stay HTTP/HTML-string based; the engine passes rendered HTML into `mzizi-scraping`.
- **Isolation:** throwaway profile under `.local/dev/browser-profile/`; never the user's Chrome profile; no stored logins; downloads disabled unless `--allow-downloads`.
- **Source-specific access policy:** the same source approval, scope and bounded request budgets apply to every adapter. `robots.txt` defaults to `respect`, but the engine should support a documented source-approved `override`. CAPTCHA/access challenges are detected and recorded; where authorised, the browser layer may hand off to manual or approved provider/adaptor resolution, otherwise it stops. Browser profile/identity configuration may be supported for approved collection workflows. See [collection policy](../../design/policy/LEGALITY_SAFETY_AND_COMPLIANCE.md); these capabilities are design targets until implemented.
- **Evidence capture:** `snapshot` records rendered HTML, a screenshot, final URL, redirect chain and console/network summary, so later replay is possible.

## Manifests

- `scrape url|file --manifest <yaml>` loads a site structure through `mzizi-manifest` validation first; invalid manifests fail with path-level errors before any request.
- Manifests under `.local/dev/manifests/` may be incomplete experiments; `manifest validate-structure` is the editing loop.
- Per-field trace is on by default in dev: for each field, selector chain attempts, which matched, raw value, transform steps, final value. This is how a selector or transform bug is localised.
- API structures (`api.structure.yaml`) follow the same flow with `fetch url` (JSON) and `scraping.extract` over JSONPath, proving the other half of the original design.
- The gap list for unknown sites (template learning, section hashing, change detection) is design work in [source redesign 03–06](../source-redesign/README.md); this plan only supplies the commands to observe those capabilities once built.
