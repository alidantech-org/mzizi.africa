---
id: DOC-56E9A1D42BC0
name: Activity schema redesign
type: documentation
tags: [improvements, schema-redesign, activity, events, news, planning]
extra: {status: planning_only}
---

# Activity — events, public actions, news and meaningful timelines

**PLANNING ONLY — the user requested `calendar` → `activity`, not the implementation of new tables today.**

## User direction and domain boundary

Rename `calendar` to `activity` and extend from calendar entries to government/public events, actions, news updates and links. Build explainable timelines across law, governance, finance, electoral activity, procurement and institutions. **Do not** confuse an event with a published source article reporting it; a published article with an actual appointment notice may support multiple actions, and one action may be evidenced by several publications.

`activity` is **not** a generic bucket for backend job executions (`engine`), source downloads (`source`), reviewer decisions (`audit`) or public feedback (`participation`). It should improve the public-facing historical narrative without replacing the authoritative domain records.

## Existing tables and target model candidates

| Current table / candidate | Proposed meaning |
|---|---|
| `calendar.events` → `activity.events` | Actual or expected occurrence; kind, time precision, jurisdiction, applicable geo, responsible participant, source and status. |
| `calendar.links` → `activity.links` | Typed links to a subject office/person/institution/law/contract/election; evaluate hard FK association design. |
| **Candidate** `activity.actions` | If distinct from events: formal decision/official act (appoint, approve, sign, enact) with actor/target/date/result. |
| **Candidate** `activity.updates` | Human-authored or curated news/public-update identity, headline/summary/publication timestamp and linked sources/events. |
| **Candidate** `activity.series` | Repeated/expected schedule templates if recurring activity requires its own identity and versions. |

Actual table columns, enum types, indexes, entity relations and `calendar` Dryv contracts must be read before adopting any rename. In particular, compare `occurred_at`/`start_at`/`end_at`/`valid_from`/`published_at` as semantic concepts rather than assuming existing fields are interchangeable.

## Integrity, geography, law and source provenance

Use explicit FK references to `geography.units` for the legally relevant geographic scope and `geography.places` for the venue/physical event location. National regulatory action may be Kenya-wide but announced in a Nairobi building. Link actor identities appropriately to `person` or `organization/governance`; do not infer one from the other. For variable targets, assess domain-specific typed association tables or rigorously constrained record registry rather than unenforceable generic `target_kind+target_id` strings.

Legal instruments and proceedings may be linked to activity, but an enacted law remains canonical in `legal`. A contract signature event links to `procurement.contracts`, but `procurement` owns the contract fields and price. News links to publisher/source page and versioned Markdown derivative while preserving its actual publication and retrieval dates.

**Temporal vocabulary:** scheduled, announced, occurred, recorded, published and amended dates are different, and each may be unknown, approximate or historically changed. Canceled scheduled activities must not be presented as completed occurrences.

## Acquisition categories and generation

- **1A seeded/static:** researched historical events and known formal official ceremonies.
- **1B seeded/pattern:** expected recurring deadlines/schedules, not proof a planned ceremony or report occurred.
- **2A automated/collected:** official announcements, gazettes, parliamentary proceedings, procurement awards, appointment notices and events identified from website Markdown.
- **2B derived:** timelines, frequency comparisons and news summaries based on verified inputs.

Store source Markdown/page hashes, capture version and extracted candidate mapping so a page update can reopen review of a past event rather than silently erase the record.

## Representative usage

For one county, show actual appointment and inauguration dates with people, offices and evidence. For a ministry, show enactment of legal mandate, official actions, procurement announcements and public activities separately. Show published news about a contract variation while contract figures remain in the procurement domain. Distinguish an expected legal deadline from a recorded submission.

## Migration plan to evaluate, not execute

1. Audit all event/link records, columns, enums, geo nulls, source attributions and API usages.
2. Compare rename-in-place vs new tables with compatibility views and ID-preserving backfills.
3. Decide actions/events/update structure and typed link FKs.
4. Generate Dryv and API changes only after approval, preserving existing calendar history.
5. Evaluate site Markdown pipeline mappings and public UI timeline queries before rollout.

## Unresolved decisions

1. `actions` as separate table versus subtype of `events`?
2. Original publisher news identity versus MZIZI-authored update identity?
3. How should dated source retraction/correction affect an event claim?
4. Event's multiple actors, legal sources and geographical roles: what must be explicitly FK-enforced?
5. What public moderation and review are necessary for activity notes or user-submitted corrections?

**Links:** [Schema index](README.md), [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md), [Site Markdown extraction](../site-structure-and-markdown-extraction.md).

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

**Domain-specific guidance:** Events require meaningful scheduled/occurred/cancelled times, not blanket valid_from/to. Historical imprecision may justify date-specific precision only where evidenced. News has publication time distinct from event time and fetch time. Activity links ordinarily do not need validity unless they independently start/end; public history is corrected, not trash-deleted.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
