// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from '#/modules/official/schema/types/entities/entities.config';
import * as IndividualsConfig from '#/modules/official/schema/types/individuals/individuals.config';
import * as ValueConfig from '#/modules/reference/schema/types/value/value.config';
import * as CitationsConfig from '#/modules/source/schema/types/citations/citations.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  INames,
  NamesKey,
  NamesRelationKey,
  NamesSortableField,
  NamesFilterableField,
  NamesDateRangeField,
  NamesSelectableField,
  INamesAsOneRelationConfig,
  INamesAsManyRelationConfig
} from './names.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const NAMES_RELATION_KEYS = ['entity', 'individual', 'nameKind', 'sourceCitation', ] as const satisfies readonly NamesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const NAMES_SORTABLE_FIELDS = [] as const satisfies readonly NamesKey[];

export const NAMES_SEARCHABLE_FIELDS = [] as const satisfies readonly NamesKey[];

export const NAMES_FILTERABLE_FIELDS = [] as const satisfies readonly NamesKey[];

export const NAMES_DATE_RANGE_FIELDS = [] as const satisfies readonly NamesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const NAMES_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'isPreferred', 'languageTag', 'name', 'nameKindId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly NamesKey[];

export const NAMES_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'isPreferred', 'languageTag', 'name', 'nameKindId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly NamesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const NAMES_EDITABLE_FIELDS = ['entityId', 'individualId', 'isPreferred', 'languageTag', 'name', 'nameKindId', 'sourceCitationId', 'validFrom', 'validUntil', ] as const satisfies readonly NamesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const NAMES_AS_ONE_RELATION_CONFIG = {
  relation: 'names',
  type: ERelationType.One,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS
} as const satisfies INamesAsOneRelationConfig;

export const NAMES_AS_MANY_RELATION_CONFIG = {
  relation: 'namess',
  type: ERelationType.Many,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS,
  sortableFields: NAMES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies INamesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const NAMES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<NamesRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'entity'),
  Q.createRelationKeyMapper<NamesRelationKey>().one(IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG, 'individual'),
  Q.createRelationKeyMapper<NamesRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'nameKind'),
  Q.createRelationKeyMapper<NamesRelationKey>().one(CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG, 'sourceCitation'),
] as const;

export const NAMES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const NAMES_QUERY_OPTIONS = {
  searchableFields: NAMES_SEARCHABLE_FIELDS,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS,
  sortableFields: NAMES_SORTABLE_FIELDS,
  filterFields: NAMES_FILTERABLE_FIELDS,
  dateRangeFields: NAMES_DATE_RANGE_FIELDS,
  oneRelations: NAMES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: NAMES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  INames,
  NamesSortableField,
  NamesSelectableField,
  NamesFilterableField,
  NamesDateRangeField,
  NamesRelationKey,
  typeof NAMES_ONE_RELATION_QUERY_OPTIONS,
  typeof NAMES_MANY_RELATION_QUERY_OPTIONS
>;