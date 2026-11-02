// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VINTAGE_RELATION_KEYS,
  VINTAGE_SORTABLE_FIELDS,
  VINTAGE_SEARCHABLE_FIELDS,
  VINTAGE_FILTERABLE_FIELDS,
  VINTAGE_DATE_RANGE_FIELDS,
  VINTAGE_SELECTABLE_FIELDS,
  VINTAGE_DEFAULT_SELECT_FIELDS,
  VINTAGE_EDITABLE_FIELDS
} from './vintage.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Vintage */
export interface IVintage extends B.IBase {
  code: string;
  isCurrent: boolean;
  label: string;
  publisherInstitutionId: string | null;
  releasedOn: Date | null;
  supersedesId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VintageKey = keyof IVintage;

export type VintageRelationKey = (typeof VINTAGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVintageReadonlyFields = B.IBaseReadonlyFields;

export type IVintageContextualFields = never;

export type IVintageSensitiveFields = never;

export type IVintageTransitionFields = never;

export type IVintageImmutableFields =
  | IVintageReadonlyFields
  | IVintageContextualFields
  | IVintageSensitiveFields
  | IVintageTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVintageCreatable = Omit<IVintage, IVintageImmutableFields | VintageRelationKey>;

export type IVintageSystemWritable = Omit<IVintage, B.IBaseReadonlyFields | VintageRelationKey>;

export type IVintageUpdatable = Partial<Omit<IVintage, IVintageImmutableFields | VintageRelationKey>>;

export interface IVintageTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VintageSortableField = (typeof VINTAGE_SORTABLE_FIELDS)[number];

export type VintageSearchableField = (typeof VINTAGE_SEARCHABLE_FIELDS)[number];

export type VintageFilterableField = (typeof VINTAGE_FILTERABLE_FIELDS)[number];

export type VintageDateRangeField = (typeof VINTAGE_DATE_RANGE_FIELDS)[number];

export type VintageSelectableField = (typeof VINTAGE_SELECTABLE_FIELDS)[number];

export type VintageDefaultSelectField = (typeof VINTAGE_DEFAULT_SELECT_FIELDS)[number];

export type VintageEditableField = (typeof VINTAGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVintageAsOneRelationConfig = Q.IOneRelationConfig<'vintage', VintageSelectableField>;

export type IVintageAsManyRelationConfig = Q.IManyRelationConfig<'vintages', VintageSelectableField, VintageSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVintageAsOneRelationQuery = Q.IAsOneRelationQuery<IVintage, VintageSelectableField>;

export type IVintageAsManyRelationQuery = Q.IAsManyRelationQuery<IVintage, VintageSelectableField, VintageSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVintageRelationMap extends Record<VintageRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVintageRelationQueries = Q.IBaseRelationQueries<IVintage, VintageRelationKey, IVintageRelationMap>;

export type IVintageItemQuery = Q.IBaseItemQuery<
  IVintage,
  VintageRelationKey,
  VintageSelectableField,
  VintageRelationKey,
  VintageSelectableField,
  IVintageRelationMap,
  IVintageRelationQueries
>;

export type IVintageListQuery = Q.IBaseListQuery<
  IVintage,
  VintageRelationKey,
  VintageSelectableField,
  VintageSortableField,
  VintageRelationKey,
  VintageSelectableField,
  VintageSortableField,
  VintageDateRangeField,
  VintageFilterableField,
  IVintageRelationMap,
  IVintageRelationQueries,
  IVintageItemQuery
>;