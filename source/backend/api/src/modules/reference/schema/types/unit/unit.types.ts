// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  UNIT_RELATION_KEYS,
  UNIT_SORTABLE_FIELDS,
  UNIT_SEARCHABLE_FIELDS,
  UNIT_FILTERABLE_FIELDS,
  UNIT_DATE_RANGE_FIELDS,
  UNIT_SELECTABLE_FIELDS,
  UNIT_DEFAULT_SELECT_FIELDS,
  UNIT_EDITABLE_FIELDS,
} from "./unit.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Measurement unit and conversion to its optional base unit; never a spatial unit. */
export interface IUnit extends B.IBase {
  baseId: string | null;
  code: string;
  offset: number;
  quantity: string;
  scale: number;
  symbol: string;
  readonly base?: IUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type UnitKey = keyof IUnit;

export type UnitRelationKey = (typeof UNIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IUnitReadonlyFields = B.IBaseReadonlyFields;

export type IUnitContextualFields = never;

export type IUnitSensitiveFields = never;

export type IUnitTransitionFields = never;

export type IUnitImmutableFields =
  IUnitReadonlyFields | IUnitContextualFields | IUnitSensitiveFields | IUnitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IUnitCreatable = Omit<IUnit, IUnitImmutableFields | UnitRelationKey>;

export type IUnitSystemWritable = Omit<IUnit, B.IBaseReadonlyFields | UnitRelationKey>;

export type IUnitUpdatable = Partial<Omit<IUnit, IUnitImmutableFields | UnitRelationKey>>;

export interface IUnitTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type UnitSortableField = (typeof UNIT_SORTABLE_FIELDS)[number];

export type UnitSearchableField = (typeof UNIT_SEARCHABLE_FIELDS)[number];

export type UnitFilterableField = (typeof UNIT_FILTERABLE_FIELDS)[number];

export type UnitDateRangeField = (typeof UNIT_DATE_RANGE_FIELDS)[number];

export type UnitSelectableField = (typeof UNIT_SELECTABLE_FIELDS)[number];

export type UnitDefaultSelectField = (typeof UNIT_DEFAULT_SELECT_FIELDS)[number];

export type UnitEditableField = (typeof UNIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IUnitAsOneRelationConfig = Q.IOneRelationConfig<"unit", UnitSelectableField>;

export type IUnitAsManyRelationConfig = Q.IManyRelationConfig<
  "units",
  UnitSelectableField,
  UnitSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IUnitAsOneRelationQuery = Q.IAsOneRelationQuery<IUnit, UnitSelectableField>;

export type IUnitAsManyRelationQuery = Q.IAsManyRelationQuery<
  IUnit,
  UnitSelectableField,
  UnitSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IUnitRelationMap extends Record<UnitRelationKey, unknown> {
  base: IUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IUnitRelationQueries = Q.IBaseRelationQueries<IUnit, UnitRelationKey, IUnitRelationMap>;

export type IUnitItemQuery = Q.IBaseItemQuery<
  IUnit,
  UnitRelationKey,
  UnitSelectableField,
  UnitRelationKey,
  UnitSelectableField,
  IUnitRelationMap,
  IUnitRelationQueries
>;

export type IUnitListQuery = Q.IBaseListQuery<
  IUnit,
  UnitRelationKey,
  UnitSelectableField,
  UnitSortableField,
  UnitRelationKey,
  UnitSelectableField,
  UnitSortableField,
  UnitDateRangeField,
  UnitFilterableField,
  IUnitRelationMap,
  IUnitRelationQueries,
  IUnitItemQuery
>;
