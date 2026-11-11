---
id: DOC-C08A7452EB19
name: Statistical domain schema redesign
type: documentation
tags: [improvements, schema-redesign, statistical, data, planning]
extra: {status: planning_only}
---

> **11 November 2026 precedence:** the connected foundation update at the end of this document supersedes conflicting jurisdiction, compatibility and cross-domain assumptions in the historical proposal below. Detailed table names remain design candidates; task 03 is prepared for design work, not a claim of completed implementation.

# Statistical — understandable but powerful measures, dimensions, periods and vintages

**PLANNING ONLY. The user's priority is clarity, understandability and **more statistical power**, not merely fewer tables.**

## User goal, current complexity and principles

Redesign `statistical` so an ordinary researcher and an API can explain exactly what a number means: which indicator and unit, measurement definition, reporting unit, geographical scope, period, source/publisher, population breakdown, release/vintage, uncertainty and method. Make KNBS, election statistics, government budgets and other African datasets comparable **only when definitions and time/geography actually align**.

Avoid two failures: (1) one giant generic row with ambiguous `value` and JSON dimensions; (2) dozens of obscure tables with overlapping names that cannot be queried without undocumented joins. The existing dimensions and observation derivation tables preserve important power and should not be discarded without analysis.

## Complete current table inventory (11)

| Existing table | Semantics to verify; potential improvement |
|---|---|
| `statistical.periods` | Canonical period identity, date precision, type and jurisdiction; compare with fiscal years. |
| `statistical.categories` | Indicator classification/taxonomy; clarify relation to `reference` schemes. |
| `statistical.indicators` | Measurable quantity definition, unit, aggregation/denominator and time methodology. |
| `statistical.fields` | Dataset column or table-specific field mapping; distinguish this from dimensions and values. |
| `statistical.datasets` | Source table/release/dataset description and publisher; entity name `statistics_table` can be confusing. |
| `statistical.observations` | Measured value by indicator, period, geography, vintage, breakdown and form of estimate. |
| `statistical.dimensions` | Breakdown definitions, e.g. sex, age group, place of residence, religion, employment category. |
| `statistical.dimension_members` | Hierarchical allowed member definitions, sourced codes, valid dates and scheme. |
| `statistical.observation_dimensions` | Exact FK junction between an observation and a dimension member; enforce compatible dimension. |
| `statistical.observation_derivations` | Formula/result dependency and upstream observation lineage. |
| `statistical.vintages` | Dated release, edition/supersession and historical published estimates. |

The initial migration does not contain the five later dimension/vintage tables; `1794300000000-statistics-dimensions.ts` creates them and extends observations. A full **current column-by-column** audit must extract entity metadata and live DDL, including numeric precision, `denominator_observation_id`, `denominator_value`, `margin_of_error`, `standard_error`, `measure_type`, `estimate_kind`, `release_label`, `vintage_id`, `geo_unit_id` and every FK. These are examples to verify, not an approved new layout.

## Candidate design: simple readable query contract

Conceptually: **What is measured** (`indicator`) × **where** (`geography`) × **when** (`period`) × **for which population/breakdown** (dimension members) × **which publication/edition** (`dataset/vintage`) → **observation** (`value, unit, estimate kind and uncertainty`).

Each term should have an unambiguous description. Make `datasets` a source/publication identity, `fields` the external table's actual columns, and `indicators` reusable semantic measures only when that matches the real data. A dimension member must belong to a known dimension and cannot freely mix arbitrary classification UUIDs. Preserve legal or public reporting jurisdiction as distinct from an observation's physical/geographic measurement unit.

## Real FKs, strong constraints and query integrity

Require `observations.indicator_id`→`indicators`, `period_id`→`periods`, `geo_unit_id`→`geography.units` where geographic, `dataset/table_id`→`datasets`, `vintage_id`→`vintages`, `denominator_observation_id`→`observations` where used, and the appropriate dimension junction FKs. Enforce one compatible member per dimension for each observation if the measurement definition requires it, and uniqueness by complete semantic key including release/edition.

Do not inherit country-wide numerical values to constituent counties; a nationwide **scope** can include counties without implying numerical disaggregation. Distinguish additive counts from percentages, proportions, means, indexes, projections and confidence intervals. A derived turnout rate must use the correct denominator and preserve the source version. Older source publications may be valid as earlier vintages, not simply outdated errors.

## Four data classes and generation methods

- **1A:** indicator definitions, dimension vocabularies, official period conventions, known source datasets.
- **1B:** expected series/county/year/dimension combinations, not manufactured numeric observations.
- **2A:** official KNBS/World Bank/IEBC/agency datasets from APIs, CSV, XLSX, reports and approved web sources.
- **2B:** computed ratios, trends, rollups, projections/standardizations with versioned formulas and compatible inputs.

Keep expected coverage separate from observed values. Re-evaluate stale derived outputs only when upstream values/formulas/geo definitions change, and preserve their versions and differences. Every table needs documented class eligibility and each row real lineage.

## SQL/API test cases before table compression

Find a county's census population for a named year and breakdown, distinguishing historical official census vs later projection vintage. Compare two county series from compatible definitions. Report expected indicator/geography/period cells missing values. Explain the calculation and source inputs for a derivative. Reconcile official county summations to a national total only where the statistical method and reporting sets justify it. Return valid zero as zero, and unknown/missing as missing—not the same.

## Column/migration risks and open decisions

Audit `fields` vs `datasets` and `categories` vs `reference.classifications` first. Review whether small explicit `units`/`methodologies` tables are justified, and which lookup values need a real schema-specific FK. Preserve datasets, releases, data methods, imported original values and derived results. Do not replace rich multidimensional relations with a blob of JSON merely to shorten schema.

**Unresolved:**

1. Distinguish data column, indicator, series and observation identity: keep existing table split or simplify?
2. Which units, denominator types and aggregation methods need enforceable lookup tables?
3. Date/period precision, source vintage, revisions and time-varying geographic boundaries?
4. Which dimensions are global versus jurisdiction-specific, and how are allowed members constrained?
5. Quality checks for impossible values, double counting, incomplete geographic series and incompatible methodology?
6. Which derived calculations can run in SQL procedures vs independent pipeline packages?
7. How should dashboards display missingness, uncertainty, revisions and confidence?

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Reference](reference.md) · [Geography](geography.md) · [Data classification](../data-categories-and-patterns.md).

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Observations already reference reporting periods and release vintages; generic validity windows and is_current may duplicate period/vintage/source editions. Dimension membership and indicator definitions need dates only if definitions genuinely change. Preserve all official revisions and derived-input lineage; soft-delete belongs to optional import drafts, not published observations.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.


## 2026-11-07 census/publication calendars and statistical freshness

**Planning only:** Distinguish a **census enumeration event**, planned release, actual publication of preliminary tables and later revised statistical vintages. `reference` can define jurisdiction/source-specific census/reporting schedules and release watch policies; `activity` can record announced and actual milestones. The published statistical figures, indicator meanings, observed geography, periods and release versions remain canonical in `statistical`, not duplicated into the event.

A verified official KNBS or equivalent provider release should trigger focused dataset/vintage/distribution refresh, provenance capture, dimensional validation and recomputation of affected derived measures. A predicted release date merely creates a due check; it must not generate made-up population figures. A newly downloaded file is not necessarily a new vintage or verified observation.

**Hotness granularity:** A historical census observation can be a cold fact but have an event-driven recheck if the publisher issues corrections. A rapidly updated projection series may be warm/hot by release policy. Field groups like measured value, classification/methodology, data release/vintage and source availability have different verification clocks; avoid per-observation copies of every monitoring timestamp or a meaningless `is_current` flag. Link verification history to canonical observation identity, vintage, field group and supporting source with enforceable relationships.

**Column semantics:** `statistical.periods.starts_on/ends_on` already expresses a reporting period. Do not add universal `valid_from/to/precision` to every observation. Distinguish `released_on`, `reported_period_id`, `verified_at`, `computed_at` as separate concepts only if their owning table/workflow needs them. Exact physical fields, aggregation rules and appropriate hotness thresholds remain **OPEN**.

## 2026-11-11 — Connected foundation direction (controlling for task 03)

The accepted model preserves shared observations/releases/units/time/provenance while requiring domain-specific meaning and typed relationships. Reject a design that stores values but cannot explain census population versus a revised estimate, a language-use survey or an approximate historical population estimate. Record who is counted, definition, method, reference period/date, spatial/boundary coverage, release/revision and uncertainty. Country context is not observation coverage.

Unknown boundary coverage remains explicit. No silent summation of overlapping areas/incompatible definitions, no national value copied to counties, no missing-as-zero. Language and community identities differ from distributions and territorial rights. An analytics capability describes supported filters, aggregation and presentation based on actual data; a topic label cannot authorize arbitrary calculations. Task 03 owns foundation contracts and these semantic test cases; task 04 owns the final statistical domain model. Future land/goods/prices/inflation/history work reuses place/time/evidence without being implemented here.

Read [the connected foundation](../connected-reference-geography-legal-foundation.md) for the decisions, candidate models, query examples, proof cases and primary research sources. Fresh construction in `mzizi_new` has no legacy database ID/data compatibility requirement; existing S3 evidence remains protected. This update records accepted direction and design deliverables, not final DDL or broad implementation authorization.

## 2026-11-11 — System-expansion alignment

Statistical owns published comparable series, indices and reproducible derivations. Raw Environment readings, Agriculture harvests, Economy prices, Finance transactions and Electoral results remain owned by their source domains. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.
