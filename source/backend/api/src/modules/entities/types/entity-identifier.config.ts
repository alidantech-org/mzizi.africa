// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalEntityConfig from '#/modules/entities/types/legal-entity.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEntityIdentifier,
  EntityIdentifierKey,
  EntityIdentifierRelationKey,
  EntityIdentifierSortableField,
  EntityIdentifierFilterableField,
  EntityIdentifierDateRangeField,
  EntityIdentifierSelectableField,
  IEntityIdentifierAsOneRelationConfig,
  IEntityIdentifierAsManyRelationConfig
} from './entity-identifier.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ENTITY_IDENTIFIER_RELATION_KEYS = ['legalEntity', ] as const satisfies readonly EntityIdentifierKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ENTITY_IDENTIFIER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly EntityIdentifierKey[];

export const ENTITY_IDENTIFIER_SEARCHABLE_FIELDS = ['value', ] as const satisfies readonly EntityIdentifierKey[];

export const ENTITY_IDENTIFIER_FILTERABLE_FIELDS = ['entityId', 'id', 'isCurrent', 'issuingAuthorityId', 'method', 'schemeId', 'value', 'verificationState', 'version', ] as const satisfies readonly EntityIdentifierKey[];

export const ENTITY_IDENTIFIER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly EntityIdentifierKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ENTITY_IDENTIFIER_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'entityId', 'id', 'isCurrent', 'issuingAuthorityId', 'licence', 'method', 'retrievedAt', 'schemeId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'verificationState', ] as const satisfies readonly EntityIdentifierKey[];

export const ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EntityIdentifierSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ENTITY_IDENTIFIER_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'entityId', 'isCurrent', 'issuingAuthorityId', 'licence', 'method', 'retrievedAt', 'schemeId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'verificationState', ] as const satisfies readonly EntityIdentifierKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ENTITY_IDENTIFIER_AS_ONE_RELATION_CONFIG = {
  relation: 'entityIdentifier',
  type: ERelationType.One,
  selectableFields: ENTITY_IDENTIFIER_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS
} as const satisfies IEntityIdentifierAsOneRelationConfig;

export const ENTITY_IDENTIFIER_AS_MANY_RELATION_CONFIG = {
  relation: 'entityIdentifiers',
  type: ERelationType.Many,
  selectableFields: ENTITY_IDENTIFIER_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_IDENTIFIER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEntityIdentifierAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ENTITY_IDENTIFIER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EntityIdentifierRelationKey>().one(LegalEntityConfig.LEGAL_ENTITY_AS_ONE_RELATION_CONFIG, 'legalEntity'),
] as const;

export const ENTITY_IDENTIFIER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ENTITY_IDENTIFIER_QUERY_OPTIONS = {
  searchableFields: ENTITY_IDENTIFIER_SEARCHABLE_FIELDS,
  selectableFields: ENTITY_IDENTIFIER_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_IDENTIFIER_SORTABLE_FIELDS,
  filterFields: ENTITY_IDENTIFIER_FILTERABLE_FIELDS,
  dateRangeFields: ENTITY_IDENTIFIER_DATE_RANGE_FIELDS,
  oneRelations: ENTITY_IDENTIFIER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ENTITY_IDENTIFIER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEntityIdentifier,
  EntityIdentifierSortableField,
  EntityIdentifierSelectableField,
  EntityIdentifierFilterableField,
  EntityIdentifierDateRangeField,
  EntityIdentifierRelationKey,
  typeof ENTITY_IDENTIFIER_ONE_RELATION_QUERY_OPTIONS,
  typeof ENTITY_IDENTIFIER_MANY_RELATION_QUERY_OPTIONS
>;