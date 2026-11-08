// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DimensionConfig from '#/modules/statistics/types/dimension.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDimensionMember,
  DimensionMemberKey,
  DimensionMemberRelationKey,
  DimensionMemberSortableField,
  DimensionMemberFilterableField,
  DimensionMemberDateRangeField,
  DimensionMemberSelectableField,
  IDimensionMemberAsOneRelationConfig,
  IDimensionMemberAsManyRelationConfig
} from './dimension-member.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DIMENSION_MEMBER_RELATION_KEYS = ['dimension', ] as const satisfies readonly DimensionMemberKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DIMENSION_MEMBER_SORTABLE_FIELDS = ['code', 'createdAt', 'label', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly DimensionMemberKey[];

export const DIMENSION_MEMBER_SEARCHABLE_FIELDS = ['code', 'label', ] as const satisfies readonly DimensionMemberKey[];

export const DIMENSION_MEMBER_FILTERABLE_FIELDS = ['code', 'dimensionId', 'id', 'isCurrent', 'label', 'parentId', 'version', ] as const satisfies readonly DimensionMemberKey[];

export const DIMENSION_MEMBER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly DimensionMemberKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DIMENSION_MEMBER_SELECTABLE_FIELDS = ['code', 'createdAt', 'dimensionId', 'id', 'isCurrent', 'label', 'parentId', 'referenceCode', 'sortOrder', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly DimensionMemberKey[];

export const DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DimensionMemberSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DIMENSION_MEMBER_EDITABLE_FIELDS = ['code', 'dimensionId', 'isCurrent', 'label', 'parentId', 'referenceCode', 'sortOrder', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly DimensionMemberKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DIMENSION_MEMBER_AS_ONE_RELATION_CONFIG = {
  relation: 'dimensionMember',
  type: ERelationType.One,
  selectableFields: DIMENSION_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS
} as const satisfies IDimensionMemberAsOneRelationConfig;

export const DIMENSION_MEMBER_AS_MANY_RELATION_CONFIG = {
  relation: 'dimensionMembers',
  type: ERelationType.Many,
  selectableFields: DIMENSION_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS,
  sortableFields: DIMENSION_MEMBER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDimensionMemberAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DIMENSION_MEMBER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DimensionMemberRelationKey>().one(DimensionConfig.DIMENSION_AS_ONE_RELATION_CONFIG, 'dimension'),
] as const;

export const DIMENSION_MEMBER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DIMENSION_MEMBER_QUERY_OPTIONS = {
  searchableFields: DIMENSION_MEMBER_SEARCHABLE_FIELDS,
  selectableFields: DIMENSION_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS,
  sortableFields: DIMENSION_MEMBER_SORTABLE_FIELDS,
  filterFields: DIMENSION_MEMBER_FILTERABLE_FIELDS,
  dateRangeFields: DIMENSION_MEMBER_DATE_RANGE_FIELDS,
  oneRelations: DIMENSION_MEMBER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DIMENSION_MEMBER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDimensionMember,
  DimensionMemberSortableField,
  DimensionMemberSelectableField,
  DimensionMemberFilterableField,
  DimensionMemberDateRangeField,
  DimensionMemberRelationKey,
  typeof DIMENSION_MEMBER_ONE_RELATION_QUERY_OPTIONS,
  typeof DIMENSION_MEMBER_MANY_RELATION_QUERY_OPTIONS
>;