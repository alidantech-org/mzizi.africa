// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LegalEntityTypes from '#/modules/entities/types/legal-entity.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ENTITY_IDENTIFIER_RELATION_KEYS,
  ENTITY_IDENTIFIER_SORTABLE_FIELDS,
  ENTITY_IDENTIFIER_SEARCHABLE_FIELDS,
  ENTITY_IDENTIFIER_FILTERABLE_FIELDS,
  ENTITY_IDENTIFIER_DATE_RANGE_FIELDS,
  ENTITY_IDENTIFIER_SELECTABLE_FIELDS,
  ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS,
  ENTITY_IDENTIFIER_EDITABLE_FIELDS
} from './entity-identifier.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Entity Identifier */
export interface IEntityIdentifier extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  entityId: string;
  isCurrent: boolean;
  issuingAuthorityId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  schemeId: string;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  value: string;
  verificationState: VerificationState;
  readonly legalEntity?: LegalEntityTypes.ILegalEntity;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EntityIdentifierKey = keyof IEntityIdentifier;

export type EntityIdentifierRelationKey = (typeof ENTITY_IDENTIFIER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEntityIdentifierReadonlyFields = B.IBaseReadonlyFields;

export type IEntityIdentifierContextualFields = never;

export type IEntityIdentifierSensitiveFields = never;

export type IEntityIdentifierTransitionFields = never;

export type IEntityIdentifierImmutableFields =
  | IEntityIdentifierReadonlyFields
  | IEntityIdentifierContextualFields
  | IEntityIdentifierSensitiveFields
  | IEntityIdentifierTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEntityIdentifierCreatable = Omit<IEntityIdentifier, IEntityIdentifierImmutableFields | EntityIdentifierRelationKey>;

export type IEntityIdentifierSystemWritable = Omit<IEntityIdentifier, B.IBaseReadonlyFields | EntityIdentifierRelationKey>;

export type IEntityIdentifierUpdatable = Partial<Omit<IEntityIdentifier, IEntityIdentifierImmutableFields | EntityIdentifierRelationKey>>;

export interface IEntityIdentifierTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EntityIdentifierSortableField = (typeof ENTITY_IDENTIFIER_SORTABLE_FIELDS)[number];

export type EntityIdentifierSearchableField = (typeof ENTITY_IDENTIFIER_SEARCHABLE_FIELDS)[number];

export type EntityIdentifierFilterableField = (typeof ENTITY_IDENTIFIER_FILTERABLE_FIELDS)[number];

export type EntityIdentifierDateRangeField = (typeof ENTITY_IDENTIFIER_DATE_RANGE_FIELDS)[number];

export type EntityIdentifierSelectableField = (typeof ENTITY_IDENTIFIER_SELECTABLE_FIELDS)[number];

export type EntityIdentifierDefaultSelectField = (typeof ENTITY_IDENTIFIER_DEFAULT_SELECT_FIELDS)[number];

export type EntityIdentifierEditableField = (typeof ENTITY_IDENTIFIER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEntityIdentifierAsOneRelationConfig = Q.IOneRelationConfig<'entityIdentifier', EntityIdentifierSelectableField>;

export type IEntityIdentifierAsManyRelationConfig = Q.IManyRelationConfig<'entityIdentifiers', EntityIdentifierSelectableField, EntityIdentifierSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEntityIdentifierAsOneRelationQuery = Q.IAsOneRelationQuery<IEntityIdentifier, EntityIdentifierSelectableField>;

export type IEntityIdentifierAsManyRelationQuery = Q.IAsManyRelationQuery<IEntityIdentifier, EntityIdentifierSelectableField, EntityIdentifierSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEntityIdentifierRelationMap extends Record<EntityIdentifierRelationKey, unknown> {
  legalEntity: LegalEntityTypes.ILegalEntityAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEntityIdentifierRelationQueries = Q.IBaseRelationQueries<IEntityIdentifier, EntityIdentifierRelationKey, IEntityIdentifierRelationMap>;

export type IEntityIdentifierItemQuery = Q.IBaseItemQuery<
  IEntityIdentifier,
  EntityIdentifierRelationKey,
  EntityIdentifierSelectableField,
  EntityIdentifierRelationKey,
  EntityIdentifierSelectableField,
  IEntityIdentifierRelationMap,
  IEntityIdentifierRelationQueries
>;

export type IEntityIdentifierListQuery = Q.IBaseListQuery<
  IEntityIdentifier,
  EntityIdentifierRelationKey,
  EntityIdentifierSelectableField,
  EntityIdentifierSortableField,
  EntityIdentifierRelationKey,
  EntityIdentifierSelectableField,
  EntityIdentifierSortableField,
  EntityIdentifierDateRangeField,
  EntityIdentifierFilterableField,
  IEntityIdentifierRelationMap,
  IEntityIdentifierRelationQueries,
  IEntityIdentifierItemQuery
>;