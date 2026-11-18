// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ArtifactsTypes from "#/modules/source/schema/types/artifacts/artifacts.types";
import type * as ObligationsTypes from "#/modules/governance/schema/types/obligations/obligations.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REPORTS_RELATION_KEYS,
  REPORTS_SORTABLE_FIELDS,
  REPORTS_SEARCHABLE_FIELDS,
  REPORTS_FILTERABLE_FIELDS,
  REPORTS_DATE_RANGE_FIELDS,
  REPORTS_SELECTABLE_FIELDS,
  REPORTS_DEFAULT_SELECT_FIELDS,
  REPORTS_EDITABLE_FIELDS,
} from "./reports.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row. */
export interface IReports extends B.IBase {
  artifactId: string | null;
  code: string;
  dueOn: Date | null;
  filedOn: Date | null;
  obligationId: string;
  periodFrom: Date | null;
  periodUntil: Date | null;
  reporterEntityId: string;
  sourceCitationId: string | null;
  statusId: string;
  readonly artifact?: ArtifactsTypes.IArtifacts;
  readonly obligation?: ObligationsTypes.IObligations;
  readonly reporterEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReportsKey = keyof IReports;

export type ReportsRelationKey = (typeof REPORTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReportsReadonlyFields = B.IBaseReadonlyFields;

export type IReportsContextualFields = never;

export type IReportsSensitiveFields = never;

export type IReportsTransitionFields = never;

export type IReportsImmutableFields =
  | IReportsReadonlyFields
  | IReportsContextualFields
  | IReportsSensitiveFields
  | IReportsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReportsCreatable = Omit<IReports, IReportsImmutableFields | ReportsRelationKey>;

export type IReportsSystemWritable = Omit<IReports, B.IBaseReadonlyFields | ReportsRelationKey>;

export type IReportsUpdatable = Partial<
  Omit<IReports, IReportsImmutableFields | ReportsRelationKey>
>;

export interface IReportsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReportsSortableField = (typeof REPORTS_SORTABLE_FIELDS)[number];

export type ReportsSearchableField = (typeof REPORTS_SEARCHABLE_FIELDS)[number];

export type ReportsFilterableField = (typeof REPORTS_FILTERABLE_FIELDS)[number];

export type ReportsDateRangeField = (typeof REPORTS_DATE_RANGE_FIELDS)[number];

export type ReportsSelectableField = (typeof REPORTS_SELECTABLE_FIELDS)[number];

export type ReportsDefaultSelectField = (typeof REPORTS_DEFAULT_SELECT_FIELDS)[number];

export type ReportsEditableField = (typeof REPORTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReportsAsOneRelationConfig = Q.IOneRelationConfig<"reports", ReportsSelectableField>;

export type IReportsAsManyRelationConfig = Q.IManyRelationConfig<
  "reports",
  ReportsSelectableField,
  ReportsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReportsAsOneRelationQuery = Q.IAsOneRelationQuery<IReports, ReportsSelectableField>;

export type IReportsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IReports,
  ReportsSelectableField,
  ReportsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReportsRelationMap extends Record<ReportsRelationKey, unknown> {
  artifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  obligation: ObligationsTypes.IObligationsAsOneRelationQuery;
  reporterEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReportsRelationQueries = Q.IBaseRelationQueries<
  IReports,
  ReportsRelationKey,
  IReportsRelationMap
>;

export type IReportsItemQuery = Q.IBaseItemQuery<
  IReports,
  ReportsRelationKey,
  ReportsSelectableField,
  ReportsRelationKey,
  ReportsSelectableField,
  IReportsRelationMap,
  IReportsRelationQueries
>;

export type IReportsListQuery = Q.IBaseListQuery<
  IReports,
  ReportsRelationKey,
  ReportsSelectableField,
  ReportsSortableField,
  ReportsRelationKey,
  ReportsSelectableField,
  ReportsSortableField,
  ReportsDateRangeField,
  ReportsFilterableField,
  IReportsRelationMap,
  IReportsRelationQueries,
  IReportsItemQuery
>;
