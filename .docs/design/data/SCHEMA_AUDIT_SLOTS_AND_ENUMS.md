---
id: DOC-DESIGN-DATA-SCHEMA-AUDIT-SLOTS-AND-ENUMS
name: Schema audit - slot eligibility and enum versus term (findings)
type: documentation
---

# Schema audit: slots, enums and contract problems

**Update 2026-11-26:** the enum conversions and most slot-readiness fixes in sections 2 to 4 are implemented; what remains open is listed in the implementation notes of [DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125](../../decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md).

**Status: findings from a read-only audit on 2026-11-25; nothing here changes a contract.** The owner decisions that use it are in [DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125](../../decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md). Design context: [TEMPLATES_AND_SLOTS](TEMPLATES_AND_SLOTS.md). Full agent notes (with line references) are in the git-ignored `.dev/research/research_notes/Schema audit/`. Line numbers marked approximate there must be re-checked before authoring.

## 1. Slot eligibility

A slot is eligible only where a repeatable pattern says the row must exist before its details are known. Evidence rows are never slots.

| Schema | Eligible (slot candidates) | Never slots (evidence only) |
|---|---|---|
| governance, official, identity, geography, legal, reference | first-pass audit in [TEMPLATES_AND_SLOTS](TEMPLATES_AND_SLOTS.md) section 12 | |
| election | `elections`, `contests` (1 presidential, 47 governor, 47 senator, 47 woman rep, 290 constituency, about 1,450 ward per general election) | candidates, results, tallies, attachments |
| legislature | `sittings`, `stages`; bills only as facts | bills, votes, speeches, summaries, motions, agenda |
| legal | `instruments`, `editions` (nullable commencement), `effects` | provisions, wordings, references, relationships |
| event | `events`, `rules`, `occurrences`, `schedules`, `items`, `calendars` | |
| source | `domains`, `sources`, `editions`; `coverage` overlaps (decide) | discoveries, captures, derivations, citations, evidence, verifications, disputes |
| media | `assets`, `uses` (a flag with no bytes yet) | |
| filesystem, history | | mostly provenance and bytes |
| finance | `budgets` (one per county per fiscal year), `funds` (County Revenue Fund, NG-CDF), `appropriations`, `revisions` | debts, findings, flows |
| statistics | `collections` (a census per country), coarse expected observations | figures, breakdowns, observations values |
| economy | | prices, weights, compositions |
| product | `sites`, `releases`; `names`, `codes`, `messages` better as gap views | |
| civic | `services`, `facilities` (maybe, only where law requires one per level), `roles` (maybe) | projects, procurements, bids, contracts |
| community | none (user-generated, partitioned) | everything |
| politics | `manifestos` (maybe); party slots live in other schemas | commitments, fulfilments |

**Statistics and money values are never invented.** A template may create the row that says a value is expected; it must never fill `amount` or `value`.

## 2. NOT NULL columns and rules that block slots

| Where | Blocker |
|---|---|
| `event.occurrences` | `plannedStartsOn`, `statusTerm`, `knowledgeTerm` |
| `event.seasons` | `startMonth`, `endMonth` |
| `event.venues` | `featureId` |
| `source.domains` | `host` |
| `media.uses` | `assetId` |
| `media.assets` | rules `HeldAssetHasBytes`, `ExternalAssetHasUrl` |
| `election.forms` | `assetId` |
| `legal.effects` | `wordingId` |
| `election.elections` | `statusTerm` |
| `finance.revisions` | `statusTerm` |
| `finance.appropriations` | `classTerm` |
| `civic.roles` | `exactlyOne(holderId, identityId)` rule (needs "at most one") |
| `governance.holders` | `individualId` |
| status enums | need `expected` or `candidate` values (occurrence, domain, geometry, election) |

## 3. Enum versus term

Rule adopted: all five tests (same in every country, code branches on it, about a dozen values or fewer, a status or structural kind, editors never add values), otherwise a term. Terms are checked by `vocabulary.labels`; enums get their labels from `product` keys and messages.

**Core schemas:** 58 `term()` calls, 33 right and 25 wrong (every wrong one should be an enum); all 18 enums right (`AppointmentStep` doubtful).

| Convert to enum | Where |
|---|---|
| governance | `gov.instance.status` (moot if `instances` retires), `gov.arm`, `gov.institution.basis`, `gov.selection.method` (three tables), `gov.position.exposure`, `gov.holder.reason`, `gov.jurisdiction.kind`, `gov.assignment.share`, `gov.report.status`, `gov.pattern.kind` (duplicates `TemplateProduct`) |
| reference | `ref.language.kind`, `ref.text.direction`, `ref.hierarchy.kind` (soft call) |
| geography | `geo.geometry.role`, `geo.geometry.basis`, `geo.relationship.kind`, `geo.change.kind`, `geo.asset.kind` (soft call) |
| identity, official | `idn.name.kind`; `ofc.contact.kind`, `ofc.contact.visibility`, `ofc.relationship.status` |
| civic | facility, project, procurement, bid-outcome and contract statuses |
| community | `com.post.kind`, `com.case.decision`, `com.subscription.kind`, `com.notification.kind`, `com.reply.status` |
| politics | commitment, fulfilment and contribution statuses; `pol.fulfilment.kind` |
| election, legislature, legal | election, station, bill, motion, stage and instrument status |
| source, filesystem, media, event | `src.domain.status`, `src.dispute.status`, `fil.folder.role`, `med.subject.role`, `evt.rule.kind`, `evt.occurrence.status`, `evt.occurrence.format`, `evt.change.kind`, `evt.schedule.status` |
| finance, statistics | `fin.period.kind`, `fin.revision.status`, `fin.finding.status`, `sta.indicator.kind`, `sta.component.transform`; `fin.flow.kind` if its five values are fixed |

| Convert to term | |
|---|---|
| `legal.ProvisionKind` | legal structure varies by country |
| `economy.PriceKind` | growable; `modelled` duplicates `FigureBasis.modelled` |

Maybes: `com.consent.purpose`, `src.derivation.kind`, `src.locator`, `evt.rule.adjustment`, `civ.facility.ownership`. Overlaps to merge: `FormStatus`/`HansardStatus`; `FigureStatus`/`FigureBasis` (`estimated`, `projected`); `NameKind`/vocabulary `LabelKind`; `ReferenceRelation`/`leg.relationship.kind`; `geo.level.kind`/`IdentityKind.Level`. `Frequency` lacks weekly, daily and irregular.

## 4. Contract problems found

- **Direct law links:** `Motions.provisionId` and `instrumentId` (`legislature.ts:92-93`); `basisProvisionId` on events, changes and schedules.
- **Template link in the wrong place:** `source.domains.templateId` (`source.ts:91`); a domain is an effect of its institution.
- **Nullable unique keys** allow duplicates: `statistics.ts:152`, `product.ts:344`, `election.turnouts` (nullable `collectionId`), `politics.alignments`.
- **Missing uniqueness:** `statistics.figures`, `legal.provisions` (parent, designation, position), `product.lang` (release, position), `economy.prices`.
- **Missing rules:** period ordering on civic projects, facilities, services, politics coalitions and alignments, economy prices; `Tallies` result belongs to the same contest and place; `Motions` subject links need an at-most-one rule; `finance.flows` needs one anchor; `Relationships` (legal) needs a subject or wording; `status`/`basis` NOT NULL against nullable `value`/`amount`.
- **Bare ids without a foreign key:** `contenders.evidenceId`, `disputes.resolutionId`, `Summaries.speechId`, `Attachments.speechId`.
- **Misfit:** `Cases.state` reuses `PostState`; `filesystem.versions.provenance` is NOT NULL free text (rows do not record how they were filled; the source schema does); `Articles.authorId` accepts any identity kind; `finance.debts` borrower and lender have no kind restriction; fiscal-year mapping of `fromYear`/`toYear` to `startsOn`/`endsOn` is undefined; the `topic` scheme has no domain prefix; `legal.ts` writes enums as arrays while others use objects.
- **Closed subject list:** `SubjectTable` (`_subjects.ts:11`) blocks evidence on slots and contacts until the tables are added.
- **Geography details** (which geometry and feature columns are NOT NULL today) were not read in this audit and are still to be checked before the unit decision is authored.
