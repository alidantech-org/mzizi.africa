// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STATISTICS_TABLE_RELATION_KEYS,
  STATISTICS_TABLE_SORTABLE_FIELDS,
  STATISTICS_TABLE_SEARCHABLE_FIELDS,
  STATISTICS_TABLE_FILTERABLE_FIELDS,
  STATISTICS_TABLE_DATE_RANGE_FIELDS,
  STATISTICS_TABLE_SELECTABLE_FIELDS,
  STATISTICS_TABLE_DEFAULT_SELECT_FIELDS,
  STATISTICS_TABLE_EDITABLE_FIELDS
} from './statistics-table.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Statistics Table */
export interface IStatisticsTable extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  collector: string | null;
  confidence: number | null;
  geoUnitId: string | null;
  indicatorId: string | null;
  isCurrent: boolean;
  jurisdictionId: string;
  licence: string | null;
  method: ProvenanceMethod;
  methodology: string | null;
  publisherInstitutionId: string | null;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  title: string;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StatisticsTableKey = keyof IStatisticsTable;

export type StatisticsTableRelationKey = (typeof STATISTICS_TABLE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStatisticsTableReadonlyFields = B.IBaseReadonlyFields;

export type IStatisticsTableContextualFields = never;

export type IStatisticsTableSensitiveFields = never;

export type IStatisticsTableTransitionFields = never;

export type IStatisticsTableImmutableFields =
  | IStatisticsTableReadonlyFields
  | IStatisticsTableContextualFields
  | IStatisticsTableSensitiveFields
  | IStatisticsTableTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStatisticsTableCreatable = Omit<IStatisticsTable, IStatisticsTableImmutableFields | StatisticsTableRelationKey>;

export type IStatisticsTableSystemWritable = Omit<IStatisticsTable, B.IBaseReadonlyFields | StatisticsTableRelationKey>;

export type IStatisticsTableUpdatable = Partial<Omit<IStatisticsTable, IStatisticsTableImmutableFields | StatisticsTableRelationKey>>;

export interface IStatisticsTableTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StatisticsTableSortableField = (typeof STATISTICS_TABLE_SORTABLE_FIELDS)[number];

export type StatisticsTableSearchableField = (typeof STATISTICS_TABLE_SEARCHABLE_FIELDS)[number];

export type StatisticsTableFilterableField = (typeof STATISTICS_TABLE_FILTERABLE_FIELDS)[number];

export type StatisticsTableDateRangeField = (typeof STATISTICS_TABLE_DATE_RANGE_FIELDS)[number];

export type StatisticsTableSelectableField = (typeof STATISTICS_TABLE_SELECTABLE_FIELDS)[number];

export type StatisticsTableDefaultSelectField = (typeof STATISTICS_TABLE_DEFAULT_SELECT_FIELDS)[number];

export type StatisticsTableEditableField = (typeof STATISTICS_TABLE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStatisticsTableAsOneRelationConfig = Q.IOneRelationConfig<'statisticsTable', StatisticsTableSelectableField>;

export type IStatisticsTableAsManyRelationConfig = Q.IManyRelationConfig<'statisticsTables', StatisticsTableSelectableField, StatisticsTableSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStatisticsTableAsOneRelationQuery = Q.IAsOneRelationQuery<IStatisticsTable, StatisticsTableSelectableField>;

export type IStatisticsTableAsManyRelationQuery = Q.IAsManyRelationQuery<IStatisticsTable, StatisticsTableSelectableField, StatisticsTableSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStatisticsTableRelationMap extends Record<StatisticsTableRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStatisticsTableRelationQueries = Q.IBaseRelationQueries<IStatisticsTable, StatisticsTableRelationKey, IStatisticsTableRelationMap>;

export type IStatisticsTableItemQuery = Q.IBaseItemQuery<
  IStatisticsTable,
  StatisticsTableRelationKey,
  StatisticsTableSelectableField,
  StatisticsTableRelationKey,
  StatisticsTableSelectableField,
  IStatisticsTableRelationMap,
  IStatisticsTableRelationQueries
>;

export type IStatisticsTableListQuery = Q.IBaseListQuery<
  IStatisticsTable,
  StatisticsTableRelationKey,
  StatisticsTableSelectableField,
  StatisticsTableSortableField,
  StatisticsTableRelationKey,
  StatisticsTableSelectableField,
  StatisticsTableSortableField,
  StatisticsTableDateRangeField,
  StatisticsTableFilterableField,
  IStatisticsTableRelationMap,
  IStatisticsTableRelationQueries,
  IStatisticsTableItemQuery
>;