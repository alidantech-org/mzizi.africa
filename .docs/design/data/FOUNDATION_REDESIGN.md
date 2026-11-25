---
{id: DOC-FOUNDATION-REDESIGN-20261125,name: FOUNDATION_REDESIGN,type: documentation,tags: [database,postgres,reference,vocabulary,identity,language,classification,product,media,dryv]}
---

# Foundation redesign: identity, vocabulary, language and classification

**Status:** the owner approved this design direction on 2026-11-25 during the schema review (task TSK-D0EC3D8B6D47). The approval covers design only. None of it is implemented yet, and the Dryv contracts, SQL and API still match the old design. Items under [Pending discussion](#pending-discussion) are **not approved** and must not be built until they are settled.

This document records how Mzizi's core schemas fit together so that it can serve many countries, many government systems, many subject areas and many languages consistently, from statistics and governance to geography and community contributions. It replaces the foundation parts of the [reference design](../../_plan/.old/schema-redesign/mzizi-db/phase-01/reference.md) as they are reviewed.

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
| `identity` | Identities, names, identifiers, addresses, classifications, tags: everything about named things | `reference`, `vocabulary` |
| `reference` | True reference data only: countries, languages, locales, currencies, units, timezones, hierarchies and levels (how countries divide themselves) | `vocabulary` only |
| `vocabulary` | Schemes, scopes, terms, labels, mappings: every controlled meaning | Nothing except languages for labels |
| `product` | Apps, sites, releases, keys, messages | `reference` |
| `media` | Articles, texts, assets, captions, uses | `reference`, `filesystem` |
| `filesystem` | Folders, files, versions, extensions: bytes only | `reference` |
| `geography` | Features, geometries, outlines, relationships, changes | `reference`, `vocabulary` |
| `governance` | As today, **plus** patterns, templates and instances moved from reference | as today |

`reference.topics` and `reference.units` are removed as separate concepts (see [section 4](#4-vocabulary)). `reference.copy` moves to `product` (see [section 8](#8-product-schema)).

How languages and vocabulary depend on each other: languages are classified by terms (kind, family, script), and term labels are written in a language. Both are loaded in a fixed order: the special languages `und`, `mul`, `zxx` and `en` first, then the vocabulary schemes, then the rest.

## 3. Identity

### 3.1 The rule

Everything gets one language-neutral database identity first, and language-specific text is added after. An identity is a `code` (lowercase, dotted, as in [code rules](../../rules/code-columns.md)) plus a kind. It never carries display text. Text lives in `identity.names` (for identities) or `vocabulary.labels` (for terms).

### 3.2 `identity.identities`

Identity is its own schema (owner decision 2026-11-25). It was first placed in reference, but because every named thing in every schema now uses it, it belongs in its own schema. Reference keeps only true reference data.

```text
identity.identities (id, kind, code, created_at, updated_at, deleted_at)
```

Only **named things** become identities: things people look up, mention and link to by name. These are countries, languages, geography features, organisations (`official.entities`), people (`official.individuals`), institutions, offices, parties, legal instruments, events, articles, hierarchies and levels. Rows such as votes, observations, budget lines, results and captures are **not** identities.

Each extending table uses the identity id as its own primary key, and its kind is enforced with a fixed kind column plus a composite foreign key:

```text
identity.identities   id = 7f3a…, kind = 'feature', code = 'ke.nairobi'
geography.features     id = 7f3a… (same uuid), plus feature-only columns
identity.names        identity_id = 7f3a…, language = sw, text = 'Nairobi'
```

```sql
-- illustrative shape, not generated yet
kind text not null generated always as ('feature') stored,
foreign key (id, kind) references identity.identities (id, kind)
```

A feature row can therefore never point at an identity whose kind is "person".

### 3.3 Why one table and not names per schema

The owner's alternative was that each schema keeps its own identification and names. The combined design keeps each schema's own columns in its own tables, and shares only the identity anchor, names and identifiers:

- **No extra joins in normal reads.** The extending table's primary key equals the identity id, so a geography read joins `features` straight to `names`. `identities` is used for foreign keys and integrity, not in everyday reads.
- **No extra nullable columns.** `identities` holds only id, kind, code and timestamps. Feature, person and institution columns stay in their own schemas.
- **Real foreign keys for links to any named thing.** Example: a photo of Nairobi today is `subject_table = 'geography.features', subject_id = 7f3a…`, checked only by a trigger and impossible to join generically. With identities it becomes `media.uses.identity_id → identity.identities.id`: a real foreign key with real restrict or cascade. "Everything about Nairobi" (photos, laws that affect it, posts, addresses) is then one join per table, the same for any kind of thing.
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

**Scaling:** `identity.names` and `identity.identifiers` are **list-partitioned by kind**. Physically, feature names, person names and law names are stored separately, which keeps the strength of the per-schema idea (separate storage and indexes, partition pruning). Logically there is still one table.

Special name structures stay with their owner. For example, people's given and family names stay in `official` (on `individuals` or a small table there). `identity.names` holds only display forms.

### 3.4 `identity.names`

```text
identity.names (identity_id, kind, language_id, text, name_kind_term, script_term, country_id?,
                 from_year, to_year, is_default, citation_id)
```

- Name kinds are terms: preferred, official, short, local, alternative, historical, abbreviation, transliteration.
- Names have valid periods (Zaire before DR Congo; Kenya's provinces before counties).
- Script is recorded, so Amharic in Ge'ez can sit beside its Latin transliteration and Arabic can be marked right to left.
- At most one default name per identity, language and period.
- **Every identity has one default name.** Its language may be any language, `mul` (a form shared by languages, such as "Nairobi") or `en`. English is **not** forced (owner decision 2026-11-25). Other languages are added rows.
- Names carry a citation, because a name is a claim with a source.

`reference.language_names` merges into this table.

### 3.5 `identity.identifiers`

```text
identity.identifiers (identity_id, kind, scheme_term, value, issuer_id?, from_year, to_year, citation_id)
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

Terms behave like identities without being rows in `identity.identities`. They have the same shape (code first, text in labels, one default label in any language, `mul` or `en`, never forced to English) and use the same language-choosing function. Terms are common words, while names are proper nouns with history and sources.

**Topics** become a tree-shaped `topic` scheme. Governance, politics and statistics point at topic terms. There is no topic table.

**Units, currencies and timezones** are real reference tables, not terms (see [section 14](#14-reference-tables-for-currencies-units-and-timezones)).

### 4.3 Global and country-specific terms

Terms are **global by default**. "County", "district" and "province" are global words that many countries use. They do not mean the same rank everywhere: Kenya's county is first-level and a US county is second-level. Rank is decided by the country's administrative system ([section 6](#6-administrative-systems)), not by the term.

A scheme or term gets a country only when it is genuinely local: traditional titles, Nyumba Kumi, a national budget classification. Labels can carry an optional country when the same language words a term differently in different countries.

### 4.4 Scheme enforcement in the database

A term column must hold a term from the right scheme. This is a **Mzizi project concern**, not a Dryv feature, and it is simple: Mzizi's own database code or application code verifies it (owner decision 2026-11-25). The exact check is chosen during implementation.

### 4.5 Ranges on terms

Numeric bands (age groups, income bands, settlement size classes, altitude zones) carry optional range columns on `vocabulary.terms` (agreed 2026-11-25):

```text
lower numeric, upper numeric, unit_id → reference.units, lower_inclusive boolean, upper_inclusive boolean
```

| Term | lower | upper | unit |
|---|---|---|---|
| age 0–4 | 0 | 5 (exclusive) | year |
| age 65+ | 65 | none | year |
| town (size class) | 2 000 | 100 000 | person |

Charts can sort bands, check they do not overlap, and combine smaller bands into larger ones ("15–64"). There is **no** general key-and-value attributes table.

### 4.6 Scheme rules and scopes

Each scheme declares its rules, and one small table says which kinds of identity it may classify (agreed 2026-11-25; to be re-checked as it is used):

```text
vocabulary.schemes   + shape (flat, tree), answers (one, many), dated (yes, no), open (yes, no)
vocabulary.scopes    (scheme, identity kind)
```

| Scheme | Applies to | Answers | Dated |
|---|---|---|---|
| office selection | office | one | yes |
| feature function | feature | many | yes |
| UN region | country | one (a tree, so its ancestors also apply) | yes |
| tag | any | many | no |

Mzizi's own code checks, on `identity.classifications`, that the identity's kind is in the scheme's scopes, and that a one-answer scheme has at most one live answer per period.

### 4.7 Label kinds

| Label kind | Use | Example (county) |
|---|---|---|
| preferred | Default text, one per language | en "County", sw "Kaunti" |
| plural | Counts and lists ("47 counties") | en "Counties", sw "Kaunti" |
| short | Chips and narrow screens | only where needed |
| abbreviation | Official short forms | "MCA" |
| alternative | Other words, used by search | |
| definition | Tooltip or explanation | "The first level of Kenya's devolved government…" |

Labels may carry an optional country. Labels have **no dates**: when a term's meaning changes, a new term supersedes the old one, so history lives in terms.

## 5. Classification, categories, tags and dimensions

**Status: partially agreed (2026-11-25).** The five concepts are the agreed direction; details are still under discussion.

There are five concepts, each used the same way in every schema:

| Concept | Meaning | How many | Dated and sourced | Stored in |
|---|---|---|---|---|
| **Kind** | What a thing *is* | Exactly 1 | No (a different kind means a different identity) | A term column on the table |
| **Category** | A broader group of kinds | Comes from the scheme tree | No | Nowhere extra: it is the kind's ancestors |
| **Classification** | An answer to a question about a thing | Many | Yes | `identity.classifications` |
| **Tag** | A loose editorial label | Many | No | `identity.tags`, using an open scheme |
| **Dimension** | How a statistic is broken down | 1 per dimension | Through its observation | `statistics.breakdowns` |

```text
identity.classifications (identity_id, term_id, from_year, to_year, citation_id)
identity.tags            (identity_id, term_id)
statistics.breakdowns     (observation_id, term_id)   at most one term per dimension per observation
```

`identity.classifications` replaces `geography.classifications` and works for any identity. `identity.tags` replaces `filesystem.tags`, `taggings` and `content_tags` for identities. Files are not identities: tags on files are a plain PostgreSQL text array (or `jsonb` if structure is ever needed) on the file row, with no tag tables. Breakdowns replace the fixed dimension columns on `statistics.observations`, so a new dimension (disability, education) is data, not a schema change.

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

**Agreed 2026-11-25.** How a country divides itself is reference data; the places are identities and geography features. **Nothing about a place (Nairobi, Westlands) is stored in reference.**

```text
reference.hierarchies   one way a country divides itself, for a period
  ke.admin.1963   Kenya administrative, 1963–2013   (routing: no)
  ke.admin.2013   Kenya administrative, 2013–       (routing: yes)
  ke.electoral    Kenya electoral, 2013–

reference.levels        the ranks of one hierarchy
  ke.admin.1963: 1 province, 2 district, 3 division, 4 location, 5 sub-location
  ke.admin.2013: 1 county, 2 sub-county, 3 ward
  ke.electoral:  1 county, 2 constituency, 3 ward
```

The names follow the international "admin level" convention (ADM0–ADM4 in UN OCHA and geoBoundaries data).

**A place's level is recorded on its dated parent link** in `geography.relationships`, so parent and rank are stated in one row and can never disagree:

```text
geography.relationships
  Nairobi   inside Kenya    hierarchy ke.admin.1963  level province      1963–2013
  Nairobi   inside Kenya    hierarchy ke.admin.2013  level county        2013–
  Westlands inside Nairobi  hierarchy ke.electoral   level constituency  2013–
```

- Every place has a parent in each hierarchy it belongs to (at minimum the country), so every membership has a row.
- Hierarchies and levels are identities, with names in every language. A level's kind is a global term (`county`, `province`), and its depth gives its rank.
- A feature keeps one identity through every reform. Nairobi was a province and is now a county, and it is the same feature.
- **Cross-country comparison** uses "level N of each country's current hierarchy of a given kind". This lines up Kenya's counties, Tanzania's regions and Uganda's districts without pretending they are the same word.
- **Addresses and breadcrumbs** follow the hierarchy marked routing. Addresses from earlier hierarchies resolve through the dated links.
- This replaces today's `geography.levels` (which has no dates). There is no separate `geography.units` table.

## 7. Multilingual foundation

### 7.1 One home for each kind of text

| Kind of text | Lives in | Example |
|---|---|---|
| Proper name of a thing | `identity.names` | Nairobi, Jamhuri ya Kenya, Bunge la Kitaifa |
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

`reference.countries` keeps only country facts (ISO codes, calling code, currency, recognition, established date). Reference may also hold other true reference lists such as currencies, units of measurement and timezones; whether currencies and units are reference tables or vocabulary schemes is decided with the term attributes design.

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
- Templates fan out over a `reference.levels` row ([section 6](#6-administrative-systems)) instead of today's `geography.levels`.

## 11. Country columns and partitioning

A table gets its own `country_id` **only** if it is large, filtered by country in most reads, and a partitioning candidate. Everything else gets its country from its place. The agreed list is in [section 18](#18-country-columns-and-partitioning).

## 12. Descriptions in the database

Descriptions written in the contracts do not reach PostgreSQL today (the generated `schema.sql` has no `COMMENT ON`). Approved direction:

- Dryv, as a general-purpose system, may allow a description on anything (schemas, tables, columns, constraints) and emit it as `COMMENT ON` in SQL. This is a generic Dryv capability, recorded in [DRYV_GAPS](DRYV_GAPS.md) when requested.
- Descriptions are written **only where they add meaning**. Generation never fails because a description is missing.
- Mzizi-specific meanings, such as which scheme a column draws from, are written by Mzizi in its own contracts as descriptions, not as Dryv features.

## 13. Table names

Single-word table names that make sense are preferred: `identities`, `names`, `identifiers`, `addresses`, `locales`, `currencies`, `units`, `timezones`, `labels`, `mappings`, `terms`, `scopes`, `releases`, `keys`, `messages`, `breakdowns`, `articles`, `texts`, `captions`, `assets`, `uses`. Renames of existing two-word tables are in [section 19](#19-table-renames).

## 14. Reference tables for currencies, units and timezones

These are true reference data, so they are real tables with ordinary foreign keys, not vocabulary terms (agreed 2026-11-25):

```text
reference.currencies  code (ISO 4217, e.g. KES), minor units (2), symbol
reference.units       symbol, base unit, exact scale and offset
reference.timezones   IANA name (Africa/Nairobi)
```

A column pointing at a currency is `currency_id → reference.currencies`, a normal foreign key.

## 15. Column naming for terms

**Agreed 2026-11-25.** A column that points at a vocabulary term ends in **`_term`**, with no `_id`:

```text
civic.procurements:   category_term, nature_term, procedure_term, status_term, evaluation_term
governance.positions: role_term, method_term, basis_term
geography.features:   kind_term
```

Why `_term` and not `_id`:

- **`_id` always means a real table.** `feature_id` → `features`, `institution_id` → `institutions`, `currency_id` → `currencies`. A reader never has to guess.
- **`_term` always means `vocabulary.terms`.** It is a uuid foreign key to `vocabulary.terms.id`, and its scheme is recorded in the column's description and checked by Mzizi's own code. The ending is the marker; leaving out `id` keeps names short and stops anyone looking for a table called `feature_types`.
- A table can have many term columns. Each is named by its **meaning**, so the names explain the row.

**Meaning words**, used the same way in every schema:

| Word | Means | Example |
|---|---|---|
| `kind` | What a thing is | `kind_term` on features (lake, county), institutions, offices |
| `status` | Where it is in its life | `status_term` (draft, active, ended) |
| `role` | What part it plays | `role_term` on positions (chair, member) |
| `method` | How it was done | `method_term` (elected, nominated, appointed) |
| `basis` | The grounds for something | `basis_term` (ward seat, special interest seat) |
| `category` | An editorial group | `category_term` on articles |

A more specific word (for example `nature_term`, `procedure_term`) is used only when none of these fits. Existing names such as `featureTypeId` and `institutionKindId` become `kind_term`.

This rule must be explained in the codebase: in `dryv/contracts/schemas/README` or the shared contract helpers, in `.docs/rules/`, and in each such column's description.

## 16. Links to rows that are not named things

**Accepted with caution (2026-11-25); the owner will re-evaluate it during implementation.**

| Table today | Points at | Becomes |
|---|---|---|
| `filesystem.media` | Places, people, institutions | `media.uses` → `identity.identities` (real foreign key) |
| `source.slugs`, `source.links` | Named things | `identity.addresses` (to be confirmed in the source review) |
| `legal.effects` | Places, institutions, offices, laws | → `identity.identities` |
| `event.subjects` | Named things | → `identity.identities` |
| `civic.beneficiaries` | Organisations, places, groups | → `identity.identities` |
| `source.verifications` | Any row (observation, result, vote) | Evidence state on the row itself |

Only verification points at rows without names. Following the provenance rule, the evidence for a row lives on that row:

```text
statistics.observations  + citation_id, status_term (sourced, verified, disputed), verified_citation_id
```

A table that needs many reviews per row gets its own table in its own schema (for example `statistics.reviews (observation_id, …)`). The 0002 "any subject" trigger and most of `_subjects.ts` are then removed.

## 17. What moves where

| From | To |
|---|---|
| `reference.schemes`, `values`, `value_labels`, `value_relations` | `vocabulary.schemes`, `terms`, `labels`, `mappings` |
| `reference.topics` | A topic scheme in vocabulary |
| `reference.language_names`; `geography`, `official`, `legal`, `event` `.names` | `identity.names` |
| `geography.identifiers`, `official.identifiers` | `identity.identifiers` |
| `geography.classifications` | `identity.classifications` |
| `source.slugs`, `source.links` | `identity.addresses` |
| `filesystem.tags`, `taggings`, `content_tags` | `identity.tags`; file tags become an array on the file |
| `geography.levels` | `reference.hierarchies` and `reference.levels`; place levels on `geography.relationships` |
| `reference.patterns`, `templates`, `instances` | `governance` |
| `reference.copy` | `product.keys`, `product.messages` |
| `countries.isServed`, `subdomain` | `product.releases`, `product.sites` |
| `countries.defaultLanguageId` | `reference.locales` |
| `countries.continentId`, `subregionId` | `identity.classifications` (UN region scheme) |
| Currency scheme values | `reference.currencies` |
| (new) | `reference.timezones` |
| `filesystem.contents` | `media.articles`, `media.texts` |
| `filesystem.media` | `media.assets`, `media.captions`, `media.uses` |
| `observations.sexId`, `ageGroupId`, `residenceId`, `ethnicityId` | `statistics.breakdowns` |

## 18. Country columns and partitioning

| Table | `country_id` | Split by | Why |
|---|---|---|---|
| `identity.names`, `identity.identifiers` | no | identity kind | The largest tables, always read by kind |
| `statistics.observations` | yes | country | Large, read for one country |
| `politics.results` | yes | country | Every election at every level |
| `governance.votes`, `governance.speeches` | yes | country | Large, read for one parliament |
| `finance.flows` | yes | country | Read for one country and its years |
| `source.captures` | no | capture month | Grows with time; old months can be archived |
| `community.views`, notifications, deliveries | yes (views) | month | Very high writes, limited retention |
| `community.posts` | yes | country | Read for one country |
| Everything else | no | not split | Small or medium; country comes from its place |

**Identity kind is a typed enum, not a scheme.** `identity.identities.kind` (and the kind column copied onto names and identifiers for partitioning) is a fixed database enum (`country`, `language`, `feature`, `entity`, `individual`, `institution`, `office`, `party`, `instrument`, `event`, `article`, …). It is part of the schema design and changes only with a migration, because partitions and kind checks depend on it.

`geography.geometries` is not partitioned. Map speed is handled as described in [section 20](#20-map-geometry-and-tiles).

## 19. Table renames

| Today | New name | Note |
|---|---|---|
| `auth.login_identities` | `logins` | |
| `auth.role_assignments` | `grants` | Who holds which role |
| `auth.role_permissions` | `privileges` | What a role may do |
| `auth.delegation_roles` | kept for now | Checked in the auth review |
| `civic.project_features` | `sites` | The places a project touches |
| `filesystem.file_versions` | `versions` | |
| `filesystem.file_extensions` | `formats` | |
| `filesystem.content_tags` | removed | Tags move to identity |
| `finance.budget_versions` | `revisions` | Original and supplementary budgets |
| `finance.fiscal_periods` | `periods` | |
| `governance.authority_scopes` | `jurisdictions` | |
| `politics.manifesto_items` | `pledges` | |
| `politics.referendum_options` | `choices` | |
| `politics.option_results` | merged into `results` | A result is for exactly one candidate or one choice |

## 20. Map geometry and tiles

**Agreed 2026-11-25.** The full-detail geometry in `geography.geometries` is evidence and is never altered. Everything a map shows is prepared from it in advance:

1. **Outlines at a few zoom levels.** Simplified copies for about 3–4 zoom bands in `geography.outlines`. This removes today's simplification on every request.
2. **Shared borders simplified together.** Neighbouring places are simplified as one topology (PostGIS topology or TopoJSON), so no gaps or overlaps appear between them.
3. **A lookup table for "where am I?".** Polygons cut into small pieces with `ST_Subdivide`, with a spatial index, so point-in-polygon lookups stay fast even for long coastlines.
4. **Bounding boxes and centre points** precomputed on outlines, so a map can frame a place without reading its geometry.
5. **Cached prepared shapes.** GeoJSON or TopoJSON per place, mode and zoom, cached in Redis and in object storage behind a CDN. The cache clears only when a geometry changes.
6. **Vector tiles.** National and large maps use tiles: generated with `ST_AsMVT`, or prebuilt tile files in object storage. Reading a prebuilt tile does not touch the database.
7. **Smaller payloads.** Coordinates rounded to what a screen needs (5 decimals is about 1 m), and responses compressed.

**Files go through the filesystem.** Prepared shapes, TopoJSON files and tile files are stored as `filesystem` files and versions, like any other stored bytes. Geography records which file version holds which prepared output (for example a tile set for a hierarchy level and zoom range, or a TopoJSON for a place), the geometry revisions it was built from, and when it was built. When a source geometry changes, the outputs built from it are marked stale and rebuilt. As everywhere in the filesystem, the caller decides folders, names, access and retention. The exact table for this link is designed during the geography review.

## Pending discussion

No open items remain from the reference review. New open items will be added here as other schemas are reviewed.

## Related

- [Database architecture](DATABASE_ARCHITECTURE.md)
- [Subject references](SUBJECT_REFERENCES.md)
- [Context and localisation](CONTEXT_AND_LOCALISATION.md)
- [Periods](PERIODS.md)
- [Dryv gaps](DRYV_GAPS.md)
- [Code column rules](../../rules/code-columns.md)
- Wave task: schema review TSK-D0EC3D8B6D47
