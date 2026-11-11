import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { recorded, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
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
export const statistics = dryv
  .group({ name: "statistics" })
  .description("Periods, indicators, statistical tables and observations.")
  .tags("public", "statistics")
  .facets({ storage: { namespace: "statistical" } });
export const services = dryv
  .group({ name: "services" })
  .description("Public services, amenities and service delivery.")
  .tags("public", "services")
  .facets({ storage: { namespace: "civic" } });

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
  ColumnDataType: dryv.property.enum({
    integer: "integer",
    decimal: "decimal",
    text: "text",
    boolean: "boolean",
    percentage: "percentage",
  }),
  UnitOfMeasure: dryv.property.string().length({ min: 1, max: 100 }),
  ObservationValue: dryv.property.number.decimal({ precision: 25, scale: 4 }),
  MeasureType: dryv.property.enum({
    count: "count",
    rate: "rate",
    ratio: "ratio",
    percentage: "percentage",
    index: "index",
    mean: "mean",
    median: "median",
    other: "other",
  }),
  EstimateKind: dryv.property.enum({
    census: "census",
    projection: "projection",
    survey: "survey",
    administrative: "administrative",
    derived: "derived",
  }),
  ReleaseLabel: dryv.property.string().length({ min: 1, max: 200 }),
  SortOrder: dryv.property.number.integer({ range: { min: 0 } }),
});

export const servicesProperties = services.properties({
  DeliveryStatus: dryv.property.enum({ planned: "planned", operating: "operating", suspended: "suspended", closed: "closed" }),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const q = () => dryv.field(sharedProperties.Name).optional();

/* -------------------------------- Statistics ----------------------------------- */

const periods = statistics.schemas({
  Period: recorded(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      granularity: dryv.field(statisticsProperties.Granularity).query({ filter: ["equal", "in"] }),
      startsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
      endsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "periods",
    [{ name: "idx_period_code", fields: ["code"], unique: true }],
  ),

  IndicatorCategory: recorded(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label).query(searchable),
      parentId: optionalId(),
    },
    "categories",
    [{ name: "idx_indicator_category_code", fields: ["code"], unique: true }],
  ),
});

const indicators = statistics.schemas({
  Indicator: recorded(
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
  IndicatorColumn: recorded(
    {
      indicatorId: relationTo(() => indicators.Indicator.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label),
      dataType: dryv.field(statisticsProperties.ColumnDataType),
    },
    "fields",
    [{ name: "idx_indicator_column_code", fields: ["code"], unique: true }],
  ),

  StatisticsTable: recorded(
    {
      jurisdictionId: plainId(),
      indicatorId: optionalId(),
      geoUnitId: optionalId(),
      publisherInstitutionId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      title: dryv.field(sharedProperties.Name).query(searchable),
      methodology: dryv.field(sharedProperties.LongText).optional().nullable(),
      collector: dryv.field(sharedProperties.Name).optional().nullable(),
    },
    "datasets",
    [{ name: "idx_statistics_table_code", fields: ["code"], unique: true }],
  ),
});

/**
 * Dimensions: a figure broken down by sex, age group, community, religion, urban or rural, and so on is one
 * observation with one row per dimension in observation_dimensions (design decision: dimension tables, not a JSON
 * column, so members have hierarchy and reference codes and can be queried, joined and constrained).
 */
const dimensions = statistics.schemas({
  Dimension: recorded(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "dimensions",
    [{ name: "idx_dimension_code", fields: ["code"], unique: true }],
  ),
  Vintage: recorded(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(statisticsProperties.ReleaseLabel).query(searchable),
      releasedOn: dryv.field(sharedProperties.Date).optional().nullable(),
      supersedesId: optionalId(),
      publisherInstitutionId: optionalId(),
    },
    "vintages",
    [{ name: "idx_vintage_code", fields: ["code"], unique: true }],
  ),
});

const dimensionMembers = statistics.schemas({
  DimensionMember: recorded(
    {
      dimensionId: relationTo(() => dimensions.Dimension.field("id")),
      parentId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label).query(searchable),
      referenceCode: dryv.field(sharedProperties.BusinessCode).optional().nullable(),
      sortOrder: dryv.field(statisticsProperties.SortOrder).optional().nullable(),
    },
    "dimension_members",
    [
      { name: "idx_dimension_member_code", fields: ["dimensionId", "code"], unique: true },
      { name: "idx_dimension_member_parent", fields: ["parentId"] },
    ],
  ),
});

const observations = statistics.schemas({
  Observation: recorded(
    {
      tableId: relationTo(() => indicatorColumns.StatisticsTable.field("id")),
      geoUnitId: optionalId(),
      indicatorId: plainId(),
      columnId: optionalId(),
      periodId: plainId(),
      numericValue: dryv
        .field(statisticsProperties.ObservationValue)
        .optional()
        .nullable()
        .query({ filter: ["between"], sort: true }),
      textValue: dryv.field(sharedProperties.Description).optional().nullable(),
      confidenceLevel: dryv.field(statisticsProperties.ConfidenceLevel).query({ filter: ["equal", "in"] }),
      measureType: dryv
        .field(statisticsProperties.MeasureType)
        .optional()
        .nullable()
        .query({ filter: ["equal", "in"] }),
      estimateKind: dryv
        .field(statisticsProperties.EstimateKind)
        .optional()
        .nullable()
        .query({ filter: ["equal", "in"] }),
      denominatorObservationId: optionalId(),
      denominatorValue: dryv.field(statisticsProperties.ObservationValue).optional().nullable(),
      marginOfError: dryv.field(statisticsProperties.ObservationValue).optional().nullable(),
      standardError: dryv.field(statisticsProperties.ObservationValue).optional().nullable(),
      vintageId: optionalId(),
      releaseLabel: dryv.field(statisticsProperties.ReleaseLabel).optional().nullable(),
    },
    "observations",
    [
      { name: "idx_observation_table", fields: ["tableId"] },
      { name: "idx_observation_lookup", fields: ["indicatorId", "periodId", "geoUnitId"] },
      { name: "idx_observation_vintage", fields: ["vintageId"] },
    ],
  ),
});

const observationLinks = statistics.schemas({
  ObservationDimension: recorded(
    {
      observationId: relationTo(() => observations.Observation.field("id")),
      dimensionId: plainId(),
      memberId: plainId(),
    },
    "observation_dimensions",
    [
      { name: "idx_observation_dimension_unique", fields: ["observationId", "dimensionId"], unique: true },
      { name: "idx_observation_dimension_member", fields: ["memberId"] },
    ],
  ),
  /** A computed value names its inputs and the method; an observation may have many inputs. */
  ObservationDerivation: recorded(
    {
      observationId: relationTo(() => observations.Observation.field("id")),
      inputObservationId: plainId(),
      computation: dryv.field(sharedProperties.Name),
      inputRole: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "observation_derivations",
    [
      { name: "idx_observation_derivation_observation", fields: ["observationId"] },
      { name: "idx_observation_derivation_input", fields: ["inputObservationId"] },
    ],
  ),
});

/* --------------------------------- Services ------------------------------------ */

const publicServices = services.schemas({
  PublicService: recorded(
    {
      jurisdictionId: plainId(),
      sectorId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      legalBasisId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "services",
    [{ name: "idx_public_service_code", fields: ["code"], unique: true }],
  ),

  Amenity: recorded(
    {
      jurisdictionId: plainId(),
      sectorId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      isActive: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
    },
    "amenities",
    [{ name: "idx_amenity_code", fields: ["code"], unique: true }],
  ),
});

const amenityLinks = services.schemas({
  /** Boards and leadership of a facility are offices in the governance domain, typed by a classification. */
  AmenityOffice: recorded(
    {
      amenityId: relationTo(() => publicServices.Amenity.field("id")),
      officeId: plainId(),
      roleKindId: optionalId(),
    },
    "posts",
    [{ name: "idx_amenity_office_amenity", fields: ["amenityId"] }],
  ),

  ServiceDelivery: recorded(
    {
      amenityId: relationTo(() => publicServices.Amenity.field("id")),
      serviceId: plainId(),
      responsibleOfficeId: optionalId(),
      budgetId: optionalId(),
      status: dryv.field(servicesProperties.DeliveryStatus).query({ filter: ["equal", "in"] }),
    },
    "deliveries",
    [
      { name: "idx_service_delivery_amenity", fields: ["amenityId"] },
      { name: "idx_service_delivery_service", fields: ["serviceId"] },
    ],
  ),
});

/* ------------------------------------ Reads ------------------------------------ */

function register(group: any, feature: string, description: string, specs: Parameters<typeof readSurface>[1][]) {
  const surfaces = specs.map((spec) => readSurface(group, spec));
  return group
    .feature(feature)
    .description(description)
    .tags("public")
    .operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
}

export const statisticsReadOperations = register(
  statistics,
  "StatisticsRead",
  "Public read access to periods, indicators, tables and observations.",
  [
    {
      singular: "Period",
      plural: "Periods",
      itemKey: "period",
      listKey: "periods",
      path: "/statistics/periods",
      idParam: "periodId",
      entity: periods.Period,
      description: "periods",
      filters: { granularity: dryv.field(statisticsProperties.Granularity).optional() },
    },
    {
      singular: "IndicatorCategory",
      plural: "IndicatorCategories",
      itemKey: "category",
      listKey: "categories",
      path: "/statistics/indicator-categories",
      idParam: "categoryId",
      entity: periods.IndicatorCategory,
      description: "indicator categories",
      filters: { parentId: id() },
    },
    {
      singular: "Indicator",
      plural: "Indicators",
      itemKey: "indicator",
      listKey: "indicators",
      path: "/statistics/indicators",
      idParam: "indicatorId",
      entity: indicators.Indicator,
      description: "indicators",
      filters: { categoryId: id(), parentId: id(), q: q() },
    },
    {
      singular: "IndicatorColumn",
      plural: "IndicatorColumns",
      itemKey: "column",
      listKey: "columns",
      path: "/statistics/indicator-columns",
      idParam: "columnId",
      entity: indicatorColumns.IndicatorColumn,
      description: "indicator columns",
      filters: { indicatorId: id() },
    },
    {
      singular: "StatisticsTable",
      plural: "StatisticsTables",
      itemKey: "table",
      listKey: "tables",
      path: "/statistics/tables",
      idParam: "tableId",
      entity: indicatorColumns.StatisticsTable,
      description: "statistics tables",
      filters: { jurisdictionId: id(), indicatorId: id(), geoUnitId: id(), q: q() },
    },
    {
      singular: "Dimension",
      plural: "Dimensions",
      itemKey: "dimension",
      listKey: "dimensions",
      path: "/statistics/dimensions",
      idParam: "dimensionId",
      entity: dimensions.Dimension,
      description: "dimensions",
      filters: { q: q() },
    },
    {
      singular: "DimensionMember",
      plural: "DimensionMembers",
      itemKey: "member",
      listKey: "members",
      path: "/statistics/dimension-members",
      idParam: "memberId",
      entity: dimensionMembers.DimensionMember,
      description: "dimension members",
      filters: { dimensionId: id(), parentId: id(), q: q() },
    },
    {
      singular: "Vintage",
      plural: "Vintages",
      itemKey: "vintage",
      listKey: "vintages",
      path: "/statistics/vintages",
      idParam: "vintageId",
      entity: dimensions.Vintage,
      description: "release vintages",
      filters: { q: q() },
    },
    {
      singular: "ObservationDimension",
      plural: "ObservationDimensions",
      itemKey: "observationDimension",
      listKey: "observationDimensions",
      path: "/statistics/observation-dimensions",
      idParam: "observationDimensionId",
      entity: observationLinks.ObservationDimension,
      description: "observation dimensions",
      filters: { observationId: id(), dimensionId: id(), memberId: id() },
    },
    {
      singular: "ObservationDerivation",
      plural: "ObservationDerivations",
      itemKey: "derivation",
      listKey: "derivations",
      path: "/statistics/observation-derivations",
      idParam: "derivationId",
      entity: observationLinks.ObservationDerivation,
      description: "observation derivations",
      filters: { observationId: id(), inputObservationId: id() },
    },
    {
      singular: "Observation",
      plural: "Observations",
      itemKey: "observation",
      listKey: "observations",
      path: "/statistics/observations",
      idParam: "observationId",
      entity: observations.Observation,
      description: "observations",
      filters: {
        tableId: id(),
        indicatorId: id(),
        periodId: id(),
        geoUnitId: id(),
        confidenceLevel: dryv.field(statisticsProperties.ConfidenceLevel).optional(),
        vintageId: id(),
      },
    },
  ],
);

export const servicesReadOperations = register(services, "ServicesRead", "Public read access to public services, amenities and delivery.", [
  {
    singular: "PublicService",
    plural: "PublicServices",
    itemKey: "service",
    listKey: "services",
    path: "/services/services",
    idParam: "serviceId",
    entity: publicServices.PublicService,
    description: "public services",
    filters: { jurisdictionId: id(), sectorId: id(), q: q() },
  },
  {
    singular: "Amenity",
    plural: "Amenities",
    itemKey: "amenity",
    listKey: "amenities",
    path: "/services/amenities",
    idParam: "amenityId",
    entity: publicServices.Amenity,
    description: "amenities",
    filters: { jurisdictionId: id(), sectorId: id(), q: q() },
  },
  {
    singular: "AmenityOffice",
    plural: "AmenityOffices",
    itemKey: "amenityOffice",
    listKey: "amenityOffices",
    path: "/services/amenity-offices",
    idParam: "amenityOfficeId",
    entity: amenityLinks.AmenityOffice,
    description: "amenity offices",
    filters: { amenityId: id(), officeId: id() },
  },
  {
    singular: "ServiceDelivery",
    plural: "ServiceDeliveries",
    itemKey: "delivery",
    listKey: "deliveries",
    path: "/services/deliveries",
    idParam: "deliveryId",
    entity: amenityLinks.ServiceDelivery,
    description: "service deliveries",
    filters: { amenityId: id(), serviceId: id() },
  },
]);
