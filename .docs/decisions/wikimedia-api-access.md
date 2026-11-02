---
{id: DEC-WIKIMEDIA-API-ACCESS,name: "Decision - Wikimedia APIs are used as APIs, not crawled, and files are stored only with a recorded free licence",type: decision,tags: [data-engine,wikimedia,gate,licence]}
---

# Decision: how the engine uses Wikidata and Wikimedia Commons

Date: 3 November 2026. Implements TSK-7EC27F97DC64 and TSK-A6C9B9251A15; builds on DEC-AUTO-APPROVAL and DEC-CLAIMS-AND-CONFLICTS.

## Decision

- **Official APIs only.** Wikidata `wbsearchentities` and `wbgetentities` find items and read their statements (flag image P41, coat of arms image P94, logo image P154, image P18, instance of P31, country P17, citizenship P27, ISO code P297). Commons `action=query&prop=imageinfo&iiprop=extmetadata` reads each file's licence short name, licence URL, author, credit and whether attribution is required. File bytes come from `upload.wikimedia.org` at the URL Commons returns. No page is scraped.
- **Site and gate.** The three hosts are one registered site (`wikimedia`). They are listed in `fixtures/policy/trusted-domains.json` as exact hosts (a foundation-run open-data service, not a `.go.ke` body) and approved by the agent account through `auto-assess`, at no more than 0.5 requests per second, with the project user agent from `.data/env.local`. Every request passes the collection gate; a 401, 403, 429, a challenge or a `maxlag` error stops the run.
- **robots.txt.** Wikimedia's robots.txt (`Disallow: /w/`) is written for web crawlers and also covers `/w/api.php`, the only endpoint the documented APIs use. The fetcher therefore skips the robots check for the path prefix `/w/api.php` on this site only (`robots_exempt_paths`); everything else still respects robots.txt. This is not an evasion: requests are identified, serial, rate limited and stop on any restriction, which is what Wikimedia's API etiquette asks of API clients.
- **Match by context, never by name.** A Wikidata item is accepted for a county only with country Kenya and an instance-of label containing county; for a constituency with a constituency instance and a Kenyan country or a parent county in its located-in statements; for the country with ISO 3166-1 alpha-2 `KE`; for a party with a party instance and country Kenya; for an institution with country Kenya; for a person with instance of human, Kenyan citizenship (or a Kenyan position) and agreeing name tokens (at least two). Several equally good candidates mean `ambiguous`; none means `not_found`. Unmatched stays unlinked.
- **Markers.** `has` is proposed only when Wikidata lists an image statement. Absence of a statement never produces `none`; `none` is a reviewer's or a level-expectation decision.
- **Licence.** A file is stored only when Commons records a free licence or public-domain status (CC0, CC BY, CC BY-SA, public domain, PD-*, GFDL, OGL). Non-commercial, no-derivatives, fair-use, missing or unrecognised terms are skipped and reported in `.data/reports/wikimedia-media.json`. The raw file is a preserved artifact; its source document records the Commons page URL, licence name, author, credit and the attribution text; a `filesystem.attachments` row links it to the entity with the role flag, emblem, logo or portrait. Attribution is displayed with the media.
- **Evidence.** The raw Wikidata entity JSON is preserved, with a source document (CC0) and an attribution on the proposed claim. Wikidata is a crowd-sourced publisher with reliability 0.6, so an official register (ORPP, IEBC) outranks it in a claim standing.

## Consequences

- Files for people appear only where Commons has a free portrait; Parliament's portraits stay documents with an unassessed licence and are not republished.
- Photographs of private individuals are never sought: persons are public-office holders already in the database.
