---
id: DOC-DESIGN-DATA-TEMPLATES-AND-SLOTS
name: Patterns, templates and slots (discussion proposal)
type: documentation
---

# Patterns, templates and slots

**Status: discussion proposal. Nothing here is implemented or approved.** Today `governance.patterns`, `templates` and `instances` have 0 rows, and all 277 positions and 2,305 offices were seeded directly. This document records the owner's direction, explains how it would work with real Kenyan examples, gives advice, and lists the decisions the owner still has to make. Evidence comes from the research report `Kenya public body patterns` (kept in the git-ignored `.dev/research/reports/`); every number below carries the confidence that report gave it.

**Update 2026-11-26:** implemented for the Kenya thin slice (see the decision record's implementation notes). The official area table is `geography.areas`; confidence and reason are on the template only; generation is the database function `template.generate_pattern` called by the engine operation `template.generate`.

**Update 2026-11-25:** the owner answered most questions. Where this document and [DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125](../../decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md) differ, the decision wins. Main changes: only root rows keep the template reference (a column, not a generic link table; D4 is replaced); `governance.instances` retires; D1, D3, D5, D6, D7, D9 and D10 are accepted; D2 and D8 (separate `template` schema, closed transform list) were not answered; the audit of all schemas is in [SCHEMA_AUDIT_SLOTS_AND_ENUMS](SCHEMA_AUDIT_SLOTS_AND_ENUMS.md).

Related: [GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK](GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK.md) (levels, units and the legal-link rule), [FOUNDATION_REDESIGN](FOUNDATION_REDESIGN.md), [SUBJECT_REFERENCES](SUBJECT_REFERENCES.md).

## 1. Direction recorded from the owner

1. Templating and generation are a platform capability. They serve governance, official, source, legal, geography and more, so they get their own schema.
2. The database holds **slots**: rows that are expected to exist before the facts are known (a holder with no individual yet, a contact with no value, a website with no URL).
3. A slot is the **actual record**, with nullable fillable columns, not a separate staging row.
4. Every generated row links to the template that established it, and carries status, confidence and reason.
5. Rows do **not** record how they were filled. Templates may carry hints on how to fill. Recording how and from where a value was filled belongs to the `source` schema, which may need improvement.
6. The link from a row to its establishing template matters more than the act of generation, because that link is the "establishment logic".
7. Nearly every table should be audited for slot and pattern eligibility, with a reason (section 12).
8. Legal basis is never linked directly from governance tables. It reaches them through patterns, templates and legal effects. Direct links are allowed only where a thing is genuinely specific (a county's own law).

## 2. Vocabulary

| Word | Meaning | Kenyan example |
|---|---|---|
| Pattern | A reviewed bundle of templates for one family of bodies, optionally for one country | "Kenya county government" |
| Template | One thing the pattern produces: what, how many, how named and coded | "a Governor office per county" |
| Scope (fan-out) | The set the template repeats over | the 47 counties; the 1,450 wards; the 10 Article 248 commissions |
| Unit | One member of a scope, tied to a place or to a list | Nandi county; Kabwareng ward; IEBC |
| Slot | A generated row, with its status, confidence and reason | the Nandi Governor office, holder not yet known |
| Basis | Why the template exists: law, convention or general knowledge | Article 179 of the Constitution; the `{county}.go.ke` habit |

## 3. The chain: from country to a real office

```
country ─< hierarchy ─< level ─< unit (a place at that level) ─> pattern scope
                                                  │
 pattern ─< template ──fans out over scope──> slot ─> the real row (institution / position / office / holder / contact / domain)
   │            │
   │            └─ field templates (text, codes, domains, counts) with confidence
   └─ basis ──> legal effect / wording   (the only route to law)
```

What the live `mzizix` database already has for Kenya:

- `ref.hie.ke.electoral` (the routing hierarchy): county (47), constituency (290), ward (1,450). These counts match the Constitution and IEBC figures in the report.
- `ref.hie.ke.administrative`: county and sub-county (304 sub-county features).
- Offices tied to a place use a feature as their place today.

The country enters in two places only: the pattern (which country's rules it follows, empty for a global pattern) and the hierarchy (which country a hierarchy divides). Everything below derives from the level: level gives hierarchy, hierarchy gives country. A database check should reject a pattern whose country disagrees with its level's country (section 11).

## 4. Worked example A: a county government, step by step

**Pattern**: Kenya county government. Basis: Constitution Articles 176 to 182 (law, strong evidence). **Scope**: every unit at the electoral and administrative `county` level, which is 47.

| Template | Produces | Per county | Code (proposed) | Basis and evidence |
|---|---|---|---|---|
| T1 | institution, "County Government of {unit.name}" | 1 | `gov.ins.ke.{slug}.government` | Art 176: law |
| T2 | institution, "County Assembly of {unit.name}" | 1 | `gov.ins.ke.{slug}.assembly` | Art 176: law |
| T3 | position, Governor | one definition | `gov.pos.ke.governor` | Art 179: law |
| T4 | office of that position | 1 | `gov.ofs.ke.governor.{slug}` | Arts 179 to 180: law |
| T5 | position, Deputy Governor, and office | 1 | `gov.ofs.ke.deputy-governor.{slug}` | Art 180: law |
| T6 | office, County Secretary | 1 | `gov.ofs.ke.county-secretary.{slug}` | County Governments Act s.44: law, 2013 text read |
| T7 | offices, executive committee members | up to 10 | `gov.ofs.ke.cec.{slug}.{n}` | Art 179: law gives a **maximum** |
| T8 | institution, County Public Service Board, with chair and 3 to 5 members | 1 | `gov.ins.ke.{slug}.service-board` | CGA ss.57 to 58: law, 2013 text |
| T9 | holder slot for each office above | 1 each | `gov.hol.…` | holder with no individual: slot |

For **Kitui** this yields about 8 institution, office and board slots plus up to 10 executive seats, with every holder empty. The research found no holder names and no executive size for Kitui, so those stay as empty or low-confidence slots.

**Expected totals**: 47 governors, 47 deputy governors, 47 county secretaries, 47 boards. The research marks these as strong (law) for the skeleton and county-specific for counts.

### Advice A1: define the position once

Seed today has 47 separate Governor positions. The cleaner reading: **one position "Governor of a county government"**, defined by the pattern with its rules (five-year term, two-term limit, how holders are chosen), and **47 offices** that each carry their own institution and place. Reasons:

- The legal rule is stated once and attached once.
- A rule change (a term limit) is one row.
- "All governors" is a query on one position.
- The unit is already on the office, so the position need not encode it.

The cost: the position has no `institution_id` (it belongs to a class of institution, "county government"), or the schema adds an institution class to positions. This is decision D3.

## 5. Worked example B: wards and the Member of County Assembly

Kenya has 1,450 electoral wards. The pattern needs the **assembly of the ward's own county**, which is two hops away in the hierarchy.

| Step | What the template does |
|---|---|
| Scope | every unit at `ref.lev.ke.electoral.ward` (1,450) |
| Position | one definition: "Member of County Assembly", ward seat, `seat_level` = ward |
| Institution | the county assembly slot (T2) of the **ancestor county** of this ward |
| Office | `gov.ofs.ke.mca.{county}.{constituency}.{ward}`, place = the ward unit |
| Holder slot | one per office, individual empty |

Example: Kabwareng ward → parent constituency Aldai → parent county Nandi → institution "County Assembly of Nandi". The existing seed already has this office with this place; what is missing is the template and the rule that says the institution must be the ancestor county's assembly. A database check can enforce it (section 11).

**Nominated seats** are not place-bound. Gender top-up seats are computed after elections; the marginalised-group count has three competing versions (six per the 2013 Act text; four in the owner's brief, found in no source; a Senate bill with two youth and two minority). Advice: the template holds the count as a **parameter with its own confidence**, and generates **no** slots until the count is known. The gap becomes a visible "count unknown" row in the coverage report rather than an invented number.

## 6. Worked example C: a constituency

The research verified one constituency end to end (Kabondo Kasipul). A constituency pattern fans out over the 290 constituency units:

| Template | Produces | Evidence |
|---|---|---|
| Member of Parliament office | 1 per constituency | Art 97: law |
| NG-CDF committee (institution) | 1 per constituency | NG-CDF Act s.43: law |
| Fund Account Manager office | 1 per constituency | NG-CDF Act: law |
| NG-CDF website | `{constituency-slug-hyphenated}.ngcdf.go.ke` | observed in 3 constituencies; one uses an independent domain |
| NG-CDF email | `cdf{constituencyslug}@ngcdf.go.ke` | observed in 1; **keep confidence low** |

The women representative and the senator fan out over the 47 counties instead, but sit in the National Assembly and the Senate. Same template mechanics, different scope and different institution.

## 7. Worked example D: a commission, where the scope is a list not a place

Article 250 gives one shape to the Chapter 15 commissions: 3 to 9 members, one six-year term, an elected vice-chair, chair and vice-chair of different genders, and a Secretary who is the chief executive. The scope here is **a list of institutions** (the ten in Article 248), not geography.

| Slot | Count | Basis |
|---|---|---|
| Chairperson | 1 | Art 250: law |
| Vice-chairperson | 1, elected by members | Art 250: law |
| Commissioners | between 1 and 7 more (range, since 3 to 9 total) | Art 250: law gives a range |
| Secretary (CEO) | 1 | Art 250: law |

For **IEBC** the Act sets a specific size; the research marks the 9-member figure as general knowledge, not read. So the template gives the shape, and a per-commission parameter gives the count with its confidence. Bodies outside Article 248 (EACC, NCIC and others) use a similar shape by convention, not by Article 250, so they get a different pattern with a lower-confidence basis.

## 8. Worked example E: websites and emails as slots

The research tested all 47 counties on 2026-11-25. About 46 of 47 follow `{county}.go.ke` with spaces and hyphens removed (the 8 multi-word counties resolve only unhyphenated: `elgeyomarakwet.go.ke`, `uasingishu.go.ke`, and so on). Busia is the exception (`busiacounty.go.ke`). Five counties resolve in DNS but failed HTTP from the test machine, which does not prove they are down. Assemblies follow `{county}assembly.go.ke` in most sampled cases, but the tally in the research notes is internally inconsistent, so the rate is unverified.

| Slot | Candidate template | Starting confidence | Why |
|---|---|---|---|
| County website | `{compact(unit.name)}.go.ke` | high band for the apex name after a DNS check | observed rule, not a registry rule |
| County assembly website | `{compact(unit.name)}assembly.go.ke` | medium | most sampled, tally unreliable |
| County `info@` email | `info@{county website}` | medium | seen on most county homepages |
| Governor, clerk, communications email | no template | slot left empty | the research found none of these generated safely |
| Social handle | no template | slot left empty | handles vary widely (`KiambuCountyGov`, `countygovmks`) |
| Person emails | never generated | not a slot | privacy rule: only role or organisation addresses |

A generated candidate starts in the **lowest confidence band** and moves up only when DNS and HTTP checks pass, and only for that one slot.

## 9. Text and value templates (how words and columns are generated)

Templates generate more than rows: they generate **column values**. The proposal is a table of field templates, one per generated column:

| Column | Template text | Notes |
|---|---|---|
| name (English) | `County Government of {unit.name}` | names are rows in `identity.names`, so this is a **name template per language** |
| name (Swahili) | `Serikali ya Kaunti ya {unit.name}` | illustrative; needs a reviewed wording |
| code | `gov.ins.ke.{unit.slug}.government` | slug from the unit's address segment |
| website | `{compact(unit.name)}.go.ke` | candidate, low starting confidence |
| seat count | parameter, plus the kind: exact, minimum, maximum or range | Art 179 is a maximum of 10 |

**Advice B1: a closed list of named transforms.** Allow only a small fixed set (`slug`, `compact`, `upper`, `join`, `ancestor(level)`) implemented as database functions, not arbitrary code. Then the database itself can generate and verify the text, which you wanted, and the review stays simple.

**Advice B2: names stay language-aware.** A name template belongs to a language, because names are never stored in plain columns here. Do not put English text in a code or description column to avoid this.

**Advice B3: store the kind of count.** The Constitution gives a maximum (Art 179), a range (Art 250), a minimum (Art 164) and exact figures (Art 97). The template needs `count_kind`, `count_min` and `count_max`, and a rule on how many slots to generate (for example the minimum, or none until known).

## 10. Legal basis through the pattern, not the row

Today eight columns outside `legal` point straight at `legal.provisions`, while `legal.effects` already links wordings to any identity. Proposed rule: governance rows reach law only through a **basis** held on the pattern or template, which points at `legal.effects` (the reviewed assertion that a provision establishes a thing).

- "Article 179 establishes the county executive" is stated once on the pattern.
- Every generated office and holder inherits it through its template.
- Direct links stay only for one-off facts (a county's own Act).
- A template with no legal basis carries a basis term instead (convention or general knowledge) and a lower default confidence.

Open point: effects point at identities, and patterns and templates are not identities today. Either they become identity kinds, or effects gain a target column (decision D5).

## 11. How the database can verify generation

| Check | Mechanism |
|---|---|
| A slot's unit is at the template's level | composite foreign key from the slot to the unit table and the template's level |
| Pattern country equals the level's country | check or trigger across pattern, level, hierarchy |
| An MCA office's institution is the assembly of the ward's county | trigger or check using the hierarchy path |
| A verified slot has its required values filled | check tied to status (the slot status must be on the same row, or a trigger reads it) |
| One current slot per template and unit | unique index (already the shape of `instances`) |
| Counts stay within the template's count range | trigger that counts slots per template and parent |
| Filled data is never overwritten on regeneration | regeneration only inserts missing slots and retires others |

Dryv may not express triggers or cross-table checks yet. Anything it cannot express goes into `DRYV_GAPS.md` rather than into application code.

**Regeneration rules.** Codes are deterministic, so running generation twice changes nothing. A unit that stops existing (an abolished county) retires its slots by setting an end year, never deleting them. A filled value is never replaced by a template value.

## 12. First-pass audit: which tables could be slot or pattern eligible

Based on the Dryv contracts. Schemas I read closely: governance, official, identity, geography, legal, reference. Others are judged from table names and **still need a proper audit** (task item).

| Table | Slot or pattern? | Reason |
|---|---|---|
| `governance.institutions`, `positions`, `offices` | yes, pattern-produced | the owner's main case; county, assembly, ministry bodies repeat |
| `governance.holders` | yes, slot | needs `individual_id` to become nullable so a holder can exist empty |
| `governance.terms` | yes | numbered terms repeat per institution (13th Parliament) |
| `governance.assignments`, `powers`, `relationships` | yes, by template | structure from law repeats: "the President appoints a CS", "a committee is part of its house" |
| `governance.jurisdictions` | yes | territorial authority follows from unit and level |
| `official.contacts` | yes, slot | contact with empty value, kind from a template |
| `official.entities` | partly | regional bodies are not generated; institutions share an entity |
| `identity.names` | yes, by text template per language | generated names with reviewed wording |
| `identity.addresses` | yes | URL segment is derived from the slug |
| `identity.identifiers` | yes, slot | scheme known, value empty (an IEBC code) |
| `geography.features` and `relationships` | yes | expected wards, units and parent links before geometry exists |
| `source.domains`, `sources`, `paths` | yes | expected website per body, with confidence |
| `legal.instruments` | yes | each county is expected to have a Finance Act and standing orders |
| `election.contests` | yes, derived | one contest per office per election (1,450 ward contests) |
| `election.stations` | maybe | polling stations repeat per ward, but counts need IEBC data |
| `legislature.sittings`, `bills`, `votes` | no | facts, not structure |
| `finance.budgets`, `appropriations` | yes, slot | each county is expected to have a budget per year |
| `civic.facilities`, `services` | maybe | expected services per level (a ward has a health centre?) needs evidence |
| `statistics.indicators`, `observations` | yes, slot | expected indicator per unit and period, value empty |
| `event.calendars`, `occurrences`, `rules` | yes | recurring dates and rules are patterns by nature |
| `politics.parties`, `commitments` | no | facts |
| `media`, `community`, `auth`, `product`, `history`, `filesystem` | no, or per-table review | content and operations, not generated structure |

## 13. Proposed shape of the template schema (a sketch, not a contract)

| Table | Holds |
|---|---|
| `template.patterns` | code, title, country (optional), kind, default basis term and default confidence |
| `template.scopes` | what a template repeats over: a level of a hierarchy, a list of institutions, a country, a class of institution |
| `template.templates` | pattern, what it produces, scope, parent template, count kind and range |
| `template.fields` | one text or value template per generated column and per language, with the closed transform list |
| `template.bases` | template to legal effect (law), or to a basis term (convention, general knowledge) |
| `template.slots` | template, unit, the produced row's table and id, status, confidence, reason |
| views | coverage per pattern and country, and pending-slot lists that export to CSV with codes and fill hints |

`template.slots` replaces `governance.instances`, which has one nullable column per product type and only works inside governance. Because holders, contacts and domains are not identities, the slot points at its row with the subject-key pair already used in the repo (table and id), while keeping a typed foreign key for identity-backed rows. The exact mechanism is decision D4.

## 14. Risks and advice

1. **Do not generate numbers you do not know.** Seat counts that vary (nominated seats, executive size, location counts) must be parameters with confidence, or no slots.
2. **Keep generated guesses private.** A conventional email is a candidate until a check passes. Never show unverified slots as facts in the public API.
3. **Do not apply one commission template to everything.** Article 250 is law for the ten named commissions only.
4. **Keep the hierarchy honest.** The national administration's statutory units (county, sub-county, division, location, sub-location) are not the electoral wards. Using IEBC wards for chiefs or assistant county commissioners would be wrong.
5. **Count conflicts stay visible.** The research found conflicting figures (marginalised seats, NG-CDF committee size, chief counts, domain tallies). The template parameter should record its source and date, never overwrite one version with another.
6. **Start with a thin slice.** Kenya county government plus the ward MCAs exercises the full chain (country, hierarchy, level, unit, position, office, holder, text templates, domains) with 47 and 1,450 units that already exist.

## 15. Decisions for the owner

| # | Question | My recommendation |
|---|---|---|
| D1 | Is the slot the actual record (empty holder, empty contact)? | Yes, recorded. Needs nullable columns and a status check |
| D2 | Should templating be its own schema? | Yes (`template`), consumed by governance, official, source, legal, geography |
| D3 | Define positions once per role, with institution and place on the office, or one position per institution? | Once per role. Position gets an institution class, not one institution |
| D4 | How does a slot point at its row: identity foreign key, subject-key pair, or both? | Both: typed key for identity rows, subject pair for the rest |
| D5 | Are patterns and templates identities, or do effects gain a target column? | Make them identity kinds so names, codes and effects work unchanged |
| D6 | Is a dedicated official administrative unit table needed between levels and features? | Yes, one row per place in a hierarchy at a level, so a slot can be verified by composite key |
| D7 | Count kinds (exact, min, max, range) on templates, and what to generate for each | Generate exact counts and minimums only; ranges and maximums as parameters until known |
| D8 | Closed transform list for text templates, run as database functions | Yes, small fixed list |
| D9 | Should the national administration units be their own hierarchy? | Yes; chiefs and commissioners follow it, not electoral wards |
| D10 | First slice to build | Kenya county government plus ward MCAs |

## 16. Evidence quality

From the research report: skeleton facts (Articles 97, 152, 155, 176 to 182, 248, 250) read from the Constitution or a mirror copy, strong. County Governments Act and Urban Areas and Cities Act were read in older revisions; section numbers may have moved. Domain rules were tested once, from one machine, on 2026-11-25. Per-commission member counts, whips, committees, and the national administration's counts are general knowledge or conflicting, and appear here only as parameters or empty slots. The full contradictions table is in the report.
