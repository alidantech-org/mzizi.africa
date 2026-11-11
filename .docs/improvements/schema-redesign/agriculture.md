---
id: DOC-EXP-AGRICULTURE-20261111
name: Agriculture domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, agriculture]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Agriculture — farms, cultivation and harvests

> **Status: HYPOTHETICAL DOMAIN BRIEF.** This design is under investigation, not approved DDL. See the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

Agriculture records managed cultivation and production activity, helping users connect Geography and Nature, Economics and Production, Statistics, Environment and Civic infrastructure.

## 2. Domain ownership

Candidate ownership: farm/enterprise operating context where appropriate, fields/cultivated plots, crop cycles, managed livestock groups, agricultural practices and harvest events/quantities.

## 3. Exclusions

Biology owns taxon identities and wild biodiversity. Economy owns products, markets, prices and trade. Statistical owns published agricultural indicators. Geography owns spatial place/geometry. Organization owns legal business identity and ownership where applicable.

## 4. Existing schema and table inventory

No Agriculture schema appears in the active SQL tree or listed Dryv domain groups. `statistical` contracts and designs include agriculture-related indicators, not a dedicated farm/harvest database. The candidate schema is new and hypothetical.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `farms` | Managed agricultural operation identity, with owner/operator links and locality. |
| `fields` | Cultivated plot identity, spatial reference and land-use history. |
| `cultivations` | Crop/taxon, field, season/cycle and management method. |
| `herds` | Managed livestock group and purpose, not a wild population. |
| `practices` | Dated practice applied to a field/herd, such as irrigation or soil management. |
| `harvests` | Actual harvest occurrence, product/taxon, quantity, unit, date and source. |

Table admission depends on independently sourced workflows and useful queries; do not create both farm and enterprise identities without distinguishing them.

## 6. Primary and foreign-key relationships

Fields link to Geography representations/places; farms to Organization/person operators; cultivations to Biology taxa and fields; harvests to cultivation and unit definitions; product identity may link to Economy. Statistical aggregates reference harvest inputs through explicit derivation lineage.

## 7. Cross-domain relationships

Agriculture records actual harvest quantity once. Economy may relate an output to a product or sale/market price without repeating the harvest fact. Statistical may publish yield and production series as derived/comparable observations. Biology taxa are reused for crop/livestock identities.

## 8. Geographic responsibilities

Field/farm boundaries are sourced or derived spatial representations with accuracy and valid period. Do not infer land ownership from cultivation, or national/county aggregate from a single point. Historical farm/field changes need explicit lineage.

## 9. Temporal responsibilities

Planting, cultivation cycle, treatment, harvest and operation dates describe different agricultural facts. Season definitions vary by crop and region; avoid assuming one calendar. Preserve source and observation time separately.

## 10. Evidence and provenance

Record source artifact/version, farmer/survey/admin reporting method, collection date, units, quality controls, uncertainty, privacy/access class and correction history. Do not silently treat estimated production as observed harvest.

## 11. Acquisition categories

Static seed: crop/measure definitions. Pattern seed: only reviewed expected coverage. Collected: farm registers, surveys and records. Derived: yield, seasonal summaries and area totals with pinned methods and coverage. Actual row origin remains explicit.

## 12. Derived data

Agriculture owns operational harvest facts and may derive field/farm summaries. Statistical owns official comparable production/yield indicators. Economy owns market prices and exchange/trade. Conversions preserve original units and document conversion factors.

## 13. Example queries

- What crops were cultivated in this area during a season, and what is the evidence?
- Which harvest records contribute to a reported production estimate?
- How does irrigation infrastructure intersect fields without implying service delivery?

## 14. UI/API requirements

Support field/farm maps, cultivation calendars and harvest summaries with explicit privacy, unit, period, method and coverage. Do not publish household/farm locations without an approved policy.

## 15. Integrity constraints to investigate

Quantity-unit compatibility, crop/field/cycle FK consistency, overlapping use of a plot, season/hemisphere interpretation, livestock group changes, harvest totals and source-reported aggregate reconciliation.

## 16. Technical standards to evaluate

FAOSTAT definitions and methodology, FAO agricultural classifications, SDMX for official statistical exchange, OGC spatial formats. Standards and FAOSTAT series are references, not mandatory internal table layouts.

## 17. Open questions

Does farm identity belong here or Organization? How are customary/communal lands represented? Are livestock groups sufficiently stable? Should crop cycles be split by planting/harvest? Which personal/household data should be excluded or restricted?

## 18. Review and approval status

Hypothetical, not reviewed or approved. Reconcile with Biology, Economy, Statistical, Organization, Geography and privacy guidance before any schema proposal.
