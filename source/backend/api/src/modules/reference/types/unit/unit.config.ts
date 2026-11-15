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
  IUnit,
  UnitKey,
  UnitRelationKey,
  UnitSortableField,
  UnitFilterableField,
  UnitDateRangeField,
  UnitSelectableField,
  IUnitAsOneRelationConfig,
  IUnitAsManyRelationConfig
} from './unit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const UNIT_RELATION_KEYS = ['base', ] as const satisfies readonly UnitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const UNIT_SORTABLE_FIELDS = [] as const satisfies readonly UnitKey[];

export const UNIT_SEARCHABLE_FIELDS = [] as const satisfies readonly UnitKey[];

export const UNIT_FILTERABLE_FIELDS = [] as const satisfies readonly UnitKey[];

export const UNIT_DATE_RANGE_FIELDS = [] as const satisfies readonly UnitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const UNIT_SELECTABLE_FIELDS = ['baseId', 'code', 'createdAt', 'deletedAt', 'id', 'offset', 'quantity', 'scale', 'symbol', 'updatedAt', 'version', ] as const satisfies readonly UnitKey[];

export const UNIT_DEFAULT_SELECT_FIELDS = ['baseId', 'code', 'createdAt', 'deletedAt', 'id', 'offset', 'quantity', 'scale', 'symbol', 'updatedAt', 'version', ] as const satisfies readonly UnitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const UNIT_EDITABLE_FIELDS = ['baseId', 'code', 'offset', 'quantity', 'scale', 'symbol', ] as const satisfies readonly UnitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const UNIT_AS_ONE_RELATION_CONFIG = {
  relation: 'unit',
  type: ERelationType.One,
  selectableFields: UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: UNIT_DEFAULT_SELECT_FIELDS
} as const satisfies IUnitAsOneRelationConfig;

export const UNIT_AS_MANY_RELATION_CONFIG = {
  relation: 'units',
  type: ERelationType.Many,
  selectableFields: UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: UNIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IUnitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const UNIT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const UNIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const UNIT_QUERY_OPTIONS = {
  searchableFields: UNIT_SEARCHABLE_FIELDS,
  selectableFields: UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: UNIT_SORTABLE_FIELDS,
  filterFields: UNIT_FILTERABLE_FIELDS,
  dateRangeFields: UNIT_DATE_RANGE_FIELDS,
  oneRelations: UNIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: UNIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IUnit,
  UnitSortableField,
  UnitSelectableField,
  UnitFilterableField,
  UnitDateRangeField,
  UnitRelationKey,
  typeof UNIT_ONE_RELATION_QUERY_OPTIONS,
  typeof UNIT_MANY_RELATION_QUERY_OPTIONS
>;