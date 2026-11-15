// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  UNITS_RELATION_KEYS,
  UNITS_SORTABLE_FIELDS,
  UNITS_SEARCHABLE_FIELDS,
  UNITS_FILTERABLE_FIELDS,
  UNITS_DATE_RANGE_FIELDS,
  UNITS_SELECTABLE_FIELDS,
  UNITS_DEFAULT_SELECT_FIELDS,
  UNITS_EDITABLE_FIELDS,
} from "./units.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units. */
export interface IUnits extends B.IBase {
  countryId: string | null;
  featureId: string;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly country?: CountryTypes.ICountry;
  readonly feature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type UnitsKey = keyof IUnits;

export type UnitsRelationKey = (typeof UNITS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IUnitsReadonlyFields = B.IBaseReadonlyFields;

export type IUnitsContextualFields = never;

export type IUnitsSensitiveFields = never;

export type IUnitsTransitionFields = never;

export type IUnitsImmutableFields =
  IUnitsReadonlyFields | IUnitsContextualFields | IUnitsSensitiveFields | IUnitsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IUnitsCreatable = Omit<IUnits, IUnitsImmutableFields | UnitsRelationKey>;

export type IUnitsSystemWritable = Omit<IUnits, B.IBaseReadonlyFields | UnitsRelationKey>;

export type IUnitsUpdatable = Partial<Omit<IUnits, IUnitsImmutableFields | UnitsRelationKey>>;

export interface IUnitsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type UnitsSortableField = (typeof UNITS_SORTABLE_FIELDS)[number];

export type UnitsSearchableField = (typeof UNITS_SEARCHABLE_FIELDS)[number];

export type UnitsFilterableField = (typeof UNITS_FILTERABLE_FIELDS)[number];

export type UnitsDateRangeField = (typeof UNITS_DATE_RANGE_FIELDS)[number];

export type UnitsSelectableField = (typeof UNITS_SELECTABLE_FIELDS)[number];

export type UnitsDefaultSelectField = (typeof UNITS_DEFAULT_SELECT_FIELDS)[number];

export type UnitsEditableField = (typeof UNITS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IUnitsAsOneRelationConfig = Q.IOneRelationConfig<"units", UnitsSelectableField>;

export type IUnitsAsManyRelationConfig = Q.IManyRelationConfig<
  "units",
  UnitsSelectableField,
  UnitsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IUnitsAsOneRelationQuery = Q.IAsOneRelationQuery<IUnits, UnitsSelectableField>;

export type IUnitsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IUnits,
  UnitsSelectableField,
  UnitsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IUnitsRelationMap extends Record<UnitsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IUnitsRelationQueries = Q.IBaseRelationQueries<
  IUnits,
  UnitsRelationKey,
  IUnitsRelationMap
>;

export type IUnitsItemQuery = Q.IBaseItemQuery<
  IUnits,
  UnitsRelationKey,
  UnitsSelectableField,
  UnitsRelationKey,
  UnitsSelectableField,
  IUnitsRelationMap,
  IUnitsRelationQueries
>;

export type IUnitsListQuery = Q.IBaseListQuery<
  IUnits,
  UnitsRelationKey,
  UnitsSelectableField,
  UnitsSortableField,
  UnitsRelationKey,
  UnitsSelectableField,
  UnitsSortableField,
  UnitsDateRangeField,
  UnitsFilterableField,
  IUnitsRelationMap,
  IUnitsRelationQueries,
  IUnitsItemQuery
>;
