---
{id: GUIDE-SITE-STRUCTURE-AUTHORING,name: Site structure authoring guide for agents,type: guidance,tags: [website,data-engine,agents]}
---

# Site structure authoring guide (for agents)

You write `mzizi.site/v1` bundles (see `.docs/docs/SITE_STRUCTURE_SPEC.md` and `WEBSITE_DESIGN.md`). A bundle is a technical recipe, not a licence: validating or even activating it never permits collection. Read `.docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md` first; it is binding.

## Hard rules

1. **No secrets.** No passwords, cookies, tokens or API keys anywhere in a bundle (the validator rejects them). `policy.auth` is always `none`; authenticated, CAPTCHA-protected or login-gated sources are out of scope.
2. **No evasion.** No proxies, rotating identities, stealth, or retrying around a block. A 401, 403, 429, challenge page or block notice ends the run.
3. **Prefer machine routes.** An official API, open-data portal or bulk download beats scraping HTML. Say in NOTES.md why you chose the route.
4. **Stay inside scope.** `policy.scope` lists the exact hosts, schemes and path prefixes the recipe needs and the paths it must never touch. Every module URL must sit inside it.
5. **You draft, humans approve.** You may propose an assessment (terms found, licence, data categories, access conditions) but you never mark a source approved. Leave `policy.assessment.ref` pointing at the pending assessment.
6. **Personal data is excluded by default.** List the categories the page may contain in your notes; `policy.data.excluded_categories` and the engine quarantine surprises.
7. **Record uncertainty.** Unknown licence is `unknown`; an unread robots.txt, terms page or untested pagination goes in the gaps section of NOTES.md.

## Working method

1. Check `robots.txt` and the terms or licence page by reading them once (a person's browser-level look). Note what you found, with the date.
2. Inspect at most a few pages with single requests. Save the HTML or JSON you based selectors on as a small excerpt in `examples/<module>.html|json` (a few real items, not the whole page).
3. Write `manifest.yml` (site code from the registry, `modules`, `policy`), one `modules/<name>.yml` per concern, one `mappings/<name>.yml` per module (or dataset import), optional `tags.yml`, and `NOTES.md`.
4. Validate: `mzizi-data validate <bundle> [--family <family bundle>]`. Fix every error; read the warnings.
5. Submit: `mzizi-data structure submit <bundle> --agent <your tool name> --model <model>` (or `structure batch <folder>` for many). A bad bundle is kept as a rejected version with its report. The site must already be registered. Do not run `structure activate`; activation is an operator decision.

## Selectors

- Give alternatives in confidence order; the first that yields items wins and a fallback is recorded as a fit warning.
- Select the **item** (a row, article or card), not the leaf. Beware selectors that also match an ancestor wrapper (the IEBC pilot first matched the page-wide row; the fix selects rows by their direct children).
- `css` uses soupsieve: `:has()` accepts only simple relative selectors (`:has(> div.col)` works, `:has(> a > b)` does not). `xpath` returns text for elements, so use it for strings, not items. `jsonpath` supports `$`, `.key`, `['key']`, `[n]`, `[*]` only.
- A field `from` is `link_text`, `link_href`, `item_text`, the name of an earlier field, a JSONPath starting with `$`, or a selector object (with `attr` for attributes). Add `regex` to cut a value and `parse` to convert it.
- Tag a field `label:url` and it becomes absolute against the page it was read from.

## Transforms (fixed library)

`trim`, `collapse_whitespace`, `nfc`, `upper`, `lower`, `normalise_name`, `clean_ordinal` (22nd to 22), `date` (`{date: "%d %B %Y"}`), `decimal` (`{decimal: {thousands: ","}}`), `fiscal_year` (2023/24 only for consecutive years), `fy_start`, `regex`, `lookup` (unmapped values are errors), `slug_code` (`{slug_code: "ke/"}`), `ref` (a reference by natural key resolved at promotion). A list is a pipeline. Anything else is rejected.

## Tags

Tags are `namespace:value` and must be in the vocabulary (reference scheme `site-tag`) or proposed in `tags.yml` within a known namespace:

- `kind:` `budget`, `tender`, `gazette`, `census`, `boundary`, `statute`, `election-result`, `report`, `directory`, `dataset`, `notice`
- `time:` `published`, `valid_from`, `valid_to`, `period`, `retrieved`
- `label:` `title`, `identifier`, `amount`, `currency`, `unit`, `name`, `code`, `date`, `url`
- `geo:` `national`, `county`, `constituency`, `ward`, `region`, `district`
- `jurisdiction:` `global`
- `tier:` `1`, `2`, `3`
- `licence:` `open`, `restricted`, `unknown`
- `platform:` `wordpress`, `drupal`, `ckan`, `custom`, `static`, `arcgis`, `dspace`
- `section:` `downloads`, `publications`, `tenders`, `news`, `contacts`, `data-portal`
- `purpose:` `data-portal`, `publications`, `legislation`, `procurement`, `statistics`, `elections`, `governance`
- `period:` `fiscal_year`, `calendar_year`, `quarter`, `month`

## Mappings

A mapping names the target table (`schema.table`, see `source/backend/contracts/targets.json`), the natural `key` fields used for idempotency, per-field `from`, `const` or `transform`, and a provenance `locator`. Required target fields you cannot fill from the page (a publisher, a document kind) are given as `const` references. Never invent a value; an unreadable value stays empty and the candidate is flagged.

## NOTES.md template

Observed (what, when, how many requests) / robots and terms / licence / personal-data categories / selectors and why / pagination / gaps and limits / what you wished the format had. The engine ignores it; reviewers and the next agent depend on it.

## Fail closed

If the site is down, redirects somewhere unexpected, asks for a login, shows a challenge, or the markup has no stable anchor, stop and write that in NOTES.md instead of guessing a selector.
