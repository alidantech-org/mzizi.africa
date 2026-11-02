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
  IEntityOwnership,
  EntityOwnershipKey,
  EntityOwnershipRelationKey,
  EntityOwnershipSortableField,
  EntityOwnershipFilterableField,
  EntityOwnershipDateRangeField,
  EntityOwnershipSelectableField,
  IEntityOwnershipAsOneRelationConfig,
  IEntityOwnershipAsManyRelationConfig
} from './entity-ownership.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ENTITY_OWNERSHIP_RELATION_KEYS = ['legalEntity', ] as const satisfies readonly EntityOwnershipKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ENTITY_OWNERSHIP_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly EntityOwnershipKey[];

export const ENTITY_OWNERSHIP_SEARCHABLE_FIELDS = [] as const satisfies readonly EntityOwnershipKey[];

export const ENTITY_OWNERSHIP_FILTERABLE_FIELDS = ['entityId', 'id', 'isCurrent', 'ownerEntityId', 'ownerPersonId', 'version', ] as const satisfies readonly EntityOwnershipKey[];

export const ENTITY_OWNERSHIP_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly EntityOwnershipKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ENTITY_OWNERSHIP_SELECTABLE_FIELDS = ['createdAt', 'entityId', 'id', 'isCurrent', 'ownerEntityId', 'ownerPersonId', 'percentage', 'position', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EntityOwnershipKey[];

export const ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EntityOwnershipSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ENTITY_OWNERSHIP_EDITABLE_FIELDS = ['entityId', 'isCurrent', 'ownerEntityId', 'ownerPersonId', 'percentage', 'position', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EntityOwnershipKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ENTITY_OWNERSHIP_AS_ONE_RELATION_CONFIG = {
  relation: 'entityOwnership',
  type: ERelationType.One,
  selectableFields: ENTITY_OWNERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS
} as const satisfies IEntityOwnershipAsOneRelationConfig;

export const ENTITY_OWNERSHIP_AS_MANY_RELATION_CONFIG = {
  relation: 'entityOwnerships',
  type: ERelationType.Many,
  selectableFields: ENTITY_OWNERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_OWNERSHIP_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEntityOwnershipAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ENTITY_OWNERSHIP_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EntityOwnershipRelationKey>().one(LegalEntityConfig.LEGAL_ENTITY_AS_ONE_RELATION_CONFIG, 'legalEntity'),
] as const;

export const ENTITY_OWNERSHIP_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ENTITY_OWNERSHIP_QUERY_OPTIONS = {
  searchableFields: ENTITY_OWNERSHIP_SEARCHABLE_FIELDS,
  selectableFields: ENTITY_OWNERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_OWNERSHIP_SORTABLE_FIELDS,
  filterFields: ENTITY_OWNERSHIP_FILTERABLE_FIELDS,
  dateRangeFields: ENTITY_OWNERSHIP_DATE_RANGE_FIELDS,
  oneRelations: ENTITY_OWNERSHIP_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ENTITY_OWNERSHIP_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEntityOwnership,
  EntityOwnershipSortableField,
  EntityOwnershipSelectableField,
  EntityOwnershipFilterableField,
  EntityOwnershipDateRangeField,
  EntityOwnershipRelationKey,
  typeof ENTITY_OWNERSHIP_ONE_RELATION_QUERY_OPTIONS,
  typeof ENTITY_OWNERSHIP_MANY_RELATION_QUERY_OPTIONS
>;