/**
 * Schema: governance | Database: mzizi
 * Approved implementation scope: institutions, offices, holders, mandates, relationships, authority_scopes.
 * Country membership is expressed through Reference and geographic scope through Geography units.
 * SQL generation remains gated on pack support for CHECK semantics and composite/partial uniqueness.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features, Levels } from "./geography.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Language, Topic, Unit, Value } from "./reference.ts";
import { Occurrences } from "./event.ts";
import { Appropriations, BudgetVersions, FiscalPeriods } from "./finance.ts";
import { Contracts, Projects } from "./civic.ts";
import { Instruments, Provisions } from "./legal.ts";
import { Artifacts, Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const governance = dryv
  .group({ name: "governance" })
  .description("Public institutions, offices, mandates, office holders and dated authority scopes.")
  .facets({ storage: { namespace: "governance", store: "main" } });
/*---------------- governance.institutions ----------------*/
export const Institutions = governance
  .schema("Institutions", {
    entityId: belongsTo(() => Entities),
    /** The country this institution belongs to (a body of one state, never inferred from its name). */
    countryId: belongsTo(() => Country),
    institutionKindId: belongsTo(() => Value),
    /** Scheme gov.institution.class: constitutional commission, service commission, regulator, security service, court, house of legislature, and so on. */
    classId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.institution.class"),
    /** Scheme gov.arm: the arm of government or kind of body this belongs to (executive, legislature, judiciary, ...). */
    armId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.arm"),
    /** Scheme gov.establishment.basis: what created it (the Constitution, an Act, an executive order, a county law). */
    establishmentBasisId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.establishment.basis"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    establishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    dissolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("InstitutionsDatesAreOrdered", rule.ordered("establishedOn", "dissolvedOn", { allowEqual: true }))
  .description("One government institution specialization of an Official entity.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("institutions")
      .index("entityId")
      .index("countryId")
      .index("classId")
      .index("armId")
      .index("sourceCitationId"),
  });

/*---------------- governance.offices ----------------*/
export const Offices = governance
  .schema("Offices", {
    /** The kind of position this seat belongs to; role, selection method and seat rule live there. */
    positionId: belongsTo(() => Positions),
    institutionId: belongsTo(() => Institutions),
    unitFeatureId: belongsTo(() => Features).maybe(),
    /** The number of the seat among the position's seats that belong to no unit (nominated or special seats). */
    seatOrdinal: dryv.field(sharedProperties.PositiveInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    createdOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    abolishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("OfficesDatesAreOrdered", rule.ordered("createdOn", "abolishedOn", { allowEqual: true }))
  .description(
    "One established public office, independent of any current holder and optionally scoped to a geographic unit.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("offices")
      .index("positionId")
      .index("institutionId")
      .index("unitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- governance.holders ----------------*/
export const Holders = governance
  .schema("Holders", {
    officeId: belongsTo(() => Offices),
    individualId: belongsTo(() => Individuals),
    /** Scheme gov.selection.method: how this person actually came to hold the seat. */
    appointmentKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.selection.method"),
    appointedByEntityId: belongsTo(() => Entities).maybe(),
    /** The body that nominated this person, when the procedure has a nomination step. */
    nominatedByEntityId: belongsTo(() => Entities).maybe(),
    /** The motion (and so the vote) that approved the appointment. */
    appointmentMotionId: belongsTo(() => Motions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    tookOfficeOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    leftOfficeOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("HoldersDatesAreOrdered", rule.ordered("tookOfficeOn", "leftOfficeOn", { allowEqual: true }))
  .description("One person's continuous tenure in one office, with appointment kind and effective dates.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("holders")
      .index("officeId", "fromYear", "toYear")
      .index("individualId")
      .index("nominatedByEntityId")
      .index("appointmentMotionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.mandates ----------------*/
export const Mandates = governance
  .schema("Mandates", {
    institutionId: belongsTo(() => Institutions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    mandateKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.mandate.kind"),
    description: dryv.field(sharedProperties.Description),
    /** The term a mandate belongs to, when it runs with one. */
    termId: belongsTo(() => Terms).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.PeriodEntity)
  .rule("MandatesDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("One responsibility or authority assignment for an institution or office.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("mandates")
      .unique("institutionId", "officeId", "mandateKindId", "description")
      .index("institutionId")
      .index("officeId")
      .index("sourceCitationId"),
  });

/*---------------- governance.relationships ----------------*/
export const Relationships = governance
  .schema("Relationships", {
    subjectInstitutionId: belongsTo(() => Institutions),
    objectInstitutionId: belongsTo(() => Institutions),
    /** Scheme gov.relationship.kind: part of, answers to, reports to. Rights over appointments live in governance.powers. */
    relationshipKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.relationship.kind"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One dated, typed relationship between two government institutions.")
  .role("entity")
  .rule("RelationshipIsNotSelfReferential", rule.differs("subjectInstitutionId", "objectInstitutionId"))
  .facets({
    storage: dryv
      .storage("relationships")
      .unique("subjectInstitutionId", "objectInstitutionId", "relationshipKindId")
      .index("subjectInstitutionId", "relationshipKindId")
      .index("objectInstitutionId", "relationshipKindId")
      .index("sourceCitationId"),
  });

/*---------------- governance.authority_scopes ----------------*/
export const AuthorityScopes = governance
  .schema("AuthorityScopes", {
    institutionId: belongsTo(() => Institutions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    unitFeatureId: belongsTo(() => Features),
    authorityKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.authority.kind"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One institution or office authority over a required Geography unit for an effective period.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("authority_scopes")
      .unique("institutionId", "officeId", "authorityKindId", "unitFeatureId")
      .index("institutionId")
      .index("officeId")
      .index("unitFeatureId")
      .index("countryId")
      .index("sourceCitationId"),
  });

/*---------------- governance.obligations ----------------*/
export const Obligations = governance
  .schema("Obligations", {
    countryId: belongsTo(() => Country),
    /** Scheme gov.obligation.kind: publish a procurement plan, publish award notices, publish a budget, report quarterly spending, respond to an audit query, publish results, deliver a contract report. */
    obligationKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.obligation.kind"),
    /** The one body that owes it, when it is one body; otherwise the kind of body below. */
    obligorInstitutionId: belongsTo(() => Institutions).maybe(),
    /** The kind of body that owes it (every county government, every procuring entity); scheme gov.obligor.kind. */
    obligorKindId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.obligor.kind"),
    /** Whom it is owed to (a regulator, the public, a legislature). */
    recipientEntityId: belongsTo(() => Entities).maybe(),
    /** Scheme gov.obligation.frequency: once, per event, monthly, quarterly, annual. */
    frequencyId: belongsTo(() => Value).tags("scheme:ref.sch.gov.obligation.frequency"),
    /** The legal provision that creates the duty. */
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    description: dryv.field(sharedProperties.Description),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("OneObligorForm", rule.atLeastOne("obligorInstitutionId", "obligorKindId"))
  .description(
    "A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("obligations")
      .index("countryId")
      .index("obligationKindId")
      .index("obligorInstitutionId")
      .index("obligorKindId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.reports ----------------*/
export const Reports = governance
  .schema("Reports", {
    obligationId: belongsTo(() => Obligations),
    /** The body that was expected to report or that did. */
    reporterEntityId: belongsTo(() => Entities),
    periodFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    periodUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    dueOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    filedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Scheme gov.report.status: due, on time, late, missing, found elsewhere, not applicable. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.gov.report.status"),
    /** The filed document, when found. */
    artifactId: belongsTo(() => Artifacts).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ReportPeriodIsOrdered", rule.ordered("periodFrom", "periodUntil", { allowEqual: true }))
  .description(
    "One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("reports")
      .index("obligationId", "periodFrom")
      .index("reporterEntityId")
      .index("statusId")
      .index("artifactId")
      .index("sourceCitationId"),
  });

/*---------------- governance.terms ----------------*/
export const Terms = governance
  .schema("Terms", {
    countryId: belongsTo(() => Country),
    /** Scheme gov.term.kind: presidential, parliamentary, county assembly, ward, and other bodies' terms. */
    termKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.term.kind"),
    /** The body whose term it is (a house of parliament, a county assembly). */
    institutionId: belongsTo(() => Institutions).maybe(),
    /** The place the term is for, when it is not the whole country. */
    unitFeatureId: belongsTo(() => Features).maybe(),
    /** The number of the term (the 13th Parliament). */
    ordinal: dryv.field(sharedProperties.PositiveInteger).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TermDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description(
    "A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("terms")
      .index("countryId", "startsOn")
      .index("termKindId")
      .index("institutionId")
      .index("unitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- governance.sittings ----------------*/
export const Sittings = governance
  .schema("Sittings", {
    institutionId: belongsTo(() => Institutions),
    /** The dated meeting: its actual date, time, venue and any reschedule or adjournment live in the occurrence. */
    occurrenceId: belongsTo(() => Occurrences),
    /** Scheme gov.sitting.kind: plenary, committee, cabinet meeting, bench, county assembly sitting, joint sitting. */
    sittingKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.sitting.kind"),
    termId: belongsTo(() => Terms).maybe(),
    /** The session within the term ("Fifth Session"). */
    sessionLabel: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    /** The running number of the sitting in the session. */
    sequenceNumber: dryv.field(sharedProperties.PositiveInteger).maybe(),
    title: dryv.field(sharedProperties.Name),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("sittings")
      .unique("occurrenceId")
      .index("institutionId")
      .index("sittingKindId")
      .index("termId")
      .index("sourceCitationId"),
  });

/*---------------- governance.bills ----------------*/
export const Bills = governance
  .schema("Bills", {
    countryId: belongsTo(() => Country),
    /** The house or body where it was introduced. */
    institutionId: belongsTo(() => Institutions),
    /** Scheme gov.bill.kind: public, private member's, money, constitutional amendment, county, treaty. */
    billKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.bill.kind"),
    /** Scheme gov.bill.status: drafted, introduced, in committee, passed, assented, gazetted, in force, withdrawn, lapsed, rejected. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.gov.bill.status"),
    title: dryv.field(sharedProperties.Name),
    summary: dryv.field(sharedProperties.Description).maybe(),
    sponsorHolderId: belongsTo(() => Holders).maybe(),
    termId: belongsTo(() => Terms).maybe(),
    /** The law this bill became, when enacted. */
    instrumentId: belongsTo(() => Instruments).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("bills")
      .index("countryId")
      .index("institutionId")
      .index("billKindId")
      .index("statusId")
      .index("sponsorHolderId")
      .index("termId")
      .index("instrumentId")
      .index("sourceCitationId"),
  });

/*---------------- governance.motions ----------------*/
export const Motions = governance
  .schema("Motions", {
    sittingId: belongsTo(() => Sittings),
    /** Scheme gov.motion.kind: motion, budget estimate, appointment, resolution, report, judgment, executive decision, amendment. */
    motionKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.motion.kind"),
    /** Scheme gov.motion.outcome: passed, rejected, withdrawn, deferred, pending. */
    outcomeId: belongsTo(() => Value).tags("scheme:ref.sch.gov.motion.outcome"),
    title: dryv.field(sharedProperties.Name),
    summary: dryv.field(sharedProperties.Description).maybe(),
    movedByHolderId: belongsTo(() => Holders).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    provisionId: belongsTo(() => Provisions).maybe(),
    budgetVersionId: belongsTo(() => BudgetVersions).maybe(),
    fiscalPeriodId: belongsTo(() => FiscalPeriods).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("motions")
      .index("sittingId")
      .index("motionKindId")
      .index("outcomeId")
      .index("movedByHolderId")
      .index("billId")
      .index("instrumentId")
      .index("provisionId")
      .index("budgetVersionId")
      .index("fiscalPeriodId")
      .index("sourceCitationId"),
  });

/*---------------- governance.stages ----------------*/
export const Stages = governance
  .schema("Stages", {
    billId: belongsTo(() => Bills),
    /** Scheme gov.stage.kind: first reading, committee, public participation, second reading, third reading, other house, mediation, assent, publication, commencement. */
    stageKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.stage.kind"),
    /** The sitting where the stage happened; absent for assent, publication and commencement. */
    sittingId: belongsTo(() => Sittings).maybe(),
    /** The motion that carried it, when there was a vote. */
    motionId: belongsTo(() => Motions).maybe(),
    /** The date for a stage outside a sitting (the date of assent, of the gazette notice). */
    onDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    outcomeId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.motion.outcome"),
    sequenceNumber: dryv.field(sharedProperties.PositiveInteger),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("StageHasSittingOrDate", rule.atLeastOne("sittingId", "onDate"))
  .description(
    "One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("stages")
      .unique("billId", "sequenceNumber")
      .index("stageKindId")
      .index("sittingId")
      .index("motionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.votes ----------------*/
export const Votes = governance
  .schema("Votes", {
    motionId: belongsTo(() => Motions),
    holderId: belongsTo(() => Holders),
    /** Scheme gov.vote.position: yes, no, abstain, absent. */
    positionId: belongsTo(() => Value).tags("scheme:ref.sch.gov.vote.position"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One office holder's recorded position on one motion (a division), including being absent.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("votes")
      .unique("motionId", "holderId")
      .index("holderId")
      .index("positionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.hansards ----------------*/
export const Hansards = governance
  .schema("Hansards", {
    sittingId: belongsTo(() => Sittings),
    /** The published official report: the stored document of the verbatim record. */
    artifactId: belongsTo(() => Artifacts),
    languageId: belongsTo(() => Language),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Volume, part or page range as printed ("Vol. 12, pp. 1-48"). */
    reference: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    /** True for a draft or unrevised report, false for the corrected official one. */
    isProvisional: dryv.field(sharedProperties.Flag),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("hansards").index("sittingId").index("artifactId").index("languageId").index("sourceCitationId"),
  });

/*---------------- governance.speeches ----------------*/
export const Speeches = governance
  .schema("Speeches", {
    sittingId: belongsTo(() => Sittings),
    holderId: belongsTo(() => Holders),
    motionId: belongsTo(() => Motions).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    hansardId: belongsTo(() => Hansards).maybe(),
    /** Scheme gov.speech.kind: speech, question, answer, statement, petition, point of order, ruling. */
    speechKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.speech.kind"),
    /** Order within the sitting. */
    position: dryv.field(sharedProperties.PositiveInteger),
    /** The page or column the speech starts on in the printed record. */
    pageReference: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    summary: dryv.field(sharedProperties.Description).maybe(),
    wordCount: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("speeches")
      .unique("sittingId", "position")
      .index("holderId")
      .index("motionId")
      .index("billId")
      .index("hansardId")
      .index("sourceCitationId"),
  });

/*---------------- governance.agenda ----------------*/
export const Agenda = governance
  .schema("Agenda", {
    sittingId: belongsTo(() => Sittings),
    position: dryv.field(sharedProperties.PositiveInteger),
    /** Scheme gov.agenda.kind: prayers, communication from the chair, petitions, questions, statements, bills, motions, adjournment. */
    agendaKindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.agenda.kind"),
    title: dryv.field(sharedProperties.Name),
    motionId: belongsTo(() => Motions).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One item of a sitting's order paper, in order, with the bill or motion it is about.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("agenda")
      .unique("sittingId", "position")
      .index("agendaKindId")
      .index("motionId")
      .index("billId")
      .index("sourceCitationId"),
  });

/*---------------- governance.positions ----------------*/
export const Positions = governance
  .schema("Positions", {
    institutionId: belongsTo(() => Institutions),
    /** Scheme gov.position.title: the name a person holds the position under (Governor, Member of Parliament); labels in every language are value labels. */
    titleId: belongsTo(() => Value).tags("scheme:ref.sch.gov.position.title"),
    /** Scheme gov.position.role: head, deputy, presiding officer, member, administrator, adjudicator. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.gov.position.role"),
    /** Scheme gov.selection.method: elected (direct, indirect, party list), nominated, appointed, ex officio, customary. */
    selectionMethodId: belongsTo(() => Value).tags("scheme:ref.sch.gov.selection.method"),
    /** The country level the position serves (national, county, ward); the ladder is data. */
    jurisdictionLevelId: belongsTo(() => Levels).maybe(),
    /** Scheme gov.seat.basis: fixed number, one per unit, set by formula, variable. */
    seatBasisId: belongsTo(() => Value).tags("scheme:ref.sch.gov.seat.basis"),
    /** For a per-unit basis: the level that gets one seat each (one per county, one per ward). */
    seatUnitLevelId: belongsTo(() => Levels).maybe(),
    /** For a fixed basis: how many seats there are. */
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termLimit: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** Scheme gov.exposure.level: how the position counts as a person with power for conflict-of-interest signals. */
    exposureId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.exposure.level"),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    displayOrder: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .description(
    "A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("positions")
      .index("institutionId")
      .index("titleId")
      .index("roleId")
      .index("selectionMethodId")
      .index("jurisdictionLevelId")
      .index("seatUnitLevelId")
      .index("exposureId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.procedures ----------------*/
export const Procedures = governance
  .schema("Procedures", {
    countryId: belongsTo(() => Country),
    /** Scheme gov.procedure.kind: appointment, removal, legislation, budget, election. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.procedure.kind"),
    description: dryv.field(sharedProperties.Description),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .description("A named sequence of rights, such as appointing a judge or removing a governor; its steps are powers.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("procedures")
      .index("countryId")
      .index("kindId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.powers ----------------*/
export const Powers = governance
  .schema("Powers", {
    /** Who holds the right: a position or a body (the electorate is a body). Exactly one. */
    holderPositionId: belongsTo(() => Positions).maybe(),
    holderInstitutionId: belongsTo(() => Institutions).maybe(),
    /** Over whom or what: a position or a body. Exactly one. */
    targetPositionId: belongsTo(() => Positions).maybe(),
    targetInstitutionId: belongsTo(() => Institutions).maybe(),
    /** Scheme gov.power.kind: initiate, nominate, vet, approve, appoint, confirm, remove, veto, assent, dissolve, fund, audit, oversee, summon, elect. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.power.kind"),
    procedureId: belongsTo(() => Procedures).maybe(),
    /** The place of this right within its procedure. */
    stepOrder: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** Scheme gov.power.threshold: simple majority, two thirds, unanimous, and so on. */
    thresholdId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.power.threshold"),
    /** True when the holder must act on it; false when the holder may. */
    isBinding: dryv.field(sharedProperties.Flag),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("HasExactlyOneHolder", rule.exactlyOne("holderPositionId", "holderInstitutionId"))
  .rule("HasExactlyOneTarget", rule.exactlyOne("targetPositionId", "targetInstitutionId"))
  .description(
    "One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("powers")
      .unique(
        "holderPositionId",
        "holderInstitutionId",
        "targetPositionId",
        "targetInstitutionId",
        "kindId",
        "procedureId",
        "stepOrder",
      )
      .index("holderPositionId", "kindId")
      .index("holderInstitutionId", "kindId")
      .index("targetPositionId", "kindId")
      .index("targetInstitutionId", "kindId")
      .index("procedureId", "stepOrder")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.functions ----------------*/
export const Functions = governance
  .schema("Functions", {
    countryId: belongsTo(() => Country),
    parentFunctionId: belongsTo(dryv.self).maybe(),
    topicId: belongsTo(() => Topic).maybe(),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("FunctionDoesNotParentItself", (v) => v.id.ne(v.parentFunctionId))
  .description(
    "A public function that a constitution or law assigns to a level of government. Its name and plain wording are copy keyed by code.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("functions")
      .acyclic("FunctionParentAcyclic", { field: "parentFunctionId" })
      .index("countryId")
      .index("parentFunctionId")
      .index("topicId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.assignments ----------------*/
export const Assignments = governance
  .schema("Assignments", {
    functionId: belongsTo(() => Functions),
    /** The one body responsible, when it is one body. */
    institutionId: belongsTo(() => Institutions).maybe(),
    /** The class of body responsible (every county government); scheme gov.obligor.kind. */
    obligorKindId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.obligor.kind"),
    /** Scheme gov.responsibility.share: exclusive, shared, concurrent. */
    shareId: belongsTo(() => Value).tags("scheme:ref.sch.gov.responsibility.share"),
    /** Where a person starts for this function: the office or the body. */
    startPositionId: belongsTo(() => Positions).maybe(),
    startInstitutionId: belongsTo(() => Institutions).maybe(),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("HasOneResponsibleForm", rule.atLeastOne("institutionId", "obligorKindId"))
  .description("Who is responsible for a function, how it is shared, where a person starts, and the law that assigns it.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("assignments")
      .index("functionId")
      .index("institutionId")
      .index("obligorKindId")
      .index("startPositionId")
      .index("startInstitutionId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- governance.promises ----------------*/
export const Promises = governance
  .schema("Promises", {
    makerHolderId: belongsTo(() => Holders).maybe(),
    makerIndividualId: belongsTo(() => Individuals).maybe(),
    /** The office held when it was said. */
    officeId: belongsTo(() => Offices).maybe(),
    /** The words, short. The recording, long text, posts and news are filesystem media and contents about this promise. */
    statement: dryv.field(sharedProperties.Description),
    madeOn: dryv.field(sharedProperties.CalendarDate),
    placeFeatureId: belongsTo(() => Features).maybe(),
    topicId: belongsTo(() => Topic).maybe(),
    quantity: dryv.field(sharedProperties.Number).maybe(),
    unitId: belongsTo(() => Unit).maybe(),
    dueOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    occurrenceId: belongsTo(() => Occurrences).maybe(),
    sittingId: belongsTo(() => Sittings).maybe(),
    speechId: belongsTo(() => Speeches).maybe(),
    /** Scheme gov.promise.status: made, in progress, delivered, broken, withdrawn, no record found. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.gov.promise.status"),
    /** The date the status was last checked against the sources. */
    statusAsOf: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("HasExactlyOneMaker", rule.exactlyOne("makerHolderId", "makerIndividualId"))
  .description(
    "Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("promises")
      .index("makerHolderId")
      .index("makerIndividualId")
      .index("officeId")
      .index("placeFeatureId")
      .index("topicId")
      .index("occurrenceId")
      .index("sittingId")
      .index("speechId")
      .index("statusId")
      .index("sourceCitationId"),
  });

/*---------------- governance.fulfilments ----------------*/
export const Fulfilments = governance
  .schema("Fulfilments", {
    promiseId: belongsTo(() => Promises),
    projectId: belongsTo(() => Projects).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    appropriationId: belongsTo(() => Appropriations).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    /** Scheme gov.fulfilment.kind: stated by an official source, matched on place and topic, proposed by a model. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.gov.fulfilment.kind"),
    /** Scheme ref.evidence.status. A model-proposed link stays proposed until reviewed. */
    evidenceStatusId: belongsTo(() => Value).tags("scheme:ref.sch.ref.evidence.status"),
    recordedOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("LinksSomething", rule.atLeastOne("projectId", "contractId", "appropriationId", "billId", "instrumentId"))
  .description("A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("fulfilments")
      .index("promiseId")
      .index("projectId")
      .index("contractId")
      .index("appropriationId")
      .index("billId")
      .index("instrumentId")
      .index("evidenceStatusId")
      .index("sourceCitationId"),
  });
