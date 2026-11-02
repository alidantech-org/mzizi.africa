// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIdeology,
  IdeologyKey,
  IdeologyRelationKey,
  IdeologySortableField,
  IdeologyFilterableField,
  IdeologyDateRangeField,
  IdeologySelectableField,
  IIdeologyAsOneRelationConfig,
  IIdeologyAsManyRelationConfig
} from './ideology.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const IDEOLOGY_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly IdeologyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const IDEOLOGY_SORTABLE_FIELDS = ['code', 'createdAt', 'label', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly IdeologyKey[];

export const IDEOLOGY_SEARCHABLE_FIELDS = ['code', 'label', ] as const satisfies readonly IdeologyKey[];

export const IDEOLOGY_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'jurisdictionId', 'label', 'method', 'verificationState', 'version', ] as const satisfies readonly IdeologyKey[];

export const IDEOLOGY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly IdeologyKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const IDEOLOGY_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'description', 'id', 'isCurrent', 'jurisdictionId', 'label', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly IdeologyKey[];

export const IDEOLOGY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly IdeologySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const IDEOLOGY_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'description', 'isCurrent', 'jurisdictionId', 'label', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly IdeologyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const IDEOLOGY_AS_ONE_RELATION_CONFIG = {
  relation: 'ideology',
  type: ERelationType.One,
  selectableFields: IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: IDEOLOGY_DEFAULT_SELECT_FIELDS
} as const satisfies IIdeologyAsOneRelationConfig;

export const IDEOLOGY_AS_MANY_RELATION_CONFIG = {
  relation: 'ideologys',
  type: ERelationType.Many,
  selectableFields: IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: IDEOLOGY_DEFAULT_SELECT_FIELDS,
  sortableFields: IDEOLOGY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IIdeologyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const IDEOLOGY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IdeologyRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const IDEOLOGY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const IDEOLOGY_QUERY_OPTIONS = {
  searchableFields: IDEOLOGY_SEARCHABLE_FIELDS,
  selectableFields: IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: IDEOLOGY_DEFAULT_SELECT_FIELDS,
  sortableFields: IDEOLOGY_SORTABLE_FIELDS,
  filterFields: IDEOLOGY_FILTERABLE_FIELDS,
  dateRangeFields: IDEOLOGY_DATE_RANGE_FIELDS,
  oneRelations: IDEOLOGY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: IDEOLOGY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IIdeology,
  IdeologySortableField,
  IdeologySelectableField,
  IdeologyFilterableField,
  IdeologyDateRangeField,
  IdeologyRelationKey,
  typeof IDEOLOGY_ONE_RELATION_QUERY_OPTIONS,
  typeof IDEOLOGY_MANY_RELATION_QUERY_OPTIONS
>;