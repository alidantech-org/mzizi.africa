---
{id: DOC-FOUNDATION-REDESIGN-20261125,name: FOUNDATION_REDESIGN,type: documentation,tags: [database,postgres,reference,vocabulary,identity,language,classification,product,media,dryv]}
---

# Foundation redesign: identity, vocabulary, language and classification

**Status:** the owner approved this design direction on 2026-11-25 during the schema review (task TSK-D0EC3D8B6D47). The approval covers design only. None of it is implemented yet, and the Dryv contracts, SQL and API still match the old design. Items under [Pending discussion](#pending-discussion) are **not approved** and must not be built until they are settled.

This document records how Mzizi's core schemas fit together so that it can serve many countries, many government systems, many subject areas and many languages consistently, from statistics and governance to geography and community contributions. It replaces the foundation parts of the [reference design](../../_plan/schema-redesign/mzizi-db/phase-01/reference.md) as they are reviewed.

## 1. Why the foundation changes

In the review of `dryv/contracts/schemas/postgres/reference.ts` on 2026-11-24 and 2026-11-25, these problems were found:

- `reference` mixes four unrelated jobs: country and language facts, the controlled vocabulary (`schemes`, `values`, `value_labels`, `value_relations`), a generation workflow (`patterns`, `templates`, `instances`) and interface wording (`copy`). It also imports governance, official, source and geography, so the schema everything depends on itself depends on everything.
- Nothing in the database checks that a column tagged with a scheme (for example `scheme:ref.sch.geo.feature.kind`) holds a value from that scheme. The check lived in seed validation, and seed is leaving the codebase (task TSK-6065C44E5476).
- Names are kept in five separate tables (`geography.names`, `official.names`, `legal.names`, `event.names`, `reference.language_names`). Each has its own language rules, and no shared way picks the right language.
- Six tables point at "any subject" with a text `subject_table` and a `subject_id` (`filesystem.media`, `source.verifications`, `source.slugs`, `event.subjects`, `legal.effects`, `civic.beneficiaries`). PostgreSQL can't enforce these links, so a trigger in migration 0002 checks them instead.
- Classification is done in five different ways: kind columns, `geography.classifications`, single `continentId` and `subregionId` columns on countries, fixed `sexId`, `ageGroupId`, `residenceId` and `ethnicityId` columns on `statistics.observations`, and a separate tags system in filesystem.
- `geography.levels` has no dates, so a country's earlier divisions (Kenya's provinces and districts before 2013) can't be represented.
- Product settings (`countries.subdomain`, `countries.isServed`) and interface wording sit among reference facts.
- `filesystem` mixes stored bytes with readable articles and media descriptions in one language.

## 2. Schema map

| Schema | Holds | Depends on |
|---|---|---|
| `reference` | Countries, languages, locales, identities, names, identifiers, classifications, tags, administrative systems and tiers | `vocabulary` only |
| `vocabulary` | Schemes, terms, labels, mappings, units: every controlled meaning | Nothing except languages for labels |
| `product` | Apps, sites, releases, keys, messages | `reference` |
| `media` | Articles, texts, assets, captions, uses | `reference`, `filesystem` |
| `filesystem` | Folders, files, versions, extensions: bytes only | `reference` |
| `geography` | Features, geometries, relationships, units, changes | `reference`, `vocabulary` |
| `governance` | As today, **plus** patterns, templates and instances moved from reference | as today |

`reference.topics` and `reference.units` are removed as separate concepts (see [section 4](#4-vocabulary)). `reference.copy` moves to `product` (see [section 8](#8-product-schema)).

How languages and vocabulary depend on each other: languages are classified by terms (kind, family, script), and term labels are written in a language. Both are loaded in a fixed order: the special languages `und`, `mul`, `zxx` and `en` first, then the vocabulary schemes, then the rest.

## 3. Identity

### 3.1 The rule

Everything gets one language-neutral database identity first, and language-specific text is added after. An identity is a `code` (lowercase, dotted, as in [code rules](../../rules/code-columns.md)) plus a kind. It never carries display text. Text lives in `reference.names` (for identities) or `vocabulary.labels` (for terms).

### 3.2 `reference.identities`

This is one thin table. It is not a separate schema.

```text
reference.identities (id, kind, code, created_at, updated_at, deleted_at)
```

Only **named things** become identities: things people look up, mention and link to by name. These are countries, languages, geography features, organisations (`official.entities`), people (`official.individuals`), institutions, offices, parties, legal instruments, events, articles, administrative systems and tiers. Rows such as votes, observations, budget lines, results and captures are **not** identities.

Each extending table uses the identity id as its own primary key, and its kind is enforced with a fixed kind column plus a composite foreign key:

```text
reference.identities   id = 7f3a…, kind = 'feature', code = 'ke.nairobi'
geography.features     id = 7f3a… (same uuid), plus feature-only columns
reference.names        identity_id = 7f3a…, language = sw, text = 'Nairobi'
```

```sql
-- illustrative shape, not generated yet
kind text not null generated always as ('feature') stored,
foreign key (id, kind) references reference.identities (id, kind)
```

A feature row can therefore never point at an identity whose kind is "person".

### 3.3 Why one table and not names per schema

The owner's alternative was that each schema keeps its own identification and names. The combined design keeps each schema's own columns in its own tables, and shares only the identity anchor, names and identifiers:

- **No extra joins in normal reads.** The extending table's primary key equals the identity id, so a geography read joins `features` straight to `names`. `identities` is used for foreign keys and integrity, not in everyday reads.
- **No extra nullable columns.** `identities` holds only id, kind, code and timestamps. Feature, person and institution columns stay in their own schemas.
- **Real foreign keys for links to any named thing.** Example: a photo of Nairobi today is `subject_table = 'geography.features', subject_id = 7f3a…`, checked only by a trigger and impossible to join generically. With identities it becomes `media.uses.identity_id → reference.identities.id`: a real foreign key with real restrict or cascade. "Everything about Nairobi" (photos, laws that affect it, posts, addresses) is then one join per table, the same for any kind of thing.
- **One language-choosing function, one search pattern and one address system** for every named thing.

**Growth estimate (planning figures, not measurements):**

| Kind | Realistic size for Africa |
|---|---|
| Geography features (villages, rivers and roads included) | 1–30 million |
| People | 1–5 million |
| Organisations (if company registries are added) | 1–20 million |
| Laws, events, institutions, offices | under 5 million |
| **Identities total** | **tens of millions** |
| **Names** (a few languages each) | **about 100–300 million at the high end** |

Billions of rows would happen only if non-named rows were made identities, which the rule forbids.

**Scaling:** `reference.names` and `reference.identifiers` are **list-partitioned by kind**. Physically, feature names, person names and law names are stored separately, which keeps the strength of the per-schema idea (separate storage and indexes, partition pruning). Logically there is still one table.

Special name structures stay with their owner. For example, people's given and family names stay in `official` (on `individuals` or a small table there). `reference.names` holds only display forms.

### 3.4 `reference.names`

```text
reference.names (identity_id, kind, language_id, text, name_kind_term, script_term, country_id?,
                 from_year, to_year, is_default, citation_id)
```

- Name kinds are terms: preferred, official, short, local, alternative, historical, abbreviation, transliteration.
- Names have valid periods (Zaire before DR Congo; Kenya's provinces before counties).
- Script is recorded, so Amharic in Ge'ez can sit beside its Latin transliteration and Arabic can be marked right to left.
- At most one default name per identity, language and period.
- **Every identity has one preferred English row** (`en`, or `mul` for a form shared by languages, such as "Nairobi"). This is checked at the end of the transaction. Other languages are added rows.
- Names carry a citation, because a name is a claim with a source.

`reference.language_names` merges into this table.

### 3.5 `reference.identifiers`

```text
reference.identifiers (identity_id, kind, scheme_term, value, issuer_id?, from_year, to_year, citation_id)
```

This merges `geography.identifiers` and `official.identifiers`, list-partitioned by kind, and covers ISO, IEBC, Wikidata, registration numbers and similar codes. **Privacy:** personal identifiers such as national ID numbers are never stored here. Only public identifiers are allowed.

### 3.6 Readable addresses

Readable URL paths (today `source.slugs`) hang off identities, so every named thing gets one address system. Old addresses keep resolving through dated rows.

## 4. Vocabulary

### 4.1 Why a separate schema

Reference holds a few stable facts that everything points at. A vocabulary changes constantly: new schemes and terms, terms used in one country, mappings between them, retired terms. Keeping vocabulary in its own schema gives each its own rules and lets reference depend only on vocabulary.

### 4.2 Tables

| Table | Replaces | Role |
|---|---|---|
| `vocabulary.schemes` | `reference.schemes` | A controlled list (feature kind, institution arm, topic, unit, sex, age group). It records shape (flat, tree, graph), whether it is open or closed, global or country-specific, which identity kinds it applies to, whether a thing takes one answer or many, and its owner. |
| `vocabulary.terms` | `reference.values` | A member of one scheme: code, parent, the term it replaces, status, valid period, optional country, display hints (`icon_code`, `color_token`) and position. **No display text.** |
| `vocabulary.labels` | `reference.value_labels` and `values.label` | Every word for a term: language, label kind (preferred, alternative, short, plural, abbreviation, definition), optional country, script and source. |
| `vocabulary.mappings` | `reference.value_relations` | Links between terms: broader, narrower, exact match, close match, related. They may cross schemes and countries. Loops are prevented. |
| `vocabulary.units` | `reference.units` | Conversion details (base unit, exact scale and offset) for terms in the unit scheme. |

Terms behave like identities without being rows in `reference.identities`. They have the same shape (code first, text in labels, an English label required, language, country and period on labels) and use the same language-choosing function. Terms are common words, while names are proper nouns with history and sources.

**Topics** become a tree-shaped `topic` scheme. Governance, politics and statistics point at topic terms. There is no topic table.

**Units** become terms of the `unit` scheme plus their row in `vocabulary.units`.

### 4.3 Global and country-specific terms

Terms are **global by default**. "County", "district" and "province" are global words that many countries use. They do not mean the same rank everywhere: Kenya's county is first-level and a US county is second-level. Rank is decided by the country's administrative system ([section 6](#6-administrative-systems)), not by the term.

A scheme or term gets a country only when it is genuinely local: traditional titles, Nyumba Kumi, a national budget classification. Labels can carry an optional country when the same language words a term differently in different countries.

### 4.4 Scheme enforcement in the database

A term column must hold a term from the right scheme, and PostgreSQL must enforce it without seed validation. The intended shape is a fixed scheme column plus a composite foreign key to `vocabulary.terms (id, scheme_code)`.

This is a **Mzizi project concern**, solved locally: in Mzizi's own contract helpers under `dryv/contracts/schemas/` and, where the contracts cannot express it, in Mzizi's SQL migrations. It is **not** a Dryv feature. See [Pending discussion](#pending-discussion) for what is still open.

### 4.5 Terms need typed attributes

Some terms need data beyond labels. Age bands need lower and upper bounds, and others need sort order or a numeric range. The design of term attributes is pending.

## 5. Classification, categories, tags and dimensions

There are five concepts, each used the same way in every schema:

| Concept | Meaning | How many | Dated and sourced | Stored in |
|---|---|---|---|---|
| **Kind** | What a thing *is* | Exactly 1 | No (a different kind means a different identity) | A term column on the table |
| **Category** | A broader group of kinds | Comes from the scheme tree | No | Nowhere extra: it is the kind's ancestors |
| **Classification** | An answer to a question about a thing | Many | Yes | `reference.classifications` |
| **Tag** | A loose editorial label | Many | No | `reference.tags`, using an open scheme |
| **Dimension** | How a statistic is broken down | 1 per dimension | Through its observation | `statistics.breakdowns` |

```text
reference.classifications (identity_id, term_id, from_year, to_year, citation_id)
reference.tags            (identity_id, term_id)
statistics.breakdowns     (observation_id, term_id)   at most one term per dimension per observation
```

`reference.classifications` replaces `geography.classifications` and works for any identity. Tags replace `filesystem.tags`, `taggings` and `content_tags`. Breakdowns replace the fixed dimension columns on `statistics.observations`, so a new dimension (disability, education) is data, not a schema change.

### 5.1 Examples

**Geography, Lake Victoria:**

```text
kind             → lake  (tree: natural feature > water body > lake)
classifications  → function: fishery, transport route   (sourced)
                   protection: Ramsar site, since 2006   (dated)
tags             → great lakes, tourism
```

**Governance, MCA seats:** kind = member of county assembly. An elected seat is classified selection: elected, seat basis: ward. A nominated seat has the same kind and is classified selection: nominated. President and governor are kinds in the office tree.

**Countries and regions, Kenya:**

```text
classifications → UN region: Africa > Sub-Saharan Africa > Eastern Africa   (tree, so all three apply)
memberships     → EAC since 2000; AU since 1963                             (real bodies, dated)
```

Statistical or geographic regions are **classifications**. Regional bodies (EAC, SADC, AU) are **organisations** (`official.entities`) with dated memberships. This keeps "a label someone applies" separate from "a body a country joined", and replaces `countries.continentId` and `subregionId`.

**Statistics, demographics:**

```text
Topic:       Demographics
Indicators:  Population, Population density, Median age
Dimensions:  Sex → female, male
             Age group → 0–4, 5–9, … (terms with numeric bounds)
             Residence → rural, urban
```

Population density is an **indicator**, not a dimension. Demographics is a **topic**. Sex, age group and residence are **dimensions**: each is a scheme and its categories are terms with labels in every language. Indicators are identities, so they have names in every language.

### 5.2 How the UI uses them

- **Kind and category: map legends and filter chips.** "Natural features ▸ Water bodies ▸ Lakes": choosing "Water bodies" selects a term and everything under it. Icons and colours come from the terms' display hints, so no screen keeps its own lookup table.
- **Classification: detail facts and faceted search.** "Protected: Ramsar site (since 2006, source …)", and filters such as "Function = market" or "Selection = elected".
- **Tags: related links, editorial collections and content discovery.**
- **Dimensions: chart controls.** "By sex" and "By age group" toggles appear from the dimensions present in the data, not from code.
- Every chip, legend and toggle text comes from labels in the reader's language. Codes such as `geo.kind.lake` never change.

## 6. Administrative systems

The **system** a country uses to divide itself is reference data. The **places** are geography.

```text
reference.systems   one way a country divides itself, for a period
  ke.admin.1963   Kenya administrative, 1963–2013   (routing: no)
  ke.admin.2013   Kenya administrative, 2013–       (routing: yes)
  ke.electoral    Kenya electoral, 2013–

reference.tiers     the levels of one system
  ke.admin.1963: 1 province, 2 district, 3 division, 4 location, 5 sub-location
  ke.admin.2013: 1 county, 2 sub-county, 3 ward
  ke.electoral:  1 county, 2 constituency, 3 ward

geography.units     a feature serving as a unit in a tier, for a period
  Nairobi    → tier province    (ke.admin.1963), 1963–2013
  Nairobi    → tier county      (ke.admin.2013), 2013–
  Westlands  → tier constituency (ke.electoral), 2013–
```

- Systems and tiers are identities, with names in every language. A tier's kind is a global term, and its depth gives its rank.
- A feature keeps one identity through every reform, and `geography.units` records what it was in each system and when. Nairobi was a province and is now a county, and it is the same feature.
- Parentage stays in dated `geography.relationships`.
- **Cross-country comparison** uses "tier N of each country's current system of a given kind". This lines up Kenya's counties, Tanzania's regions and Uganda's districts without pretending they are the same word.
- **Addresses and breadcrumbs** follow the system marked routing. Addresses from earlier systems resolve through the dated units.
- This replaces `geography.levels`.

## 7. Multilingual foundation

### 7.1 One home for each kind of text

| Kind of text | Lives in | Example |
|---|---|---|
| Proper name of a thing | `reference.names` | Nairobi, Jamhuri ya Kenya, Bunge la Kitaifa |
| Word for a term | `vocabulary.labels` | County, Kaunti, definitions |
| Interface wording | `product.messages` | Button text, page titles |
| Readable articles | `media.texts` | Explainers, blog posts |
| Media descriptions | `media.captions` | Photo title, alt text |
| Evidence and long source text | Its domain table, always with its original language | Law wording, Hansard, community posts |
| Translation of evidence | A separate row linked to the original, marked human or machine | `legal.translations` already works this way |

### 7.2 Rules for every schema

1. Domain tables have no free `name`, `label`, `title` or `description` display-text columns. Titles are names; descriptions are definition labels or media texts.
2. Every text row has a language from `reference.languages`. `und` means not known, `mul` means shared by several languages and `zxx` means no linguistic content. **A missing language never means English.**
3. Originals are never overwritten. A translation is a derivative that records its method and what it was translated from. Evidence is never silently translated and shown as the original.
4. Text that changes over time has a valid period.

### 7.3 Choosing the text to show

One database function or view, used by every API read:

```text
requested language (?lang) → the user's saved languages → the country's locales in order → mul → en → any available
```

It returns `{ text, language, isFallback, direction }`. Every displayed text in the API is one shared Dryv type, `LocalizedText`, so the UI can always mark a fallback ("shown in English") and set the text direction. No screen writes its own fallback logic.

### 7.4 Countries, languages and locales

`reference.locales` (country, language, status official/national/recognised/regional, order) replaces the single `countries.defaultLanguageId`. It drives the fallback chain, which languages a site offers, and number and date formatting. A locale is a language plus a country (sw-KE, fr-CD, en-NG).

`reference.countries` keeps only country facts (ISO codes, calling code, currency term, recognition, established date).

**Fixes:** unique ISO codes on countries and languages become partial unique indexes that skip soft-deleted rows, so a deleted row no longer blocks re-adding the code. `countries.subdomain` and `isServed` move to `product.releases`.

## 8. Product schema

| Table | Role |
|---|---|
| `product.apps` | web, app, dev |
| `product.sites` | Each public site or domain (mzizi.africa, ke.mzizi.africa): its app, default locale and status |
| `product.releases` | Which country is served on which app and since when, with the enabled languages and their order. Replaces `countries.isServed` and `subdomain`. |
| `product.keys` | Every interface text key declared in contracts (`web.home.title`), with a description and the placeholders it takes, so translators know the context |
| `product.messages` | The text for one key in one language, optionally for one country, with status (draft, reviewed, published) and who translated it. Replaces `reference.copy`. |

Interface keys are contracts-first: screens declare their keys, unknown keys are refused, and missing translations show as gaps. Feature flags and per-site settings may be added later.

## 9. Media schema

`filesystem` keeps only bytes: folders, files, versions and extensions, with no meaning and no language. Readable and visual material moves to a new `media` schema:

| Table | Role |
|---|---|
| `media.articles` | The article identity: code, category and classification, with no text. Replaces `filesystem.contents`. |
| `media.texts` | One row per language: title, summary, Markdown body, origin (original, human translation, machine translation), translated from, status |
| `media.assets` | A photo, logo, flag, video, audio or document scan, pointing at a filesystem version. Replaces `filesystem.media`. |
| `media.captions` | Per language: title, description, alt text |
| `media.uses` | Which identity an asset illustrates and why (Nairobi ← photo, purpose: skyline) |

Example, "How a bill becomes law": one article; an English original; a Swahili human translation; a French machine translation left as a draft. The UI offers English and Kiswahili and labels any published machine translation. An article may stay in one language only.

## 10. Patterns move to governance

`patterns`, `templates` and `instances` move from `reference` to `governance`. Fixes to make when they move:

- `instances` is unique on `(templateId, unitFeatureId)`, but `unitFeatureId` can be null and PostgreSQL treats nulls as distinct. A template that does not fan out could therefore produce duplicate instances. This needs a partial unique index for the null case, or `NULLS NOT DISTINCT`.
- `templates.institutionKindId` must be limited to its scheme, like its sibling columns.
- Templates fan out over a tier ([section 6](#6-administrative-systems)) instead of `geography.levels`.

## 11. Country columns and partitioning

A table gets its own `country_id` **only** if it is large, filtered by country in most reads, and a partitioning candidate. Everything else gets its country from its place. Likely candidates are `statistics.observations`, `politics.results`, `governance.votes`, `governance.speeches`, `finance.flows` and community posts. The final list is decided table by table during each schema's review, together with the partitioning plan in task TSK-D0EC3D8B6D47.

## 12. Descriptions in the database

Descriptions written in the contracts do not reach PostgreSQL today (the generated `schema.sql` has no `COMMENT ON`). Approved direction:

- Dryv, as a general-purpose system, may allow a description on anything (schemas, tables, columns, constraints) and emit it as `COMMENT ON` in SQL. This is a generic Dryv capability, recorded in [DRYV_GAPS](DRYV_GAPS.md) when requested.
- Descriptions are written **only where they add meaning**. Generation never fails because a description is missing.
- Mzizi-specific meanings, such as which scheme a column draws from, are written by Mzizi in its own contracts as descriptions, not as Dryv features.

## 13. Table names

Single-word table names that make sense are preferred: `identities`, `names`, `identifiers`, `locales`, `labels`, `mappings`, `terms`, `releases`, `keys`, `messages`, `systems`, `tiers`, `units`, `breakdowns`, `articles`, `texts`, `captions`, `assets`, `uses`.

Existing two-word tables are reviewed one by one during each schema's review and renamed only where a single word is clear and safe: `login_identities`, `role_assignments`, `role_permissions`, `delegation_roles`, `file_versions`, `file_extensions`, `content_tags`, `budget_versions`, `fiscal_periods`, `authority_scopes`, `manifesto_items`, `referendum_options`, `option_results`, `project_features`.

## Pending discussion

These are **not approved** and must be settled before implementation:

1. **Naming of vocabulary columns.** How a column that points at a term is recognised from its name. Today `geography.features.featureTypeId` suggests a non-existent `feature_types` table. The options discussed (a prefix or a suffix convention) are undecided.
2. **Project-local scheme enforcement.** Exactly how Mzizi enforces a column's scheme using only general Dryv features (a Mzizi contract helper, generated fixed columns and composite foreign keys, or a Mzizi migration trigger), and whether the current Dryv packs can express it.
3. **Term attributes.** How terms carry typed data such as age-band bounds and numeric ranges.
4. **How schemes declare what they apply to.** The kinds of identity a scheme may classify and whether it allows one answer or many, and how that is enforced.
5. **Links to unnamed rows.** Subject links to rows that are not identities (for example a verification of one observation) cannot use `reference.identities` and need their own design per schema.
6. **The full move list.** Every table and column moving between schemas, with its new name, written per schema during the review.
7. **Final `country_id` and partitioning list**, decided per schema.
8. **Two-word table renames**, decided per schema.
9. **Labels on terms:** confirm the label kinds and whether labels need periods.
10. **Load order and the English-row check:** how the transaction-end checks are implemented for bulk loads.

## Related

- [Database architecture](DATABASE_ARCHITECTURE.md)
- [Subject references](SUBJECT_REFERENCES.md)
- [Context and localisation](CONTEXT_AND_LOCALISATION.md)
- [Periods](PERIODS.md)
- [Dryv gaps](DRYV_GAPS.md)
- [Code column rules](../../rules/code-columns.md)
- Wave task: schema review TSK-D0EC3D8B6D47
