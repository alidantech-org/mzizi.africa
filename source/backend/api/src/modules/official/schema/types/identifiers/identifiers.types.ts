// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  IDENTIFIERS_RELATION_KEYS,
  IDENTIFIERS_SORTABLE_FIELDS,
  IDENTIFIERS_SEARCHABLE_FIELDS,
  IDENTIFIERS_FILTERABLE_FIELDS,
  IDENTIFIERS_DATE_RANGE_FIELDS,
  IDENTIFIERS_SELECTABLE_FIELDS,
  IDENTIFIERS_DEFAULT_SELECT_FIELDS,
  IDENTIFIERS_EDITABLE_FIELDS,
} from "./identifiers.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer. */
export interface IIdentifiers extends B.IBase {
  entityId: string | null;
  individualId: string | null;
  issuerEntityId: string | null;
  namespace: string | null;
  schemeId: string;
  sourceCitationId: string | null;
  value: string;
  readonly entity?: EntitiesTypes.IEntities;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly issuerEntity?: EntitiesTypes.IEntities;
  readonly scheme?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IdentifiersKey = keyof IIdentifiers;

export type IdentifiersRelationKey = (typeof IDENTIFIERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIdentifiersReadonlyFields = B.IBaseReadonlyFields;

export type IIdentifiersContextualFields = never;

export type IIdentifiersSensitiveFields = never;

export type IIdentifiersTransitionFields = never;

export type IIdentifiersImmutableFields =
  | IIdentifiersReadonlyFields
  | IIdentifiersContextualFields
  | IIdentifiersSensitiveFields
  | IIdentifiersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIdentifiersCreatable = Omit<
  IIdentifiers,
  IIdentifiersImmutableFields | IdentifiersRelationKey
>;

export type IIdentifiersSystemWritable = Omit<
  IIdentifiers,
  B.IBaseReadonlyFields | IdentifiersRelationKey
>;

export type IIdentifiersUpdatable = Partial<
  Omit<IIdentifiers, IIdentifiersImmutableFields | IdentifiersRelationKey>
>;

export interface IIdentifiersTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IdentifiersSortableField = (typeof IDENTIFIERS_SORTABLE_FIELDS)[number];

export type IdentifiersSearchableField = (typeof IDENTIFIERS_SEARCHABLE_FIELDS)[number];

export type IdentifiersFilterableField = (typeof IDENTIFIERS_FILTERABLE_FIELDS)[number];

export type IdentifiersDateRangeField = (typeof IDENTIFIERS_DATE_RANGE_FIELDS)[number];

export type IdentifiersSelectableField = (typeof IDENTIFIERS_SELECTABLE_FIELDS)[number];

export type IdentifiersDefaultSelectField = (typeof IDENTIFIERS_DEFAULT_SELECT_FIELDS)[number];

export type IdentifiersEditableField = (typeof IDENTIFIERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIdentifiersAsOneRelationConfig = Q.IOneRelationConfig<
  "identifiers",
  IdentifiersSelectableField
>;

export type IIdentifiersAsManyRelationConfig = Q.IManyRelationConfig<
  "identifiers",
  IdentifiersSelectableField,
  IdentifiersSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIdentifiersAsOneRelationQuery = Q.IAsOneRelationQuery<
  IIdentifiers,
  IdentifiersSelectableField
>;

export type IIdentifiersAsManyRelationQuery = Q.IAsManyRelationQuery<
  IIdentifiers,
  IdentifiersSelectableField,
  IdentifiersSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIdentifiersRelationMap extends Record<IdentifiersRelationKey, unknown> {
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  issuerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  scheme: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIdentifiersRelationQueries = Q.IBaseRelationQueries<
  IIdentifiers,
  IdentifiersRelationKey,
  IIdentifiersRelationMap
>;

export type IIdentifiersItemQuery = Q.IBaseItemQuery<
  IIdentifiers,
  IdentifiersRelationKey,
  IdentifiersSelectableField,
  IdentifiersRelationKey,
  IdentifiersSelectableField,
  IIdentifiersRelationMap,
  IIdentifiersRelationQueries
>;

export type IIdentifiersListQuery = Q.IBaseListQuery<
  IIdentifiers,
  IdentifiersRelationKey,
  IdentifiersSelectableField,
  IdentifiersSortableField,
  IdentifiersRelationKey,
  IdentifiersSelectableField,
  IdentifiersSortableField,
  IdentifiersDateRangeField,
  IdentifiersFilterableField,
  IIdentifiersRelationMap,
  IIdentifiersRelationQueries,
  IIdentifiersItemQuery
>;
