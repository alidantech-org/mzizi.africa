/**
 * Schema: governance | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 10, 30.4 and 32 (approved 2026-11-25).
 * Contract authors: the state as law creates it: institutions, positions (kinds of seat), offices (concrete seats),
 * holders and the steps that put them there, structural relationships, jurisdictions, functions and powers, and the
 * generation patterns moved from reference. Proceedings are in `legislature`; promises in `politics`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Contests } from "./election.ts";
import { Versions } from "./filesystem.ts";
import { Features } from "./geography.ts";
import { Provisions } from "./legal.ts";
import { Motions } from "./legislature.ts";
import { Contacts, Individuals } from "./official.ts";
import { Countries, Levels } from "./reference.ts";
import { Domains } from "./source.ts";

export const governance = dryv
  .group({ name: "governance" })
  .description(
    "The state as law creates it: institutions, positions, offices, holders, appointments, terms, relationships, jurisdictions, functions, powers, procedures, obligations, reports and generation patterns.",
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
    PerTerm: "per-term",
    OnEvent: "on-event",
  }),
  TemplateProduct: dryv.property.enum({
    Institution: "institution",
    Position: "position",
    Office: "office",
    Domain: "domain",
    Contact: "contact",
    EventRule: "event-rule",
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
    armTerm: term("gov.arm", "executive, legislature, judiciary or independent.").maybe(),
    basisTerm: term("gov.institution.basis", "constitutional, statutory, administrative.").maybe(),
    countryId: belongsTo(() => Countries),
    ...periodFields,
    ...dates,
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
      .index("armTerm")
      .references("InstitutionIsIdentity", identityReference),
  });

/*---------------- governance.positions ----------------*/
export const Positions = governance
  .schema("Positions", {
    identityKind: identityKindField("position"),
    institutionId: belongsTo(() => Institutions)
      .maybe()
      .description("The institution the seat belongs to."),
    roleTerm: term("gov.position.role", "The kind of seat (president, governor, member of county assembly, chair)."),
    methodTerm: term("gov.selection.method", "How holders are chosen: elected, nominated, appointed.").maybe(),
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
    provisionId: belongsTo(() => Provisions)
      .maybe()
      .description("The provision that creates the position."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe().description("Order in leadership trees."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("PositionKind", (v) => v.identityKind.eq("position"))
  .description("A kind of seat that law creates (Governor, Member of County Assembly). Its titles are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("positions")
      .index("institutionId")
      .index("roleTerm")
      .index("levelId")
      .references("PositionIsIdentity", identityReference),
  });

/*---------------- governance.offices ----------------*/
export const Offices = governance
  .schema("Offices", {
    identityKind: identityKindField("office"),
    positionId: belongsTo(() => Positions),
    institutionId: belongsTo(() => Institutions),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The place the seat represents (a ward)."),
    seat: dryv
      .field(governanceProperties.Seat)
      .maybe()
      .description("The seat's number or label where one place has several."),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("OfficeKind", (v) => v.identityKind.eq("office"))
  .rule("OfficePeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("One concrete seat (the Governor of Nairobi, the MCA for Kilimani ward).")
  .role("entity");

const liveOffice = (withFeature: boolean, withSeat: boolean) =>
  governance.expression(
    `LiveOffice${withFeature ? "Placed" : "Unplaced"}${withSeat ? "Numbered" : "Single"}`,
    Offices.check((v) =>
      v.deletedAt
        .isNull()
        .and(
          v.toYear.isNull(),
          withFeature ? v.featureId.isNotNull() : v.featureId.isNull(),
          withSeat ? v.seat.isNotNull() : v.seat.isNull(),
        ),
    ),
  );
Offices.facets({
  storage: dryv
    .storage("offices")
    .indexes(
      {
        description: "One current seat per position and place.",
        fields: ["positionId", "featureId"],
        unique: true,
        where: liveOffice(true, false),
      },
      {
        description: "One current numbered seat per position, place and number.",
        fields: ["positionId", "featureId", "seat"],
        unique: true,
        where: liveOffice(true, true),
      },
      {
        description: "One current numbered seat per position and number.",
        fields: ["positionId", "seat"],
        unique: true,
        where: liveOffice(false, true),
      },
      {
        description: "One current single seat per position.",
        fields: ["positionId"],
        unique: true,
        where: liveOffice(false, false),
      },
    )
    .index("institutionId")
    .index("featureId")
    .references("OfficeIsIdentity", identityReference),
});

/*---------------- governance.holders ----------------*/
export const Holders = governance
  .schema("Holders", {
    officeId: belongsTo(() => Offices),
    individualId: belongsTo(() => Individuals),
    methodTerm: term("gov.selection.method", "How the holder got the seat: elected, nominated, appointed, acting."),
    contestId: belongsTo(() => Contests)
      .maybe()
      .description("The election contest that put the holder in office."),
    reasonTerm: term("gov.holder.reason", "Why the tenure ended (term end, resignation, death, removal).").maybe(),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("HolderPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("HolderDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("A person in an office for a period. How they got there is `governance.appointments`.")
  .role("entity")
  .facets({ storage: dryv.storage("holders").index("officeId", "fromYear").index("individualId").index("contestId") });

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
    featureId: belongsTo(() => Features).maybe(),
    ordinal: dryv.field(sharedProperties.PositiveInteger).maybe().description("The term's number (13th Parliament)."),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TermHasOneOwner", rule.exactlyOne("institutionId", "officeId"))
  .rule("TermPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A numbered term or mandate of an institution or office (absorbs the former mandates).")
  .role("entity")
  .facets({ storage: dryv.storage("terms").index("institutionId", "ordinal").index("officeId") });

/*---------------- governance.relationships ----------------*/
export const Relationships = governance
  .schema("Relationships", {
    fromId: identity("The institution, position or office the link starts from."),
    toId: identity("The one it points at."),
    kindTerm: term("gov.relationship.kind", "oversees, accountable to, part of."),
    provisionId: belongsTo(() => Provisions).maybe(),
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
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The area authority covers; empty for the whole country."),
    kindTerm: term("gov.jurisdiction.kind", "territorial, subject matter, appellate."),
    ...periodFields,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("JurisdictionHasOneHolder", rule.exactlyOne("institutionId", "officeId"))
  .description("Where an institution or office has authority.")
  .role("entity")
  .facets({
    storage: dryv.storage("jurisdictions").index("countryId", "featureId").index("institutionId").index("officeId"),
  });

/*---------------- governance.functions ----------------*/
export const Functions = governance
  .schema("Functions", {
    identityKind: identityKindField("function"),
    parentId: belongsTo(dryv.self).maybe(),
    topicTerm: term("topic", "The policy area (health, roads, agriculture)."),
    provisionId: belongsTo(() => Provisions)
      .maybe()
      .description("The provision that assigns the function."),
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
    shareTerm: term("gov.assignment.share", "exclusive or concurrent."),
    initiatorId: identity("The position or institution that initiates or leads the function.").maybe(),
    provisionId: belongsTo(() => Provisions).maybe(),
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
    provisionId: belongsTo(() => Provisions).maybe(),
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
    provisionId: belongsTo(() => Provisions).maybe(),
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
    provisionId: belongsTo(() => Provisions).maybe(),
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
    statusTerm: term("gov.report.status", "due, filed, late, missing."),
    artifactId: belongsTo(() => Versions)
      .maybe()
      .description("The filed document's stored version."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One report filed (or not) against an obligation.")
  .role("entity")
  .facets({ storage: dryv.storage("reports").index("obligationId", "fromYear").index("reporterId") });

/*---------------- governance.patterns ----------------*/
export const Patterns = governance
  .schema("Patterns", {
    title: dryv.field(sharedProperties.Name).description("Internal English label for people curating patterns."),
    kindTerm: term("gov.pattern.kind", "institution set, position set, site set, calendar set.").maybe(),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country the pattern belongs to; empty for any country."),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A reviewed rule for generating expected records (institutions, positions, offices, sites) before real ones are found.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("patterns").index("kindTerm").index("countryId") });

/*---------------- governance.templates ----------------*/
export const Templates = governance
  .schema("Templates", {
    patternId: belongsTo(() => Patterns, { onDelete: "cascade" }),
    produces: dryv.field(governanceProperties.TemplateProduct).description("What the template produces."),
    fanOutLevelId: belongsTo(() => Levels)
      .maybe()
      .description("The level it fans out over (one product per place)."),
    parentTemplateId: belongsTo(dryv.self).maybe(),
    nameTemplate: dryv.field(sharedProperties.NonEmptyString500).description("Name with named tokens."),
    codeTemplate: dryv.field(sharedProperties.NonEmptyString500).description("Code with named tokens."),
    kindTerm: term("gov.institution.kind", "Institution kind of the product.").maybe(),
    armTerm: term("gov.arm", "Arm of the product.").maybe(),
    classTerm: term("gov.institution.class", "Institution class of the product.").maybe(),
    roleTerm: term("gov.position.role", "Position role of the product.").maybe(),
    methodTerm: term("gov.selection.method", "Selection method of the product.").maybe(),
    basisTerm: term("gov.seat.basis", "Seat basis of the product.").maybe(),
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termLimit: dryv.field(sharedProperties.PositiveInteger).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("PositionAttributesNeedPositionProduct", (v) =>
    v.produces
      .eq("position")
      .or(
        v.produces.eq("office"),
        v.roleTerm
          .isNull()
          .and(
            v.methodTerm.isNull(),
            v.basisTerm.isNull(),
            v.seatCount.isNull(),
            v.termYears.isNull(),
            v.termLimit.isNull(),
          ),
      ),
  )
  .rule("InstitutionAttributesNeedInstitutionProduct", (v) =>
    v.produces.eq("institution").or(v.kindTerm.isNull().and(v.armTerm.isNull(), v.classTerm.isNull())),
  )
  .description(
    "One thing a pattern produces, how many, how it is named and coded. Templates generate structure only, never people.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("templates").unique("patternId", "code").index("fanOutLevelId").index("parentTemplateId"),
  });

/*---------------- governance.instances ----------------*/
export const Instances = governance
  .schema("Instances", {
    templateId: belongsTo(() => Templates),
    unitFeatureId: belongsTo(() => Features)
      .maybe()
      .description("The place the product was generated for."),
    institutionId: belongsTo(() => Institutions).maybe(),
    positionId: belongsTo(() => Positions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    domainId: belongsTo(() => Domains).maybe(),
    contactId: belongsTo(() => Contacts).maybe(),
    statusTerm: term("gov.instance.status", "expected, sourced, verified, not found, disputed."),
    generatedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .rule("InstanceHasOneProduct", rule.exactlyOne("institutionId", "positionId", "officeId", "domainId", "contactId"))
  .description("Which template produced which record, for which place, and whether it is only expected or has been found.")
  .role("entity");

Instances.facets({
  storage: dryv
    .storage("instances")
    .indexes(
      {
        fields: ["templateId", "unitFeatureId"],
        unique: true,
        where: governance.expression(
          "PlacedInstance",
          Instances.check((v) => v.unitFeatureId.isNotNull()),
        ),
      },
      {
        description: "A template that does not fan out produces one instance.",
        fields: ["templateId"],
        unique: true,
        where: governance.expression(
          "UnplacedInstance",
          Instances.check((v) => v.unitFeatureId.isNull()),
        ),
      },
    )
    .index("unitFeatureId")
    .index("institutionId")
    .index("positionId")
    .index("officeId"),
});
