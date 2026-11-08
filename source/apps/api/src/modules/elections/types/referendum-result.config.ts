// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ReferendumOptionConfig from '#/modules/elections/types/referendum-option.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IReferendumResult,
  ReferendumResultKey,
  ReferendumResultRelationKey,
  ReferendumResultSortableField,
  ReferendumResultFilterableField,
  ReferendumResultDateRangeField,
  ReferendumResultSelectableField,
  IReferendumResultAsOneRelationConfig,
  IReferendumResultAsManyRelationConfig
} from './referendum-result.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REFERENDUM_RESULT_RELATION_KEYS = ['referendumOption', ] as const satisfies readonly ReferendumResultKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REFERENDUM_RESULT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', 'votes', ] as const satisfies readonly ReferendumResultKey[];

export const REFERENDUM_RESULT_SEARCHABLE_FIELDS = [] as const satisfies readonly ReferendumResultKey[];

export const REFERENDUM_RESULT_FILTERABLE_FIELDS = ['declaringInstitutionId', 'geoUnitId', 'id', 'isCurrent', 'optionId', 'resultLevelId', 'resultStatus', 'version', 'votes', ] as const satisfies readonly ReferendumResultKey[];

export const REFERENDUM_RESULT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ReferendumResultKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REFERENDUM_RESULT_SELECTABLE_FIELDS = ['createdAt', 'declaredAt', 'declaringInstitutionId', 'evidenceForm', 'geoUnitId', 'id', 'isCurrent', 'optionId', 'resultLevelId', 'resultStatus', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'votes', ] as const satisfies readonly ReferendumResultKey[];

export const REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ReferendumResultSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REFERENDUM_RESULT_EDITABLE_FIELDS = ['declaredAt', 'declaringInstitutionId', 'evidenceForm', 'geoUnitId', 'isCurrent', 'optionId', 'resultLevelId', 'resultStatus', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'votes', ] as const satisfies readonly ReferendumResultKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REFERENDUM_RESULT_AS_ONE_RELATION_CONFIG = {
  relation: 'referendumResult',
  type: ERelationType.One,
  selectableFields: REFERENDUM_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS
} as const satisfies IReferendumResultAsOneRelationConfig;

export const REFERENDUM_RESULT_AS_MANY_RELATION_CONFIG = {
  relation: 'referendumResults',
  type: ERelationType.Many,
  selectableFields: REFERENDUM_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_RESULT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IReferendumResultAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_RESULT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ReferendumResultRelationKey>().one(ReferendumOptionConfig.REFERENDUM_OPTION_AS_ONE_RELATION_CONFIG, 'referendumOption'),
] as const;

export const REFERENDUM_RESULT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_RESULT_QUERY_OPTIONS = {
  searchableFields: REFERENDUM_RESULT_SEARCHABLE_FIELDS,
  selectableFields: REFERENDUM_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_RESULT_SORTABLE_FIELDS,
  filterFields: REFERENDUM_RESULT_FILTERABLE_FIELDS,
  dateRangeFields: REFERENDUM_RESULT_DATE_RANGE_FIELDS,
  oneRelations: REFERENDUM_RESULT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REFERENDUM_RESULT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IReferendumResult,
  ReferendumResultSortableField,
  ReferendumResultSelectableField,
  ReferendumResultFilterableField,
  ReferendumResultDateRangeField,
  ReferendumResultRelationKey,
  typeof REFERENDUM_RESULT_ONE_RELATION_QUERY_OPTIONS,
  typeof REFERENDUM_RESULT_MANY_RELATION_QUERY_OPTIONS
>;