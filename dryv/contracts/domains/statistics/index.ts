import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { evidenced, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Statistics and public services.
 *
 * Indicators, periods and observations carry provenance and verification state like every other
 * claim; verification is a state, never a string flag. Sectors, leadership roles and board kinds
 * are classification records. A facility's boards and leaders are office and holder links to the
 * governance domain, so leadership is not a separate hard-coded role list.
 */
export const statistics = dryv.group({ name: "statistics" }).description("Periods, indicators, statistical tables and observations.").tags("public", "statistics");
export const services = dryv.group({ name: "services" }).description("Public services, amenities and service delivery.").tags("public", "services");

export const statisticsProperties = statistics.properties({
  Granularity: dryv.property.enum({
    day: "day",
    week: "week",
    month: "month",
    quarter: "quarter",
    year: "year",
    decade: "decade",
    century: "century",
    custom: "custom",
  }),
  ConfidenceLevel: dryv.property.enum({ high: "high", medium: "medium", low: "low", estimate: "estimate", projection: "projection" }),
  ColumnDataType: dryv.property.enum({ integer: "integer", decimal: "decimal", text: "text", boolean: "boolean", percentage: "percentage" }),
  UnitOfMeasure: dryv.property.string().length({ min: 1, max: 100 }),
  ObservationValue: dryv.property.number.decimal({ precision: 25, scale: 4 }),
});

export const servicesProperties = services.properties({
  DeliveryStatus: dryv.property.enum({ planned: "planned", operating: "operating", suspended: "suspended", closed: "closed" }),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const q = () => dryv.field(sharedProperties.Name).optional();

/* -------------------------------- Statistics ----------------------------------- */

const periods = statistics.schemas({
  Period: evidenced(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      granularity: dryv.field(statisticsProperties.Granularity).query({ filter: ["equal", "in"] }),
      startsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
      endsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "periods",
    [{ name: "idx_period_code", fields: ["code"], unique: true }],
  ),

  IndicatorCategory: evidenced(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label).query(searchable),
      parentId: optionalId(),
    },
    "indicator_categories",
    [{ name: "idx_indicator_category_code", fields: ["code"], unique: true }],
  ),
});

const indicators = statistics.schemas({
  Indicator: evidenced(
    {
      categoryId: relationTo(() => periods.IndicatorCategory.field("id")),
      parentId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      unitOfMeasure: dryv.field(statisticsProperties.UnitOfMeasure).optional().nullable(),
      definition: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "indicators",
    [{ name: "idx_indicator_code", fields: ["code"], unique: true }],
  ),
});

const indicatorColumns = statistics.schemas({
  IndicatorColumn: evidenced(
    {
      indicatorId: relationTo(() => indicators.Indicator.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label),
      dataType: dryv.field(statisticsProperties.ColumnDataType),
    },
    "indicator_columns",
    [{ name: "idx_indicator_column_code", fields: ["code"], unique: true }],
  ),

  StatisticsTable: evidenced(
    {
      jurisdictionId: relationTo(() => referenceSchemas.Jurisdiction.field("id")),
      indicatorId: optionalId(),
      geoUnitId: optionalId(),
      publisherInstitutionId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      title: dryv.field(sharedProperties.Name).query(searchable),
      methodology: dryv.field(sharedProperties.LongText).optional().nullable(),
      collector: dryv.field(sharedProperties.Name).optional().nullable(),
    },
    "statistics_tables",
    [{ name: "idx_statistics_table_code", fields: ["code"], unique: true }],
  ),
});

const observations = statistics.schemas({
  Observation: evidenced(
    {
      tableId: relationTo(() => indicatorColumns.StatisticsTable.field("id")),
      geoUnitId: optionalId(),
      indicatorId: plainId(),
      columnId: optionalId(),
      periodId: plainId(),
      numericValue: dryv.field(statisticsProperties.ObservationValue).optional().nullable().query({ filter: ["between"], sort: true }),
      textValue: dryv.field(sharedProperties.Description).optional().nullable(),
      confidenceLevel: dryv.field(statisticsProperties.ConfidenceLevel).query({ filter: ["equal", "in"] }),
    },
    "observations",
    [
      { name: "idx_observation_table", fields: ["tableId"] },
      { name: "idx_observation_lookup", fields: ["indicatorId", "periodId", "geoUnitId"] },
    ],
  ),
});

/* --------------------------------- Services ------------------------------------ */

const publicServices = services.schemas({
  PublicService: evidenced(
    {
      jurisdictionId: relationTo(() => referenceSchemas.Jurisdiction.field("id")),
      sectorId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      legalBasisId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "public_services",
    [{ name: "idx_public_service_code", fields: ["code"], unique: true }],
  ),

  Amenity: evidenced(
    {
      jurisdictionId: relationTo(() => referenceSchemas.Jurisdiction.field("id")),
      sectorId: plainId(),
      geoUnitId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      isActive: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
    },
    "amenities",
    [{ name: "idx_amenity_code", fields: ["code"], unique: true }, { name: "idx_amenity_geo", fields: ["geoUnitId"] }],
  ),
});

const amenityLinks = services.schemas({
  /** Boards and leadership of a facility are offices in the governance domain, typed by a classification. */
  AmenityOffice: evidenced(
    {
      amenityId: relationTo(() => publicServices.Amenity.field("id")),
      officeId: plainId(),
      roleKindId: optionalId(),
    },
    "amenity_offices",
    [{ name: "idx_amenity_office_amenity", fields: ["amenityId"] }],
  ),

  ServiceDelivery: evidenced(
    {
      amenityId: relationTo(() => publicServices.Amenity.field("id")),
      serviceId: plainId(),
      responsibleOfficeId: optionalId(),
      budgetId: optionalId(),
      status: dryv.field(servicesProperties.DeliveryStatus).query({ filter: ["equal", "in"] }),
    },
    "service_deliveries",
    [{ name: "idx_service_delivery_amenity", fields: ["amenityId"] }, { name: "idx_service_delivery_service", fields: ["serviceId"] }],
  ),
});

/* ------------------------------------ Reads ------------------------------------ */

function register(group: any, feature: string, description: string, specs: Parameters<typeof readSurface>[1][]) {
  const surfaces = specs.map((spec) => readSurface(group, spec));
  return group.feature(feature).description(description).tags("public").operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
}

export const statisticsReadOperations = register(statistics, "StatisticsRead", "Public read access to periods, indicators, tables and observations.", [
  { singular: "Period", plural: "Periods", itemKey: "period", listKey: "periods", path: "/statistics/periods", idParam: "periodId", entity: periods.Period, description: "periods", filters: { granularity: dryv.field(statisticsProperties.Granularity).optional() } },
  { singular: "IndicatorCategory", plural: "IndicatorCategories", itemKey: "category", listKey: "categories", path: "/statistics/indicator-categories", idParam: "categoryId", entity: periods.IndicatorCategory, description: "indicator categories", filters: { parentId: id() } },
  { singular: "Indicator", plural: "Indicators", itemKey: "indicator", listKey: "indicators", path: "/statistics/indicators", idParam: "indicatorId", entity: indicators.Indicator, description: "indicators", filters: { categoryId: id(), parentId: id(), q: q() } },
  { singular: "IndicatorColumn", plural: "IndicatorColumns", itemKey: "column", listKey: "columns", path: "/statistics/indicator-columns", idParam: "columnId", entity: indicatorColumns.IndicatorColumn, description: "indicator columns", filters: { indicatorId: id() } },
  { singular: "StatisticsTable", plural: "StatisticsTables", itemKey: "table", listKey: "tables", path: "/statistics/tables", idParam: "tableId", entity: indicatorColumns.StatisticsTable, description: "statistics tables", filters: { jurisdictionId: id(), indicatorId: id(), geoUnitId: id(), q: q() } },
  { singular: "Observation", plural: "Observations", itemKey: "observation", listKey: "observations", path: "/statistics/observations", idParam: "observationId", entity: observations.Observation, description: "observations", filters: { tableId: id(), indicatorId: id(), periodId: id(), geoUnitId: id(), confidenceLevel: dryv.field(statisticsProperties.ConfidenceLevel).optional() } },
]);

export const servicesReadOperations = register(services, "ServicesRead", "Public read access to public services, amenities and delivery.", [
  { singular: "PublicService", plural: "PublicServices", itemKey: "service", listKey: "services", path: "/services/services", idParam: "serviceId", entity: publicServices.PublicService, description: "public services", filters: { jurisdictionId: id(), sectorId: id(), q: q() } },
  { singular: "Amenity", plural: "Amenities", itemKey: "amenity", listKey: "amenities", path: "/services/amenities", idParam: "amenityId", entity: publicServices.Amenity, description: "amenities", filters: { jurisdictionId: id(), sectorId: id(), geoUnitId: id(), q: q() } },
  { singular: "AmenityOffice", plural: "AmenityOffices", itemKey: "amenityOffice", listKey: "amenityOffices", path: "/services/amenity-offices", idParam: "amenityOfficeId", entity: amenityLinks.AmenityOffice, description: "amenity offices", filters: { amenityId: id(), officeId: id() } },
  { singular: "ServiceDelivery", plural: "ServiceDeliveries", itemKey: "delivery", listKey: "deliveries", path: "/services/deliveries", idParam: "deliveryId", entity: amenityLinks.ServiceDelivery, description: "service deliveries", filters: { amenityId: id(), serviceId: id() } },
]);
