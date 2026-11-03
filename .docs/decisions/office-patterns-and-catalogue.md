---
{id: DEC-OFFICE-PATTERNS,name: "Decision - office and unit patterns are versioned JSON, generated deterministically, idempotently and without deleting",type: decision,tags: [governance,patterns,offices,seeds,places,provenance]}
---

# Decision: office patterns and the governance catalogue

Date: 3 November 2026. Lane H3. Builds on `DEC-PLACES-AND-OFFICE-PATTERNS` and `DEC-JURISDICTION-WIDE-SCOPE`.

## Two sources, one rule

- **Catalogue** (`fixtures/seed/ke-governance-structure.json`, version 2): named bodies and the posts they have no matter where they are (ministries, state departments, state corporations and SAGAs, regulators, tribunals, funds, public universities, constitutional commissions and independent offices). Each institution has a required `scope` (`national` resolves to the root geography unit), optional `offices` (title, cardinality, appointing authority, selection, term, legal basis), `expectations` (a presence the body should have, with basis and no address), `knownUnknowns`, and top-level `facilities`. There is one catalogue; nothing parallel.
- **Patterns** (`fixtures/patterns/ke-office-patterns.json`): posts, units and expectations that exist for every geography unit at a level (county executive and assembly, ward MCA, constituency MP, county senator and woman representative, nominated seats, NG-CDF committee posts, and regional offices of the IEBC, TSC, NLC, ODPP, DCI, NG-CDF and the High Court).

Both files are registered as source documents of the publisher "Mzizi curated research" (kind curated seed, one document per file version, and one per pattern version, titled `Office pattern <id> version <n>`) and every row they create is attributed to the document with method curated and a locator. No record gained a `source` column.

## Identity

Codes are built from the pattern's template: counties use the First Schedule number (`ke/county/047/governor` is Nairobi), constituencies and wards use the geography unit path (`ke/constituency/nairobi/dagoretti/constituency-mp`, `ke/ward/nairobi/dagoretti/mca`), units hang under the parent body (`ke/electoral-commission/county/047`). `definition_code` is `<pattern id>:<definition>` and the post's scope is the geography unit. The same pattern and the same geography always give the same codes, so generation is idempotent.

## Cardinality

An office row is a post definition for a scope, and the legal cardinality is data: a `governance.rules` row of kind `other` records "Cardinality: min to max" with the appointing authority and legal basis, `term_length_years` and `max_terms` have their own rows, and the appointing method is a procedure. County executive: governor 1, deputy governor 1, county executive committee members 0 to 10 (Constitution art. 179(2)(b), County Governments Act s. 35), county secretary 1, chief officers unbounded. County assembly: speaker 1, clerk 1, six marginalised-group seats (art. 177(1)(c)), gender top-up seats unbounded (art. 177(1)(b)); one MCA per ward (art. 177(1)(a)). National: one MP per constituency, one woman representative and one senator per county, 12 nominated MPs, 16 + 2 + 2 nominated senators. Where the Constitution fixes a number it is recorded; where a statute fixes it and this lane could not confirm it (NG-CDF committee size, commission sizes beyond the art. 250 rule of 3 to 9), the number is left open and listed as a known unknown. Actual numbers in a county (for example how many executive members a governor appointed) are never derived from the rule.

## Versions and changes

A pattern has an integer `version`. Rerunning the same version writes nothing. A new version: rows it still justifies stay; a changed cardinality retires the old rule (`is_current = false`, `valid_to`) and writes the new one; a post, unit or expectation that an earlier version generated and this one no longer justifies is retired (`is_current = false`, `valid_to`), never deleted. Earlier attributions stay, so the history of which version produced what is preserved.

## Existing holders

Existing seat offices (named by person or slug before the pattern engine) are **adopted**, not duplicated: an office of the National Assembly or Senate scoped to a constituency or county, without a definition, gets the definition code and keeps its code and its holders. Two candidates for one unit is a reported conflict, not a guess. Nominated seats, which belong to no unit, are adopted by code prefix. Offices left without a scope (see `geography-model.md`) cannot be adopted and are reported with their holders.

## Totals

After generation the engine compares, per level, the law's number (47 counties, 290 constituencies, 1,450 wards), the number of units in geography and the number of generated posts, and reports mismatches. The geography data holds 1,452 wards; the law (IEBC delimitation of 2012) fixes 1,450, so the difference of two is reported rather than hidden.

## Boundaries

A pattern never produces coordinates, addresses, buildings or rooms (validation rejects extra fields); it produces posts, units and expectations only. Chiefs and assistant chiefs are not generated because administrative units below the ward are not modelled in geography.
