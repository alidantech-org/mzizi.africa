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
  IVintage,
  VintageKey,
  VintageRelationKey,
  VintageSortableField,
  VintageFilterableField,
  VintageDateRangeField,
  VintageSelectableField,
  IVintageAsOneRelationConfig,
  IVintageAsManyRelationConfig
} from './vintage.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VINTAGE_RELATION_KEYS = [] as const satisfies readonly VintageKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VINTAGE_SORTABLE_FIELDS = ['code', 'createdAt', 'label', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly VintageKey[];

export const VINTAGE_SEARCHABLE_FIELDS = ['code', 'label', ] as const satisfies readonly VintageKey[];

export const VINTAGE_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'label', 'publisherInstitutionId', 'supersedesId', 'version', ] as const satisfies readonly VintageKey[];

export const VINTAGE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly VintageKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VINTAGE_SELECTABLE_FIELDS = ['code', 'createdAt', 'id', 'isCurrent', 'label', 'publisherInstitutionId', 'releasedOn', 'supersedesId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly VintageKey[];

export const VINTAGE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly VintageSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VINTAGE_EDITABLE_FIELDS = ['code', 'isCurrent', 'label', 'publisherInstitutionId', 'releasedOn', 'supersedesId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly VintageKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VINTAGE_AS_ONE_RELATION_CONFIG = {
  relation: 'vintage',
  type: ERelationType.One,
  selectableFields: VINTAGE_SELECTABLE_FIELDS,
  defaultSelectFields: VINTAGE_DEFAULT_SELECT_FIELDS
} as const satisfies IVintageAsOneRelationConfig;

export const VINTAGE_AS_MANY_RELATION_CONFIG = {
  relation: 'vintages',
  type: ERelationType.Many,
  selectableFields: VINTAGE_SELECTABLE_FIELDS,
  defaultSelectFields: VINTAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: VINTAGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IVintageAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VINTAGE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const VINTAGE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VINTAGE_QUERY_OPTIONS = {
  searchableFields: VINTAGE_SEARCHABLE_FIELDS,
  selectableFields: VINTAGE_SELECTABLE_FIELDS,
  defaultSelectFields: VINTAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: VINTAGE_SORTABLE_FIELDS,
  filterFields: VINTAGE_FILTERABLE_FIELDS,
  dateRangeFields: VINTAGE_DATE_RANGE_FIELDS,
  oneRelations: VINTAGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VINTAGE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IVintage,
  VintageSortableField,
  VintageSelectableField,
  VintageFilterableField,
  VintageDateRangeField,
  VintageRelationKey,
  typeof VINTAGE_ONE_RELATION_QUERY_OPTIONS,
  typeof VINTAGE_MANY_RELATION_QUERY_OPTIONS
>;