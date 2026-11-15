// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from '#/modules/geography/schema/types/features/features.config';
import * as ValueConfig from '#/modules/reference/schema/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRelationships,
  RelationshipsKey,
  RelationshipsRelationKey,
  RelationshipsSortableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsSelectableField,
  IRelationshipsAsOneRelationConfig,
  IRelationshipsAsManyRelationConfig
} from './relationships.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const RELATIONSHIPS_RELATION_KEYS = ['objectFeature', 'relationshipKind', 'subjectFeature', 'system', ] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SORTABLE_FIELDS = [] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_SEARCHABLE_FIELDS = [] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_FILTERABLE_FIELDS = [] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DATE_RANGE_FIELDS = [] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'id', 'objectFeatureId', 'relationshipKindId', 'sourceRefId', 'subjectFeatureId', 'systemId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'id', 'objectFeatureId', 'relationshipKindId', 'sourceRefId', 'subjectFeatureId', 'systemId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly RelationshipsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_EDITABLE_FIELDS = ['objectFeatureId', 'relationshipKindId', 'sourceRefId', 'subjectFeatureId', 'systemId', 'validFrom', 'validUntil', ] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const RELATIONSHIPS_AS_ONE_RELATION_CONFIG = {
  relation: 'relationships',
  type: ERelationType.One,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS
} as const satisfies IRelationshipsAsOneRelationConfig;

export const RELATIONSHIPS_AS_MANY_RELATION_CONFIG = {
  relation: 'relationshipss',
  type: ERelationType.Many,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IRelationshipsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG, 'objectFeature'),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'relationshipKind'),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG, 'subjectFeature'),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'system'),
] as const;

export const RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_QUERY_OPTIONS = {
  searchableFields: RELATIONSHIPS_SEARCHABLE_FIELDS,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  filterFields: RELATIONSHIPS_FILTERABLE_FIELDS,
  dateRangeFields: RELATIONSHIPS_DATE_RANGE_FIELDS,
  oneRelations: RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IRelationships,
  RelationshipsSortableField,
  RelationshipsSelectableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsRelationKey,
  typeof RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  typeof RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS
>;