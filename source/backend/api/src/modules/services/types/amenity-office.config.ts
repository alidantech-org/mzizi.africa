// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AmenityConfig from '#/modules/services/types/amenity.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAmenityOffice,
  AmenityOfficeKey,
  AmenityOfficeRelationKey,
  AmenityOfficeSortableField,
  AmenityOfficeFilterableField,
  AmenityOfficeDateRangeField,
  AmenityOfficeSelectableField,
  IAmenityOfficeAsOneRelationConfig,
  IAmenityOfficeAsManyRelationConfig
} from './amenity-office.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const AMENITY_OFFICE_RELATION_KEYS = ['amenity', ] as const satisfies readonly AmenityOfficeKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const AMENITY_OFFICE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly AmenityOfficeKey[];

export const AMENITY_OFFICE_SEARCHABLE_FIELDS = [] as const satisfies readonly AmenityOfficeKey[];

export const AMENITY_OFFICE_FILTERABLE_FIELDS = ['amenityId', 'id', 'isCurrent', 'officeId', 'roleKindId', 'version', ] as const satisfies readonly AmenityOfficeKey[];

export const AMENITY_OFFICE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly AmenityOfficeKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const AMENITY_OFFICE_SELECTABLE_FIELDS = ['amenityId', 'createdAt', 'id', 'isCurrent', 'officeId', 'roleKindId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AmenityOfficeKey[];

export const AMENITY_OFFICE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AmenityOfficeSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const AMENITY_OFFICE_EDITABLE_FIELDS = ['amenityId', 'isCurrent', 'officeId', 'roleKindId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AmenityOfficeKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const AMENITY_OFFICE_AS_ONE_RELATION_CONFIG = {
  relation: 'amenityOffice',
  type: ERelationType.One,
  selectableFields: AMENITY_OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_OFFICE_DEFAULT_SELECT_FIELDS
} as const satisfies IAmenityOfficeAsOneRelationConfig;

export const AMENITY_OFFICE_AS_MANY_RELATION_CONFIG = {
  relation: 'amenityOffices',
  type: ERelationType.Many,
  selectableFields: AMENITY_OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_OFFICE_DEFAULT_SELECT_FIELDS,
  sortableFields: AMENITY_OFFICE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAmenityOfficeAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const AMENITY_OFFICE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AmenityOfficeRelationKey>().one(AmenityConfig.AMENITY_AS_ONE_RELATION_CONFIG, 'amenity'),
] as const;

export const AMENITY_OFFICE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const AMENITY_OFFICE_QUERY_OPTIONS = {
  searchableFields: AMENITY_OFFICE_SEARCHABLE_FIELDS,
  selectableFields: AMENITY_OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_OFFICE_DEFAULT_SELECT_FIELDS,
  sortableFields: AMENITY_OFFICE_SORTABLE_FIELDS,
  filterFields: AMENITY_OFFICE_FILTERABLE_FIELDS,
  dateRangeFields: AMENITY_OFFICE_DATE_RANGE_FIELDS,
  oneRelations: AMENITY_OFFICE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: AMENITY_OFFICE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAmenityOffice,
  AmenityOfficeSortableField,
  AmenityOfficeSelectableField,
  AmenityOfficeFilterableField,
  AmenityOfficeDateRangeField,
  AmenityOfficeRelationKey,
  typeof AMENITY_OFFICE_ONE_RELATION_QUERY_OPTIONS,
  typeof AMENITY_OFFICE_MANY_RELATION_QUERY_OPTIONS
>;