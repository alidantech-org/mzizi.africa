---
id: DOC-GOVERNANCE-CONTENT-20261118
name: GOVERNANCE_AND_CONTENT
type: documentation
tags: [governance,institutions,content,legal,compare,api,dev-data]
---

# Governance, institutions, explanatory content, legal basis and comparison

**Status: implemented 18 November 2026** in the Dryv contracts (`governance.ts`, `filesystem.ts`, `reference.ts`, `apps/api/insights.ts`, `apps/api/locality.ts`), the NestJS reads in `source/backend/api/src/modules/insights/features/insights/reads/` (`institutions.ts`, `govtree.ts`, `content.ts`, `legal.ts`, `compare.ts`) and the dev seed (`scripts/dev/dev_seed/gov_*.py`, `governance.py`, `content.py`, `data/gov.json`, `pages/*.md`). Names of bodies and article numbers are public facts; the people who hold offices are invented and tagged `dev`; the texts are flagged development text.

## Nothing is hard-coded in the apps

Every grouping an app shows is a reference scheme or a row:

| Scheme | What it classifies | Order |
| --- | --- | --- |
| `gov.arm` | executive, legislature, judiciary, independent commissions and offices, county governments, funds and state corporations | `reference.values.position` |
| `gov.establishment.basis` | the Constitution, an Act of Parliament, an executive order, a county law, other | position |
| `gov.office.kind` | the tier of an office (president, deputy president, governor, deputy governor, senator, woman representative, cabinet secretary, principal secretary, judge, commissioner, ...); `parent` gives the tree (deputy under president, principal secretary under cabinet secretary) | position and parent |
| `gov.appointment.kind` | how the seat is held: elected, running mate, nominated, appointed, ex officio, elected by members | |
| `gov.leader.tab` | the tabs of the leaders page; each `broader_than` the appointment kinds it includes | position |
| `gov.level` | country, county, sub-county, constituency, ward, `related_to` the geography kind | position |
| `gov.relationship.kind` | part of, oversees, reports to, funds (between bodies) | |
| `gov.mandate.kind` | purpose, function, legal basis (statements about a body) | |
| `fil.content.category` / `classification` | what a text is about and how a screen places it | position |

`governance.institutions` gained `arm_id` and `establishment_basis_id`; `reference.values` gained `position`. Bodies relate through `governance.relationships` (a body that has 40 or more children, such as the 47 county governments or the 290 NG-CDF committees, is folded into its parent in the directory).

## Content

`filesystem.contents` holds markdown texts about a subject row (`subject_table`/`subject_id`), with a slug per language, a category, a classification, tags (`filesystem.content_tags`) and an optional registered file. Front matter (`---` lines of `key: value`) and inline `![alt](media:<media code>)` references are resolved by the API to real addresses before a text is sent; a reference that cannot be resolved is reported in `gaps`. Texts are authored as files in `scripts/dev/dev_seed/pages/` (a small header, then the markdown) and generated for every body from `gov.json`.

## Legal basis

`legal.effects` points at subjects. A body, a place, a level and an **office kind** each carry effects (Constitution articles); a leader's legal basis is the office kind's plus the body's. Acts are recorded as `gov.mandate.kind.legal-basis` statements until Acts are loaded as instruments; the API returns both, typed `constitution` or `act`.

## API (all GET, under `/v1`)

| Path | Operation | Document |
| --- | --- | --- |
| `/institutions` | `ListInstitutions` | `InstitutionList` (arms → kinds → bodies) |
| `/institutions/{code}` | `GetInstitution` | `InstitutionDetail` |
| `/governance/tabs` | `GetGovernanceTabs` | `GovernanceTabs` (tabs and the body switcher) |
| `/governance/tree?tab=&institution=&featureId=` | `GetGovernanceTree` | `GovernanceTree` (nodes, edges, rail, legend) |
| `/content?slug=` or `?subjectTable=&subjectCode=` | `GetContent` | `ContentPage` |
| `/content/list?category=&tag=` | `ListContent` | `ContentList` |
| `/legal-basis?subjectTable=&subjectCode=` | `GetLegalBasis` | `LegalBasis` (also for offices and leaders) |
| `/compare/options?featureId=&metric=` | `GetCompareOptions` | `CompareOptions` (ten nearest, ten top, the ladder) |
| `/compare?a=&b=&metrics=` | `GetComparison` | `Comparison` |

A leader node carries a performance bar: attendance at recorded votes where the leader votes, else the share of completed projects in their area, ranked within the same tier and measurement basis. Where neither exists the bar is `null` and the gaps say so; an empty bar is not a low score. The ladder in `CompareOptions` names every missing rung (a ward with no sub-county, other countries when only Kenya exists).

`GET /v1/locality/{featureId}` now takes only the path parameter and `languageCode`; the earlier requirement to repeat `featureId` in the query is gone (Dryv gap 69). The `onDate` query binding was dropped because the generated controller types a date query as `unknown` (gap 70).

## Not done

Acts are not loaded as legal instruments with provisions, so an Act appears as a statement and not as a provision to open. Holders and many bodies have no performance measure. There are no real photographs or emblems; images are placeholder avatars.

## Continuation verification and client integration

The existing `GetContent` operation now also serves stored legal provisions at `slug=legal/<short provision code>`. Content about a legal instrument (including `constitution/overview`) includes its top-level provisions in `related`; a provision includes child provisions, stored wording, language, and its parent content slug in `frontMatter.parent`. Article and preamble readers include all stored descendant clauses inline in source order, while chapter readers retain article navigation. `frontMatter.sourceProvisions` and `citationIds` retain the assembled rows and citations. Clients can therefore navigate chapters, articles and clauses using the same typed content document instead of treating the Constitution as only an explanatory placeholder. The development database currently has 2,864 provisions and wordings for the imported Constitution. These reads use stored text; they do not generate legal wording. Missing requested translations are reported explicitly. Explanatory development prose retains its separate development flag.

`legal-basis` accepts either a subject code or that subject's UUID within the allowed tables, allowing place and holder profiles to use their existing IDs. Content subject reads likewise accept UUIDs, and `official.individuals` content resolves stored biographies. Holder and office reads include direct effects as well as effects on the office kind and institution. Institution lookup accepts full stored codes and unambiguous short identifiers without choosing a country implicitly.

A tree with no category definitions, or an unavailable explicitly requested category, returns empty node/edge/rail lists, `tab: null` and a gap. An institution-only tree contains its holders; an institution tree with an explicit appointment tab filters to that tab's reference-defined kinds. Parent-tier links cannot attach to an arbitrary holder from another place. Bars describe recorded vote participation or area project completion; they are proxy indicators, and ranks compare the same tier and measurement basis. Missing bars remain null.

Comparison rungs and labels now come from `gov.level` and its related geography kinds. Nearby ordering uses geographical distance; country comparison ranks countries rather than silently ranking counties. Missing-country messages use the recorded country name. Metric definitions, several gap messages, and metric titles/units remain English in the current insights contracts; full reference-driven metric localisation is not completed here. Client availability handling must preserve those gaps rather than invent translated backend data or scores.

## Current-active governance views

The current tree, institution directory and profiles, appointment-category counts, institution leader counts, and performance-ranking cohorts share current visibility predicates in `reads/governance-active.ts`. Holders must have started their tenure; offices must have been created; institutions must have been established. An exact end date excludes the record from that date onward, following the existing locality read convention. A recorded future end date does not remove a still-current holder. Soft-deleted holders, offices, institutions, mandates and relationships are excluded. Recursive institution traversal excludes inactive bodies and deleted links, and displayed mandates use their own effective dates.

Exact dates take priority over year fields. When only years are known, future start years and completed past end years are excluded; an uncertain end in the current year remains possible through that year because the database does not establish an exact end day. Missing dates impose no invented cutoff and do not prove that the tenure was independently verified. Dates are evaluated against PostgreSQL `current_date`, consistently with current locality reads. A selected tree level changes the client focus; it does not change temporal validity. Historical individual/holder profile reads remain separately accessible and retain office-history dates; current-tree filtering does not delete or rewrite those records.
