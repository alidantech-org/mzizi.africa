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
  IExpectation,
  ExpectationKey,
  ExpectationRelationKey,
  ExpectationSortableField,
  ExpectationFilterableField,
  ExpectationDateRangeField,
  ExpectationSelectableField,
  IExpectationAsOneRelationConfig,
  IExpectationAsManyRelationConfig
} from './expectation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EXPECTATION_RELATION_KEYS = [] as const satisfies readonly ExpectationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EXPECTATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ExpectationKey[];

export const EXPECTATION_SEARCHABLE_FIELDS = [] as const satisfies readonly ExpectationKey[];

export const EXPECTATION_FILTERABLE_FIELDS = ['basis', 'facilityTypeId', 'id', 'isCurrent', 'resolvedOccupancyId', 'roleId', 'scopeGeoUnitId', 'status', 'subjectId', 'subjectKind', 'version', ] as const satisfies readonly ExpectationKey[];

export const EXPECTATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ExpectationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EXPECTATION_SELECTABLE_FIELDS = ['basis', 'createdAt', 'facilityTypeId', 'id', 'isCurrent', 'maxCount', 'minCount', 'resolvedOccupancyId', 'roleId', 'scopeGeoUnitId', 'status', 'subjectId', 'subjectKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ExpectationKey[];

export const EXPECTATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ExpectationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EXPECTATION_EDITABLE_FIELDS = ['basis', 'facilityTypeId', 'isCurrent', 'maxCount', 'minCount', 'resolvedOccupancyId', 'roleId', 'scopeGeoUnitId', 'status', 'subjectId', 'subjectKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ExpectationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EXPECTATION_AS_ONE_RELATION_CONFIG = {
  relation: 'expectation',
  type: ERelationType.One,
  selectableFields: EXPECTATION_SELECTABLE_FIELDS,
  defaultSelectFields: EXPECTATION_DEFAULT_SELECT_FIELDS
} as const satisfies IExpectationAsOneRelationConfig;

export const EXPECTATION_AS_MANY_RELATION_CONFIG = {
  relation: 'expectations',
  type: ERelationType.Many,
  selectableFields: EXPECTATION_SELECTABLE_FIELDS,
  defaultSelectFields: EXPECTATION_DEFAULT_SELECT_FIELDS,
  sortableFields: EXPECTATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IExpectationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EXPECTATION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const EXPECTATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EXPECTATION_QUERY_OPTIONS = {
  searchableFields: EXPECTATION_SEARCHABLE_FIELDS,
  selectableFields: EXPECTATION_SELECTABLE_FIELDS,
  defaultSelectFields: EXPECTATION_DEFAULT_SELECT_FIELDS,
  sortableFields: EXPECTATION_SORTABLE_FIELDS,
  filterFields: EXPECTATION_FILTERABLE_FIELDS,
  dateRangeFields: EXPECTATION_DATE_RANGE_FIELDS,
  oneRelations: EXPECTATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EXPECTATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IExpectation,
  ExpectationSortableField,
  ExpectationSelectableField,
  ExpectationFilterableField,
  ExpectationDateRangeField,
  ExpectationRelationKey,
  typeof EXPECTATION_ONE_RELATION_QUERY_OPTIONS,
  typeof EXPECTATION_MANY_RELATION_QUERY_OPTIONS
>;