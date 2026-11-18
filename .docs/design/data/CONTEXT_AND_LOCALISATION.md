---
id: DOC-CONTEXT-AND-LOCALISATION-20261118
name: CONTEXT_AND_LOCALISATION
type: documentation
tags: [context, country, language, region, currency, cloudflare, localisation, multi-country, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-18, code_changes: none}
---

# Context and localisation: country, language, region and concepts from data

**Status: proposal.** Mzizi is multi-country now (owner decision, 2026-11-18). Every hard-coded country word, currency, level name or indicator code in an app or in a read is evidence that the backend is not generic enough ([hard-coding audit](../../handoffs/HANDOFF-HARDCODING-AND-CONTEXT-AUDIT-20261118.md)). This document defines the context object, how it is resolved, and the data that replaces the constants. The earlier proposal [neutral-platform-and-reference-driven-localisation](../../_plan/guides/neutral-platform-and-reference-driven-localisation.md) is the starting point; this is its application to the insights API and the apps.

## 1. The context object

One typed document, authored once in the contract and returned by one operation (`GetContext`); every read that depends on it declares so, and the SDK sends it as an option.

| Field | Meaning |
| --- | --- |
| `countryCode`, `countryRef` | ISO 3166-1 alpha-2 and the `Country` reference row |
| `placeFeatureId` / `placeCode` | the unit the visitor is "in" or has chosen, optional |
| `language` | interface and content language, with the fallback chain actually used |
| `locale` | number, date and unit conventions |
| `currencyRef` | currency for money display (stored amounts stay in minor units plus their own currency) |
| `levels` | the administrative ladder for the country: code, singular and plural labels, depth, what sits below |
| `vocabulary` | named concepts for the country (offices, elections, funds, institutions) with labels per language |
| `headlineIndicators` | the indicators and metrics the overview leads with, per level |
| `features` | which sections exist for this country (a country without tenders data hides tenders) |
| `source` | how it was decided: `selection`, `preference`, `device_position`, `cdn_header`, `default` |
| `gaps` | structured gaps, never sentences |

## 2. Resolution order

1. Explicit selection in this request (path segment or query).
2. Saved preference (account, or the device actor's stored preference).
3. Device position matched to a place (the mobile app, or the browser if the visitor allows it).
4. `CF-IPCountry` from Cloudflare, for the country only.
5. Configured default country (an authored setting, never a literal in code).

A selection always beats detection. The response states which step decided so the UI can offer "Not here? Change." Language follows the same idea: selection, preference, browser or device language, country default, platform default.

## 3. Cloudflare country header

- The API reads `CF-IPCountry` (ISO alpha-2). `XX` (unknown) and `T1` (Tor) mean no country and become a gap. The country maps to a `Country` row by code; unknown rows give a gap.
- Region, city and timezone headers exist only when Cloudflare's "visitor location headers" transform is enabled for the zone. Treat finer granularity as unconfirmed until enabled.
- **Trust:** the origin accepts the header only from Cloudflare (restrict origin traffic to Cloudflare, or authenticated origin pulls, or a tunnel). Otherwise any client can forge it. Trust is authored configuration, tested, and not repeated in reads.
- **Dev and test override:** an authored override stands in for the header; it cannot be enabled in production.
- **Caching:** any page or read that varies by country or language must vary on the context (cache key includes country and language); no cached page may cross countries.
- **Logging:** only the derived country code is logged, never the address.

## 4. What becomes data (and replaces constants)

| Constant today | Becomes |
| --- | --- |
| "Kenya", "KSh", "47 counties" in pages, phrases and format helpers | country name and adjective, currency, level counts from the context |
| `NEXT = { country: "counties", ... }` | `levels` of the country, dated administrative structure |
| `"county"` and `"constituency"` default levels, regex on office titles | default level per country and indicator; office kinds from reference values |
| Metric catalogue in `leaderboards.ts` (17 metrics, units, English descriptions, SQL) | indicator and metric definitions as rows with per-language labels, unit, direction, applicable levels, source and display hints, read by one generic engine |
| `votes2022`, `amountKes`, election kind to level mapping | election and money documents keyed by election and currency, level from election data |
| Gap messages in English built in code | structured gaps (code and parameters) with copy resolved per language |
| Interface strings (en and sw tables in code) | copy rows per language keyed by contract keys (owner decision: database) |
| Navigation arrays, icons, label maps, colours per kind | navigation and display hints authored in the contract and on reference values |
| Language and theme in `localStorage`, saved places on the device | preferences read on the server, device actor or account |

## 5. Concepts across countries

Countries differ in names, levels and offices. Comparison needs a **concept map**: a reference mapping that says the same abstract level or office in two countries (for example an elected sub-national executive), with per-country labels. Comparison operations compare concepts, never label strings. Money compares only in the same currency or through a recorded rate (source and date).

## 6. Data additions to design (additive migrations only)

Country-scoped indicator and metric definitions and display hints; the administrative level ladder per country (dated, using existing geography structure); concept vocabulary and concept map; copy keys and values per language and country; preference storage for device actors and accounts; the authored default country and the Cloudflare trust setting; country scope on reads that currently ignore the existing `Country` columns. Exact schemas are authored in `dryv/contracts/schemas`; none is hand-written SQL.

## 7. Open questions

1. Which countries load first, and in what order of data readiness?
2. Is a language ever tied to a country by default (Swahili for Kenya and Tanzania), or purely a user choice?
3. Does the visitor's current country restrict anything (for example posting) or only set defaults?
4. Is Cloudflare in front of the mobile app's API traffic as well as the web?
5. Is the "visitor location headers" transform acceptable to enable (it adds data, with privacy implications)?
6. Who maintains per-country concept vocabulary and translations, and how are they reviewed?
7. Do cached pages need purge on data change per country, and is edge caching wanted at all for personalised pages?
