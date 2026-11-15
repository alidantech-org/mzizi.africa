// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from '#/modules/official/types/entities/entities.config';
import * as IndividualsConfig from '#/modules/official/types/individuals/individuals.config';
import * as ValueConfig from '#/modules/reference/types/value/value.config';
import * as CitationsConfig from '#/modules/source/types/citations/citations.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIdentifiers,
  IdentifiersKey,
  IdentifiersRelationKey,
  IdentifiersSortableField,
  IdentifiersFilterableField,
  IdentifiersDateRangeField,
  IdentifiersSelectableField,
  IIdentifiersAsOneRelationConfig,
  IIdentifiersAsManyRelationConfig
} from './identifiers.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const IDENTIFIERS_RELATION_KEYS = ['entity', 'individual', 'issuerEntity', 'scheme', 'sourceCitation', ] as const satisfies readonly IdentifiersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_SORTABLE_FIELDS = [] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_SEARCHABLE_FIELDS = [] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_FILTERABLE_FIELDS = [] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_DATE_RANGE_FIELDS = [] as const satisfies readonly IdentifiersKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'issuerEntityId', 'namespace', 'schemeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'value', 'version', ] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'issuerEntityId', 'namespace', 'schemeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'value', 'version', ] as const satisfies readonly IdentifiersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_EDITABLE_FIELDS = ['entityId', 'individualId', 'issuerEntityId', 'namespace', 'schemeId', 'sourceCitationId', 'validFrom', 'validUntil', 'value', ] as const satisfies readonly IdentifiersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const IDENTIFIERS_AS_ONE_RELATION_CONFIG = {
  relation: 'identifiers',
  type: ERelationType.One,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS
} as const satisfies IIdentifiersAsOneRelationConfig;

export const IDENTIFIERS_AS_MANY_RELATION_CONFIG = {
  relation: 'identifierss',
  type: ERelationType.Many,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS,
  sortableFields: IDENTIFIERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IIdentifiersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'entity'),
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG, 'individual'),
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'issuerEntity'),
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'scheme'),
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG, 'sourceCitation'),
] as const;

export const IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const IDENTIFIERS_QUERY_OPTIONS = {
  searchableFields: IDENTIFIERS_SEARCHABLE_FIELDS,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS,
  sortableFields: IDENTIFIERS_SORTABLE_FIELDS,
  filterFields: IDENTIFIERS_FILTERABLE_FIELDS,
  dateRangeFields: IDENTIFIERS_DATE_RANGE_FIELDS,
  oneRelations: IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IIdentifiers,
  IdentifiersSortableField,
  IdentifiersSelectableField,
  IdentifiersFilterableField,
  IdentifiersDateRangeField,
  IdentifiersRelationKey,
  typeof IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS,
  typeof IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS
>;