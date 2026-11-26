/**
 * Schema: governance | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 10, 30.4 and 32 (approved 2026-11-25).
 * Contract authors: the state as law creates it: institutions, positions (kinds of seat), offices (concrete seats),
 * holders and the steps that put them there, structural relationships, jurisdictions, functions and powers. Generation
 * recipes are in `template`. Proceedings are in `legislature`; promises in `politics`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { templateFields } from "#/schemas/_templates.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Contests, Elections } from "./election.ts";
import { Versions } from "./filesystem.ts";
import { Areas } from "./geography.ts";
import { Motions } from "./legislature.ts";
import { Entities, Individuals, Premises } from "./official.ts";
import { Countries, Levels } from "./reference.ts";

export const governance = dryv
  .group({ name: "governance" })
  .description(
    "The state as law creates it: institutions, positions, offices, holders, appointments, terms, relationships, jurisdictions, functions, powers, procedures, obligations, reports.",
  )
  .facets({ storage: { namespace: "governance", store: "main" } });

const governanceProperties = governance.properties({
  AppointmentStep: dryv.property.enum({
    Nomination: "nomination",
    Recommendation: "recommendation",
    Vetting: "vetting",
    Approval: "approval",
    Appointment: "appointment",
    SwearingIn: "swearing-in",
  }),
  Frequency: dryv.property.enum({
    Monthly: "monthly",
    Quarterly: "quarterly",
    Annual: "annual",
    Weekly: "weekly",
    Daily: "daily",
    Irregular: "irregular",
    PerTerm: "per-term",
    OnEvent: "on-event",
  }),
  Seat: dryv.property.string().length({ min: 1, max: 100 }),
});

const dates = {
  startsOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Exact start date, when known."),
  endsOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Exact end date, when known."),
};

/*---------------- governance.institutions ----------------*/
export const Institutions = governance
  .schema("Institutions", {
    identityKind: identityKindField("entity"),
    kindTerm: term("gov.institution.kind", "government, assembly, ministry, committee, court, commission."),
    classTerm: term("gov.institution.class", "ministry, department, commission, independent office, court.").maybe(),
    arm: dryv.field(enums.InstitutionArm).description("executive, legislature, judiciary or independent.").maybe(),
    basis: dryv.field(enums.InstitutionBasis).description("constitutional, statutory, administrative.").maybe(),
    countryId: belongsTo(() => Countries),
    ...periodFields,
    ...dates,
    ...templateFields("institution"),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("InstitutionKind", (v) => v.identityKind.eq("entity"))
  .rule("InstitutionPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "A public institution; it shares its organisation's identity (`official.entities`). Committees are institutions linked to their house.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("institutions")
      .index("countryId", "kindTerm")
      .index("arm")
      .index("templateId")
      .references("InstitutionIsIdentity", identityReference)
      .references("InstitutionIsEntity", { fields: ["id"], target: () => Entities, targetFields: ["id"] }),
  });

/*---------------- governance.positions ----------------*/
export const Positions = governance
  .schema("Positions", {
    identityKind: identityKindField("position"),
    institutionClassTerm: term(
      "gov.institution.class",
      "The class of institution that has this seat (county government, county assembly); the institution itself is on the office.",
    ).maybe(),
    roleTerm: term("gov.position.role", "The kind of seat (president, governor, member of county assembly, chair)."),
    method: dryv.field(enums.SelectionMethod).description("How holders are chosen: elected, nominated, appointed.").maybe(),
    levelId: belongsTo(() => Levels)
      .maybe()
      .description("The level of government the position exists at."),
    basisTerm: term("gov.seat.basis", "The grounds of the seat (ward seat, special interest seat).").maybe(),
    seatLevelId: belongsTo(() => Levels)
      .maybe()
      .description("The level whose places each have one seat (ward for MCAs)."),
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termLimit: dryv.field(sharedProperties.PositiveInteger).maybe(),
    exposureTerm: term("gov.position.exposure", "How public the role is, for privacy rules.").maybe(),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe().description("Order in leadership trees."),
    ...templateFields("position"),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("PositionKind", (v) => v.identityKind.eq("position"))
  .description(
    "A kind of seat that law creates, defined once per role (Governor, Member of County Assembly). The institution and the place are on the office. Its titles are `identity.names`.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("positions")
      .index("institutionClassTerm")
      .index("roleTerm")
      .index("levelId")
      .index("templateId")
      .references("PositionIsIdentity", identityReference),
  });

/*---------------- governance.offices ----------------*/
export const Offices = governance
  .schema("Offices", {
    identityKind: identityKindField("office"),
    positionId: belongsTo(() => Positions),
    institutionId: belongsTo(() => Institutions),
    areaId: belongsTo(() => Areas)
      .maybe()
      .description("The official area the seat represents (a ward, a county); empty for a seat of the whole country."),
    premisesId: belongsTo(() => Premises)
      .maybe()
      .description("The premises the office sits in (County Hall); empty while unknown."),
    seat: dryv
      .field(governanceProperties.Seat)
      .maybe()
      .description("The seat's number or label where one place has several."),
    ...periodFields,
    ...dates,
    ...templateFields("office"),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("OfficeKind", (v) => v.identityKind.eq("office"))
  .rule("OfficePeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "One concrete seat: a position at an institution and an area (the Governor of Nairobi, the MCA for Kilimani ward).",
  )
  .role("entity");

const liveOffice = (withArea: boolean, withSeat: boolean) =>
  governance.expression(
    `LiveOffice${withArea ? "Placed" : "Unplaced"}${withSeat ? "Numbered" : "Single"}`,
    Offices.check((v) =>
      v.deletedAt
        .isNull()
        .and(
          v.toYear.isNull(),
          withArea ? v.areaId.isNotNull() : v.areaId.isNull(),
          withSeat ? v.seat.isNotNull() : v.seat.isNull(),
        ),
    ),
  );
Offices.facets({
  storage: dryv
    .storage("offices")
    .indexes(
      {
        description: "One current seat per position, institution and area.",
        fields: ["positionId", "institutionId", "areaId"],
        unique: true,
        where: liveOffice(true, false),
      },
      {
        description: "One current numbered seat per position, institution, area and number.",
        fields: ["positionId", "institutionId", "areaId", "seat"],
        unique: true,
        where: liveOffice(true, true),
      },
      {
        description: "One current numbered seat per position, institution and number.",
        fields: ["positionId", "institutionId", "seat"],
        unique: true,
        where: liveOffice(false, true),
      },
      {
        description: "One current single seat per position and institution.",
        fields: ["positionId", "institutionId"],
        unique: true,
        where: liveOffice(false, false),
      },
    )
    .index("institutionId")
    .index("areaId")
    .index("premisesId")
    .index("templateId")
    .references("OfficeIsIdentity", identityReference),
});

/*---------------- governance.holders ----------------*/
export const Holders = governance
  .schema("Holders", {
    officeId: belongsTo(() => Offices),
    termId: belongsTo(() => GovernanceTerms)
      .maybe()
      .description("The office term this holder slot belongs to; the term must be of the same office."),
    individualId: belongsTo(() => Individuals)
      .maybe()
      .description("The person; empty while the holder is only an expected slot."),
    method: dryv
      .field(enums.SelectionMethod)
      .description("How the holder got the seat: elected, nominated, appointed, acting.")
      .maybe(),
    contestId: belongsTo(() => Contests)
      .maybe()
      .description("The election contest that put the holder in office."),
    reason: dryv.field(enums.HolderEnd).description("Why the tenure ended (term end, resignation, death, removal).").maybe(),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("HolderPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("HolderDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description(
    "A person in an office for a period, or the empty slot for one. How a person got there is `governance.appointments`.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("holders")
      .index("officeId", "fromYear")
      .index("individualId")
      .index("contestId")
      .index("termId")
      .references("HolderTermIsOfOffice", {
        fields: ["termId", "officeId"],
        target: () => GovernanceTerms,
        targetFields: ["id", "officeId"],
      }),
  });

/*---------------- governance.appointments ----------------*/
export const Appointments = governance
  .schema("Appointments", {
    holderId: belongsTo(() => Holders, { onDelete: "cascade" }),
    step: dryv
      .field(governanceProperties.AppointmentStep)
      .description("nomination, recommendation, vetting, approval, appointment or swearing-in."),
    actorId: identity("Who took the step: a person, Parliament, a board or a commission."),
    actorHolderId: belongsTo(() => Holders)
      .maybe()
      .description("The person acting in office (President X while in office)."),
    motionId: belongsTo(() => Motions)
      .maybe()
      .description("The vote, when the step was a vote."),
    onDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    fromYear: periodFields.fromYear,
  })
  .extends(baseSchemas.Entity)
  .description(
    "One step that put a holder in office; appointments by Parliament or a board are recorded like those by a person.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("appointments").index("holderId", "step").index("actorId").index("actorHolderId") });

/*---------------- governance.terms ----------------*/
export const GovernanceTerms = governance
  .schema("OfficeTerms", {
    institutionId: belongsTo(() => Institutions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    kindTerm: term("gov.term.kind", "parliamentary term, mandate, session period."),
    areaId: belongsTo(() => Areas).maybe(),
    electionId: belongsTo(() => Elections)
      .maybe()
      .description("The general election cycle that fills this term; empty for appointed terms."),
    ordinal: dryv.field(sharedProperties.PositiveInteger).maybe().description("The term's number (13th Parliament)."),
    ...periodFields,
    ...dates,
    ...templateFields("term"),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TermHasOneOwner", rule.exactlyOne("institutionId", "officeId"))
  .rule("TermPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "A numbered term or mandate of an institution or office: one row per election cycle for an elected office, one open row for an appointed one.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("terms")
      .index("institutionId", "ordinal")
      .index("officeId")
      .index("areaId")
      .index("electionId")
      .index("templateId")
      .unique("id", "officeId"),
  });

/*---------------- governance.relationships ----------------*/
export const Relationships = governance
  .schema("Relationships", {
    fromId: identity("The institution, position or office the link starts from."),
    toId: identity("The one it points at."),
    kindTerm: term("gov.relationship.kind", "oversees, accountable to, part of."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("GovernanceRelationshipIsNotSelf", rule.differs("fromId", "toId"))
  .description("A structural link from law: a ministry part of the executive, a committee part of its house.")
  .role("entity")
  .facets({ storage: dryv.storage("relationships").index("fromId", "kindTerm").index("toId", "kindTerm") });

/*---------------- governance.jurisdictions ----------------*/
export const Jurisdictions = governance
  .schema("Jurisdictions", {
    institutionId: belongsTo(() => Institutions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    countryId: belongsTo(() => Countries),
    areaId: belongsTo(() => Areas)
      .maybe()
      .description("The official area the authority covers; empty for the whole country."),
    kind: dryv.field(enums.JurisdictionKind).description("territorial, subject matter, appellate."),
    ...periodFields,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("JurisdictionHasOneHolder", rule.exactlyOne("institutionId", "officeId"))
  .description("Where an institution or office has authority.")
  .role("entity")
  .facets({
    storage: dryv.storage("jurisdictions").index("countryId", "areaId").index("institutionId").index("officeId"),
  });

/*---------------- governance.functions ----------------*/
export const Functions = governance
  .schema("Functions", {
    identityKind: identityKindField("function"),
    parentId: belongsTo(dryv.self).maybe(),
    topicTerm: term("topic", "The policy area (health, roads, agriculture)."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("FunctionKind", (v) => v.identityKind.eq("function"))
  .description("A government function (county health services) from law, possibly under a broader one.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("functions")
      .index("parentId")
      .index("topicTerm")
      .acyclic("FunctionParentsHaveNoCycle", { field: "parentId" })
      .references("FunctionIsIdentity", identityReference),
  });

/*---------------- governance.assignments ----------------*/
export const Assignments = governance
  .schema("Assignments", {
    functionId: belongsTo(() => Functions, { onDelete: "cascade" }),
    institutionId: belongsTo(() => Institutions).maybe(),
    positionId: belongsTo(() => Positions).maybe(),
    share: dryv.field(enums.AssignmentShare).description("exclusive or concurrent."),
    initiatorId: identity("The position or institution that initiates or leads the function.").maybe(),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("AssignmentHasOneCarrier", rule.exactlyOne("institutionId", "positionId"))
  .description("Which institution or position carries a function, and who leads it.")
  .role("entity")
  .facets({ storage: dryv.storage("assignments").index("functionId").index("institutionId").index("positionId") });

/*---------------- governance.procedures ----------------*/
export const Procedures = governance
  .schema("Procedures", {
    identityKind: identityKindField("procedure"),
    kindTerm: term("gov.procedure.kind", "appointment, impeachment, budget approval."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ProcedureKind", (v) => v.identityKind.eq("procedure"))
  .description("A procedure law sets out; its explanation is a definition name or a media article.")
  .role("entity")
  .facets({ storage: dryv.storage("procedures").index("kindTerm").references("ProcedureIsIdentity", identityReference) });

/*---------------- governance.powers ----------------*/
export const Powers = governance
  .schema("Powers", {
    fromId: identity("The position or institution that holds the power."),
    toId: identity("The position or institution it acts on."),
    kindTerm: term("gov.power.kind", "appoint, nominate, dismiss, veto, approve."),
    procedureId: belongsTo(() => Procedures).maybe(),
    step: dryv.field(sharedProperties.PositiveInteger).maybe().description("Order within the procedure."),
    thresholdTerm: term("gov.power.threshold", "simple majority, two-thirds.").maybe(),
    isBinding: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .rule("PowerIsNotSelf", rule.differs("fromId", "toId"))
  .description("How power flows between positions and institutions, by procedure and threshold.")
  .role("entity")
  .facets({ storage: dryv.storage("powers").index("fromId", "kindTerm").index("toId", "kindTerm").index("procedureId") });

/*---------------- governance.obligations ----------------*/
export const Obligations = governance
  .schema("Obligations", {
    holderId: identity("The institution or position that must report."),
    recipientId: identity("Who receives the report."),
    kindTerm: term("gov.obligation.kind", "annual report, audit submission, budget estimates."),
    frequency: dryv.field(governanceProperties.Frequency),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A duty to report that law sets; its explanation is a definition name.")
  .role("entity")
  .facets({ storage: dryv.storage("obligations").index("holderId").index("recipientId") });

/*---------------- governance.reports ----------------*/
export const Reports = governance
  .schema("Reports", {
    obligationId: belongsTo(() => Obligations),
    reporterId: identity("Who filed the report."),
    ...periodFields,
    dueOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    filedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    status: dryv.field(enums.ReportStatus).description("due, filed, late, missing."),
    artifactId: belongsTo(() => Versions)
      .maybe()
      .description("The filed document's stored version."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One report filed (or not) against an obligation.")
  .role("entity")
  .facets({ storage: dryv.storage("reports").index("obligationId", "fromYear").index("reporterId") });
