---
{id: DOC-SITE-STRUCTURE-SPEC,name: SITE_STRUCTURE_SPEC,type: documentation,tags: [website,data-engine,format]}
---

# Site structure specification (mzizi.site/v1, draft)

A site structure tells the data engine how to discover, fetch, extract, label and map the information a site publishes, without an LLM at run time. It is authored mostly by agents in batches, stored as files, versioned per site (see `WEBSITE_DESIGN.md`), and validated against a JSON Schema owned by Mzizi. It borrows ideas from browser site descriptions but is a different format designed for data extraction.

## Bundle layout

```text
<site code>/<version>/
  manifest.yml        identity, schema version, module list, defaults, policy
  modules/
    <name>.yml        one concern each: a listing, a document family, an API, a table family
  mappings/
    <name>.yml        field to Mzizi target mappings and semantics for one module
  sections.yml        content sections: semantic label, path rules, file types, pagination (optional)
  tags.yml            vocabulary extensions used by this bundle (optional)
  NOTES.md            human-readable findings, gaps, limitations, considerations
  notes/<topic>.md    longer explanations per module (optional)
  examples/           small saved response samples used for dry-run validation
```

Granularity is the point: a large site is many small module files, so agents can add or repair one module without rewriting the rest, and unchanged modules deduplicate across versions.

## Manifest

```yaml
schema: mzizi.site/v1
site: ke-example-portal          # the site code, not a domain
base:
  domain_role: primary           # resolved from website.domains at run time
  paths: [/]
policy:
  robots: respect
  rate: { requests_per_second: 0.5, max_concurrency: 2 }
  licence: { ref: cc-by-4.0, source: https://example.invalid/terms }
  auth: none                     # anything other than none means the engine refuses
fetch: { mode: http }            # http | api | browser
modules: [budgets, tenders]
tags: [jurisdiction:KE, domain:finance]
```

`auth` other than `none`, CAPTCHAs and access challenges are not supported; the engine stops and records a check. A manifest never contains secrets, passwords, cookies or tokens.

### Policy block (machine-enforced)

The manifest `policy` is enforced by the engine and mirrors `LEGALITY_SAFETY_AND_COMPLIANCE.md` section 9.2. The effective limit is the most conservative of this block, the site's approved scope and the engine's global ceilings.

```yaml
policy:
  assessment: { ref: assess-ke-treasury-2026-11 }      # the legal/source assessment this recipe relies on; resolved at run time
  scope:
    hosts: [treasury.go.ke]                            # exact hosts and schemes the engine may contact
    schemes: [https]
    paths: { allow: [/publications/], deny: [/admin/, /login] }
  rate: { requests_per_second: 0.5, max_concurrency: 2 }
  retries: { max: 3, backoff: exponential_jitter }
  limits: { max_response_bytes: 52428800, timeout_seconds: 30 }
  identify: { user_agent: "MziziBot/1.0 (+https://mzizi.africa/bot; contact@mzizi.africa)" }
  robots: respect                                      # a default operational rule, not a legal safe harbour
  stop_on: [401, 403, 429, repeated_5xx, access_challenge, block_notice]
  data: { excluded_categories: [national_id, biometric, health, children, precise_address, criminal, political_opinion], on_unexpected: quarantine }
  purposes: [research, public_atlas]                   # collection and publication purposes covered by the assessment
```

A structure is a technical recipe, not a licence or authorisation: it validates against the schema and a dry run even when its source is legally unapproved, and the engine refuses to run it unless the assessment is `approved` (or `approved_with_conditions` with every condition enforceable) and the request falls inside `scope`. Structure publication never activates collection. Retry loops never try to overcome a restriction; a stop condition ends the run and records a check.

## Inheritance and overlays

A family bundle has the same layout as a site bundle and declares `kind: family`. A site bundle may extend it:

```yaml
schema: mzizi.site/v1
site: ke-nairobi-county
extends: { family: ke-county-government, version: 3 }   # version optional: latest active
vars: { base_path: /tenders }                           # per-site parameters used by family modules as ${base_path}
overlay:
  modules:
    replace: [tenders]       # use this bundle's modules/tenders.yml instead of the family's
    add: [city-bylaws]
    remove: [assembly-links]
  tags: [geo:county]
```

Family modules reference `${subject.geography}` and similar subject variables; the engine fills them from `website.site_subjects`, so a mapping can set the geography unit of every candidate without hard-coded ids. Resolution is: family modules, minus `remove`, with `replace` and `add` applied, then `vars`. The engine stores the effective manifest hash on captures. Cycles and more than one level of inheritance are rejected in v1.

## Modules

A module has `discover` (how to find items), `fetch` (how to get each), `extract` (how to read fields) and optional `paginate`.

```yaml
module: budgets
tags: [kind:budget, tier:2]
discover:
  listing:
    url: /publications/budgets
    items: { css: "article.pub a[href$='.pdf']" }       # css | xpath | jsonpath | regex | sitemap | api
    paginate: { type: query, param: page, start: 1, stop_when: empty_items }
fetch: { resource: pdf }
extract:
  fields:
    title:      { from: link_text, tags: [label:title] }
    published:  { from: { css: ".date" }, parse: { date: "%d %B %Y" }, tags: [time:published] }
    fiscal_year:{ from: title, regex: "(\\d{4}/\\d{2})", tags: [time:period, period:fiscal_year] }
expect: { min_items: 5 }                                  # drift detection
```

Selectors are alternatives in confidence order; the engine tries each and records which matched. `expect` states what a healthy result looks like, so the engine can detect drift without guessing.

## Content sections

Most sites do not use a universal `/downloads` path, and one section can be reachable from several paths. `sections.yml` therefore models meaning first: each section has a semantic `label` (publications, downloads, media, tenders, notices, legislation, reports, press, budgets, bills, gazettes, careers, projects, events, data, contacts), one or more path `rules`, optional `file_types` and a `paginate` hint.

```yaml
sections:
  - label: tenders
    file_types: [pdf]
    paginate: { type: query, param: page, start: 1, max_pages: 50 }
    rules:
      - { kind: exact, pattern: /tenders, provenance: { method: custom-prepared, label: Custom-prepared from manual research, confidence: 0.5 } }
      - { kind: regex, pattern: '^/tenders/(?P<year>\d{4})/?$' }
```

- A rule is an `exact` path or a `regex` anchored with `^/` whose named groups are slots. Known slots: year, county, constituency, ward, number, page, month, slug, id.
- Validation (`structure/sections.py`) rejects unknown labels, a label declared twice, invalid regular expressions, unknown slots and unanchored regexes. `match_rule(sections, path)` returns the label, the matched rule and captured slot values.
- Rule origin is `provenance` on the rule (method `custom-prepared`, `discovered`, `ai-proposed` or `reviewed`, plus label, ref and confidence), not a text source column. Rules found from crawled links are only proposals (`discovered` or `ai-proposed`) until reviewed.
- Seeds for Kenyan families (county governments, assemblies, NG-CDF, ministries, commissions, regulators) are in `engine/database/fixtures/seed/ke-site-sections.json`, labelled "Custom-prepared from manual research". They are unverified hypotheses at low confidence; no site was contacted.
- Each section page expanded is recorded in `website.section_visits` (site, structure version, section label, rule index, page URL, depth, visited_at, items_found) by `crawl.py`; files are registered as `source.documents` (one per content hash) with a `website.document_sightings` row per URL (headers, size, leading section) and classified by `semantics.py` into `source.document_classifications`.

## Tags: giving data meaning

Tags are namespaced `key:value` labels attached to modules, fields, resources and mappings. They give the engine and reviewers machine-readable meaning without adding code. The base vocabulary lives in `reference.classifications` (scheme `site-tag`) so it is data, not code; a bundle's `tags.yml` may propose extensions, which the engine accepts only if they match an existing scheme prefix.

Examples: `kind:budget|tender|gazette|census|boundary`, `time:published|valid_from|valid_to|period`, `label:title|identifier|amount|currency|unit`, `geo:county|ward|national`, `jurisdiction:KE`, `tier:1|2|3` (promotion policy hint), `licence:open|restricted`.

## Mappings: semantics to Mzizi targets

```yaml
mapping: budgets
target_kind: finance.budgets
key: [fiscal_year, entity]
fields:
  fiscal_year: { from: fiscal_year, transform: fiscal_year }      # resolves to finance.years id by natural key
  amount:      { from: table.approved, transform: { decimal: {thousands: ","} } }
  currency:    { const: KES }
  valid_from:  { from: fiscal_year, transform: fy_start, precision: day }
provenance:
  locator: { page: $page, table: $table_index, cell: $cell }
  method: structure-run
```

A mapping states the target contract (`schema.table`), the natural key used for idempotency, per-field sources, transforms from a fixed library (date, decimal, fiscal year, lookup by code, normalise name), constants, and the locator template for `source.attributions`. Unknown transforms fail validation. Lookups reference reference data by natural key, never by hard-coded ids.

## Validation

1. Schema validation against the `mzizi.site/v1` JSON Schema (closed: unknown keys and executable code are rejected).
2. Static checks: modules referenced exist, tags known, mappings target real contract fields, transforms in the library, policy sane.
3. Dry run against `examples/` saved responses; results must satisfy each module's `expect`.
4. Live check (engine): a bounded, rate-limited fetch confirms the structure still fits; recorded in `website.checks`.

## NOTES.md

Required for every bundle and written by the authoring agent: what was observed (dated), what the structure does not cover, known gaps, licence and access findings, unstable parts, suggested follow-ups, and which tags or transforms it wished it had. The engine ignores it; reviewers and later agents read it.

## Out of scope for v1

Authenticated sites, CAPTCHAs, anti-bot evasion, JavaScript execution beyond declared browser mode, OCR rules (document extraction profiles belong to the extractor config referenced by `fetch.resource`), natural-language rules.

## Implementation (engine/data)

- JSON Schemas: `source/backend/engine/data/schemas/site/v1` (`manifest`, `module`, `mapping`, `tags`, `common`). All are closed; `policy.auth` is the constant `none`; `robots` is `respect`.
- Validator: `mzizi_data.structure.validate` (`mzizi-data validate <dir> [--family <dir>]`). It runs the schema, the static checks (module files and names, listed modules, overlay, mapping module and target, mapped fields exist in `source/backend/contracts/targets.json`, key fields mapped, transforms in the library, tags in the `site-tag` vocabulary or proposed in `tags.yml`, URLs inside `policy.scope.paths`), the secret lint, the NOTES.md requirement and the dry run against `examples/`.
- `targets.json` is exported from the entities by `bun src/cli.ts export-targets` in the database package.
- Selectors: `css` (BeautifulSoup), `xpath` (lxml), `jsonpath` (a minimal built-in subset: `$`, `.key`, `['key']`, `[n]`, `[*]`; recursive descent is rejected) and `regex`; a list is tried in confidence order and the matching index is recorded.
- Transform library: `trim`, `collapse_whitespace`, `nfc`, `upper`, `lower`, `normalise_name`, `date`, `decimal`, `fiscal_year`, `fy_start`, `regex`, `lookup`. An unknown transform is an error; a failed transform is reported on the field, never guessed.
- Family inheritance: one level; `effective_modules` and `substitute` resolve the overlay and `${var}` variables, and an undefined variable is an error.
- Samples: `engine/data/samples` (an HTML listing, a JSON API, a family and a site extending it), all on fictional hosts. They validate technically and remain unusable until an assessment is approved.
