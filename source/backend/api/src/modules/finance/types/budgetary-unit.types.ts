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
  BUDGETARY_UNIT_RELATION_KEYS,
  BUDGETARY_UNIT_SORTABLE_FIELDS,
  BUDGETARY_UNIT_SEARCHABLE_FIELDS,
  BUDGETARY_UNIT_FILTERABLE_FIELDS,
  BUDGETARY_UNIT_DATE_RANGE_FIELDS,
  BUDGETARY_UNIT_SELECTABLE_FIELDS,
  BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS,
  BUDGETARY_UNIT_EDITABLE_FIELDS
} from './budgetary-unit.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Budgetary Unit */
export interface IBudgetaryUnit extends B.IBase {
  code: string;
  geoUnitId: string | null;
  institutionId: string | null;
  isCurrent: boolean;
  jurisdictionId: string;
  legalEntityId: string | null;
  levelId: string;
  name: string;
  parentUnitId: string | null;
  partyId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BudgetaryUnitKey = keyof IBudgetaryUnit;

export type BudgetaryUnitRelationKey = (typeof BUDGETARY_UNIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBudgetaryUnitReadonlyFields = B.IBaseReadonlyFields;

export type IBudgetaryUnitContextualFields = never;

export type IBudgetaryUnitSensitiveFields = never;

export type IBudgetaryUnitTransitionFields = never;

export type IBudgetaryUnitImmutableFields =
  | IBudgetaryUnitReadonlyFields
  | IBudgetaryUnitContextualFields
  | IBudgetaryUnitSensitiveFields
  | IBudgetaryUnitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBudgetaryUnitCreatable = Omit<IBudgetaryUnit, IBudgetaryUnitImmutableFields | BudgetaryUnitRelationKey>;

export type IBudgetaryUnitSystemWritable = Omit<IBudgetaryUnit, B.IBaseReadonlyFields | BudgetaryUnitRelationKey>;

export type IBudgetaryUnitUpdatable = Partial<Omit<IBudgetaryUnit, IBudgetaryUnitImmutableFields | BudgetaryUnitRelationKey>>;

export interface IBudgetaryUnitTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BudgetaryUnitSortableField = (typeof BUDGETARY_UNIT_SORTABLE_FIELDS)[number];

export type BudgetaryUnitSearchableField = (typeof BUDGETARY_UNIT_SEARCHABLE_FIELDS)[number];

export type BudgetaryUnitFilterableField = (typeof BUDGETARY_UNIT_FILTERABLE_FIELDS)[number];

export type BudgetaryUnitDateRangeField = (typeof BUDGETARY_UNIT_DATE_RANGE_FIELDS)[number];

export type BudgetaryUnitSelectableField = (typeof BUDGETARY_UNIT_SELECTABLE_FIELDS)[number];

export type BudgetaryUnitDefaultSelectField = (typeof BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS)[number];

export type BudgetaryUnitEditableField = (typeof BUDGETARY_UNIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBudgetaryUnitAsOneRelationConfig = Q.IOneRelationConfig<'budgetaryUnit', BudgetaryUnitSelectableField>;

export type IBudgetaryUnitAsManyRelationConfig = Q.IManyRelationConfig<'budgetaryUnits', BudgetaryUnitSelectableField, BudgetaryUnitSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBudgetaryUnitAsOneRelationQuery = Q.IAsOneRelationQuery<IBudgetaryUnit, BudgetaryUnitSelectableField>;

export type IBudgetaryUnitAsManyRelationQuery = Q.IAsManyRelationQuery<IBudgetaryUnit, BudgetaryUnitSelectableField, BudgetaryUnitSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBudgetaryUnitRelationMap extends Record<BudgetaryUnitRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBudgetaryUnitRelationQueries = Q.IBaseRelationQueries<IBudgetaryUnit, BudgetaryUnitRelationKey, IBudgetaryUnitRelationMap>;

export type IBudgetaryUnitItemQuery = Q.IBaseItemQuery<
  IBudgetaryUnit,
  BudgetaryUnitRelationKey,
  BudgetaryUnitSelectableField,
  BudgetaryUnitRelationKey,
  BudgetaryUnitSelectableField,
  IBudgetaryUnitRelationMap,
  IBudgetaryUnitRelationQueries
>;

export type IBudgetaryUnitListQuery = Q.IBaseListQuery<
  IBudgetaryUnit,
  BudgetaryUnitRelationKey,
  BudgetaryUnitSelectableField,
  BudgetaryUnitSortableField,
  BudgetaryUnitRelationKey,
  BudgetaryUnitSelectableField,
  BudgetaryUnitSortableField,
  BudgetaryUnitDateRangeField,
  BudgetaryUnitFilterableField,
  IBudgetaryUnitRelationMap,
  IBudgetaryUnitRelationQueries,
  IBudgetaryUnitItemQuery
>;