// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';
import * as ClassificationRecordConfig from '#/modules/reference/types/classification-record.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IGeoUnit,
  GeoUnitKey,
  GeoUnitRelationKey,
  GeoUnitSortableField,
  GeoUnitFilterableField,
  GeoUnitDateRangeField,
  GeoUnitSelectableField,
  IGeoUnitAsOneRelationConfig,
  IGeoUnitAsManyRelationConfig
} from './geo-unit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_UNIT_RELATION_KEYS = ['jurisdiction', 'classificationRecord', ] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'parentId', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_FILTERABLE_FIELDS = ['code', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'method', 'name', 'parentId', 'verificationState', 'version', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'licence', 'method', 'name', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoUnitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'licence', 'method', 'name', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_UNIT_AS_ONE_RELATION_CONFIG = {
  relation: 'geoUnit',
  type: ERelationType.One,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoUnitAsOneRelationConfig;

export const GEO_UNIT_AS_MANY_RELATION_CONFIG = {
  relation: 'geoUnits',
  type: ERelationType.Many,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoUnitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeoUnitRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
  Q.createRelationKeyMapper<GeoUnitRelationKey>().one(ClassificationRecordConfig.CLASSIFICATION_RECORD_AS_ONE_RELATION_CONFIG, 'classificationRecord'),
] as const;

export const GEO_UNIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_QUERY_OPTIONS = {
  searchableFields: GEO_UNIT_SEARCHABLE_FIELDS,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_SORTABLE_FIELDS,
  filterFields: GEO_UNIT_FILTERABLE_FIELDS,
  dateRangeFields: GEO_UNIT_DATE_RANGE_FIELDS,
  oneRelations: GEO_UNIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_UNIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoUnit,
  GeoUnitSortableField,
  GeoUnitSelectableField,
  GeoUnitFilterableField,
  GeoUnitDateRangeField,
  GeoUnitRelationKey,
  typeof GEO_UNIT_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_UNIT_MANY_RELATION_QUERY_OPTIONS
>;