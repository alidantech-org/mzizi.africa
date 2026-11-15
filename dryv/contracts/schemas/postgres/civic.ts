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
import { Features, Places, Units } from "./geography.ts";
import { Institutions } from "./governance.ts";
import { Entities } from "./official.ts";
import { Country, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

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
    placeFeatureId: belongsTo(() => Places, { to: "featureId" }).maybe(),
    scopeUnitFeatureId: belongsTo(() => Units, { to: "featureId" }).maybe(),
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
    scopeUnitFeatureId: belongsTo(() => Units, { to: "featureId" }).maybe(),
    statusId: belongsTo(() => Value),
    startedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    completedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
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
    buyerEntityId: belongsTo(() => Entities),
    countryId: belongsTo(() => Country).maybe(),
    procedureKindId: belongsTo(() => Value),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
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
  .extends(baseSchemas.Entity)
  .description("One supplier submission to one procurement process, with the reported amount and outcome where known.")
  .role("entity")
  .facets({ storage: dryv.storage("bids").index("procurementId").index("bidderEntityId").index("sourceCitationId") });

/*---------------- civic.contracts ----------------*/
export const Contracts = civic
  .schema("Contracts", {
    procurementId: belongsTo(() => Procurements).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    contractorEntityId: belongsTo(() => Entities),
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    currencyId: belongsTo(() => Value),
    statusId: belongsTo(() => Value),
    signedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
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
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One dated deliverable or milestone under a contract, optionally scoped to a geographic unit.")
  .role("entity")
  .facets({
    storage: dryv.storage("deliveries").index("contractId", "deliveredOn").index("unitFeatureId").index("sourceCitationId"),
  });
