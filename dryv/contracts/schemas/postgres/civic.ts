/**
 * Schema: civic | Database: mzizi
 * Approved contract: services, projects, procurement, bids, contracts and delivery records.
 * Geography owns physical features, places and spatial representations.
 * SQL generation remains gated on faithful CHECK, code-shape and access-policy enforcement.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Institutions } from "./governance.ts";
import { Entities } from "./official.ts";
import { Country, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);
const point = dryv.geometry({ shape: "point", srid: 4326 });

export const civic = dryv
  .group({ name: "civic" })
  .description("Public services, projects, procurement processes, contracts and delivery evidence.")
  .facets({ storage: { namespace: "civic", store: "main" } });

/*---------------- civic.services ----------------*/
export const Services = civic
  .schema("Services", {
    providerEntityId: belongsTo(() => Entities),
    responsibleInstitutionId: belongsTo(() => Institutions).maybe(),
    serviceKindId: belongsTo(() => Value),
    name: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    placeFeatureId: belongsTo(() => Features).maybe(),
    scopeUnitFeatureId: belongsTo(() => Features).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One provider's service provision at a physical place or geographic coverage unit during a service period.")
  .role("entity")
  .rule("HasPlaceOrCoverage", rule.atLeastOne("placeFeatureId", "scopeUnitFeatureId"))
  .rule("ServiceDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .facets({
    storage: dryv
      .storage("services")
      .index("providerEntityId")
      .index("responsibleInstitutionId")
      .index("placeFeatureId")
      .index("scopeUnitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- civic.projects ----------------*/
export const Projects = civic
  .schema("Projects", {
    name: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    responsibleInstitutionId: belongsTo(() => Institutions).maybe(),
    sponsorEntityId: belongsTo(() => Entities).maybe(),
    implementingEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    scopeUnitFeatureId: belongsTo(() => Features).maybe(),
    statusId: belongsTo(() => Value),
    startedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    completedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Where the works are, when a single point describes it; the area is scopeUnitFeatureId. */
    location: dryv.field(point).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One public development or infrastructure project with responsible institution, status, geographic scope and evidence.",
  )
  .role("entity")
  .rule("ProjectDatesAreOrdered", rule.ordered("startedOn", "completedOn", { allowEqual: true }))
  .facets({
    storage: dryv
      .storage("projects")
      .index("statusId")
      .index("responsibleInstitutionId")
      .index("scopeUnitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- civic.project_features ----------------*/
export const ProjectFeatures = civic
  .schema("ProjectFeatures", {
    projectId: belongsTo(() => Projects),
    featureId: belongsTo(() => Features),
    featureKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One typed relationship between a Civic project and one Geography feature.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("project_features")
      .unique("projectId", "featureId", "featureKindId")
      .index("featureId")
      .index("sourceCitationId"),
  });

/*---------------- civic.procurements ----------------*/
export const Procurements = civic
  .schema("Procurements", {
    projectId: belongsTo(() => Projects).maybe(),
    /** Scheme civ.procurement.category: works, goods, services, consultancy, non-consulting services. */
    categoryId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.civ.procurement.category"),
    /** Scheme civ.contract.nature: what the supplier is expected to do (build, rehabilitate, maintain, supply, deliver a service, consult, supervise, train). */
    natureId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.civ.contract.nature"),
    buyerEntityId: belongsTo(() => Entities),
    countryId: belongsTo(() => Country).maybe(),
    procedureKindId: belongsTo(() => Value),
    /** The notice title and the buyer's own reference, as advertised. */
    title: dryv.field(sharedProperties.Name).maybe(),
    reference: dryv.field(sharedProperties.Name).maybe(),
    /** Scheme civ.procurement.status: open, closed, evaluation, awarded, cancelled, complete. */
    statusId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.civ.procurement.status"),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    closesOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    awardedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One public procurement process run by a buyer, optionally linked to a project.")
  .role("entity")
  .facets({ storage: dryv.storage("procurements").index("buyerEntityId").index("sourceCitationId") });

/*---------------- civic.bids ----------------*/
export const Bids = civic
  .schema("Bids", {
    procurementId: belongsTo(() => Procurements),
    bidderEntityId: belongsTo(() => Entities),
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits).maybe(),
    currencyId: belongsTo(() => Value).maybe(),
    outcomeId: belongsTo(() => Value),
    submittedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One supplier submission to one procurement process, with the reported amount and outcome where known.")
  .role("entity")
  .facets({ storage: dryv.storage("bids").index("procurementId").index("bidderEntityId").index("sourceCitationId") });

/*---------------- civic.contracts ----------------*/
export const Contracts = civic
  .schema("Contracts", {
    procurementId: belongsTo(() => Procurements).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    /** Scheme civ.contract.nature: what the contractor is expected to do. */
    natureId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.civ.contract.nature"),
    contractorEntityId: belongsTo(() => Entities),
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    currencyId: belongsTo(() => Value),
    statusId: belongsTo(() => Value),
    signedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One executed contract with a contractor, optional procurement/project links and contracted amount.")
  .role("entity")
  .facets({ storage: dryv.storage("contracts").index("procurementId").index("projectId").index("sourceCitationId") });

/*---------------- civic.deliveries ----------------*/
export const Deliveries = civic
  .schema("Deliveries", {
    contractId: belongsTo(() => Contracts),
    deliveryKindId: belongsTo(() => Value),
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits).maybe(),
    currencyId: belongsTo(() => Value).maybe(),
    deliveredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    unitFeatureId: belongsTo(() => Features).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One dated deliverable or milestone under a contract, optionally scoped to a geographic unit.")
  .role("entity")
  .facets({
    storage: dryv.storage("deliveries").index("contractId", "deliveredOn").index("unitFeatureId").index("sourceCitationId"),
  });


/*---------------- civic.facilities ----------------*/
export const Facilities = civic
  .schema("Facilities", {
    /** The geographic feature that is this facility (a point, line or area); one facility per feature. */
    featureId: belongsTo(() => Features),
    /** Scheme civ.facility.class: a hierarchy from the super class (government office, education, health, security and justice, water, transport, markets, electoral) down to type and level. */
    facilityClassId: belongsTo(() => Value).tags("scheme:ref.sch.civ.facility.class"),
    countryId: belongsTo(() => Country).maybe(),
    /** The body that runs it day to day (a county health department, a school board). */
    operatorEntityId: belongsTo(() => Entities).maybe(),
    /** The body that owns the land or asset when different from the operator. */
    ownerEntityId: belongsTo(() => Entities).maybe(),
    /** The institution accountable for it (the ministry or county department). */
    responsibleInstitutionId: belongsTo(() => Institutions).maybe(),
    /** Scheme civ.facility.ownership: public, private, faith-based, community, public-private. */
    ownershipId: belongsTo(() => Value).maybe().tags("scheme:ref.sch.civ.facility.ownership"),
    /** Scheme civ.facility.status: planned, under construction, operational, partly operational, closed, abandoned. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.civ.facility.status"),
    openedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    closedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("FacilityDatesAreOrdered", rule.ordered("openedOn", "closedOn", { allowEqual: true }))
  .description(
    "The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("facilities")
      .unique("featureId")
      .index("facilityClassId")
      .index("operatorEntityId")
      .index("ownerEntityId")
      .index("responsibleInstitutionId")
      .index("statusId")
      .index("sourceCitationId"),
  });

/*---------------- civic.beneficiaries ----------------*/
export const Beneficiaries = civic
  .schema("Beneficiaries", {
    /** Scheme civ.benefit.kind: infrastructure, works, equipment and supplies, services, empowerment, education support, environment, health, relief, capacity building. */
    benefitKindId: belongsTo(() => Value).tags("scheme:ref.sch.civ.benefit.kind"),
    projectId: belongsTo(() => Projects).maybe(),
    procurementId: belongsTo(() => Procurements).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    /** Optional share of the amount that benefits this subject, as a percentage. */
    sharePercent: dryv.field(sharedProperties.Percentage).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedSubjectEntity)
  .rule("ExactlyOneSpendingRecord", rule.exactlyOne("projectId", "procurementId", "contractId"))
  .description(
    "Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("beneficiaries")
      .index("subjectTable", "subjectId")
      .index("projectId")
      .index("procurementId")
      .index("contractId")
      .index("benefitKindId")
      .index("sourceCitationId"),
  });
