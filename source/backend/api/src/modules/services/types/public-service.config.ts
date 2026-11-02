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
  IPublicService,
  PublicServiceKey,
  PublicServiceRelationKey,
  PublicServiceSortableField,
  PublicServiceFilterableField,
  PublicServiceDateRangeField,
  PublicServiceSelectableField,
  IPublicServiceAsOneRelationConfig,
  IPublicServiceAsManyRelationConfig
} from './public-service.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PUBLIC_SERVICE_RELATION_KEYS = [] as const satisfies readonly PublicServiceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PUBLIC_SERVICE_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PublicServiceKey[];

export const PUBLIC_SERVICE_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly PublicServiceKey[];

export const PUBLIC_SERVICE_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'sectorId', 'version', ] as const satisfies readonly PublicServiceKey[];

export const PUBLIC_SERVICE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PublicServiceKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PUBLIC_SERVICE_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'sectorId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PublicServiceKey[];

export const PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PublicServiceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PUBLIC_SERVICE_EDITABLE_FIELDS = ['code', 'description', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'sectorId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PublicServiceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PUBLIC_SERVICE_AS_ONE_RELATION_CONFIG = {
  relation: 'publicService',
  type: ERelationType.One,
  selectableFields: PUBLIC_SERVICE_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS
} as const satisfies IPublicServiceAsOneRelationConfig;

export const PUBLIC_SERVICE_AS_MANY_RELATION_CONFIG = {
  relation: 'publicServices',
  type: ERelationType.Many,
  selectableFields: PUBLIC_SERVICE_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLIC_SERVICE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPublicServiceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PUBLIC_SERVICE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PUBLIC_SERVICE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PUBLIC_SERVICE_QUERY_OPTIONS = {
  searchableFields: PUBLIC_SERVICE_SEARCHABLE_FIELDS,
  selectableFields: PUBLIC_SERVICE_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLIC_SERVICE_SORTABLE_FIELDS,
  filterFields: PUBLIC_SERVICE_FILTERABLE_FIELDS,
  dateRangeFields: PUBLIC_SERVICE_DATE_RANGE_FIELDS,
  oneRelations: PUBLIC_SERVICE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PUBLIC_SERVICE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPublicService,
  PublicServiceSortableField,
  PublicServiceSelectableField,
  PublicServiceFilterableField,
  PublicServiceDateRangeField,
  PublicServiceRelationKey,
  typeof PUBLIC_SERVICE_ONE_RELATION_QUERY_OPTIONS,
  typeof PUBLIC_SERVICE_MANY_RELATION_QUERY_OPTIONS
>;