---
id: DOC-7B194EF06A3C
name: Public and official participation domain schema proposal
type: documentation
tags: [improvements, schema-redesign, participation, consultation, planning]
extra: {status: planning_only, schema: new_proposed}
---

# Participation — public consultation, official input, feedback and responses

**PLANNING ONLY — this schema does not currently exist as an active MZIZI application schema. It is the user's proposal, not a database migration.**

## Why this must be a separate domain

The user explicitly requested a distinct `participation` schema for **government officials' participation, public participation, submitted feedback, consultation and related concerns**. This must be separate from operational `audit`, internal research `engine` reviews, ordinary `auth` role assignments, published source statements and domain-specific governance records.

A member of the public may comment on a law or budget; a government office may respond; an official may participate as a stakeholder, moderator, reviewer or respondent; an authenticated contributor may propose a correction to MZIZI. These are distinguishable actions with different legal and privacy requirements. Preserve authorship, applicable jurisdiction, issue, date, evidence, moderation and whether participation was officially submitted or merely displayed.

## No existing dedicated tables: consider only a small coherent model

| Candidate | Question it needs to answer | Alternative / consolidation |
|---|---|---|
| `consultations` | What formal consultation, hearing, survey or public call was opened, by whom, when and under which legal basis? | Could be a specialized activity but needs submission windows and procedural rules. |
| `submissions` | Who submitted which comment, petition, opinion or evidence, when and on what issue? | Prefer unified submission with kind/status rather than one table for every subtype. |
| `responses` | Which authority/official responded to a submission, accepted, rejected or explained action? | Could be linked reply table if response carries legal or decision state. |
| `participants` | Who can participate: public individual, organization representative, public official or anonymous participant? | Prefer FK associations to `person`, `auth` or `organization` with privacy-safe identity representations. |
| `attachments` or typed junctions | Which submitted documents/media support a submission or response? | Reuse `filesystem.versions` and typed FKs; no separate byte storage. |
| `moderation` or ``audit` events | Who moderated and why, with visibility/version changes? | Determine whether append-only audit evidence suffices; don't create duplicate moderation ledgers. |
| `topics`/`subjects` (optional) | Which `legal`, `governance`, `finance`, `procurement`, `activity` or `geography` record is being discussed? | Use typed link tables or constrained registry with enforced referential integrity. |

**These are candidate logical tables, not an approved SQL table list.** Avoid making one table per feedback type, or constructing a social network engine when simple public consultations suffice. The form of official participation may be a `consultations` type or distinct legally defined process; review before deciding.

## Required referential integrity and temporal context

FK consultation to responsible `governance.institutions`, jurisdiction/root geo unit and applicable `legal` rule if relevant; record public scope vs physical hearing venue and exact opening/closing times. FK submission and response to the consultation/topic, referenced person/account/org where appropriate, and official responder with a dated office/authority role. A public participant may be unauthenticated but still require spam prevention and privacy notices; do not fabricate a `person.individuals` identity for anonymous text. Publicly attributed official responses should link to a verified office/institution rather than a free-text badge.

Support discussions about county projects and laws without assuming the subject's geography equals the submitter's home/location. Distinguish **original submitted text** from a published redacted version and structured moderation outcome; preserve immutable evidence and correction trail when law/consent permits. Link file attachments to filesystem, but never store original sensitive documents as indiscriminately public.

## Acquisition classes, pattern behavior and activity integration

- **1A static curated:** official consultation frameworks, response categories and user-facing templates; not fabricated participant contributions.
- **1B pattern:** procedural consultation steps, required hearing schedules or response windows where legitimate local law/rules specify expectations.
- **2A automatically captured:** genuine user/official submissions, feedback, replies, and verifiable official consultation publications; submissions are user-generated, not "AI collected truth."
- **2B derived:** counts, participation rates, topics/aggregates and summarized themes, preserving source, quality, anonymity and limitations.

An expected consultation from a pattern does not imply it occurred; an submitted opinion does not become a verified public claim just because it is in MZIZI. `activity` can describe consultations as public events, but `participation` owns submissions and official reply/decision state.

## Example queries and decisions

Show consultations open for a Kenya county, with verified government sponsor and relevant law, then count public responses without exposing unnecessary personal identifiers. Show official response to a petition with attached reason and date. Trace a person's participation role without confusing their `auth` access with governmental office. Display anonymous feedback safely while retaining an operational moderation trail. Link a publicly submitted correction request to `engine` review without automatically mutating the canonical table.

**Open questions requiring user approval:**
1. Anonymous public submissions and identity verification requirements?
2. Public vs restricted original documents, personal contact privacy, export and moderation rules?
3. Whether all comments now in `audit.comments` move here, or only public-facing discussions (likely selective).
4. Consultation, hearing, petition, ballot/public survey, and formal government response distinctions?
5. Public feedback workflow into research candidate/quality review without turning opinion into fact?
6. Who controls participation permissions, official representative validity and legal submission deadlines?

Before adding DDL: review local public-participation laws/requirements and global neutrality; record schema/table/column comments, real cross-schema FKs, immutable history, source evidence, data classes, API contracts and independent pattern/migration checks.

**References:** [Master planning register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Activity](activity.md) · [Audit](audit.md) · [Auth](auth.md). **Status: discussed, not approved.**

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

**Domain-specific guidance:** Consultations may open/close on exact dates; submissions and responses have real submitted/replied times, not generic validity. Legal procedural deadlines can derive from the applicable pattern while actual public hearings have independent dates. Consider deletion of unpublished drafts; preserve published official responses, withdrawal/redaction and privacy-specific purge rules.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.

## 2026-11-11 — System-expansion alignment

Community participation and consent may be relevant to heritage and environmental knowledge; keep participation records distinct from canonical claims and audit decisions. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.
