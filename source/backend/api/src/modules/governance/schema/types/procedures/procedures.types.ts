// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROCEDURES_RELATION_KEYS,
  PROCEDURES_SORTABLE_FIELDS,
  PROCEDURES_SEARCHABLE_FIELDS,
  PROCEDURES_FILTERABLE_FIELDS,
  PROCEDURES_DATE_RANGE_FIELDS,
  PROCEDURES_SELECTABLE_FIELDS,
  PROCEDURES_DEFAULT_SELECT_FIELDS,
  PROCEDURES_EDITABLE_FIELDS,
} from "./procedures.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A named sequence of rights, such as appointing a judge or removing a governor; its steps are powers. */
export interface IProcedures extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  countryId: string;
  description: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  kindId: string;
  sourceCitationId: string | null;
  toYear: number | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly country?: CountryTypes.ICountry;
  readonly kind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProceduresKey = keyof IProcedures;

export type ProceduresRelationKey = (typeof PROCEDURES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProceduresReadonlyFields = B.IBaseReadonlyFields;

export type IProceduresContextualFields = never;

export type IProceduresSensitiveFields = never;

export type IProceduresTransitionFields = never;

export type IProceduresImmutableFields =
  | IProceduresReadonlyFields
  | IProceduresContextualFields
  | IProceduresSensitiveFields
  | IProceduresTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProceduresCreatable = Omit<
  IProcedures,
  IProceduresImmutableFields | ProceduresRelationKey
>;

export type IProceduresSystemWritable = Omit<
  IProcedures,
  B.IBaseReadonlyFields | ProceduresRelationKey
>;

export type IProceduresUpdatable = Partial<
  Omit<IProcedures, IProceduresImmutableFields | ProceduresRelationKey>
>;

export interface IProceduresTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProceduresSortableField = (typeof PROCEDURES_SORTABLE_FIELDS)[number];

export type ProceduresSearchableField = (typeof PROCEDURES_SEARCHABLE_FIELDS)[number];

export type ProceduresFilterableField = (typeof PROCEDURES_FILTERABLE_FIELDS)[number];

export type ProceduresDateRangeField = (typeof PROCEDURES_DATE_RANGE_FIELDS)[number];

export type ProceduresSelectableField = (typeof PROCEDURES_SELECTABLE_FIELDS)[number];

export type ProceduresDefaultSelectField = (typeof PROCEDURES_DEFAULT_SELECT_FIELDS)[number];

export type ProceduresEditableField = (typeof PROCEDURES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProceduresAsOneRelationConfig = Q.IOneRelationConfig<
  "procedures",
  ProceduresSelectableField
>;

export type IProceduresAsManyRelationConfig = Q.IManyRelationConfig<
  "procedures",
  ProceduresSelectableField,
  ProceduresSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProceduresAsOneRelationQuery = Q.IAsOneRelationQuery<
  IProcedures,
  ProceduresSelectableField
>;

export type IProceduresAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProcedures,
  ProceduresSelectableField,
  ProceduresSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProceduresRelationMap extends Record<ProceduresRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProceduresRelationQueries = Q.IBaseRelationQueries<
  IProcedures,
  ProceduresRelationKey,
  IProceduresRelationMap
>;

export type IProceduresItemQuery = Q.IBaseItemQuery<
  IProcedures,
  ProceduresRelationKey,
  ProceduresSelectableField,
  ProceduresRelationKey,
  ProceduresSelectableField,
  IProceduresRelationMap,
  IProceduresRelationQueries
>;

export type IProceduresListQuery = Q.IBaseListQuery<
  IProcedures,
  ProceduresRelationKey,
  ProceduresSelectableField,
  ProceduresSortableField,
  ProceduresRelationKey,
  ProceduresSelectableField,
  ProceduresSortableField,
  ProceduresDateRangeField,
  ProceduresFilterableField,
  IProceduresRelationMap,
  IProceduresRelationQueries,
  IProceduresItemQuery
>;
