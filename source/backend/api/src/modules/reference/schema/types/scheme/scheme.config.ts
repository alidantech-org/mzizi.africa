// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IScheme,
  SchemeKey,
  SchemeRelationKey,
  SchemeSortableField,
  SchemeFilterableField,
  SchemeDateRangeField,
  SchemeSelectableField,
  ISchemeAsOneRelationConfig,
  ISchemeAsManyRelationConfig
} from './scheme.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SCHEME_RELATION_KEYS = [] as const satisfies readonly SchemeKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SCHEME_SORTABLE_FIELDS = [] as const satisfies readonly SchemeKey[];

export const SCHEME_SEARCHABLE_FIELDS = [] as const satisfies readonly SchemeKey[];

export const SCHEME_FILTERABLE_FIELDS = [] as const satisfies readonly SchemeKey[];

export const SCHEME_DATE_RANGE_FIELDS = [] as const satisfies readonly SchemeKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SCHEME_SELECTABLE_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'ownerSnapshot', 'title', 'updatedAt', 'version', ] as const satisfies readonly SchemeKey[];

export const SCHEME_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'ownerSnapshot', 'title', 'updatedAt', 'version', ] as const satisfies readonly SchemeSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SCHEME_EDITABLE_FIELDS = ['code', 'ownerSnapshot', 'title', ] as const satisfies readonly SchemeKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SCHEME_AS_ONE_RELATION_CONFIG = {
  relation: 'scheme',
  type: ERelationType.One,
  selectableFields: SCHEME_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEME_DEFAULT_SELECT_FIELDS
} as const satisfies ISchemeAsOneRelationConfig;

export const SCHEME_AS_MANY_RELATION_CONFIG = {
  relation: 'schemes',
  type: ERelationType.Many,
  selectableFields: SCHEME_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEME_DEFAULT_SELECT_FIELDS,
  sortableFields: SCHEME_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISchemeAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SCHEME_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const SCHEME_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SCHEME_QUERY_OPTIONS = {
  searchableFields: SCHEME_SEARCHABLE_FIELDS,
  selectableFields: SCHEME_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEME_DEFAULT_SELECT_FIELDS,
  sortableFields: SCHEME_SORTABLE_FIELDS,
  filterFields: SCHEME_FILTERABLE_FIELDS,
  dateRangeFields: SCHEME_DATE_RANGE_FIELDS,
  oneRelations: SCHEME_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SCHEME_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IScheme,
  SchemeSortableField,
  SchemeSelectableField,
  SchemeFilterableField,
  SchemeDateRangeField,
  SchemeRelationKey,
  typeof SCHEME_ONE_RELATION_QUERY_OPTIONS,
  typeof SCHEME_MANY_RELATION_QUERY_OPTIONS
>;