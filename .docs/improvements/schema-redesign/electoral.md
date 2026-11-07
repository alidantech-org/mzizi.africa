---
id: DOC-4125ED9B7A63
name: Electoral domain schema redesign
type: documentation
tags: [improvements, schema-redesign, electoral, planning]
extra: {status: planning_only}
---

# Electoral — elections, electorates, candidates, vote results and referendums

**PLANNING ONLY — detailed design review required; not authorized to implement.**

## Confirmed boundary

`electoral` remains **separate from `political`**. The user wants comprehensive Kenya IEBC results, candidates, voters by geographic level, seats, party affiliation at contest time, official declarations and meaningful historical comparisons, while retaining worldwide applicability. A **registered voter count** is not the same as votes cast, counted valid votes, declared vote for a candidate, turnout rate or number of allocated seats. Distinguish nomination, contest, tally, declaration and certification.

## Current tables (11) and their responsibilities

| Current table | Review focus and possible improvement |
|---|---|
| `elections` | Elections/election rounds or by-elections, jurisdiction, organizer, law, dates and status. |
| `seats` | Contest/representative seat identity, valid period and geo unit represented, not a candidate identity. |
| `candidates` | Person contesting a seat, party affiliation/nomination at **that election**, withdrawal/disqualification status. |
| `results` | Official vote tallies, reporting unit, candidate/contest, declaration level, status and correction edition. |
| `electorates` | Registered/eligible voters, cast/valid/rejected/spoilt votes, source date/geo scope; introduced in later migration. |
| `referendum_questions` | Legally specified question linked to an electoral event. |
| `referendum_options` | Ordered, defined responses to a question with stable identity. |
| `referendum_results` | Official votes for each option at a geo reporting level and declaration version. |
| `seat_allocations` | Seat allocation results, party/election and applicable rule, not directly equivalent to voting totals. |
| `manifestos` | Dated party/candidate electoral platform with external source. |
| `commitments` | Individually traceable manifesto pledges and possible later associated activity. |

The current initial schema plus the `1794800000000-electoral-ballots.ts` migration must be compared with **all current TypeORM columns, Dryv contract types and deployed DB constraints**. For each table audit exact PK, FK, `election_id`, `seat_id`, `person_id`/`individual_id`, `party_id`, `geo_unit_id`, value fields, round, declaration status, valid dates, version and provenance. Those names are **semantic audit targets**, not assertions that every table has them.

## Proposal: hard links and defensible results

Use hard FK for election→jurisdiction/organizing institution, seat→geography/office/legal pattern, candidate→person and election/seat, candidate party→political party at nomination time, result→candidate/seat/election/geo and source version, referendum option→question, and constituency representation→correct historical geography. Add unique/functional constraints to avoid duplicates by (election, contest, reporting geography, round, choice/candidate, official edition).

National and county results are overlapping reported totals, **not independent additive records** when one already includes the other. The geography ancestor/descendant query model must avoid reporting double totals; a national total cannot automatically be disaggregated to counties. Country-root scope and report geography must remain separate from ballot-center venue and declaring institution HQ.

Legal procedure link should identify the electoral framework in force at the election time, including boundary changes, seat allocation rules and certification process. A claim of a winner requires declaration evidence, not just an AI-generated ranking.

## Four data categories and generation

- **1A:** election and seat definitions, official roles, known timelines and legally established electoral units.
- **1B:** seats/contests expected under a verified law or administrative pattern; never auto-generate candidates or votes.
- **2A:** IEBC and other election authority registered voters, nominations, official election results, reports and referenda.
- **2B:** turnout rates, shares, swings, comparisons and seat/party summaries, with explicit formula, denominators, vintage and geo consistency.

The `statistical` domain may reuse official electoral quantities as a dataset, but must not create competing canonical vote identities. Preserve official source snapshots and corrections.

## Query/acceptance examples

Which candidates actually ran for a county/constituency seat on election day? Show registered voters vs cast/valid votes at every official reporting level. Find a county total from certified results without mixing an earlier provisional edition. Show a voter's region aggregate historically despite boundary changes, without disclosing person-level voting behavior. Trace a seat winner→`governance.holders` only when independent office assumption evidence is available.

## Migration and decision risks

Reconcile results/states/aggregation and historical geo unit links; test registered voter denominators before computing turnout. Preserve source edition/correction history and candidacies that were later withdrawn. Enforce all known cross-domain FKs only after resolving orphans and duplicates; no destructive reset. Update Dryv/client contract changes carefully.

## Open questions

1. Should a referendum be an election subtype or a separate electoral event identity?
2. How are rounds, results statuses, recounts and official corrected declarations versioned?
3. Which precise reporting geo systems and date-aware boundaries apply?
4. How to model independently published voter registration datasets versus election-day turnout?
5. Where should campaign manifestos and commitment verification reside?
6. Which official releases can be auto-imported vs require review?

**Links:** [Schema index](README.md), [Master record](../mzizi-data-schema-storage-and-pipelines-redesign.md), [Geography](geography.md), [Statistics](statistical.md).

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

**Domain-specific guidance:** Elections have occurrence/round dates, candidates have nomination/withdrawal events, seats can derive structural applicability from electoral law/patterns, and results have official declaration/vintage history. Avoid generic validity/precision/is_current on every electoral row. Never soft-delete official historic election results; preserve corrected versions and evidence.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
