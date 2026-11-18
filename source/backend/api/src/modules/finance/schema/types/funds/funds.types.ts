// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FUNDS_RELATION_KEYS,
  FUNDS_SORTABLE_FIELDS,
  FUNDS_SEARCHABLE_FIELDS,
  FUNDS_FILTERABLE_FIELDS,
  FUNDS_DATE_RANGE_FIELDS,
  FUNDS_SELECTABLE_FIELDS,
  FUNDS_DEFAULT_SELECT_FIELDS,
  FUNDS_EDITABLE_FIELDS,
} from "./funds.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One named public fund with a classification, manager and country. */
export interface IFunds extends B.IBase {
  code: string;
  countryId: string | null;
  fundKindId: string;
  fundingSourceId: string | null;
  managingEntityId: string | null;
  scopeUnitFeatureId: string | null;
  sourceCitationId: string | null;
  readonly country?: CountryTypes.ICountry;
  readonly fundKind?: ValueTypes.IValue;
  readonly fundingSource?: ValueTypes.IValue;
  readonly managingEntity?: EntitiesTypes.IEntities;
  readonly scopeUnitFeature?: FeaturesTypes.IFeatures;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FundsKey = keyof IFunds;

export type FundsRelationKey = (typeof FUNDS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFundsReadonlyFields = B.IBaseReadonlyFields;

export type IFundsContextualFields = never;

export type IFundsSensitiveFields = never;

export type IFundsTransitionFields = never;

export type IFundsImmutableFields =
  IFundsReadonlyFields | IFundsContextualFields | IFundsSensitiveFields | IFundsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFundsCreatable = Omit<IFunds, IFundsImmutableFields | FundsRelationKey>;

export type IFundsSystemWritable = Omit<IFunds, B.IBaseReadonlyFields | FundsRelationKey>;

export type IFundsUpdatable = Partial<Omit<IFunds, IFundsImmutableFields | FundsRelationKey>>;

export interface IFundsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FundsSortableField = (typeof FUNDS_SORTABLE_FIELDS)[number];

export type FundsSearchableField = (typeof FUNDS_SEARCHABLE_FIELDS)[number];

export type FundsFilterableField = (typeof FUNDS_FILTERABLE_FIELDS)[number];

export type FundsDateRangeField = (typeof FUNDS_DATE_RANGE_FIELDS)[number];

export type FundsSelectableField = (typeof FUNDS_SELECTABLE_FIELDS)[number];

export type FundsDefaultSelectField = (typeof FUNDS_DEFAULT_SELECT_FIELDS)[number];

export type FundsEditableField = (typeof FUNDS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFundsAsOneRelationConfig = Q.IOneRelationConfig<"funds", FundsSelectableField>;

export type IFundsAsManyRelationConfig = Q.IManyRelationConfig<
  "funds",
  FundsSelectableField,
  FundsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFundsAsOneRelationQuery = Q.IAsOneRelationQuery<IFunds, FundsSelectableField>;

export type IFundsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFunds,
  FundsSelectableField,
  FundsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFundsRelationMap extends Record<FundsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  fundKind: ValueTypes.IValueAsOneRelationQuery;
  fundingSource: ValueTypes.IValueAsOneRelationQuery;
  managingEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  scopeUnitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFundsRelationQueries = Q.IBaseRelationQueries<
  IFunds,
  FundsRelationKey,
  IFundsRelationMap
>;

export type IFundsItemQuery = Q.IBaseItemQuery<
  IFunds,
  FundsRelationKey,
  FundsSelectableField,
  FundsRelationKey,
  FundsSelectableField,
  IFundsRelationMap,
  IFundsRelationQueries
>;

export type IFundsListQuery = Q.IBaseListQuery<
  IFunds,
  FundsRelationKey,
  FundsSelectableField,
  FundsSortableField,
  FundsRelationKey,
  FundsSelectableField,
  FundsSortableField,
  FundsDateRangeField,
  FundsFilterableField,
  IFundsRelationMap,
  IFundsRelationQueries,
  IFundsItemQuery
>;
