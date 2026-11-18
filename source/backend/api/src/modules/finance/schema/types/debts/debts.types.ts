// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DEBTS_RELATION_KEYS,
  DEBTS_SORTABLE_FIELDS,
  DEBTS_SEARCHABLE_FIELDS,
  DEBTS_FILTERABLE_FIELDS,
  DEBTS_DATE_RANGE_FIELDS,
  DEBTS_SELECTABLE_FIELDS,
  DEBTS_DEFAULT_SELECT_FIELDS,
  DEBTS_EDITABLE_FIELDS,
} from "./debts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts. */
export interface IDebts extends B.IBase {
  amountMinorUnits: number;
  borrowerEntityId: string;
  code: string;
  contractedOn: Date | null;
  countryId: string | null;
  currencyId: string;
  debtKindId: string;
  lenderEntityId: string | null;
  maturityOn: Date | null;
  sourceCitationId: string | null;
  readonly borrowerEntity?: EntitiesTypes.IEntities;
  readonly country?: CountryTypes.ICountry;
  readonly currency?: ValueTypes.IValue;
  readonly debtKind?: ValueTypes.IValue;
  readonly lenderEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DebtsKey = keyof IDebts;

export type DebtsRelationKey = (typeof DEBTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDebtsReadonlyFields = B.IBaseReadonlyFields;

export type IDebtsContextualFields = never;

export type IDebtsSensitiveFields = never;

export type IDebtsTransitionFields = never;

export type IDebtsImmutableFields =
  IDebtsReadonlyFields | IDebtsContextualFields | IDebtsSensitiveFields | IDebtsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDebtsCreatable = Omit<IDebts, IDebtsImmutableFields | DebtsRelationKey>;

export type IDebtsSystemWritable = Omit<IDebts, B.IBaseReadonlyFields | DebtsRelationKey>;

export type IDebtsUpdatable = Partial<Omit<IDebts, IDebtsImmutableFields | DebtsRelationKey>>;

export interface IDebtsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DebtsSortableField = (typeof DEBTS_SORTABLE_FIELDS)[number];

export type DebtsSearchableField = (typeof DEBTS_SEARCHABLE_FIELDS)[number];

export type DebtsFilterableField = (typeof DEBTS_FILTERABLE_FIELDS)[number];

export type DebtsDateRangeField = (typeof DEBTS_DATE_RANGE_FIELDS)[number];

export type DebtsSelectableField = (typeof DEBTS_SELECTABLE_FIELDS)[number];

export type DebtsDefaultSelectField = (typeof DEBTS_DEFAULT_SELECT_FIELDS)[number];

export type DebtsEditableField = (typeof DEBTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDebtsAsOneRelationConfig = Q.IOneRelationConfig<"debts", DebtsSelectableField>;

export type IDebtsAsManyRelationConfig = Q.IManyRelationConfig<
  "debts",
  DebtsSelectableField,
  DebtsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDebtsAsOneRelationQuery = Q.IAsOneRelationQuery<IDebts, DebtsSelectableField>;

export type IDebtsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDebts,
  DebtsSelectableField,
  DebtsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDebtsRelationMap extends Record<DebtsRelationKey, unknown> {
  borrowerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  debtKind: ValueTypes.IValueAsOneRelationQuery;
  lenderEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDebtsRelationQueries = Q.IBaseRelationQueries<
  IDebts,
  DebtsRelationKey,
  IDebtsRelationMap
>;

export type IDebtsItemQuery = Q.IBaseItemQuery<
  IDebts,
  DebtsRelationKey,
  DebtsSelectableField,
  DebtsRelationKey,
  DebtsSelectableField,
  IDebtsRelationMap,
  IDebtsRelationQueries
>;

export type IDebtsListQuery = Q.IBaseListQuery<
  IDebts,
  DebtsRelationKey,
  DebtsSelectableField,
  DebtsSortableField,
  DebtsRelationKey,
  DebtsSelectableField,
  DebtsSortableField,
  DebtsDateRangeField,
  DebtsFilterableField,
  IDebtsRelationMap,
  IDebtsRelationQueries,
  IDebtsItemQuery
>;
