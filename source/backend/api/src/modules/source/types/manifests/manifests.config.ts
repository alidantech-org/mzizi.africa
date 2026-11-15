// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from '#/modules/reference/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IManifests,
  ManifestsKey,
  ManifestsRelationKey,
  ManifestsSortableField,
  ManifestsFilterableField,
  ManifestsDateRangeField,
  ManifestsSelectableField,
  IManifestsAsOneRelationConfig,
  IManifestsAsManyRelationConfig
} from './manifests.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANIFESTS_RELATION_KEYS = ['kind', ] as const satisfies readonly ManifestsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANIFESTS_SORTABLE_FIELDS = [] as const satisfies readonly ManifestsKey[];

export const MANIFESTS_SEARCHABLE_FIELDS = [] as const satisfies readonly ManifestsKey[];

export const MANIFESTS_FILTERABLE_FIELDS = [] as const satisfies readonly ManifestsKey[];

export const MANIFESTS_DATE_RANGE_FIELDS = [] as const satisfies readonly ManifestsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANIFESTS_SELECTABLE_FIELDS = ['code', 'createdAt', 'deletedAt', 'description', 'id', 'kindId', 'title', 'updatedAt', 'version', ] as const satisfies readonly ManifestsKey[];

export const MANIFESTS_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'deletedAt', 'description', 'id', 'kindId', 'title', 'updatedAt', 'version', ] as const satisfies readonly ManifestsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANIFESTS_EDITABLE_FIELDS = ['code', 'description', 'kindId', 'title', ] as const satisfies readonly ManifestsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANIFESTS_AS_ONE_RELATION_CONFIG = {
  relation: 'manifests',
  type: ERelationType.One,
  selectableFields: MANIFESTS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTS_DEFAULT_SELECT_FIELDS
} as const satisfies IManifestsAsOneRelationConfig;

export const MANIFESTS_AS_MANY_RELATION_CONFIG = {
  relation: 'manifestss',
  type: ERelationType.Many,
  selectableFields: MANIFESTS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTS_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IManifestsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANIFESTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ManifestsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
] as const;

export const MANIFESTS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANIFESTS_QUERY_OPTIONS = {
  searchableFields: MANIFESTS_SEARCHABLE_FIELDS,
  selectableFields: MANIFESTS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTS_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTS_SORTABLE_FIELDS,
  filterFields: MANIFESTS_FILTERABLE_FIELDS,
  dateRangeFields: MANIFESTS_DATE_RANGE_FIELDS,
  oneRelations: MANIFESTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANIFESTS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IManifests,
  ManifestsSortableField,
  ManifestsSelectableField,
  ManifestsFilterableField,
  ManifestsDateRangeField,
  ManifestsRelationKey,
  typeof MANIFESTS_ONE_RELATION_QUERY_OPTIONS,
  typeof MANIFESTS_MANY_RELATION_QUERY_OPTIONS
>;