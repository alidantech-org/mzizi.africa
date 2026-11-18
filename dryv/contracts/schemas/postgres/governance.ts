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
import { Features } from "./geography.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Value } from "./reference.ts";
import { Provisions } from "./legal.ts";
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
    institutionKindId: belongsTo(() => Value),
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
    storage: dryv.storage("institutions").index("entityId").index("armId").index("sourceCitationId"),
  });

/*---------------- governance.offices ----------------*/
export const Offices = governance
  .schema("Offices", {
    institutionId: belongsTo(() => Institutions),
    officeKindId: belongsTo(() => Value),
    unitFeatureId: belongsTo(() => Features).maybe(),
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
    storage: dryv.storage("offices").index("unitFeatureId").index("sourceCitationId"),
  });

/*---------------- governance.holders ----------------*/
export const Holders = governance
  .schema("Holders", {
    officeId: belongsTo(() => Offices),
    individualId: belongsTo(() => Individuals),
    appointmentKindId: belongsTo(() => Value),
    appointedByEntityId: belongsTo(() => Entities).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    tookOfficeOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    leftOfficeOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("HoldersDatesAreOrdered", rule.ordered("tookOfficeOn", "leftOfficeOn", { allowEqual: true }))
  .description("One person's continuous tenure in one office, with appointment kind and effective dates.")
  .role("entity")
  .facets({
    storage: dryv.storage("holders").index("officeId", "fromYear", "toYear").index("individualId").index("sourceCitationId"),
  });

/*---------------- governance.mandates ----------------*/
export const Mandates = governance
  .schema("Mandates", {
    institutionId: belongsTo(() => Institutions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    mandateKindId: belongsTo(() => Value),
    description: dryv.field(sharedProperties.Description),
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
    relationshipKindId: belongsTo(() => Value),
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
    authorityKindId: belongsTo(() => Value),
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
    obligorKindId: belongsTo(() => Value).maybe().tags("scheme:ref.sch.gov.obligor.kind"),
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
