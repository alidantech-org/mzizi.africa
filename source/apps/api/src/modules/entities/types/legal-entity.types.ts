// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { EntityStatus } from '#/types/entities/entity-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_ENTITY_RELATION_KEYS,
  LEGAL_ENTITY_SORTABLE_FIELDS,
  LEGAL_ENTITY_SEARCHABLE_FIELDS,
  LEGAL_ENTITY_FILTERABLE_FIELDS,
  LEGAL_ENTITY_DATE_RANGE_FIELDS,
  LEGAL_ENTITY_SELECTABLE_FIELDS,
  LEGAL_ENTITY_DEFAULT_SELECT_FIELDS,
  LEGAL_ENTITY_EDITABLE_FIELDS
} from './legal-entity.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Entity */
export interface ILegalEntity extends B.IBase {
  code: string;
  entityTypeId: string;
  isCurrent: boolean;
  jurisdictionId: string;
  officialName: string;
  parentEntityId: string | null;
  status: EntityStatus;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalEntityKey = keyof ILegalEntity;

export type LegalEntityRelationKey = (typeof LEGAL_ENTITY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalEntityReadonlyFields = B.IBaseReadonlyFields;

export type ILegalEntityContextualFields = never;

export type ILegalEntitySensitiveFields = never;

export type ILegalEntityTransitionFields = never;

export type ILegalEntityImmutableFields =
  | ILegalEntityReadonlyFields
  | ILegalEntityContextualFields
  | ILegalEntitySensitiveFields
  | ILegalEntityTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalEntityCreatable = Omit<ILegalEntity, ILegalEntityImmutableFields | LegalEntityRelationKey>;

export type ILegalEntitySystemWritable = Omit<ILegalEntity, B.IBaseReadonlyFields | LegalEntityRelationKey>;

export type ILegalEntityUpdatable = Partial<Omit<ILegalEntity, ILegalEntityImmutableFields | LegalEntityRelationKey>>;

export interface ILegalEntityTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalEntitySortableField = (typeof LEGAL_ENTITY_SORTABLE_FIELDS)[number];

export type LegalEntitySearchableField = (typeof LEGAL_ENTITY_SEARCHABLE_FIELDS)[number];

export type LegalEntityFilterableField = (typeof LEGAL_ENTITY_FILTERABLE_FIELDS)[number];

export type LegalEntityDateRangeField = (typeof LEGAL_ENTITY_DATE_RANGE_FIELDS)[number];

export type LegalEntitySelectableField = (typeof LEGAL_ENTITY_SELECTABLE_FIELDS)[number];

export type LegalEntityDefaultSelectField = (typeof LEGAL_ENTITY_DEFAULT_SELECT_FIELDS)[number];

export type LegalEntityEditableField = (typeof LEGAL_ENTITY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalEntityAsOneRelationConfig = Q.IOneRelationConfig<'legalEntity', LegalEntitySelectableField>;

export type ILegalEntityAsManyRelationConfig = Q.IManyRelationConfig<'legalEntitys', LegalEntitySelectableField, LegalEntitySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalEntityAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalEntity, LegalEntitySelectableField>;

export type ILegalEntityAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalEntity, LegalEntitySelectableField, LegalEntitySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalEntityRelationMap extends Record<LegalEntityRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalEntityRelationQueries = Q.IBaseRelationQueries<ILegalEntity, LegalEntityRelationKey, ILegalEntityRelationMap>;

export type ILegalEntityItemQuery = Q.IBaseItemQuery<
  ILegalEntity,
  LegalEntityRelationKey,
  LegalEntitySelectableField,
  LegalEntityRelationKey,
  LegalEntitySelectableField,
  ILegalEntityRelationMap,
  ILegalEntityRelationQueries
>;

export type ILegalEntityListQuery = Q.IBaseListQuery<
  ILegalEntity,
  LegalEntityRelationKey,
  LegalEntitySelectableField,
  LegalEntitySortableField,
  LegalEntityRelationKey,
  LegalEntitySelectableField,
  LegalEntitySortableField,
  LegalEntityDateRangeField,
  LegalEntityFilterableField,
  ILegalEntityRelationMap,
  ILegalEntityRelationQueries,
  ILegalEntityItemQuery
>;