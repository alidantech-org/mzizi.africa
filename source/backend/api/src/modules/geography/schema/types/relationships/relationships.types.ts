// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from '#/modules/geography/schema/types/features/features.types';
import type * as ValueTypes from '#/modules/reference/schema/types/value/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  RELATIONSHIPS_RELATION_KEYS,
  RELATIONSHIPS_SORTABLE_FIELDS,
  RELATIONSHIPS_SEARCHABLE_FIELDS,
  RELATIONSHIPS_FILTERABLE_FIELDS,
  RELATIONSHIPS_DATE_RANGE_FIELDS,
  RELATIONSHIPS_SELECTABLE_FIELDS,
  RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  RELATIONSHIPS_EDITABLE_FIELDS
} from './relationships.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface IRelationships extends B.IBase {
  objectFeatureId: string;
  relationshipKindId: string;
  sourceRefId: string | null;
  subjectFeatureId: string;
  systemId: string;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly objectFeature?: FeaturesTypes.IFeatures;
  readonly relationshipKind?: ValueTypes.IValue;
  readonly subjectFeature?: FeaturesTypes.IFeatures;
  readonly system?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RelationshipsKey = keyof IRelationships;

export type RelationshipsRelationKey = (typeof RELATIONSHIPS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRelationshipsReadonlyFields = B.IBaseReadonlyFields;

export type IRelationshipsContextualFields = never;

export type IRelationshipsSensitiveFields = never;

export type IRelationshipsTransitionFields = never;

export type IRelationshipsImmutableFields =
  | IRelationshipsReadonlyFields
  | IRelationshipsContextualFields
  | IRelationshipsSensitiveFields
  | IRelationshipsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRelationshipsCreatable = Omit<IRelationships, IRelationshipsImmutableFields | RelationshipsRelationKey>;

export type IRelationshipsSystemWritable = Omit<IRelationships, B.IBaseReadonlyFields | RelationshipsRelationKey>;

export type IRelationshipsUpdatable = Partial<Omit<IRelationships, IRelationshipsImmutableFields | RelationshipsRelationKey>>;

export interface IRelationshipsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RelationshipsSortableField = (typeof RELATIONSHIPS_SORTABLE_FIELDS)[number];

export type RelationshipsSearchableField = (typeof RELATIONSHIPS_SEARCHABLE_FIELDS)[number];

export type RelationshipsFilterableField = (typeof RELATIONSHIPS_FILTERABLE_FIELDS)[number];

export type RelationshipsDateRangeField = (typeof RELATIONSHIPS_DATE_RANGE_FIELDS)[number];

export type RelationshipsSelectableField = (typeof RELATIONSHIPS_SELECTABLE_FIELDS)[number];

export type RelationshipsDefaultSelectField = (typeof RELATIONSHIPS_DEFAULT_SELECT_FIELDS)[number];

export type RelationshipsEditableField = (typeof RELATIONSHIPS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRelationshipsAsOneRelationConfig = Q.IOneRelationConfig<'relationships', RelationshipsSelectableField>;

export type IRelationshipsAsManyRelationConfig = Q.IManyRelationConfig<'relationshipss', RelationshipsSelectableField, RelationshipsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRelationshipsAsOneRelationQuery = Q.IAsOneRelationQuery<IRelationships, RelationshipsSelectableField>;

export type IRelationshipsAsManyRelationQuery = Q.IAsManyRelationQuery<IRelationships, RelationshipsSelectableField, RelationshipsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRelationshipsRelationMap extends Record<RelationshipsRelationKey, unknown> {
  objectFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  relationshipKind: ValueTypes.IValueAsOneRelationQuery;
  subjectFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  system: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRelationshipsRelationQueries = Q.IBaseRelationQueries<IRelationships, RelationshipsRelationKey, IRelationshipsRelationMap>;

export type IRelationshipsItemQuery = Q.IBaseItemQuery<
  IRelationships,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  IRelationshipsRelationMap,
  IRelationshipsRelationQueries
>;

export type IRelationshipsListQuery = Q.IBaseListQuery<
  IRelationships,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsSortableField,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsSortableField,
  RelationshipsDateRangeField,
  RelationshipsFilterableField,
  IRelationshipsRelationMap,
  IRelationshipsRelationQueries,
  IRelationshipsItemQuery
>;