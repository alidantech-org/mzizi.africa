---
{id: TSK-2F91B305A16F,name: "Close the statistics gaps: the country figure, derived rankings and comparison",type: task,status: planned,priority: medium,created_at: 2026-11-19T09:53:17.234Z,updated_at: 2026-11-19T09:53:17.234Z,order: 6144}
---

# Close the statistics gaps: the country figure, derived rankings and comparison

## Goal

The home page compares saved places against the national figure ("94%, 12 points above the 82% national"), shows a "rankings leader" for civic delivery with a method link, a population series by census year, and glance cards with source links. The statistics tables already hold most of this, but two things are missing in the model: a defined way to find a country's own feature so the national figure can be read for any country, and a definition of a composite or derived ranking with its method, so "Top for civic delivery" is data with provenance and not a number typed into a screen.

## Context

Supported today (`dryv/contracts/schemas/postgres/statistics.ts`): `Indicators` (22-40) with `measureKindId`, `unitId`, `higherIsBetter` and `roleId`; `Observations` (43-85) per place, period, value and optional sex, age, residence, ethnicity and language, with `estimated` and a `sourceCitationId`; `Metrics` (88-118) with numerator and denominator indicators, `perFactor`, `defaultLevelKindId` and `isRankable`. Missing:

1. **Country to root feature.** `geography.features` carries no country column, because country is a relationship (geography.ts:37), and `geography.levels` (279-297) gives depth 0 only a feature kind. The Kenya seed encodes the root as feature code `ke` (`seed/data/ke/geo/features.csv`), a convention rather than a stored link. A screen cannot reliably get "the national figure" for an arbitrary country.
2. **Composite rankings.** `Metrics` rank a single indicator or one divided by another. There is no definition of an index made of weighted components, no normalisation method, and no place to record the method citation that the "method" link needs.
3. **Derived observations.** Nothing says an observation was computed from others (rankings, per-capita rates), by which definition, so a reader cannot tell a published figure from a derived one.

## Method options

For the root: (a) add an optional `rootFeatureId` to `geography.levels` for the depth-0 row; (b) add `rootFeatureId` to `reference.countries` (reverse dependency, rejected: Geography already imports reference); (c) keep convention. Recommended: (a), unique per country and hierarchy.

For composites: (a) `statistics.indicator_components` (`indicatorId`, `componentIndicatorId`, `weight`, `transformId`, direction) so a composite is an ordinary indicator whose observations are computed and stored with `derived` true; (b) a separate `rankings` table. Recommended: (a), the screens then read composites like any indicator and the method is a citation on the indicator. Add `derivation` description and method citation, and a `derivedFromMethodCitationId` or reuse `sourceCitationId` for the method document.

Alternatives for vintages (revised figures for one census): keep new observations with their own citation and period; do not add version fields (`.docs/rules/versioning.md`).

## Acceptance checklist

- [ ] Decide how a country resolves to its root feature, author the column or rule in `geography.ts`, and update `seed/data/ke/geo/levels.csv` only after owner approval.
- [ ] Author composite indicator components and the derived marker in `statistics.ts`, with a rule that component weights are positive and a cycle check on components (DRYV_GAPS gap 10).
- [ ] Define how a derived observation records its inputs' periods and the method citation, and how missing inputs yield "not available", never a zero.
- [ ] Confirm the saved-place comparison is one query pattern: a place observation, the root feature observation for the same indicator and period, and the difference with `higherIsBetter` deciding the colour class.
- [ ] Record that ranking order labels and plain names come from copy and metric codes, not from code.
- [ ] Owner review recorded; run `task validate`.
