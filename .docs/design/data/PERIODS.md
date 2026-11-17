---
id: DOC-PERIODS
name: Periods instead of validity windows
type: documentation
---

# Periods instead of validity windows

Decided with the owner on 18 November 2026. There is no general `valid_from`/`valid_until` window and no earliest/latest bounds. A table has a period only when its rows really change over time or when the period tells duplicates apart.

## The shared period

Defined in `dryv/contracts/schemas/_periods.ts`, spread into the period bases in `_base.ts` (`PeriodEntity`, `CodedPeriodEntity`, `CodedPeriodSubjectEntity`):

| Column | Meaning |
|---|---|
| `from_year` | First year, as an integer (negative for BCE). |
| `to_year` | Last year; empty means the period has not ended. |
| `from_to_precision` | One value for the pair: `exact`, `approximate`, `start-approximate`, `end-approximate` or `unknown`. |

The precision is a closed technical enum (`DatePrecision`), not a Reference scheme: the shared bases cannot import the Reference tables without a cycle, so a new value is a schema change. `to_year >= from_year` is a check where both exist.

## Exact dates

A table where the day matters adds dates named for it. When an exact date is given, its year is filled and the precision is `exact`; `mzizi-manifest data` rejects a seed row that breaks this.

| Table | Years | Exact dates |
|---|---|---|
| geography.features | yes | `established_on`, `ended_on` |
| geography.relationships | yes | `starts_on`, `ends_on` |
| geography.geometries, geography.classifications, politics.alignments | yes | none |
| governance.institutions | yes | `established_on`, `dissolved_on` |
| governance.offices | yes | `created_on`, `abolished_on` |
| governance.holders | yes | `took_office_on`, `left_office_on` |
| governance.mandates, official.relationships, source.domains, legal.wordings | yes | `starts_on`, `ends_on` |
| politics.parties | yes | `registered_on`, `deregistered_on` |
| politics.memberships | yes | `joined_on`, `left_on` |
| politics.coalitions | yes | `formed_on`, `dissolved_on` |
| legal.effects | yes | `effective_on`, `ended_on` |

## Removed

No period at all: geography, official and legal names (a former name is the `historical` name kind), official identifiers, contacts and branding, reference value labels, language names and value relations, governance relationships and authority scopes. Their natural keys no longer include a date.

## Seed conversion

`scripts/seed/migrate_periods.py` converted the seed CSVs. The old `*_earliest` bounds were judgment calls, not data, and were dropped (listed in `.dev/reports/period-bounds-dropped.txt`).
