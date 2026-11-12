/**
 * Schema: civic | Database: mzizi
 * Approved contract: services, projects, procurement, bids, contracts and delivery records.
 * Geography owns physical features, places and spatial representations.
 * SQL generation remains gated on faithful CHECK, code-shape and access-policy enforcement.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { geographySchemas } from "./geography.ts";
import { governanceSchemas } from "./governance.ts";
import { officialSchemas } from "./official.ts";
import { referenceSchemas } from "./reference.ts";
import { sourceSchemas } from "./source.ts";

export const civic = dryv
  .group({ name: "civic" })
  .description("Public services, projects, procurement processes, contracts and delivery evidence.")
  .facets({ storage: { namespace: "civic" } });
const civicExpressions = civic.expressions({
  ServiceHasPlaceOrCoverage: dryv.expression.or(
    dryv.expression.notEqual(dryv.expression.context("value", "place_feature_id"), dryv.expression.value(null)),
    dryv.expression.notEqual(dryv.expression.context("value", "scope_unit_feature_id"), dryv.expression.value(null)),
  ),
  ServiceDatesAreOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "starts_on"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "ends_on"), dryv.expression.value(null)),
    dryv.expression.lessThanOrEqual(dryv.expression.context("value", "starts_on"), dryv.expression.context("value", "ends_on")),
  ),
  ProjectDatesAreOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "started_on"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "completed_on"), dryv.expression.value(null)),
    dryv.expression.lessThanOrEqual(dryv.expression.context("value", "started_on"), dryv.expression.context("value", "completed_on")),
  ),
});
// biome-ignore lint/suspicious/noExplicitAny: enables typed links among Civic records.
export const civicSchemas: Record<string, any> = {};
const id = () => dryv.field(sharedProperties.Id);
const ref = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const optRef = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().optional().nullable().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const tableName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const grains: Record<string, string> = {
  Services: "One provider's service provision at a physical place or geographic coverage unit during a service period.",
  Projects: "One public development or infrastructure project with responsible institution, status, geographic scope and evidence.",
  ProjectFeatures: "One typed relationship between a Civic project and one Geography feature.",
  Procurements: "One public procurement process run by a buyer, optionally linked to a project.",
  Bids: "One supplier submission to one procurement process, with the reported amount and outcome where known.",
  Contracts: "One executed contract with a contractor, optional procurement/project links and contracted amount.",
  Deliveries: "One dated deliverable or milestone under a contract, optionally scoped to a geographic unit.",
};
const table = (name: string, fields: Record<string, any>, indexes: any[] = []) => {
  let definition: any = dryv
    .schema({
      id: id(),
      ...fields,
      source_citation_id: fields.source_citation_id ?? optRef(() => sourceSchemas.Citations.field("id")),
    })
    .description(grains[name]!)
    .role("entity");
  if (name === "Services") {
    definition = definition
      .invariant("HasPlaceOrCoverage", civicExpressions.ServiceHasPlaceOrCoverage)
      .invariant("ServiceDatesAreOrdered", civicExpressions.ServiceDatesAreOrdered);
  }
  if (name === "Projects") definition = definition.invariant("ProjectDatesAreOrdered", civicExpressions.ProjectDatesAreOrdered);
  const x = civic.schemas({
    [name]: definition.facets({
      storage: dryv
        .storage(tableName(name))
        .primaryKey("id")
        .indexes(...indexes, { name: `idx_${tableName(name)}_citation`, fields: ["source_citation_id"] }),
    }),
  });
  civicSchemas[name] = x[name];
};
/*---------------- civic.services ----------------*/
table(
  "Services",
  {
    provider_entity_id: ref(() => officialSchemas.Entities.field("id")),
    responsible_institution_id: optRef(() => governanceSchemas.Institutions.field("id")),
    service_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    name: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    place_feature_id: optRef(() => geographySchemas.Places.field("feature_id")),
    scope_unit_feature_id: optRef(() => geographySchemas.Units.field("feature_id")),
    starts_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    ends_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_services_code", fields: ["code"], unique: true },
    { name: "idx_services_provider", fields: ["provider_entity_id"] },
    { name: "idx_services_responsible_institution", fields: ["responsible_institution_id"] },
    { name: "idx_services_place", fields: ["place_feature_id"] },
    { name: "idx_services_scope", fields: ["scope_unit_feature_id"] },
  ],
);
/*---------------- End civic.services ----------------*/
/*---------------- civic.projects ----------------*/
table(
  "Projects",
  {
    code: dryv.field(sharedProperties.IdentityCode),
    name: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    responsible_institution_id: optRef(() => governanceSchemas.Institutions.field("id")),
    sponsor_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    implementing_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    scope_unit_feature_id: optRef(() => geographySchemas.Units.field("feature_id")),
    status_id: ref(() => referenceSchemas.Value.field("id")),
    started_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    completed_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_projects_code", fields: ["code"], unique: true },
    { name: "idx_projects_status", fields: ["status_id"] },
    { name: "idx_projects_institution", fields: ["responsible_institution_id"] },
    { name: "idx_projects_scope", fields: ["scope_unit_feature_id"] },
  ],
);
/*---------------- End civic.projects ----------------*/
/*---------------- civic.project_features ----------------*/
table(
  "ProjectFeatures",
  {
    project_id: ref(() => civicSchemas.Projects.field("id")),
    feature_id: ref(() => geographySchemas.Features.field("id")),
    feature_kind_id: ref(() => referenceSchemas.Value.field("id")),
  },
  [
    { name: "uq_project_features_project_feature_kind", fields: ["project_id", "feature_id", "feature_kind_id"], unique: true },
    { name: "idx_project_features_feature", fields: ["feature_id"] },
  ],
);
/*---------------- End civic.project_features ----------------*/
/*---------------- civic.procurements ----------------*/
table(
  "Procurements",
  {
    project_id: optRef(() => civicSchemas.Projects.field("id")),
    buyer_entity_id: ref(() => officialSchemas.Entities.field("id")),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    procedure_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    published_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_procurements_code", fields: ["code"], unique: true },
    { name: "idx_procurements_buyer", fields: ["buyer_entity_id"] },
  ],
);
/*---------------- End civic.procurements ----------------*/
/*---------------- civic.bids ----------------*/
table(
  "Bids",
  {
    procurement_id: ref(() => civicSchemas.Procurements.field("id")),
    bidder_entity_id: ref(() => officialSchemas.Entities.field("id")),
    amount_minor_units: dryv.field(sharedProperties.AmountMinorUnits).optional().nullable(),
    currency_id: optRef(() => referenceSchemas.Value.field("id")),
    outcome_id: ref(() => referenceSchemas.Value.field("id")),
    submitted_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_bids_procurement", fields: ["procurement_id"] },
    { name: "idx_bids_bidder", fields: ["bidder_entity_id"] },
  ],
);
/*---------------- End civic.bids ----------------*/
/*---------------- civic.contracts ----------------*/
table(
  "Contracts",
  {
    procurement_id: optRef(() => civicSchemas.Procurements.field("id")),
    project_id: optRef(() => civicSchemas.Projects.field("id")),
    contractor_entity_id: ref(() => officialSchemas.Entities.field("id")),
    amount_minor_units: dryv.field(sharedProperties.AmountMinorUnits),
    currency_id: ref(() => referenceSchemas.Value.field("id")),
    status_id: ref(() => referenceSchemas.Value.field("id")),
    signed_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_contracts_procurement", fields: ["procurement_id"] },
    { name: "idx_contracts_project", fields: ["project_id"] },
  ],
);
/*---------------- End civic.contracts ----------------*/
/*---------------- civic.deliveries ----------------*/
table(
  "Deliveries",
  {
    contract_id: ref(() => civicSchemas.Contracts.field("id")),
    delivery_kind_id: ref(() => referenceSchemas.Value.field("id")),
    amount_minor_units: dryv.field(sharedProperties.AmountMinorUnits).optional().nullable(),
    currency_id: optRef(() => referenceSchemas.Value.field("id")),
    delivered_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    unit_feature_id: optRef(() => geographySchemas.Units.field("feature_id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_deliveries_contract_date", fields: ["contract_id", "delivered_on"] },
    { name: "idx_deliveries_scope", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End civic.deliveries ----------------*/
