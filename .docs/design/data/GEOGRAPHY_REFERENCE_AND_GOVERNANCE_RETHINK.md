---
id: DOC-DESIGN-DATA-GEOGRAPHY-REFERENCE-GOVERNANCE-RETHINK
name: Geography, reference, countries and governance rethink (discussion proposal)
type: documentation
---

# Geography, reference, countries and governance: how they connect

**Status: discussion proposal. Nothing here is implemented or approved.** This is the first topic file of the wave "DB design and seed data rethink". It records what the Dryv contracts (`dryv/contracts/schemas/postgres`) and the live `mzizix` database contain today, where the connections are weak, and the choices the owner has to make. Generation and slots have their own topic file: [TEMPLATES_AND_SLOTS](TEMPLATES_AND_SLOTS.md).

**Update 2026-11-26:** the official unit table is implemented as `geography.areas` (own id, never-null feature, parent in the same hierarchy, guards in the database). Hierarchy membership left `geography.relationships`.

**Update 2026-11-25:** the owner accepted G1, G2 (with the unit's feature never null and parent membership only in the unit table), G3 and G5. Details and the remaining open points are in [DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125](../../decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md). G4, G6 and G7 were not answered.

## 1. The connections today

```
reference.countries
   └─< reference.hierarchies   (country_id, kind: administrative / electoral / traditional / statistical, is_routing)
          └─< reference.levels  (hierarchy_id, depth, kind)

geography.features            (the one identity of every place, natural or administrative)
   └─ geography.relationships (feature -> parent feature, with hierarchy_id and level_id, dated)

governance.institutions, positions, offices, holders        (the state as law creates it)
governance.patterns ─< templates (fan_out_level_id -> levels) ─< instances (unit_feature_id -> features)

legal.provisions ─< wordings ─< effects (wording_id, identity_id: any named thing)
```

A **unit** (a place at a level) is not a table. It is a feature with a dated `geography.relationships` row that carries the hierarchy and the level. To find "all wards" the database walks relationships whose `level_id` is the ward level.

### What Kenya looks like in the database

| Hierarchy | Levels | Features | Routing |
|---|---|---|---|
| `ref.hie.ke.electoral` | county (47), constituency (290), ward (1,450) | matches the Constitution and IEBC delimitation | yes |
| `ref.hie.ke.administrative` | county, sub-county (304 sub-county features) | | no |

A ward is a county, constituency and ward in the electoral hierarchy. The national administration (county commissioner, deputy county commissioner, assistant county commissioner, chief, assistant chief) follows a **different** statutory line: county, sub-county, division, location and sub-location. The research notes that the statute's "ward" for assistant county commissioners is the division, not the electoral ward. So Kenya needs at least three hierarchies, not one (decision G3).

## 2. Findings from the live database (2026-11-25)

| Finding | Number |
|---|---|
| `governance.patterns`, `templates`, `instances` | 0, 0, 0 |
| positions / offices / holders | 277 / 2,305 / 0 |
| positions with `provision_id`, `level_id`, `seat_level_id`, `seat_count`, `term_years`, `term_limit` | 0 of 277 for each |
| offices with a `legal.effects` row | 0 of 2,305 |
| `legal.effects` rows | 384 (none on offices) |

**Two scoping styles in the same table.** National posts use "one position, many place offices": `national-assembly.member-of-parliament` is 1 position with 302 offices, 290 of them tied to a constituency; `senate.senator` is 1 position with 51 offices, 47 tied to a county. County posts use "one position per county": 47 governor, 47 deputy governor and 47 member-of-county-assembly positions. The county then appears three times: in the institution, in the position code, and in the office's place. The advice and the reason are in [TEMPLATES_AND_SLOTS](TEMPLATES_AND_SLOTS.md) section 4 (A1).

## 3. Where country is needed

| Place | Is `country_id` needed? | Why |
|---|---|---|
| `reference.hierarchies` | yes, required | a hierarchy divides one country |
| `reference.levels` | no, derived | level to hierarchy to country |
| `governance.patterns` | optional | empty means "any country" |
| `governance.templates` | no, derived | through the pattern and the level |
| `geography.features` | no | a feature's country is found through its hierarchy links |
| `identity.names`, `official.entities` | optional | only where a name or registration is country-specific |

**Gap.** Nothing checks that a pattern's country matches its template's level's country. That should be a database rule (see section 5 of this file and section 11 of the templates file).

## 4. Legal links: the rule and the exceptions

Owner rule: no governance or similar table links directly to a legal provision. Law reaches them through a pattern or template (and `legal.effects`). Direct links stay only for specific things.

Columns that point directly at `legal.provisions` outside `legal` today:

| Table | Column |
|---|---|
| `governance.positions` | `provision_id` |
| `governance.relationships` | `provision_id` |
| `governance.functions` | `provision_id` |
| `governance.assignments` | `provision_id` |
| `governance.procedures` | `provision_id` |
| `governance.powers` | `provision_id` |
| `governance.obligations` | `provision_id` |
| `legislature` (one table) | `provision_id` |

**Advice.** The rule is sound. The cost is that these links move to the pattern's basis and the template. The risk is that `legal.effects` currently targets identities, and patterns and templates are not identities. Decision G5 below (same as D5 in the templates file).

## 5. Linking governance to places: raw features, or an official unit?

Today `instances.unit_feature_id`, `offices.feature_id` and `jurisdictions.feature_id` all point at a raw `geography.features` row. A feature can sit in several hierarchies, so "Kabwareng" does not say whether it is a ward in the electoral hierarchy or something else, nor what level, nor which county.

| | Option 1: keep features | Option 2: add an official unit table |
|---|---|---|
| Shape | feature plus a dated relationship row carries hierarchy and level | one row per place in one hierarchy at one level, with parent unit and period |
| Verifying "this office's place is a ward" | needs a join and a trigger | a composite foreign key on (unit, level) |
| Kenya example | Kabwareng the feature, then relationships to Aldai and Nandi | unit "Kabwareng, electoral ward, parent Aldai constituency, parent Nandi county" |
| Cost | none | one table; the parent link in `geography.relationships` moves or is duplicated |
| Risk | silent mismatch between level and place | two sources for the same parent link if not unified |

**Recommendation:** Option 2, with the unit table replacing the dated parent rows for hierarchy membership (other relationships such as `borders` stay in `geography.relationships`). This also gives patterns an official thing to fan out over, as the owner asked.

## 6. Questions and the recommendation for each

| # | Question | Recommendation |
|---|---|---|
| G1 | Position defined once per role, with place and institution on the office? | Yes (see D3 in the templates file) |
| G2 | Add an official unit table? | Yes, replacing hierarchy membership in `geography.relationships` |
| G3 | Which hierarchy do MCA ward seats follow? Should the national administration units be separate hierarchies? | Electoral for MCAs and MPs; a separate national-administration hierarchy for commissioners and chiefs |
| G4 | Enforce country agreement between pattern, level and hierarchy in the database? | Yes, check or trigger |
| G5 | Are patterns and templates identities, so effects can target them? | Yes, as identity kinds |
| G6 | Must every institution also have an `official.entities` row? | Yes, a foreign key from `institutions.id` to `entities.id` makes the shared identity checkable |
| G7 | Where do committees link to their house? | `governance.relationships` (institutions have no parent column); unverified, to be checked in the contracts |

## 7. What stays untouched until the owner agrees

No contract, seed or migration changes. The next step after this document is agreed is a decision record for each G choice under `.docs/decisions/`, then contract changes in `dryv/contracts`, regeneration, a database reset (`bun run db reset --yes`) and a seed rebuilt in the git-ignored `.dev/seed/`.
