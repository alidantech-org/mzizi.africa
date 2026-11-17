---
{id: RULE-CODES,name: Codes,type: rule,tags: [schema,manifest,agent-guidance]}
---

# Codes

This rule governs source, mapping, term, job and engine inputs and the database row codes handled by the seed workflow. The current filesystem registry has its own [underscore grammar](code-columns.md). The rule was agreed with the owner on 16 November 2026. It has one grammar, two forms for a database row, and a fixed list of short names.

## Grammar

- Segments are lowercase `a-z0-9` words. **A dash joins the words of one real name** (`north-america`, `un-member-state`). **A dot means "narrower than"** (`geo.continent.north-america`: a value of the continent scheme). **Never an underscore.**
- Concept words (the parts of a scheme code) are single words: `recognition.status`, `country.designation`. Only a name, the last segment of a member or an entity, may contain dashes.
- At most 16 segments and 255 characters. Codes are unique, immutable, and never reused: a rename is a new code linked by supersession, because ids derive from codes.

## Spaces: where the code lives

A code starts with its space.

| Space | Means |
|---|---|
| `pg` | identifies a **PostgreSQL row** |
| `sys` | identifies a **system thing** that is not a row: a mapping, a term list, a job, engine data, a schema |
| `mg` | MongoDB, reserved; not used yet |

The database stores a row's code without `pg.`; the repository writes it with. `mzizi_manifest.features.codes.grammar.qualify` and `strip` are the only conversions; never add or remove the space by hand.

## Short names

Schemas and tables have fixed short names in `source/schema/seed/codes.json` (`reference` is `ref`, `geography` is `geo`, `legal` is `leg`, `official` is `ofc`, `governance` is `gov`, `politics` is `pol`, `civic` is `civ`, `finance` is `fin`, `source` is `src`, `filesystem` is `fil`, `auth` is `aut`, `audit` is `aud`; tables such as `countries` are `cty`, `values` are `val`, `schemes` are `sch`, `websites` are `wbs`). A short is unique within its level and never changes. A test fails when a generated table has no short.

## Database rows

```text
pg.<schema short>.<table short>.<identity path>      qualified (repository)
<schema short>.<table short>.<identity path>         stored (database)
```

- **Entity** (default): the identity path is a name path: `pg.ref.cty.ke`, `pg.ref.cty.northern-cyprus`.
- **Scheme** (`reference.schemes`): the path is `<schema short>.<concept>(.<concept>)*`, starting with the schema that owns the meaning: `geo.continent`, `geo.recognition.status`, `fin.currency`. Qualified: `pg.ref.sch.geo.continent`.
- **Member** (`reference.values`): the path is the scheme's path plus exactly one name: `geo.continent.north-america`, `geo.recognition.status.un-member-state`, `fin.currency.kes`. Qualified: `pg.ref.val.geo.continent.north-america`.
- A hierarchy that is part of identity (a row whose parent is part of its name) extends its parent's code by one segment. A hierarchy that is only classification lives in relations, not in the code: which subregion a country is in is its `subregion_code` link, so the code never changes.

## Seed files hold the short form

In a seed CSV (`data/<scope>/<domain>/<table>.csv`, or a folder named for the table holding `<label>.<table>.csv` parts) the file and the link column already say which table, so the `code` cell and every link cell hold the **identity path alone**: `ke`, `geo.continent.africa`. A seed row never carries `id` or the system columns (`version`, `created_at`, `updated_at`, `deleted_at`); the loader assigns them, deriving the id from the table and the code (`mzizi_manifest.features.seeds.ids.stable_id`). Links are written as the target's code (`continent_code`), never an id. Manifests, logs and the API use the full code.

## System things

| Thing | Code | Lives at |
|---|---|---|
| Source (website, API) | `pg.src.srs.<scope>.<name>` (a source is a row) | `seed/sources/srs/<scope>/<name>/manifest.yml` |
| Mapping | `sys.map.<schema short>.<table short>.<scope>.<name>`, named after the table it writes first | `seed/mappings/<schema short>/<table short>/<scope>/<name>.yml` |
| Term list | `sys.trm.<scope>.<domain>` | `seed/terms/<scope>/<domain>.yml` |
| Column dictionary | `sys.col.<scope>.<domain>` | `seed/columns/<scope>/<domain>.yml` |
| Job spec | `sys.eng.job.<scope>.<name>` | `seed/engine/job/<scope>/<name>.json` |
| Engine data | `sys.eng.<name path>`, for example `sys.eng.web.classification` | `seed/engine/web/classification.yaml` |

`<scope>` is `global` or a country code. For term lists it says where the meaning is true, not where a word was found (county, governor and president are `global`; a Kenya-only office is `ke`), and a language is never a scope: each term and alias carries a language code. A term list holds words, patterns and heading rules for one domain (people, address, money, procurement, ...) and never names a table; a column dictionary links database columns to those terms by list code and key. A manifest may use items of its own scope or `global`, never another country; `global` uses only `global`. A file's folder path mirrors its code without the first two segments. Expected table columns are not a manifest: they are the object form of a mapping's `inputs`.

## Checks

`uv run mzizi-manifest refs [folder]` checks manifest codes, kinds, scope, references, cycles and paths. `uv run mzizi-manifest data [folder]` checks every seed CSV: the grammar, the scheme and member rules, uniqueness, and that every code link resolves. Never invent a new space, short name, scheme shape or segment rule without asking the owner.
