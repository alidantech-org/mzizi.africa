// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VARIATIONS_RELATION_KEYS,
  VARIATIONS_SORTABLE_FIELDS,
  VARIATIONS_SEARCHABLE_FIELDS,
  VARIATIONS_FILTERABLE_FIELDS,
  VARIATIONS_DATE_RANGE_FIELDS,
  VARIATIONS_SELECTABLE_FIELDS,
  VARIATIONS_DEFAULT_SELECT_FIELDS,
  VARIATIONS_EDITABLE_FIELDS,
} from "./variations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One change to an executed contract: a variation of price or scope, an extension, a renewal or a termination. */
export interface IVariations extends B.IBase {
  amountDeltaMinorUnits: number | null;
  code: string;
  contractId: string;
  currencyId: string | null;
  kindId: string;
  newEndOn: Date | null;
  reason: string | null;
  signedOn: Date | null;
  sourceCitationId: string | null;
  readonly contract?: ContractsTypes.IContracts;
  readonly currency?: ValueTypes.IValue;
  readonly kind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VariationsKey = keyof IVariations;

export type VariationsRelationKey = (typeof VARIATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVariationsReadonlyFields = B.IBaseReadonlyFields;

export type IVariationsContextualFields = never;

export type IVariationsSensitiveFields = never;

export type IVariationsTransitionFields = never;

export type IVariationsImmutableFields =
  | IVariationsReadonlyFields
  | IVariationsContextualFields
  | IVariationsSensitiveFields
  | IVariationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVariationsCreatable = Omit<
  IVariations,
  IVariationsImmutableFields | VariationsRelationKey
>;

export type IVariationsSystemWritable = Omit<
  IVariations,
  B.IBaseReadonlyFields | VariationsRelationKey
>;

export type IVariationsUpdatable = Partial<
  Omit<IVariations, IVariationsImmutableFields | VariationsRelationKey>
>;

export interface IVariationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VariationsSortableField = (typeof VARIATIONS_SORTABLE_FIELDS)[number];

export type VariationsSearchableField = (typeof VARIATIONS_SEARCHABLE_FIELDS)[number];

export type VariationsFilterableField = (typeof VARIATIONS_FILTERABLE_FIELDS)[number];

export type VariationsDateRangeField = (typeof VARIATIONS_DATE_RANGE_FIELDS)[number];

export type VariationsSelectableField = (typeof VARIATIONS_SELECTABLE_FIELDS)[number];

export type VariationsDefaultSelectField = (typeof VARIATIONS_DEFAULT_SELECT_FIELDS)[number];

export type VariationsEditableField = (typeof VARIATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVariationsAsOneRelationConfig = Q.IOneRelationConfig<
  "variations",
  VariationsSelectableField
>;

export type IVariationsAsManyRelationConfig = Q.IManyRelationConfig<
  "variations",
  VariationsSelectableField,
  VariationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVariationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IVariations,
  VariationsSelectableField
>;

export type IVariationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IVariations,
  VariationsSelectableField,
  VariationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVariationsRelationMap extends Record<VariationsRelationKey, unknown> {
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVariationsRelationQueries = Q.IBaseRelationQueries<
  IVariations,
  VariationsRelationKey,
  IVariationsRelationMap
>;

export type IVariationsItemQuery = Q.IBaseItemQuery<
  IVariations,
  VariationsRelationKey,
  VariationsSelectableField,
  VariationsRelationKey,
  VariationsSelectableField,
  IVariationsRelationMap,
  IVariationsRelationQueries
>;

export type IVariationsListQuery = Q.IBaseListQuery<
  IVariations,
  VariationsRelationKey,
  VariationsSelectableField,
  VariationsSortableField,
  VariationsRelationKey,
  VariationsSelectableField,
  VariationsSortableField,
  VariationsDateRangeField,
  VariationsFilterableField,
  IVariationsRelationMap,
  IVariationsRelationQueries,
  IVariationsItemQuery
>;
