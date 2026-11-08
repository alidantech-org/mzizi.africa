// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IClassificationRecord,
  ClassificationRecordKey,
  ClassificationRecordRelationKey,
  ClassificationRecordSortableField,
  ClassificationRecordFilterableField,
  ClassificationRecordDateRangeField,
  ClassificationRecordSelectableField,
  IClassificationRecordAsOneRelationConfig,
  IClassificationRecordAsManyRelationConfig
} from './classification-record.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CLASSIFICATION_RECORD_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly ClassificationRecordKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CLASSIFICATION_RECORD_SORTABLE_FIELDS = ['code', 'createdAt', 'label', 'order', 'scheme', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ClassificationRecordKey[];

export const CLASSIFICATION_RECORD_SEARCHABLE_FIELDS = ['code', 'label', ] as const satisfies readonly ClassificationRecordKey[];

export const CLASSIFICATION_RECORD_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'jurisdictionId', 'label', 'scheme', 'version', ] as const satisfies readonly ClassificationRecordKey[];

export const CLASSIFICATION_RECORD_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ClassificationRecordKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CLASSIFICATION_RECORD_SELECTABLE_FIELDS = ['code', 'createdAt', 'emblemExpected', 'flagExpected', 'id', 'isCurrent', 'jurisdictionId', 'label', 'legalBasis', 'order', 'scheme', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ClassificationRecordKey[];

export const CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ClassificationRecordSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CLASSIFICATION_RECORD_EDITABLE_FIELDS = ['code', 'emblemExpected', 'flagExpected', 'isCurrent', 'jurisdictionId', 'label', 'legalBasis', 'order', 'scheme', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ClassificationRecordKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CLASSIFICATION_RECORD_AS_ONE_RELATION_CONFIG = {
  relation: 'classificationRecord',
  type: ERelationType.One,
  selectableFields: CLASSIFICATION_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS
} as const satisfies IClassificationRecordAsOneRelationConfig;

export const CLASSIFICATION_RECORD_AS_MANY_RELATION_CONFIG = {
  relation: 'classificationRecords',
  type: ERelationType.Many,
  selectableFields: CLASSIFICATION_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS,
  sortableFields: CLASSIFICATION_RECORD_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IClassificationRecordAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CLASSIFICATION_RECORD_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ClassificationRecordRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const CLASSIFICATION_RECORD_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CLASSIFICATION_RECORD_QUERY_OPTIONS = {
  searchableFields: CLASSIFICATION_RECORD_SEARCHABLE_FIELDS,
  selectableFields: CLASSIFICATION_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATION_RECORD_DEFAULT_SELECT_FIELDS,
  sortableFields: CLASSIFICATION_RECORD_SORTABLE_FIELDS,
  filterFields: CLASSIFICATION_RECORD_FILTERABLE_FIELDS,
  dateRangeFields: CLASSIFICATION_RECORD_DATE_RANGE_FIELDS,
  oneRelations: CLASSIFICATION_RECORD_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CLASSIFICATION_RECORD_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IClassificationRecord,
  ClassificationRecordSortableField,
  ClassificationRecordSelectableField,
  ClassificationRecordFilterableField,
  ClassificationRecordDateRangeField,
  ClassificationRecordRelationKey,
  typeof CLASSIFICATION_RECORD_ONE_RELATION_QUERY_OPTIONS,
  typeof CLASSIFICATION_RECORD_MANY_RELATION_QUERY_OPTIONS
>;