// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as WordingsTypes from "#/modules/legal/schema/types/wordings/wordings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";

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
  RELATIONSHIPS_EDITABLE_FIELDS,
} from "./relationships.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here. */
export interface IRelationships extends B.IBase {
  affectedWordingId: string | null;
  authorityWordingId: string | null;
  citationId: string | null;
  code: string;
  effectiveOn: Date | null;
  explanation: string | null;
  kindId: string;
  objectInstrumentId: string | null;
  resultingWordingId: string | null;
  subjectInstrumentId: string | null;
  readonly affectedWording?: WordingsTypes.IWordings;
  readonly authorityWording?: WordingsTypes.IWordings;
  readonly citation?: CitationsTypes.ICitations;
  readonly kind?: ValueTypes.IValue;
  readonly objectInstrument?: InstrumentsTypes.IInstruments;
  readonly resultingWording?: WordingsTypes.IWordings;
  readonly subjectInstrument?: InstrumentsTypes.IInstruments;
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

export type IRelationshipsCreatable = Omit<
  IRelationships,
  IRelationshipsImmutableFields | RelationshipsRelationKey
>;

export type IRelationshipsSystemWritable = Omit<
  IRelationships,
  B.IBaseReadonlyFields | RelationshipsRelationKey
>;

export type IRelationshipsUpdatable = Partial<
  Omit<IRelationships, IRelationshipsImmutableFields | RelationshipsRelationKey>
>;

export interface IRelationshipsTransitionPayload {}

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

export type IRelationshipsAsOneRelationConfig = Q.IOneRelationConfig<
  "relationships",
  RelationshipsSelectableField
>;

export type IRelationshipsAsManyRelationConfig = Q.IManyRelationConfig<
  "relationships",
  RelationshipsSelectableField,
  RelationshipsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRelationshipsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IRelationships,
  RelationshipsSelectableField
>;

export type IRelationshipsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IRelationships,
  RelationshipsSelectableField,
  RelationshipsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRelationshipsRelationMap extends Record<RelationshipsRelationKey, unknown> {
  affectedWording: WordingsTypes.IWordingsAsOneRelationQuery;
  authorityWording: WordingsTypes.IWordingsAsOneRelationQuery;
  citation: CitationsTypes.ICitationsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  objectInstrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  resultingWording: WordingsTypes.IWordingsAsOneRelationQuery;
  subjectInstrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRelationshipsRelationQueries = Q.IBaseRelationQueries<
  IRelationships,
  RelationshipsRelationKey,
  IRelationshipsRelationMap
>;

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
