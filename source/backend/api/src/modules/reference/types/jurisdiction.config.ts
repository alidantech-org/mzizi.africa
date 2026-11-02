// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IJurisdiction,
  JurisdictionKey,
  JurisdictionRelationKey,
  JurisdictionSortableField,
  JurisdictionFilterableField,
  JurisdictionDateRangeField,
  JurisdictionSelectableField,
  IJurisdictionAsOneRelationConfig,
  IJurisdictionAsManyRelationConfig
} from './jurisdiction.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const JURISDICTION_RELATION_KEYS = [] as const satisfies readonly JurisdictionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const JURISDICTION_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly JurisdictionKey[];

export const JURISDICTION_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly JurisdictionKey[];

export const JURISDICTION_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'kind', 'method', 'name', 'verificationState', 'version', ] as const satisfies readonly JurisdictionKey[];

export const JURISDICTION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly JurisdictionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const JURISDICTION_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'id', 'isCurrent', 'kind', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly JurisdictionKey[];

export const JURISDICTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly JurisdictionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const JURISDICTION_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'isCurrent', 'kind', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly JurisdictionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const JURISDICTION_AS_ONE_RELATION_CONFIG = {
  relation: 'jurisdiction',
  type: ERelationType.One,
  selectableFields: JURISDICTION_SELECTABLE_FIELDS,
  defaultSelectFields: JURISDICTION_DEFAULT_SELECT_FIELDS
} as const satisfies IJurisdictionAsOneRelationConfig;

export const JURISDICTION_AS_MANY_RELATION_CONFIG = {
  relation: 'jurisdictions',
  type: ERelationType.Many,
  selectableFields: JURISDICTION_SELECTABLE_FIELDS,
  defaultSelectFields: JURISDICTION_DEFAULT_SELECT_FIELDS,
  sortableFields: JURISDICTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IJurisdictionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const JURISDICTION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const JURISDICTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const JURISDICTION_QUERY_OPTIONS = {
  searchableFields: JURISDICTION_SEARCHABLE_FIELDS,
  selectableFields: JURISDICTION_SELECTABLE_FIELDS,
  defaultSelectFields: JURISDICTION_DEFAULT_SELECT_FIELDS,
  sortableFields: JURISDICTION_SORTABLE_FIELDS,
  filterFields: JURISDICTION_FILTERABLE_FIELDS,
  dateRangeFields: JURISDICTION_DATE_RANGE_FIELDS,
  oneRelations: JURISDICTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: JURISDICTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IJurisdiction,
  JurisdictionSortableField,
  JurisdictionSelectableField,
  JurisdictionFilterableField,
  JurisdictionDateRangeField,
  JurisdictionRelationKey,
  typeof JURISDICTION_ONE_RELATION_QUERY_OPTIONS,
  typeof JURISDICTION_MANY_RELATION_QUERY_OPTIONS
>;