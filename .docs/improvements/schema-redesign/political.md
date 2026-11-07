---
id: DOC-5E71D4BA902F
name: Political domain schema redesign
type: documentation
tags: [improvements, schema-redesign, political, planning]
extra: {status: planning_only}
---

# Political — parties, party organizations, affiliations and internal leadership

**PLANNING ONLY. No table/schema change or Taskcode task is authorized.**

## User decision and conceptual boundary

Keep `political` **separate from `electoral`**. Political entities and ideological positions are not identical to elections, and real people remain anchored in `person`. Preserve neutral, globally applicable political classifications rather than encoding a single nation's party system. An individual can change political affiliations, stand as a candidate for one party at an earlier election, hold an internal party office, or hold a government office; those are different relationships and time intervals.

## Existing schema and table-level review

Current active tables, verified in the entity catalogue:

| Table | Existing responsibility; candidate treatment |
|---|---|
| `political.parties` | Canonical party identity; review registration status, aliases, legal jurisdiction, identifiers and historical continuity. **Retain concept.** |
| `political.memberships` | Person-to-party association over valid time; audit uniqueness, type of membership, evidence, uncertain affiliation and expiry. |
| `political.units` | Party internal geographic/organizational branches; distinguish units from `geography.units`. |
| `political.ideologies` | Named political theories/ideological concepts; review whether these belong in reference scheme or remain domain entities. |
| `political.alignments` | Existing party-ideology association; **do not confuse with alliances/coalitions** without examining its exact columns. |
| `political.positions` | Party posts/leadership position definitions, distinct from constitutional/government offices. |
| `political.holders` | People holding party positions with start/end/acting/verified status and historical evidence. |

**Column audit needed for each current table:** `id`/stable business identifiers, names, `jurisdiction_id`, `geo_unit_id` if any, `party_id`, `person_id`/`individual_id`, `position_id`, validity, record version, provenance links, and type identifiers. This is a **review checklist**, not a statement that each listed column exists on every table. Extract the full column/type/index/FK report from current entities and actual PostgreSQL before deciding rename or removal.

## Relationship plan: real foreign keys

Political memberships and holders should FK to `person.individuals`, with party/position FKs inside `political`. A party may reference a legal identity in `organization.entities` where that entity really exists; the party and organization must not be collapsed into one concept automatically. Jurisdiction is distinct from county branch territory and from election seat geography; links to `reference` and `geography` must reflect actual semantics. Where party units have multiple geographic scopes, evaluate an explicit typed junction with hard FKs. Link nomination/party at an election through `electoral` at the historical election date, not by copying today's membership onto an old result.

**Questions for SQL review:** What was the person's documented party at election time? Are two same-named parties in separate jurisdictions different identities? Which party unit represents county scope versus merely having an office physically in that county? Which party office did a person hold during a coalition period? What is the source of an asserted ideological alignment?

## Acquisition categories and patterns

- **1A static seeded:** carefully curated registered and historical parties, official identifiers and controlled party-post types.
- **1B pattern seeded:** expected party leadership positions or geographic party branches only when approved party structures establish them; an expected chapter is not proof it exists.
- **2A automated collected:** registrations, party leadership changes, official membership/affiliation announcements, electoral nominations, deregistration and alliances.
- **2B derived:** membership histories, leadership tenure, official party-linked vote summaries and neutral aggregate analysis.

Add acquisition eligibility to table comments/Markdown, with per-row lineage identifying actual acquisition. No pattern may invent human membership or affiliations.

## Redesign candidates, tradeoffs and migration

An explicit `coalitions`/`alliances` concept may be useful but only after auditing whether existing relationships represent dated coalitions reliably. Controlled `ideologies` may benefit from dedicated classes if relationships carry more than a label; otherwise simplify vocabulary tables. Prefer stable party IDs and dated name/status/affiliation history over rewriting past values. Enforce FKs to person/organization/jurisdiction and membership temporal constraints without deleting historic ties.

Preserve existing party and member identifiers, API contracts, source attributions and importer mappings during any later migration. Audit all old classification FKs, political-membership join uniqueness, and distinctions between party membership, elected office and governance appointment.

## Explicitly open user decisions

1. Optional vs required party→legal-organization FK.
2. Party alliances/coalitions: standalone table vs typed party relationship.
3. Historic disputed/provisional/dissolved registrations and their source requirements.
4. Party chapter scope and physical HQ/branch address ownership.
5. Whether ideology classification needs its own dedicated table.
6. Which fields are permitted to change automatically, with review and audit.

**Links:** [Schema redesign index](README.md) · [Master record](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Classification/patterns](../data-categories-and-patterns.md).

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

**Domain-specific guidance:** Political parties may have dated registration/dissolution events, but membership and internal position holding are independent dated relationships. Ideologies and party position definitions should not automatically carry validity/precision/is_current fields. Genuine mergers, splits, changes of affiliation and disputed histories need explicit lifecycle evidence rather than soft delete.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
