// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from '#/modules/geography/types/features.types';
import type * as ValueTypes from '#/modules/reference/types/value.types';

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
  IDENTIFIERS_EDITABLE_FIELDS
} from './identifiers.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A preserved identifier assigned to a feature by an external geographic registry or source system. */
export interface IIdentifiers extends B.IBase {
  externalId: string;
  featureId: string;
  identifierSchemeId: string;
  namespace: string | null;
  sourceRefId: string | null;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly identifierScheme?: ValueTypes.IValue;
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

export type IIdentifiersCreatable = Omit<IIdentifiers, IIdentifiersImmutableFields | IdentifiersRelationKey>;

export type IIdentifiersSystemWritable = Omit<IIdentifiers, B.IBaseReadonlyFields | IdentifiersRelationKey>;

export type IIdentifiersUpdatable = Partial<Omit<IIdentifiers, IIdentifiersImmutableFields | IdentifiersRelationKey>>;

export interface IIdentifiersTransitionPayload {
}

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

export type IIdentifiersAsOneRelationConfig = Q.IOneRelationConfig<'identifiers', IdentifiersSelectableField>;

export type IIdentifiersAsManyRelationConfig = Q.IManyRelationConfig<'identifierss', IdentifiersSelectableField, IdentifiersSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIdentifiersAsOneRelationQuery = Q.IAsOneRelationQuery<IIdentifiers, IdentifiersSelectableField>;

export type IIdentifiersAsManyRelationQuery = Q.IAsManyRelationQuery<IIdentifiers, IdentifiersSelectableField, IdentifiersSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIdentifiersRelationMap extends Record<IdentifiersRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  identifierScheme: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIdentifiersRelationQueries = Q.IBaseRelationQueries<IIdentifiers, IdentifiersRelationKey, IIdentifiersRelationMap>;

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