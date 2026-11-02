// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CLASSIFICATION_RECORD_RELATION_KEYS,
  CLASSIFICATION_RECORD_SORTABLE_FIELDS,
  CLASSIFICATION_RECORD_SEARCHABLE_FIELDS,
  CLASSIFICATION_RECORD_FILTERABLE_FIELDS,
  CLASSIFICATION_RECORD_DATE_RANGE_FIELDS,
  CLASSIFICATION_RECORD_SELECTABLE_FIELDS,
  CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS,
  CLASSIFICATION_RECORD_EDITABLE_FIELDS
} from './classification-record.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Classification Record */
export interface IClassificationRecord extends B.IBase {
  code: string;
  isCurrent: boolean;
  jurisdictionId: string;
  label: string;
  legalBasis: string | null;
  order: number | null;
  scheme: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ClassificationRecordKey = keyof IClassificationRecord;

export type ClassificationRecordRelationKey = (typeof CLASSIFICATION_RECORD_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IClassificationRecordReadonlyFields = B.IBaseReadonlyFields;

export type IClassificationRecordContextualFields = never;

export type IClassificationRecordSensitiveFields = never;

export type IClassificationRecordTransitionFields = never;

export type IClassificationRecordImmutableFields =
  | IClassificationRecordReadonlyFields
  | IClassificationRecordContextualFields
  | IClassificationRecordSensitiveFields
  | IClassificationRecordTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IClassificationRecordCreatable = Omit<IClassificationRecord, IClassificationRecordImmutableFields | ClassificationRecordRelationKey>;

export type IClassificationRecordSystemWritable = Omit<IClassificationRecord, B.IBaseReadonlyFields | ClassificationRecordRelationKey>;

export type IClassificationRecordUpdatable = Partial<Omit<IClassificationRecord, IClassificationRecordImmutableFields | ClassificationRecordRelationKey>>;

export interface IClassificationRecordTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ClassificationRecordSortableField = (typeof CLASSIFICATION_RECORD_SORTABLE_FIELDS)[number];

export type ClassificationRecordSearchableField = (typeof CLASSIFICATION_RECORD_SEARCHABLE_FIELDS)[number];

export type ClassificationRecordFilterableField = (typeof CLASSIFICATION_RECORD_FILTERABLE_FIELDS)[number];

export type ClassificationRecordDateRangeField = (typeof CLASSIFICATION_RECORD_DATE_RANGE_FIELDS)[number];

export type ClassificationRecordSelectableField = (typeof CLASSIFICATION_RECORD_SELECTABLE_FIELDS)[number];

export type ClassificationRecordDefaultSelectField = (typeof CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS)[number];

export type ClassificationRecordEditableField = (typeof CLASSIFICATION_RECORD_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IClassificationRecordAsOneRelationConfig = Q.IOneRelationConfig<'classificationRecord', ClassificationRecordSelectableField>;

export type IClassificationRecordAsManyRelationConfig = Q.IManyRelationConfig<'classificationRecords', ClassificationRecordSelectableField, ClassificationRecordSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IClassificationRecordAsOneRelationQuery = Q.IAsOneRelationQuery<IClassificationRecord, ClassificationRecordSelectableField>;

export type IClassificationRecordAsManyRelationQuery = Q.IAsManyRelationQuery<IClassificationRecord, ClassificationRecordSelectableField, ClassificationRecordSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IClassificationRecordRelationMap extends Record<ClassificationRecordRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IClassificationRecordRelationQueries = Q.IBaseRelationQueries<IClassificationRecord, ClassificationRecordRelationKey, IClassificationRecordRelationMap>;

export type IClassificationRecordItemQuery = Q.IBaseItemQuery<
  IClassificationRecord,
  ClassificationRecordRelationKey,
  ClassificationRecordSelectableField,
  ClassificationRecordRelationKey,
  ClassificationRecordSelectableField,
  IClassificationRecordRelationMap,
  IClassificationRecordRelationQueries
>;

export type IClassificationRecordListQuery = Q.IBaseListQuery<
  IClassificationRecord,
  ClassificationRecordRelationKey,
  ClassificationRecordSelectableField,
  ClassificationRecordSortableField,
  ClassificationRecordRelationKey,
  ClassificationRecordSelectableField,
  ClassificationRecordSortableField,
  ClassificationRecordDateRangeField,
  ClassificationRecordFilterableField,
  IClassificationRecordRelationMap,
  IClassificationRecordRelationQueries,
  IClassificationRecordItemQuery
>;