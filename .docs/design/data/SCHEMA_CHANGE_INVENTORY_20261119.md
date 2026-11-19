---
id: DOC-SCHEMA-CHANGE-INVENTORY-20261119
name: SCHEMA_CHANGE_INVENTORY_20261119
type: documentation
tags: [database, schema, dryv, inventory, review, proposal]
extra: {status: approved_2026-11-19_see_DEC-SCHEMA-CHANGE-INVENTORY-APPROVED-20261119, date: 2026-11-19, group: GRP-F3C7A28BEB50}
---

# Schema change inventory (for owner approval before any contract is edited)

**Status: approved by the owner on 19 November 2026 (DEC-SCHEMA-CHANGE-INVENTORY-APPROVED-20261119).** This is the complete list of new tables, changed columns, new vocabularies and generated-output consequences that tasks 002 to 015 would make. Task 001 applies it, and only the parts the owner approves. Design reasons are in [POWER_MONEY_PATTERNS_AND_SITES](POWER_MONEY_PATTERNS_AND_SITES.md). Citations are to `dryv/contracts/schemas/postgres/` unless stated.

## Rules this inventory follows

1. **Table names** ([database-naming](../../rules/database-naming.md), owner restatement 19 Nov 2026): plural, one word unless two are really needed, never repeating the schema. All 17 new tables below are one word. Existing two-word names are untouched.
2. **Foreign keys across schemas are required** for correct linkage (naming rule 7). New tables use real foreign keys. The only polymorphic "table plus id" references kept are the existing `subjectFields` pattern (`dryv/contracts/schemas/_subjects.ts`), used where a record genuinely may point at any table: media, contents, citations, replies, disputes, subscriptions. Where a closed set of targets exists, this inventory uses several nullable foreign keys with an exactly-one rule (as `official.relationships`, official.ts:140-172, already does), not a subject reference.
3. **Unstructured material lives in `filesystem`**: long text in `filesystem.contents`, videos, audio, social posts and documents in `filesystem.media` (kinds video and audio exist; platforms youtube, tiktok, facebook, instagram, x, vimeo exist, filesystem.ts:147-177), each attached to its subject record. No new table stores video links, post URLs, transcripts or long statements.
4. **Codes** follow `.docs/rules/codes.md` and `IdentityCode`; coded tables extend `baseSchemas.CodedEntity` or `CodedPeriodEntity`. No version fields are added (`.docs/rules/versioning.md`).
5. **Vocabularies are data** (reference schemes and values, owner-approved before seeding). Country names appear only in seed rows.

## A. New tables (17)

Types use the shared properties already in `_shared.ts`: Id, Name, Description, CalendarDate, Instant, Flag, PositiveInteger, NonNegativeInteger, Percentage, Number, AmountMinorUnits, Url, Code. `FK` means a real foreign key. "maybe" means nullable.

### reference (2) and the stub extended

**`reference.templates`**: one thing a pattern produces. `patternId` FK patterns; `code`; `produces` (closed enum: institution, position, office, domain, contact, event-rule); `fanOutLevelId` FK geography.levels maybe (one per unit of that level; empty means exactly one); `parentTemplateId` self maybe; `nameTemplate`; `codeTemplate`; typed attributes carried by the product, all maybe: `institutionKindId`, `armId`, `classId` (to values), `roleId`, `selectionMethodId`, `seatBasisId`, `seatCount`, `termYears`, `termLimit`; `sourceCitationId` maybe. Rule: attributes must match `produces`. Unique `(patternId, code)`.

**`reference.instances`**: the ledger of generated records. `templateId` FK; `unitFeatureId` FK geography.features maybe; exactly one of `institutionId` FK, `positionId` FK, `officeId` FK, `domainId` FK source.domains, `contactId` FK official.contacts; `statusId` (scheme `ref.evidence.status`); `generatedAt`; `verifiedCitationId` FK maybe. Unique `(templateId, unitFeatureId)`. This replaces the earlier subject-reference ledger idea so the links are real foreign keys.

### governance (7)

**`governance.positions`**: a kind of office with its seat rule. `code`; `institutionId` FK; `roleId` (gov.position.role); `selectionMethodId` (gov.selection.method); `jurisdictionLevelId` FK geography.levels maybe; `seatBasisId` (gov.seat.basis); `seatUnitLevelId` FK geography.levels maybe; `seatCount` maybe; `termYears` maybe; `termLimit` maybe; `exposureId` (gov.exposure.level, the "person with power" definition) maybe; `basisProvisionId` FK legal.provisions maybe; `displayOrder` maybe; `sourceCitationId` maybe; period fields. Rules: fixed basis requires `seatCount`; per-unit basis requires `seatUnitLevelId`.

**`governance.procedures`**: a named sequence of rights (appoint a judge, remove a governor, pass a bill). `code`; `countryId` FK; `kindId` (gov.procedure.kind); `basisProvisionId` FK maybe; `description`; `sourceCitationId` maybe; period fields.

**`governance.powers`**: one right held by one party over another. `holderPositionId` FK, `holderInstitutionId` FK (exactly one; the electorate is an institution); `targetPositionId` FK, `targetInstitutionId` FK (exactly one); `kindId` (gov.power.kind); `procedureId` FK maybe; `stepOrder` maybe; `thresholdId` (gov.power.threshold) maybe; `isBinding` Flag; `basisProvisionId` FK maybe; `sourceCitationId` maybe; period fields. Unique `(holder, target, kind, procedureId, stepOrder)`.

**`governance.functions`**: a public function a constitution or law assigns. `code`; `countryId` FK; `parentFunctionId` self maybe (acyclic); `topicId` FK reference.topics maybe; `basisProvisionId` FK maybe; `sourceCitationId` maybe; period fields. Names and the "if you need" wording are copy keyed by code.

**`governance.assignments`**: who is responsible for a function. `functionId` FK; `institutionId` FK maybe; `obligorKindId` (class of body, existing scheme `gov.obligor.kind`) maybe; `shareId` (gov.responsibility.share); `startPositionId` FK maybe; `startInstitutionId` FK maybe; `basisProvisionId` FK maybe; `sourceCitationId` maybe; period fields. Rule: at least one of `institutionId`, `obligorKindId`.

**`governance.promises`**: something a leader said they would do. `code`; `makerHolderId` FK, `makerIndividualId` FK (exactly one); `officeId` FK maybe (office held when said); `statement` (short words); `madeOn`; `placeFeatureId` FK maybe; `topicId` FK maybe; `quantity` maybe and `unitId` FK reference.units maybe; `dueOn` maybe; `occurrenceId` FK event.occurrences maybe; `sittingId` FK maybe; `speechId` FK maybe; `statusId` (gov.promise.status); `statusAsOf`; `sourceCitationId` maybe. **The recording, the long text, the social post and the news report are `filesystem.media` and `filesystem.contents` rows whose subject is the promise.**

**`governance.fulfilments`**: a recorded link from a promise to what delivered it. `promiseId` FK; one of `projectId` FK civic.projects, `contractId` FK civic.contracts, `appropriationId` FK finance.appropriations, `billId` FK governance.bills, `instrumentId` FK legal.instruments (at least one); `kindId` (gov.fulfilment.kind: stated by official source, matched on place and topic, proposed by a model); `evidenceStatusId` (ref.evidence.status); `sourceCitationId` maybe; `recordedOn`. Model-proposed rows stay proposed until reviewed.

### politics (1)

**`politics.contributions`**: money or goods given to a party or candidate. `code`; `donorEntityId` FK official.entities, `donorIndividualId` FK official.individuals (exactly one); `recipientPartyId` FK, `recipientCandidateId` FK (exactly one); `electionId` FK maybe; `amountMinorUnits`; `currencyId`; `isInKind` Flag; `givenOn`; `evidenceStatusId`; `disclosureFileVersionId` FK filesystem.file_versions maybe; `sourceCitationId` maybe.

### civic (3)

**`civic.partners`**: a party sharing a contract or bid. `contractId` FK or `bidId` FK (exactly one); `partnerEntityId` FK; `roleId` (civ.partner.role: lead, member, subcontractor, guarantor, supervisor); `sharePercentage` maybe; `sourceCitationId` maybe.

**`civic.variations`**: a change to a contract. `contractId` FK; `kindId` (civ.variation.kind: variation, extension, termination, renewal); `amountDeltaMinorUnits` maybe; `currencyId` maybe; `newEndOn` maybe; `signedOn` maybe; `reason` maybe; `sourceCitationId` maybe.

**`civic.officials`**: a person in the buying process. `procurementId` FK or `contractId` FK (at least one); `individualId` FK official.individuals; `roleId` (civ.official.role: accounting officer, committee chair, evaluator, approver, signatory); `officeId` FK governance.offices maybe; `actedOn` maybe; `sourceCitationId` maybe.

### statistics (1)

**`statistics.components`**: what a derived indicator is made of. `indicatorId` FK (the derived one); `componentIndicatorId` FK; `weight` Number (positive); `transformId` (sta.component.transform: as is, normalised, inverted); `position`. Unique `(indicatorId, componentIndicatorId)`; no cycles.

### source (2)

**`source.disputes`**: two or more sources disagree about a record. `subjectFields` (the contested record: a genuine any-table case); `kindId` (src.dispute.kind); `statusId` (src.dispute.status: open, resolved, both kept); `summary`; `resolvedOn` maybe; `resolutionCitationId` FK maybe.

**`source.contenders`**: one side of a dispute. `disputeId` FK; `citationId` FK; `claim` (text); `position`; `isPreferred` Flag.

### community (1)

**`community.replies`**: a right of reply or correction request. `subjectFields` (the record concerned); `respondentEntityId` FK, `respondentIndividualId` FK (exactly one); `contentId` FK filesystem.contents (the text); `statusId` (com.reply.status: received, identity verified, published, declined); `receivedAt`; `publishedAt` maybe.

## B. Changed tables

| Table | Change | Reason |
|---|---|---|
| `reference.patterns` | add `kindId` (gov.pattern.kind), `countryId` FK maybe, `description` | task 010 |
| `geography.levels` | add `rootFeatureId` FK geography.features maybe (depth-0 row) | resolves a country to its root feature, so national figures work for any country |
| `governance.institutions` | add `countryId` FK reference.countries; add `classId` (gov.institution.class) maybe | filter by country; sidebar groups |
| `governance.offices` | add `positionId` FK positions; add `seatOrdinal` maybe; **remove `officeKindId`** (role and selection method move to positions) | task 003 |
| `governance.holders` | add `nominatedByEntityId` FK maybe, `appointmentMotionId` FK governance.motions maybe; tag `appointmentKindId` with scheme gov.selection.method | exercised rights |
| `governance.relationships` | tag `relationshipKindId` with scheme `gov.relationship.kind` (part-of, answers-to, reports-to); rights move to `powers` | no untagged kinds |
| `governance.mandates`, `governance.authority_scopes` | tag `mandateKindId`, `authorityKindId` with schemes | no untagged kinds |
| `official.relationships` | tag `kindId` with `ofc.relationship.kind`; add `evidenceBasisId` (ref.evidence.basis), `evidenceStatusId` (ref.evidence.status), `confidence` Percentage maybe | graded ownership and kinship |
| `civic.procurements` | add `estimatedAmountMinorUnits` maybe, `currencyId` maybe, `bidderCount` maybe, `evaluationBasisId` (civ.evaluation.basis) maybe | award versus estimate, single-bidder rate |
| `civic.contracts` | add `buyerEntityId` FK maybe; rule: at least one of `procurementId`, `buyerEntityId` | direct awards |
| `finance.flows` | add `counterpartyIndividualId` FK maybe; rule: not both counterparties | payments to individuals |
| `statistics.indicators` | add `isDerived` Flag | marks computed indicators |
| `source.domains` | add `statusId` (src.domain.status), `entityId` FK official.entities maybe, `officialContactId` FK official.contacts maybe, `templateId` FK reference.templates maybe, `lastCheckedAt` maybe | candidate hosts and verification. **No `official.sites` table**: a website is an `official.contacts` row of kind website (owner decision) |
| `source.sources` | add `licenceId` (src.licence), `termsUrl` maybe | reuse terms per source |
| `filesystem.media` | add `startSecond`, `endSecond` NonNegativeInteger maybe, rule ordered | the moment in a recording a promise or speech sits at |
| `legal.effects` | add `subjectFields` as maybe (both or neither) | a Gazette notice names the record it creates or changes |
| `dryv/contracts/schemas/_subjects.ts` | the closed `SubjectTable` list gains the new tables that can be subjects (positions, powers, procedures, functions, promises, fulfilments, contributions, partners, variations, officials, disputes, replies, templates) by running `bun dryv/tools/sync-tables.ts` | media, contents, citations and subscriptions can attach to them |

Unchanged on purpose: `official.contacts` (website kind already exists), `source.coverage` (used for "no record found"), `community.subscriptions` and `notifications` (a leader, promise or place is a subject), `event` tables (a signatory or chief-guest role is a value, `guest-of-honour` already exists).

## C. New vocabularies (reference schemes; values need owner approval before seeding)

`ref.evidence.status` (expected, sourced, verified, not found, disputed); `ref.evidence.basis` (registry record, official declaration, court record, news report, inferred by matching); `gov.pattern.kind`; `gov.selection.method` (with display-class parents: elected, nominated, appointed, ex officio, plus customary); `gov.position.role`; `gov.seat.basis` (fixed, per unit, formula, variable); `gov.institution.class`; `gov.exposure.level`; `gov.procedure.kind`; `gov.power.kind`; `gov.power.threshold`; `gov.responsibility.share`; `gov.relationship.kind`; `gov.promise.status`; `gov.fulfilment.kind`; `ofc.relationship.kind` (family, business and political classes as parent values; kinship classes define "relative" and associate classes define "associate"); `civ.partner.role`; `civ.variation.kind`; `civ.official.role`; `civ.evaluation.basis`; `sta.component.transform`; `src.domain.status`; `src.licence`; `src.dispute.kind`; `src.dispute.status`; `com.reply.status`. Content categories `promise`, `speech-text` and `reply` join `fil.content.category`. Kenya-shaped values (`gov.arm.devolved-government`, `gov.term.kind.ward`, `gov.office.kind.*`) are superseded or generalised (task 002).

## D. Owner's added features and where they land

| Feature | Where |
|---|---|
| Completeness meter on every list | read model over `reference.instances` and per-position seat counts; no stored counts |
| One evidence-status vocabulary | `ref.evidence.status` on instances, official relationships, contributions, fulfilments |
| "As of this date" reading rule | no table: read contracts take an as-of date; rule recorded in `PERIODS.md` and enforced in the read contract design |
| Keep both sources when they disagree | `source.disputes` and `source.contenders` |
| Right of reply | `community.replies` with text in `filesystem.contents` |
| OCDS, BODS and Popolo mappings | `.docs/design/data/STANDARDS_MAPPING.md` (a document, no table) |
| Reuse terms per source | `source.sources.licenceId`, `termsUrl` |
| Meaning of "person with power" and "relative or associate" | `positions.exposureId` and `ofc.relationship.kind` class parents; legal basis through a citation on each value's source |

## E. What regenerating changes

`bun run dryv:database:generate` rewrites `source/backend/database/sql/schema.sql`, `migrations/0001_init.sql` and `.snapshot` (pre-release rebuild; Dryv cannot yet produce a change-aware migration, DRYV_GAPS gap 1), the Python row models under `source/backend/engine/src/mzizi_engine/api/schemas/postgres/`, `source/schema/database/*.schema.json`, and the SDK types under `source/sdk/`. Existing reads that use `governance.offices.office_kind_id` must be moved to positions: the NestJS insights reads, `source/apps/web/lib/site/insights.ts` and the dev seed script `scripts/dev/dev_seed/`. The working tree already holds uncommitted statistics changes in six of these files; they are kept.

## F. Table-name audit

New tables: templates, instances, positions, procedures, powers, functions, assignments, promises, fulfilments, contributions, partners, variations, officials, components, disputes, contenders, replies (17, none with an underscore). Each is plural, one word, does not repeat its schema, and is unique within its schema. **Open for owner choice:** `civic.officials` and `civic.partners` are generic words; alternatives are `civic.signatories` and `civic.consortia`.

## G. Applied on 19 November 2026 (task 001)

All 17 tables and the section B changes are authored in `dryv/contracts/schemas/postgres/`, generated, applied to the scratch database `mzizi_test` and proven with test rows and queries (`scripts/dev/model_proof/`). Differences from the text above, for the owner to confirm:

| Item | What was done and why |
|---|---|
| `governance.positions.titleId` (scheme `gov.position.title`) added | Moving readers off `offices.office_kind_id` showed positions had no display name; the old office kind carried "Governor". Labels in each language stay value labels. |
| `source.domains.sourceId` and `statusId` optional | A candidate host has no source yet; real seed domains have no status. |
| `official.relationships.confidence` uses `Confidence` (0 to 1) | The shared property already exists; the inventory said Percentage. |
| `legal.effects` unchanged | It was already a subject carrier, so it can name any record. |
| `reference.instances` uses five real foreign keys with an exactly-one rule | Replaces the subject-reference idea, per the foreign-key rule. |
| Schemes added to `schemes.csv` (29, no values) | Needed so seed files can reference them; values still await approval. |
| Dev seed (`scripts/dev/dev_seed`) | Builds a position per institution and title; offices point at positions; dev titles, roles, seat bases and selection methods are dev-only values. |

