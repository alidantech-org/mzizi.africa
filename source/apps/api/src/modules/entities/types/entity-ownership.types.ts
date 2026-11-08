// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LegalEntityTypes from '#/modules/entities/types/legal-entity.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ENTITY_OWNERSHIP_RELATION_KEYS,
  ENTITY_OWNERSHIP_SORTABLE_FIELDS,
  ENTITY_OWNERSHIP_SEARCHABLE_FIELDS,
  ENTITY_OWNERSHIP_FILTERABLE_FIELDS,
  ENTITY_OWNERSHIP_DATE_RANGE_FIELDS,
  ENTITY_OWNERSHIP_SELECTABLE_FIELDS,
  ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS,
  ENTITY_OWNERSHIP_EDITABLE_FIELDS
} from './entity-ownership.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Entity Ownership */
export interface IEntityOwnership extends B.IBase {
  entityId: string;
  isCurrent: boolean;
  ownerEntityId: string | null;
  ownerPersonId: string | null;
  percentage: number | null;
  position: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly legalEntity?: LegalEntityTypes.ILegalEntity;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EntityOwnershipKey = keyof IEntityOwnership;

export type EntityOwnershipRelationKey = (typeof ENTITY_OWNERSHIP_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEntityOwnershipReadonlyFields = B.IBaseReadonlyFields;

export type IEntityOwnershipContextualFields = never;

export type IEntityOwnershipSensitiveFields = never;

export type IEntityOwnershipTransitionFields = never;

export type IEntityOwnershipImmutableFields =
  | IEntityOwnershipReadonlyFields
  | IEntityOwnershipContextualFields
  | IEntityOwnershipSensitiveFields
  | IEntityOwnershipTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEntityOwnershipCreatable = Omit<IEntityOwnership, IEntityOwnershipImmutableFields | EntityOwnershipRelationKey>;

export type IEntityOwnershipSystemWritable = Omit<IEntityOwnership, B.IBaseReadonlyFields | EntityOwnershipRelationKey>;

export type IEntityOwnershipUpdatable = Partial<Omit<IEntityOwnership, IEntityOwnershipImmutableFields | EntityOwnershipRelationKey>>;

export interface IEntityOwnershipTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EntityOwnershipSortableField = (typeof ENTITY_OWNERSHIP_SORTABLE_FIELDS)[number];

export type EntityOwnershipSearchableField = (typeof ENTITY_OWNERSHIP_SEARCHABLE_FIELDS)[number];

export type EntityOwnershipFilterableField = (typeof ENTITY_OWNERSHIP_FILTERABLE_FIELDS)[number];

export type EntityOwnershipDateRangeField = (typeof ENTITY_OWNERSHIP_DATE_RANGE_FIELDS)[number];

export type EntityOwnershipSelectableField = (typeof ENTITY_OWNERSHIP_SELECTABLE_FIELDS)[number];

export type EntityOwnershipDefaultSelectField = (typeof ENTITY_OWNERSHIP_DEFAULT_SELECT_FIELDS)[number];

export type EntityOwnershipEditableField = (typeof ENTITY_OWNERSHIP_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEntityOwnershipAsOneRelationConfig = Q.IOneRelationConfig<'entityOwnership', EntityOwnershipSelectableField>;

export type IEntityOwnershipAsManyRelationConfig = Q.IManyRelationConfig<'entityOwnerships', EntityOwnershipSelectableField, EntityOwnershipSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEntityOwnershipAsOneRelationQuery = Q.IAsOneRelationQuery<IEntityOwnership, EntityOwnershipSelectableField>;

export type IEntityOwnershipAsManyRelationQuery = Q.IAsManyRelationQuery<IEntityOwnership, EntityOwnershipSelectableField, EntityOwnershipSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEntityOwnershipRelationMap extends Record<EntityOwnershipRelationKey, unknown> {
  legalEntity: LegalEntityTypes.ILegalEntityAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEntityOwnershipRelationQueries = Q.IBaseRelationQueries<IEntityOwnership, EntityOwnershipRelationKey, IEntityOwnershipRelationMap>;

export type IEntityOwnershipItemQuery = Q.IBaseItemQuery<
  IEntityOwnership,
  EntityOwnershipRelationKey,
  EntityOwnershipSelectableField,
  EntityOwnershipRelationKey,
  EntityOwnershipSelectableField,
  IEntityOwnershipRelationMap,
  IEntityOwnershipRelationQueries
>;

export type IEntityOwnershipListQuery = Q.IBaseListQuery<
  IEntityOwnership,
  EntityOwnershipRelationKey,
  EntityOwnershipSelectableField,
  EntityOwnershipSortableField,
  EntityOwnershipRelationKey,
  EntityOwnershipSelectableField,
  EntityOwnershipSortableField,
  EntityOwnershipDateRangeField,
  EntityOwnershipFilterableField,
  IEntityOwnershipRelationMap,
  IEntityOwnershipRelationQueries,
  IEntityOwnershipItemQuery
>;